import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clinicWorkflowTemplate from '@/assets/templates/clinic-attendant-workflow.json'
import { getAdminPlatformSettings } from '@/services/AdminPlatformSettingsService'
import { useSessionUser } from '@/store/authStore'
import { createClinicAgent } from '@/services/AgentService'
import type {
    AgentLifecycleStatus,
    ClinicAttendantInput,
    RagMemory,
} from '@/@types/agents'

type WizardStep = 0 | 1 | 2 | 3

const steps = ['Template', 'WhatsApp', 'IA e RAGs', 'Revisao']

const defaultPrompt = `Voce e o atendente virtual oficial da clinica.

Objetivos:
- acolher pacientes com clareza;
- responder apenas com informacoes autorizadas;
- coletar dados apenas quando necessario;
- encaminhar para humano quando houver urgencia, duvida clinica ou necessidade operacional.

Regras:
- seja cordial, profissional e direto;
- nao invente medicos, horarios, convenios ou procedimentos;
- se nao houver certeza, informe que o caso sera encaminhado;
- quando o caso precisar de humano, finalize usando a tag correta.`

const formatDate = (value: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(value))
}

const CreateAgent: React.FC = () => {
    const navigate = useNavigate()
    const user = useSessionUser((state) => state.user)
    const adminSettings = useMemo(() => getAdminPlatformSettings(), [])
    const [activeStep, setActiveStep] = useState<WizardStep>(0)
    const [saving, setSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [name, setName] = useState('')
    const [clinicName, setClinicName] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState<AgentLifecycleStatus>('Ativo')
    const [tagDraft, setTagDraft] = useState('')
    const [tags, setTags] = useState<string[]>([
        'Clinica',
        'WhatsApp',
        'Atendente',
    ])

    const [instanceId, setInstanceId] = useState('')
    const [instanceToken, setInstanceToken] = useState('')
    const [clientToken, setClientToken] = useState('')

    const [model, setModel] = useState('gpt-4o-mini')
    const [systemPrompt, setSystemPrompt] = useState(defaultPrompt)
    const [handoffMessage, setHandoffMessage] = useState(
        'Em breve o time da clinica dara continuidade ao atendimento.',
    )
    const [memoryWindow, setMemoryWindow] = useState(10)
    const [errorTagId, setErrorTagId] = useState('1')
    const [handoffTagId, setHandoffTagId] = useState('2')
    const [supportTagId, setSupportTagId] = useState('3')
    const [ragDraftTitle, setRagDraftTitle] = useState('')
    const [ragDraftContent, setRagDraftContent] = useState('')
    const [ragMemories, setRagMemories] = useState<RagMemory[]>([])

    const currentUserLabel = user.userName || user.email || 'usuario atual'
    const workflowStats = useMemo(() => {
        const nodeCount = Array.isArray(clinicWorkflowTemplate.nodes)
            ? clinicWorkflowTemplate.nodes.length
            : 0

        const connectionCount = clinicWorkflowTemplate.connections
            ? Object.keys(clinicWorkflowTemplate.connections).length
            : 0

        return {
            nodeCount,
            connectionCount,
        }
    }, [])

    const requiredStepOneFields = [
        name.trim(),
        clinicName.trim(),
        description.trim(),
    ]

    const requiredStepTwoFields = [
        instanceId.trim(),
        instanceToken.trim(),
        clientToken.trim(),
    ]

    const requiredStepThreeFields = [
        systemPrompt.trim(),
        handoffMessage.trim(),
        errorTagId.trim(),
        handoffTagId.trim(),
        supportTagId.trim(),
    ]

    const handleNext = () => {
        setErrorMessage('')

        if (activeStep === 0 && requiredStepOneFields.some((value) => !value)) {
            setErrorMessage(
                'Preencha nome, clinica e descricao antes de continuar.',
            )
            return
        }

        if (activeStep === 1 && requiredStepTwoFields.some((value) => !value)) {
            setErrorMessage(
                'Complete os dados de conexao do WhatsApp para continuar.',
            )
            return
        }

        if (
            activeStep === 2 &&
            requiredStepThreeFields.some((value) => !value)
        ) {
            setErrorMessage(
                'Defina prompt, mensagem de handoff e o mapeamento de tags.',
            )
            return
        }

        setActiveStep((currentStep) =>
            currentStep < 3 ? ((currentStep + 1) as WizardStep) : currentStep,
        )
    }

    const handlePrevious = () => {
        setErrorMessage('')
        setActiveStep((currentStep) =>
            currentStep > 0 ? ((currentStep - 1) as WizardStep) : currentStep,
        )
    }

    const handleAddTag = () => {
        const nextTag = tagDraft.trim()

        if (!nextTag) {
            return
        }

        setTags((currentTags) =>
            currentTags.includes(nextTag)
                ? currentTags
                : [...currentTags, nextTag],
        )
        setTagDraft('')
    }

    const handleRemoveTag = (tag: string) => {
        setTags((currentTags) => currentTags.filter((item) => item !== tag))
    }

    const handleAddRagMemory = () => {
        const nextTitle = ragDraftTitle.trim()
        const nextContent = ragDraftContent.trim()

        if (!nextTitle || !nextContent) {
            return
        }

        setRagMemories((currentMemories) => [
            ...currentMemories,
            {
                id: `${Date.now()}`,
                title: nextTitle,
                content: nextContent,
            },
        ])
        setRagDraftTitle('')
        setRagDraftContent('')
    }

    const handleRemoveRagMemory = (memoryId: string) => {
        setRagMemories((currentMemories) =>
            currentMemories.filter((memory) => memory.id !== memoryId),
        )
    }

    const buildPayload = (): ClinicAttendantInput => ({
        name: name.trim(),
        clinicName: clinicName.trim(),
        description: description.trim(),
        status,
        tags,
        whatsapp: {
            provider: 'z-api',
            instanceId: instanceId.trim(),
            instanceToken: instanceToken.trim(),
            clientToken: clientToken.trim(),
        },
        intelligence: {
            model,
            systemPrompt: systemPrompt.trim(),
            handoffMessage: handoffMessage.trim(),
            memoryWindow,
            tagMapping: {
                errorTagId: errorTagId.trim(),
                handoffTagId: handoffTagId.trim(),
                supportTagId: supportTagId.trim(),
            },
            ragMemories,
        },
    })

    const handleSave = async () => {
        setSaving(true)
        setErrorMessage('')

        try {
            const payload = buildPayload()
            await createClinicAgent(payload, user)
            navigate('/agentes')
        } catch {
            setErrorMessage(
                'Nao foi possivel salvar o agente agora. Revise os dados e tente novamente.',
            )
        } finally {
            setSaving(false)
        }
    }

    const reviewPayload = buildPayload()

    return (
        <div className="flex flex-col gap-6">
            <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase text-indigo-500 dark:text-indigo-300">
                            studio.IA
                        </p>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Criar atendente para clinica
                        </h1>
                        <p className="mt-1 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
                            Esta jornada configura um fluxo n8n baseado no
                            template de WhatsApp, sem alterar a estrutura do
                            workflow. O usuario final define apenas conexao
                            WhatsApp, prompt, memorias e regras do atendente.
                        </p>
                    </div>
                    <Link
                        to="/agentes"
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-indigo-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-400"
                    >
                        Voltar para agentes
                    </Link>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-4">
                    {steps.map((step, index) => (
                        <div
                            key={step}
                            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                                activeStep === index
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-200'
                                    : 'border-gray-200 text-gray-600 dark:border-gray-800 dark:text-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{step}</span>
                                <span className="text-xs text-gray-400">
                                    {index + 1}/4
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </header>

            {activeStep === 0 && (
                <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Template do agente
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Hoje a plataforma esta preparada para criar
                            atendentes de clinica sobre um fluxo n8n travado,
                            com infraestrutura administrada pela plataforma.
                        </p>

                        <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-semibold text-indigo-700 dark:text-indigo-200">
                                        Atendente para clinica
                                    </h3>
                                    <p className="mt-2 text-sm text-indigo-700/80 dark:text-indigo-200/80">
                                        Fluxo com entrada por WhatsApp, memoria,
                                        agente de IA, tools e roteamento de
                                        resposta. A logica do workflow permanece
                                        fixa; so as configuracoes funcionais do
                                        atendente mudam.
                                    </p>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-200">
                                    Selecionado
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <Field required label="Nome do atendente">
                                <input
                                    value={name}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="Ex.: Recepcao Clinica Aurora"
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                />
                            </Field>

                            <Field required label="Nome da clinica">
                                <input
                                    value={clinicName}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="Ex.: Clinica Aurora"
                                    onChange={(event) =>
                                        setClinicName(event.target.value)
                                    }
                                />
                            </Field>

                            <Field label="Status inicial">
                                <select
                                    value={status}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    onChange={(event) =>
                                        setStatus(
                                            event.target.value as AgentLifecycleStatus,
                                        )
                                    }
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                    <option value="Programado">
                                        Programado
                                    </option>
                                </select>
                            </Field>

                            <Field label="Usuario dono">
                                <div className="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                                    {currentUserLabel}
                                </div>
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field required label="Descricao do atendente">
                                <textarea
                                    value={description}
                                    className="min-h-[100px] rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="Descreva o papel desse atendente na operacao da clinica."
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Tags da plataforma">
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200"
                                            onClick={() =>
                                                handleRemoveTag(tag)
                                            }
                                        >
                                            {tag} x
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <input
                                        value={tagDraft}
                                        className="flex-1 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                        placeholder="Nova tag"
                                        onChange={(event) =>
                                            setTagDraft(event.target.value)
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault()
                                                handleAddTag()
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                        onClick={handleAddTag}
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            </Field>
                        </div>
                    </div>

                    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Resumo tecnico do template
                        </h2>
                        <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                            <InfoRow
                                label="Nos do workflow"
                                value={`${workflowStats.nodeCount}`}
                            />
                            <InfoRow
                                label="Conexoes"
                                value={`${workflowStats.connectionCount}`}
                            />
                            <InfoRow
                                label="Canal principal"
                                value="WhatsApp / Z-API"
                            />
                            <InfoRow
                                label="Memoria"
                                value="Buffer configuravel"
                            />
                            <InfoRow
                                label="Provisionamento"
                                value="Backend da plataforma"
                            />
                        </div>
                        <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                            Redis, OpenAI, pasta do n8n, projeto e workflow de
                            tool agora sao tratados como configuracao
                            administrativa da plataforma, e nao mais como dados
                            do usuario final.
                        </div>
                    </aside>
                </section>
            )}

            {activeStep === 1 && (
                <div className="grid gap-6">
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Conexao WhatsApp
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Esses dados alimentam os nodes HTTP do fluxo sem
                            alterar a logica do template.
                        </p>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <Field required label="Z-API Instance ID">
                                <input
                                    value={instanceId}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="3EDEA..."
                                    onChange={(event) =>
                                        setInstanceId(event.target.value)
                                    }
                                />
                            </Field>

                            <Field required label="Z-API Instance Token">
                                <input
                                    value={instanceToken}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="token da instancia"
                                    onChange={(event) =>
                                        setInstanceToken(event.target.value)
                                    }
                                />
                            </Field>

                            <Field required label="Z-API Client Token">
                                <input
                                    value={clientToken}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="client-token"
                                    onChange={(event) =>
                                        setClientToken(event.target.value)
                                    }
                                />
                            </Field>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Infraestrutura administrada pela plataforma
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Cada atendente gera um novo workflow, mas os dados
                            de n8n, Redis e credenciais tecnicas ficam fora do
                            formulario do cliente e virao de um perfil
                            administrativo no futuro.
                        </p>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <InfoPanel
                                label="Pasta n8n"
                                value={adminSettings.n8n.folderId}
                            />
                            <InfoPanel
                                label="Project n8n"
                                value={adminSettings.n8n.projectId}
                            />
                            <InfoPanel
                                label="Workflow da tool"
                                value={adminSettings.n8n.guideWorkflowId}
                            />
                            <InfoPanel
                                label="Publicacao automatica"
                                value={
                                    adminSettings.n8n.publishOnCreate
                                        ? 'Ativa'
                                        : 'Desligada'
                                }
                            />
                        </div>
                    </section>
                </div>
            )}

            {activeStep === 2 && (
                <div className="grid gap-6">
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Inteligencia do atendente
                        </h2>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <Field label="Modelo">
                                <select
                                    value={model}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    onChange={(event) =>
                                        setModel(event.target.value)
                                    }
                                >
                                    <option value="gpt-4o-mini">
                                        gpt-4o-mini
                                    </option>
                                    <option value="gpt-4.1-mini">
                                        gpt-4.1-mini
                                    </option>
                                    <option value="gpt-4o">gpt-4o</option>
                                </select>
                            </Field>

                            <Field label="Janela de memoria">
                                <input
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={memoryWindow}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    onChange={(event) =>
                                        setMemoryWindow(
                                            Number(event.target.value),
                                        )
                                    }
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field required label="Prompt principal">
                                <textarea
                                    value={systemPrompt}
                                    className="min-h-[260px] rounded-lg border border-gray-300 bg-transparent px-3 py-2 font-mono text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="Instrucao completa do atendente"
                                    onChange={(event) =>
                                        setSystemPrompt(event.target.value)
                                    }
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field
                                required
                                label="Mensagem de handoff humano"
                            >
                                <input
                                    value={handoffMessage}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="Mensagem enviada antes do encaminhamento"
                                    onChange={(event) =>
                                        setHandoffMessage(
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Mapeamento de tags
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            O prompt usa essas tags para acionar o node de
                            handoff no WhatsApp.
                        </p>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <Field required label="Tag de erro">
                                <input
                                    value={errorTagId}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    onChange={(event) =>
                                        setErrorTagId(event.target.value)
                                    }
                                />
                            </Field>

                            <Field required label="Tag de handoff">
                                <input
                                    value={handoffTagId}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    onChange={(event) =>
                                        setHandoffTagId(event.target.value)
                                    }
                                />
                            </Field>

                            <Field required label="Tag de suporte">
                                <input
                                    value={supportTagId}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    onChange={(event) =>
                                        setSupportTagId(event.target.value)
                                    }
                                />
                            </Field>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            RAGs e memorias
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Cada memoria adicionada entra no contexto do prompt
                            final enviado ao workflow.
                        </p>

                        <div className="mt-6 grid gap-4">
                            <Field label="Titulo da memoria">
                                <input
                                    value={ragDraftTitle}
                                    className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="Ex.: Politica de agendamento"
                                    onChange={(event) =>
                                        setRagDraftTitle(
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>

                            <Field label="Conteudo da memoria">
                                <textarea
                                    value={ragDraftContent}
                                    className="min-h-[110px] rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                                    placeholder="Texto base que a IA podera usar no atendimento."
                                    onChange={(event) =>
                                        setRagDraftContent(
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                    onClick={handleAddRagMemory}
                                >
                                    Adicionar memoria
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3">
                            {ragMemories.length === 0 && (
                                <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                    Nenhuma memoria adicionada ainda.
                                </div>
                            )}

                            {ragMemories.map((memory) => (
                                <div
                                    key={memory.id}
                                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-950"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {memory.title}
                                            </h3>
                                            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
                                                {memory.content}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-300 dark:border-rose-500/30 dark:text-rose-300"
                                            onClick={() =>
                                                handleRemoveRagMemory(
                                                    memory.id,
                                                )
                                            }
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {activeStep === 3 && (
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Revisao final
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        O workflow sera criado a partir do template higienizado e
                        recebera apenas os dados abaixo como configuracao.
                    </p>

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        <ReviewCard
                            title="Identidade"
                            lines={[
                                `Atendente: ${reviewPayload.name}`,
                                `Clinica: ${reviewPayload.clinicName}`,
                                `Status: ${reviewPayload.status}`,
                                `Tags: ${reviewPayload.tags.join(', ')}`,
                            ]}
                        />
                        <ReviewCard
                            title="WhatsApp"
                            lines={[
                                'Provider: Z-API',
                                `Instance ID: ${reviewPayload.whatsapp.instanceId}`,
                                `Provisionado pela plataforma para ${reviewPayload.clinicName}`,
                            ]}
                        />
                        <ReviewCard
                            title="Infraestrutura"
                            lines={[
                                `Pasta n8n: ${adminSettings.n8n.folderId}`,
                                `Projeto n8n: ${adminSettings.n8n.projectId}`,
                                `Tool workflow: ${adminSettings.n8n.guideWorkflowId}`,
                                `Publicar ao criar: ${
                                    adminSettings.n8n.publishOnCreate
                                        ? 'sim'
                                        : 'nao'
                                }`,
                            ]}
                        />
                        <ReviewCard
                            title="IA"
                            lines={[
                                `Modelo: ${reviewPayload.intelligence.model}`,
                                `Memoria: ${reviewPayload.intelligence.memoryWindow}`,
                                `RAGs: ${reviewPayload.intelligence.ragMemories.length}`,
                                `Mensagem de handoff: ${reviewPayload.intelligence.handoffMessage}`,
                            ]}
                        />
                    </div>

                    <div className="mt-6 rounded-xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-950">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Preview do payload
                        </h3>
                        <div className="mt-3 grid gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <InfoRow
                                label="Nome do workflow"
                                value={reviewPayload.name}
                            />
                            <InfoRow
                                label="Total de nos"
                                value={`${workflowStats.nodeCount}`}
                            />
                            <InfoRow
                                label="Criado em"
                                value={formatDate(new Date().toISOString())}
                            />
                        </div>
                    </div>
                </section>
            )}

            {errorMessage && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                    {errorMessage}
                </div>
            )}

            <footer className="flex flex-wrap items-center justify-end gap-3">
                <Link
                    to="/agentes"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-indigo-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-400"
                >
                    Cancelar
                </Link>
                <button
                    type="button"
                    disabled={activeStep === 0 || saving}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-400"
                    onClick={handlePrevious}
                >
                    Voltar
                </button>
                {activeStep < 3 && (
                    <button
                        type="button"
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        onClick={handleNext}
                    >
                        Avancar
                    </button>
                )}
                {activeStep === 3 && (
                    <button
                        type="button"
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                        onClick={handleSave}
                    >
                        {saving ? 'Salvando...' : 'Salvar atendente'}
                    </button>
                )}
            </footer>
        </div>
    )
}

type FieldProps = {
    label: string
    required?: boolean
    children: React.ReactNode
}

const Field = ({ label, required = false, children }: FieldProps) => {
    return (
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>
                {label}
                {required ? ' *' : ''}
            </span>
            {children}
        </label>
    )
}

const InfoRow = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-right font-medium text-gray-900 dark:text-gray-100">
                {value}
            </span>
        </div>
    )
}

const InfoPanel = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-950">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {label}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                {value}
            </p>
        </div>
    )
}

const ReviewCard = ({
    title,
    lines,
}: {
    title: string
    lines: string[]
}) => {
    return (
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-950">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {title}
            </h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {lines.map((line) => (
                    <p key={line}>{line}</p>
                ))}
            </div>
        </div>
    )
}

export default CreateAgent
