import workflowTemplate from '@/assets/templates/clinic-attendant-workflow.json'
import appConfig from '@/configs/app.config'
import createUID from '@/components/ui/utils/createUid'
import ApiService from './ApiService'
import { getAdminPlatformSettings } from './AdminPlatformSettingsService'
import type { User } from '@/@types/auth'
import type {
    AdminPlatformSettings,
    AgentProvisioningRequest,
    AgentProvisioningResponse,
    AgentRecord,
    ClinicAttendantInput,
    WorkflowCreatePayload,
    WorkflowTemplate,
} from '@/@types/agents'

const LOCAL_STORAGE_KEY = 'studio.ia.agents'

const WORKFLOW_PLACEHOLDERS: Record<string, string> = {
    __ZAPI_INSTANCE_ID__: '',
    __ZAPI_INSTANCE_TOKEN__: '',
    __ZAPI_CLIENT_TOKEN__: '',
    __GUIDE_WORKFLOW_ID__: '',
    __WEBHOOK_PATH__: '',
    __OPENAI_CREDENTIAL_ID__: '',
    __OPENAI_CREDENTIAL_NAME__: '',
    __REDIS_CREDENTIAL_ID__: '',
    __REDIS_CREDENTIAL_NAME__: '',
}

const DEFAULT_CLINIC_PROMPT = `Voce e o atendente virtual oficial da clinica.

Objetivo:
- Receber pacientes com clareza e cordialidade.
- Responder com base nas informacoes autorizadas pela clinica.
- Coletar dados apenas quando necessario para continuar o atendimento.
- Encaminhar para humano quando o caso exigir confirmacao, urgencia ou acao operacional.

Regras:
- Use linguagem profissional, direta e acolhedora.
- Nao invente informacoes, horarios, medicos, convenios ou procedimentos.
- Se nao houver certeza, informe que vai encaminhar para o time responsavel.
- Quando precisar de atendimento humano, finalize com a tag configurada de suporte.
- Quando coletar dados para acao humana, finalize com a tag configurada de handoff.
- Em erro operacional, finalize com a tag configurada de erro.
`

const buildWebhookPath = (value: string, prefix: string) => {
    const normalizedValue = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const suffix = normalizedValue || `agente-${Date.now()}`

    return `${prefix}-${suffix}`
}

const cloneValue = <T>(value: T): T => {
    return JSON.parse(JSON.stringify(value)) as T
}

const readAgentsFromStorage = (): AgentRecord[] => {
    const rawValue = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!rawValue) {
        return []
    }

    try {
        const parsedValue = JSON.parse(rawValue)
        return Array.isArray(parsedValue) ? (parsedValue as AgentRecord[]) : []
    } catch {
        return []
    }
}

const writeAgentsToStorage = (agents: AgentRecord[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(agents))
}

export const getAgentOwnerKey = (user?: User) => {
    return user?.userId || user?.email || 'anonymous'
}

const replacePlaceholders = (
    value: unknown,
    replacements: Record<string, string>,
): unknown => {
    if (Array.isArray(value)) {
        return value.map((item) => replacePlaceholders(item, replacements))
    }

    if (value && typeof value === 'object') {
        const nextValue: Record<string, unknown> = {}

        Object.entries(value).forEach(([key, entryValue]) => {
            nextValue[key] = replacePlaceholders(entryValue, replacements)
        })

        return nextValue
    }

    if (typeof value === 'string') {
        return Object.entries(replacements).reduce(
            (result, [placeholder, replacement]) =>
                result.split(placeholder).join(replacement),
            value,
        )
    }

    return value
}

const buildPromptWithRag = (input: ClinicAttendantInput) => {
    const trimmedPrompt = input.intelligence.systemPrompt.trim()
    const basePrompt =
        trimmedPrompt.length > 0 ? trimmedPrompt : DEFAULT_CLINIC_PROMPT

    const ragSection =
        input.intelligence.ragMemories.length > 0
            ? `\n\nMemorias e RAGs autorizadas:\n${input.intelligence.ragMemories
                  .map(
                      (memory, index) =>
                          `${index + 1}. ${memory.title}\n${memory.content}`,
                  )
                  .join('\n\n')}`
            : ''

    return [
        `Clinica: ${input.clinicName}`,
        `Tag de erro: <<ADD_TAG:${input.intelligence.tagMapping.errorTagId}>>`,
        `Tag de handoff: <<ADD_TAG:${input.intelligence.tagMapping.handoffTagId}>>`,
        `Tag de suporte: <<ADD_TAG:${input.intelligence.tagMapping.supportTagId}>>`,
        '',
        basePrompt,
        ragSection,
    ]
        .join('\n')
        .trim()
}

const updateNodeAssignments = (
    assignments: unknown,
    assignmentName: string,
    nextValue: string,
) => {
    if (!assignments || typeof assignments !== 'object') {
        return
    }

    const assignmentList = (assignments as { assignments?: unknown[] }).assignments

    if (!Array.isArray(assignmentList)) {
        return
    }

    assignmentList.forEach((assignment) => {
        if (
            assignment &&
            typeof assignment === 'object' &&
            (assignment as { name?: string }).name === assignmentName
        ) {
            ;(assignment as { value: string }).value = nextValue
        }
    })
}

export const buildClinicWorkflowPayload = (
    input: ClinicAttendantInput,
    adminSettings: AdminPlatformSettings,
): WorkflowCreatePayload => {
    const templateClone = cloneValue(workflowTemplate as WorkflowTemplate)
    const replacements = {
        ...WORKFLOW_PLACEHOLDERS,
        __ZAPI_INSTANCE_ID__: input.whatsapp.instanceId,
        __ZAPI_INSTANCE_TOKEN__: input.whatsapp.instanceToken,
        __ZAPI_CLIENT_TOKEN__: input.whatsapp.clientToken,
        __GUIDE_WORKFLOW_ID__: adminSettings.n8n.guideWorkflowId,
        __WEBHOOK_PATH__: buildWebhookPath(
            input.name,
            adminSettings.defaults.webhookPrefix,
        ),
        __OPENAI_CREDENTIAL_ID__:
            adminSettings.credentials.openAiCredentialId,
        __OPENAI_CREDENTIAL_NAME__:
            adminSettings.credentials.openAiCredentialName,
        __REDIS_CREDENTIAL_ID__: adminSettings.credentials.redisCredentialId,
        __REDIS_CREDENTIAL_NAME__:
            adminSettings.credentials.redisCredentialName,
    }

    const workflow = replacePlaceholders(
        templateClone,
        replacements,
    ) as WorkflowTemplate

    workflow.name = input.name

    workflow.nodes.forEach((node) => {
        if (node.name === 'AI Agent') {
            const nodeOptions = node.parameters?.options as
                | Record<string, unknown>
                | undefined

            if (nodeOptions) {
                nodeOptions.systemMessage = buildPromptWithRag(input)
            }
        }

        if (node.name === 'OpenAI Chat Model') {
            const nodeParameters = node.parameters as
                | Record<string, unknown>
                | undefined

            if (nodeParameters) {
                nodeParameters.model = input.intelligence.model

                const options = (nodeParameters.options ??
                    {}) as Record<string, unknown>
                nodeParameters.options = {
                    ...options,
                    temperature: 0,
                }
            }
        }

        if (node.name === 'Window Buffer Memory') {
            const nodeParameters = node.parameters as
                | Record<string, unknown>
                | undefined

            if (nodeParameters) {
                nodeParameters.contextWindowLength =
                    input.intelligence.memoryWindow
            }
        }

        if (node.name === 'Set - tagId e outputLimpo') {
            updateNodeAssignments(
                (node.parameters as { assignments?: unknown })?.assignments,
                'outputLimpo',
                input.intelligence.handoffMessage,
            )
        }
    })

    return {
        name: workflow.name,
        nodes: workflow.nodes,
        connections: workflow.connections,
        settings: workflow.settings,
    }
}

export const buildClinicProvisioningRequest = (
    input: ClinicAttendantInput,
    adminSettings: AdminPlatformSettings,
): AgentProvisioningRequest => {
    return {
        templateKey: 'clinic-attendant',
        folderId: adminSettings.n8n.folderId,
        projectId: adminSettings.n8n.projectId,
        publishOnCreate: adminSettings.n8n.publishOnCreate,
        workflow: buildClinicWorkflowPayload(input, adminSettings),
        metadata: {
            clinicName: input.clinicName,
            tags: input.tags,
            guideWorkflowId: adminSettings.n8n.guideWorkflowId,
            ragMemories: input.intelligence.ragMemories,
        },
    }
}

export const listAgentsByUser = (user?: User) => {
    const ownerKey = getAgentOwnerKey(user)

    return readAgentsFromStorage()
        .filter((agent) => agent.ownerKey === ownerKey)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export const listAllAgents = () =>
    readAgentsFromStorage().sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt),
    )

export const listAgentsByOwnerKey = (ownerKey: string) =>
    readAgentsFromStorage()
        .filter((agent) => agent.ownerKey === ownerKey)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))

export const createClinicAgent = async (
    input: ClinicAttendantInput,
    user?: User,
) => {
    const adminSettings = getAdminPlatformSettings()
    const provisioningRequest = buildClinicProvisioningRequest(
        input,
        adminSettings,
    )
    const ownerKey = getAgentOwnerKey(user)
    const timestamp = new Date().toISOString()

    const nextAgent: AgentRecord = {
        id: createUID(12),
        ownerKey,
        templateKey: 'clinic-attendant',
        libraryCategory: 'atendimento',
        catalogItemId: 'support-whatsapp-agent',
        name: input.name,
        clinicName: input.clinicName,
        description: input.description,
        status: input.status,
        tags: input.tags,
        channelLabel: 'WhatsApp / Z-API',
        provisioningStatus: appConfig.enableMock
            ? 'rascunho-local'
            : 'pendente-backend',
        provisioningMessage: appConfig.enableMock
            ? 'Configuracao salva localmente. O provisionamento real no n8n depende do backend da plataforma.'
            : 'Provisionamento enviado para o backend da plataforma.',
        n8nFolderId: adminSettings.n8n.folderId,
        n8nProjectId: adminSettings.n8n.projectId,
        createdAt: timestamp,
        updatedAt: timestamp,
        adminSettingsSnapshot: adminSettings,
        config: input,
    }

    if (!appConfig.enableMock) {
        try {
            const response =
                await ApiService.fetchDataWithAxios<AgentProvisioningResponse>({
                    url: '/agents/provision',
                    method: 'post',
                    data: provisioningRequest,
                })

            nextAgent.provisioningStatus = 'provisionado'
            nextAgent.provisioningMessage =
                'Workflow provisionado com sucesso no n8n.'
            nextAgent.n8nWorkflowId = response.workflowId
            nextAgent.n8nWorkflowUrl = response.workflowUrl
        } catch {
            nextAgent.provisioningStatus = 'falha'
            nextAgent.provisioningMessage =
                'Nao foi possivel provisionar o workflow no backend. A configuracao foi mantida localmente.'
        }
    }

    const currentAgents = readAgentsFromStorage()
    writeAgentsToStorage([nextAgent, ...currentAgents])

    return {
        agent: nextAgent,
        provisioningRequest,
    }
}

export const deleteAgentById = (agentId: string, user?: User) => {
    const ownerKey = getAgentOwnerKey(user)
    const filteredAgents = readAgentsFromStorage().filter(
        (agent) => !(agent.id === agentId && agent.ownerKey === ownerKey),
    )

    writeAgentsToStorage(filteredAgents)
}

export const duplicateAgentById = (agentId: string, user?: User) => {
    const ownerKey = getAgentOwnerKey(user)
    const currentAgent = readAgentsFromStorage().find(
        (agent) => agent.id === agentId && agent.ownerKey === ownerKey,
    )

    if (!currentAgent) {
        return null
    }

    const timestamp = new Date().toISOString()
    const duplicatedAgent: AgentRecord = {
        ...currentAgent,
        id: createUID(12),
        name: `${currentAgent.name} copia`,
        provisioningStatus: 'rascunho-local',
        provisioningMessage:
            'Copia criada localmente. Revise as credenciais e reprovisione quando necessario.',
        createdAt: timestamp,
        updatedAt: timestamp,
        config: {
            ...currentAgent.config,
            name: `${currentAgent.config.name} copia`,
        },
        n8nWorkflowId: undefined,
        n8nWorkflowUrl: undefined,
    }

    const currentAgents = readAgentsFromStorage()
    writeAgentsToStorage([duplicatedAgent, ...currentAgents])

    return duplicatedAgent
}

export const updateAgentById = (
    agentId: string,
    user: User | undefined,
    input: Partial<Pick<AgentRecord, 'name' | 'description' | 'status' | 'tags'>>,
) => {
    const ownerKey = getAgentOwnerKey(user)
    const currentAgents = readAgentsFromStorage()
    const currentAgent = currentAgents.find(
        (agent) => agent.id === agentId && agent.ownerKey === ownerKey,
    )

    if (!currentAgent) {
        return null
    }

    const updatedAgent: AgentRecord = {
        ...currentAgent,
        ...input,
        updatedAt: new Date().toISOString(),
        config: {
            ...currentAgent.config,
            name: input.name ?? currentAgent.config.name,
            description: input.description ?? currentAgent.config.description,
            status: input.status ?? currentAgent.config.status,
            tags: input.tags ?? currentAgent.config.tags,
        },
    }

    writeAgentsToStorage(
        currentAgents.map((agent) =>
            agent.id === agentId && agent.ownerKey === ownerKey
                ? updatedAgent
                : agent,
        ),
    )

    return updatedAgent
}
