import { useMemo, useState } from 'react'
import type { AgentLifecycleStatus, ClinicAttendantInput } from '@/@types/agents'
import type { User } from '@/@types/auth'
import {
    createClinicAgent,
    deleteAgentById,
    listAgentsByUser,
    updateAgentById,
} from '@/services/AgentService'
import {
    getLibraryCategories,
} from '@/services/AdminCatalogService'
import {
    DEPARTMENT_MONTHLY_PRICE,
    listClientAccounts,
    setDepartmentSubscriptionStatus,
} from '@/services/ClientAccountService'

const buildTargetUser = (ownerKey: string, profile?: { fullName?: string; email?: string }): User => ({
    userId: ownerKey.includes('@') ? undefined : ownerKey,
    email: profile?.email || (ownerKey.includes('@') ? ownerKey : ''),
    userName: profile?.fullName || ownerKey,
    authority: ['user'],
})

const buildDefaultClinicInput = (targetUser?: User): ClinicAttendantInput => ({
    name: 'Atendente da operacao',
    clinicName: targetUser?.userName || 'Conta do cliente',
    description: 'Configuracao criada pela equipe de suporte da plataforma.',
    status: 'Ativo',
    tags: ['suporte', 'setup-assistido'],
    whatsapp: {
        provider: 'z-api',
        instanceId: '',
        instanceToken: '',
        clientToken: '',
    },
    intelligence: {
        model: 'gpt-4o-mini',
        systemPrompt:
            'Voce e um agente configurado pela equipe da plataforma para apoiar a operacao do cliente com atendimento claro e seguro.',
        handoffMessage:
            'Encaminhando sua solicitacao para o time humano responsavel.',
        memoryWindow: 20,
        tagMapping: {
            errorTagId: '1',
            handoffTagId: '2',
            supportTagId: '3',
        },
        ragMemories: [],
    },
})

const AdminClientOperations = () => {
    const [clients, setClients] = useState(() => listClientAccounts())
    const [categories, setCategories] = useState(() => getLibraryCategories())
    const [selectedOwnerKey, setSelectedOwnerKey] = useState<string>(
        clients[0]?.ownerKey || '',
    )
    const selectedClient = clients.find((client) => client.ownerKey === selectedOwnerKey)
    const targetUser = selectedClient
        ? buildTargetUser(selectedClient.ownerKey, selectedClient.settings.profile)
        : undefined
    const clientAgents = useMemo(
        () => (targetUser ? listAgentsByUser(targetUser) : []),
        [targetUser],
    )
    const [draftInput, setDraftInput] = useState<ClinicAttendantInput>(
        buildDefaultClinicInput(targetUser),
    )
    const [editingAgentId, setEditingAgentId] = useState<string | null>(null)

    const refresh = () => {
        setClients(listClientAccounts())
        setCategories(getLibraryCategories())
    }

    const syncDraft = (user?: User) => {
        setDraftInput(buildDefaultClinicInput(user))
        setEditingAgentId(null)
    }

    const handleSelectClient = (ownerKey: string) => {
        const client = clients.find((entry) => entry.ownerKey === ownerKey)
        const nextTargetUser = client
            ? buildTargetUser(ownerKey, client.settings.profile)
            : undefined

        setSelectedOwnerKey(ownerKey)
        syncDraft(nextTargetUser)
    }

    const handleCreateOrUpdate = async () => {
        if (!targetUser) {
            return
        }

        if (editingAgentId) {
            updateAgentById(editingAgentId, targetUser, {
                name: draftInput.name,
                description: draftInput.description,
                status: draftInput.status,
                tags: draftInput.tags,
            })
        } else {
            await createClinicAgent(draftInput, targetUser)
        }

        refresh()
        syncDraft(targetUser)
    }

    const activeSubscriptions =
        selectedClient?.settings.subscriptions.filter((item) => item.status === 'active') ||
        []

    return (
        <div className="flex flex-col gap-6">
            <section className="rounded-[32px] border border-white/10 bg-[#07111c] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                    Administracao
                </p>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                    Operacao e suporte ao cliente
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                    A equipe interna pode acompanhar contas, habilitar
                    departamentos e criar ou ajustar agentes em nome do cliente
                    final diretamente pelo login administrativo.
                </p>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-6">
                    <h2 className="text-lg font-semibold text-white">Clientes</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Contas encontradas na base local da aplicacao.
                    </p>

                    <div className="mt-5 space-y-3">
                        {clients.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                                Nenhuma conta encontrada ainda. O suporte passa a
                                ter material aqui conforme clientes usam a area
                                final e salvam configuracoes.
                            </div>
                        )}

                        {clients.map((client) => {
                            const subscriptions = client.settings.subscriptions.filter(
                                (item) => item.status === 'active',
                            ).length
                            const isActive = client.ownerKey === selectedOwnerKey

                            return (
                                <button
                                    key={client.ownerKey}
                                    type="button"
                                    className={`w-full rounded-[24px] border p-4 text-left transition ${
                                        isActive
                                            ? 'border-cyan-300/35 bg-cyan-300/10'
                                            : 'border-white/10 bg-black/20'
                                    }`}
                                    onClick={() => handleSelectClient(client.ownerKey)}
                                >
                                    <p className="text-sm font-semibold text-white">
                                        {client.settings.profile.companyName ||
                                            client.settings.profile.fullName ||
                                            client.ownerKey}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {client.settings.profile.email || client.ownerKey}
                                    </p>
                                    <p className="mt-2 text-xs text-cyan-200">
                                        {subscriptions} departamentos ativos
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <section className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    Conta selecionada
                                </h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    {selectedClient
                                        ? selectedClient.settings.profile.companyName ||
                                          selectedClient.settings.profile.fullName ||
                                          selectedClient.ownerKey
                                        : 'Selecione um cliente para operar a conta.'}
                                </p>
                            </div>
                            {selectedClient && (
                                <span className="rounded-full bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                                    {activeSubscriptions.length} assinaturas ativas
                                </span>
                            )}
                        </div>

                        {selectedClient && (
                            <>
                                <div className="mt-5 grid gap-3 md:grid-cols-2">
                                    {categories.map((category) => {
                                        const subscribed = activeSubscriptions.some(
                                            (item) => item.category === category.value,
                                        )

                                        return (
                                            <div
                                                key={category.value}
                                                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-white">
                                                        {category.label}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        R$ {category.monthlyPrice || DEPARTMENT_MONTHLY_PRICE}
                                                        ,00/mes
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={`rounded-full px-4 py-2 text-xs font-semibold ${
                                                        subscribed
                                                            ? 'bg-emerald-400/10 text-emerald-200'
                                                            : 'bg-white/10 text-slate-300'
                                                    }`}
                                                    onClick={() => {
                                                        setDepartmentSubscriptionStatus(
                                                            targetUser,
                                                            category.value,
                                                            subscribed ? 'inactive' : 'active',
                                                        )
                                                        refresh()
                                                    }}
                                                >
                                                    {subscribed ? 'Ativo' : 'Liberar'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </section>

                    <section className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    Configurar agente para o cliente
                                </h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    Fluxo assistido da equipe interna. Hoje a
                                    base operacional mais madura continua sendo o
                                    template de atendimento.
                                </p>
                            </div>
                            {editingAgentId && (
                                <button
                                    type="button"
                                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white"
                                    onClick={() => syncDraft(targetUser)}
                                >
                                    Cancelar edicao
                                </button>
                            )}
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-2">
                            <Field label="Nome do agente">
                                <input
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                    value={draftInput.name}
                                    onChange={(event) =>
                                        setDraftInput((current) => ({
                                            ...current,
                                            name: event.target.value,
                                        }))
                                    }
                                />
                            </Field>
                            <Field label="Conta ou operacao">
                                <input
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                    value={draftInput.clinicName}
                                    onChange={(event) =>
                                        setDraftInput((current) => ({
                                            ...current,
                                            clinicName: event.target.value,
                                        }))
                                    }
                                />
                            </Field>
                            <Field label="Status">
                                <select
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                    value={draftInput.status}
                                    onChange={(event) =>
                                        setDraftInput((current) => ({
                                            ...current,
                                            status: event.target
                                                .value as AgentLifecycleStatus,
                                        }))
                                    }
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                    <option value="Programado">Programado</option>
                                </select>
                            </Field>
                            <Field label="Tags">
                                <input
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                    value={draftInput.tags.join(', ')}
                                    onChange={(event) =>
                                        setDraftInput((current) => ({
                                            ...current,
                                            tags: event.target.value
                                                .split(',')
                                                .map((item) => item.trim())
                                                .filter(Boolean),
                                        }))
                                    }
                                />
                            </Field>
                        </div>

                        <Field label="Descricao">
                            <textarea
                                rows={3}
                                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                value={draftInput.description}
                                onChange={(event) =>
                                    setDraftInput((current) => ({
                                        ...current,
                                        description: event.target.value,
                                    }))
                                }
                            />
                        </Field>

                        <div className="mt-4 grid gap-4 lg:grid-cols-3">
                            <Field label="Z-API Instance ID">
                                <input
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                    value={draftInput.whatsapp.instanceId}
                                    onChange={(event) =>
                                        setDraftInput((current) => ({
                                            ...current,
                                            whatsapp: {
                                                ...current.whatsapp,
                                                instanceId: event.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Field>
                            <Field label="Instance Token">
                                <input
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                    value={draftInput.whatsapp.instanceToken}
                                    onChange={(event) =>
                                        setDraftInput((current) => ({
                                            ...current,
                                            whatsapp: {
                                                ...current.whatsapp,
                                                instanceToken: event.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Field>
                            <Field label="Client Token">
                                <input
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                    value={draftInput.whatsapp.clientToken}
                                    onChange={(event) =>
                                        setDraftInput((current) => ({
                                            ...current,
                                            whatsapp: {
                                                ...current.whatsapp,
                                                clientToken: event.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Field>
                        </div>

                        <Field label="Prompt principal">
                            <textarea
                                rows={4}
                                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                value={draftInput.intelligence.systemPrompt}
                                onChange={(event) =>
                                    setDraftInput((current) => ({
                                        ...current,
                                        intelligence: {
                                            ...current.intelligence,
                                            systemPrompt: event.target.value,
                                        },
                                    }))
                                }
                            />
                        </Field>

                        <button
                            type="button"
                            className="mt-5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
                            onClick={handleCreateOrUpdate}
                        >
                            {editingAgentId
                                ? 'Salvar agente do cliente'
                                : 'Criar agente para o cliente'}
                        </button>
                    </section>

                    <section className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-6">
                        <h2 className="text-lg font-semibold text-white">
                            Agentes da conta selecionada
                        </h2>
                        <div className="mt-5 grid gap-4 xl:grid-cols-2">
                            {clientAgents.map((agent) => (
                                <article
                                    key={agent.id}
                                    className="rounded-[24px] border border-white/10 bg-black/20 p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {agent.name}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-300">
                                                {agent.description}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                                            {agent.status}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs text-slate-500">
                                        {agent.provisioningMessage}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white"
                                            onClick={() => {
                                                setEditingAgentId(agent.id)
                                                setDraftInput(agent.config)
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-full border border-rose-400/20 px-4 py-2 text-sm font-semibold text-rose-300"
                                            onClick={() => {
                                                deleteAgentById(agent.id, targetUser)
                                                refresh()
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </article>
                            ))}

                            {selectedClient && clientAgents.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                                    Esta conta ainda nao tem agentes configurados
                                    pela equipe ou pelo cliente.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </div>
    )
}

const Field = ({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) => (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-300">
        <span>{label}</span>
        {children}
    </label>
)

export default AdminClientOperations
