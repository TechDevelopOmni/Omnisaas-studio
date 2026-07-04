export type AgentTemplateKey = 'clinic-attendant'

export type AgentLibraryCategory = string

export type AgentLibraryCategoryGroupId = 'departamentos' | 'especialidades'

export type AgentLifecycleStatus = 'Ativo' | 'Inativo' | 'Programado'

export type AgentProvisioningStatus =
    | 'rascunho-local'
    | 'pendente-backend'
    | 'provisionado'
    | 'falha'

export type RagMemory = {
    id: string
    title: string
    content: string
}

export type AgentTagMapping = {
    errorTagId: string
    handoffTagId: string
    supportTagId: string
}

export type AdminPlatformSettings = {
    n8n: {
        folderId: string
        projectId: string
        guideWorkflowId: string
        publishOnCreate: boolean
    }
    credentials: {
        openAiCredentialId: string
        openAiCredentialName: string
        redisCredentialId: string
        redisCredentialName: string
    }
    defaults: {
        webhookPrefix: string
    }
}

export type ClinicAttendantInput = {
    name: string
    clinicName: string
    description: string
    status: AgentLifecycleStatus
    tags: string[]
    whatsapp: {
        provider: 'z-api'
        instanceId: string
        instanceToken: string
        clientToken: string
    }
    intelligence: {
        model: string
        systemPrompt: string
        handoffMessage: string
        memoryWindow: number
        tagMapping: AgentTagMapping
        ragMemories: RagMemory[]
    }
}

export type WorkflowNode = {
    name: string
    type: string
    parameters?: Record<string, unknown>
    credentials?: Record<string, { id: string; name: string }>
    [key: string]: unknown
}

export type WorkflowTemplate = {
    name: string
    nodes: WorkflowNode[]
    connections: Record<string, unknown>
    settings: Record<string, unknown>
    active?: boolean
    tags?: unknown[]
    [key: string]: unknown
}

export type WorkflowCreatePayload = {
    name: string
    nodes: WorkflowNode[]
    connections: Record<string, unknown>
    settings: Record<string, unknown>
}

export type AgentProvisioningRequest = {
    templateKey: AgentTemplateKey
    folderId: string
    projectId: string
    publishOnCreate: boolean
    workflow: WorkflowCreatePayload
    metadata: {
        clinicName: string
        tags: string[]
        guideWorkflowId: string
        ragMemories: RagMemory[]
    }
}

export type AgentProvisioningResponse = {
    workflowId?: string
    workflowUrl?: string
}

export type AgentRecord = {
    id: string
    ownerKey: string
    templateKey: AgentTemplateKey
    libraryCategory?: AgentLibraryCategory
    catalogItemId?: string
    name: string
    clinicName: string
    description: string
    status: AgentLifecycleStatus
    tags: string[]
    channelLabel: string
    provisioningStatus: AgentProvisioningStatus
    provisioningMessage: string
    n8nFolderId: string
    n8nProjectId: string
    n8nWorkflowId?: string
    n8nWorkflowUrl?: string
    createdAt: string
    updatedAt: string
    adminSettingsSnapshot: AdminPlatformSettings
    config: ClinicAttendantInput
}

export type AgentCatalogItem = {
    id: string
    category: AgentLibraryCategory
    title: string
    role: string
    description: string
    highlights: string[]
    route: string
    available: boolean
    visual: {
        accent: string
        glow: string
        panel: string
        symbol: string
    }
}

export type AgentLibraryCategoryRecord = {
    value: AgentLibraryCategory
    label: string
    description: string
    groupId: AgentLibraryCategoryGroupId
    monthlyPrice: number
}

export type AgentLibraryCategoryGroupRecord = {
    id: AgentLibraryCategoryGroupId
    label: string
    description: string
}
