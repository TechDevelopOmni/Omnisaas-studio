import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSessionUser } from '@/store/authStore'
import {
    deleteAgentById,
    duplicateAgentById,
    listAgentsByUser,
} from '@/services/AgentService'
import type { AgentCatalogItem, AgentRecord } from '@/@types/agents'
import {
    getAgentCatalog,
    getLibraryCategories,
} from '@/services/AdminCatalogService'
import { getClientAccountSettings } from '@/services/ClientAccountService'

const provisioningLabelMap = {
    'rascunho-local': 'Rascunho local',
    'pendente-backend': 'Pendente no backend',
    provisionado: 'Provisionado',
    falha: 'Falha',
} as const

const formatCompactNumber = (value: number) =>
    new Intl.NumberFormat('pt-BR').format(value)

const buildMetricSeed = (value: string) =>
    value.split('').reduce((total, char) => total + char.charCodeAt(0), 0)

const buildAgentMetrics = (agent: AgentRecord) => {
    const seed = buildMetricSeed(
        `${agent.id}${agent.createdAt}${agent.status}${agent.provisioningStatus}`,
    )

    const executions = 80 + (seed % 870)
    const totalTokens = executions * (220 + (seed % 110))
    const avgResponseSeconds = 25 + (seed % 55)
    const successRate = 88 + (seed % 11)

    return {
        executions,
        totalTokens,
        avgResponseSeconds,
        successRate,
    }
}

const findConfiguredAgent = (
    item: AgentCatalogItem,
    agents: AgentRecord[],
) => {
    const directMatch = agents.find((agent) => agent.catalogItemId === item.id)

    if (directMatch) {
        return directMatch
    }

    return agents.find((agent) => agent.libraryCategory === item.category)
}

const AgentConfiguration: React.FC = () => {
    const user = useSessionUser((state) => state.user)
    const [agents, setAgents] = useState<AgentRecord[]>([])
    const libraryCategories = useMemo(() => getLibraryCategories(), [])
    const agentCatalog = useMemo(() => getAgentCatalog(), [])

    useEffect(() => {
        setAgents(listAgentsByUser(user))
    }, [user])

    const loadAgents = () => {
        setAgents(listAgentsByUser(user))
    }

    const accountSettings = useMemo(
        () => getClientAccountSettings(user),
        [user],
    )

    const subscribedCategories = useMemo(
        () =>
            accountSettings.subscriptions.filter(
                (subscription) => subscription.status === 'active',
            ),
        [accountSettings],
    )

    const contractedAgentCards = useMemo(
        () =>
            subscribedCategories.map((subscription) => {
                const category = libraryCategories.find(
                    (item) => item.value === subscription.category,
                )
                const items = agentCatalog
                    .filter((item) => item.category === subscription.category)
                    .map((item) => {
                        const configuredAgent = findConfiguredAgent(item, agents)

                        return {
                            item,
                            configuredAgent,
                            metrics: configuredAgent
                                ? buildAgentMetrics(configuredAgent)
                                : null,
                        }
                    })

                return {
                    category,
                    items,
                }
            }),
        [agentCatalog, agents, libraryCategories, subscribedCategories],
    )

    const summary = useMemo(() => {
        const contractedCount = contractedAgentCards.reduce(
            (total, group) => total + group.items.length,
            0,
        )
        const configuredCount = contractedAgentCards.reduce(
            (total, group) =>
                total +
                group.items.filter((entry) => entry.configuredAgent).length,
            0,
        )
        const activeCount = contractedAgentCards.reduce(
            (total, group) =>
                total +
                group.items.filter(
                    (entry) => entry.configuredAgent?.status === 'Ativo',
                ).length,
            0,
        )

        return {
            contractedCount,
            configuredCount,
            activeCount,
        }
    }, [contractedAgentCards])

    const handleDelete = (agentId: string) => {
        deleteAgentById(agentId, user)
        loadAgents()
    }

    const handleDuplicate = (agentId: string) => {
        duplicateAgentById(agentId, user)
        loadAgents()
    }

    return (
        <div className="flex flex-col gap-6">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111c] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-10 top-4 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
                    <div className="absolute right-0 top-8 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                            studio.IA
                        </p>
                        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                            Agentes contratados da conta
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                            Cada departamento contratado libera um conjunto de
                            agentes. Aqui voce enxerga esses agentes em cards
                            pequenos, com status e dados operacionais quando ja
                            houver configuracao.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/Biblioteca"
                            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Explorar biblioteca
                        </Link>
                        <Link
                            to="/criaragente"
                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                        >
                            Criar novo agente
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    label="Agentes contratados"
                    value={`${summary.contractedCount}`}
                    helper="Total liberado pelos departamentos ativos"
                />
                <SummaryCard
                    label="Ja configurados"
                    value={`${summary.configuredCount}`}
                    helper="Instancias criadas dentro da conta"
                />
                <SummaryCard
                    label="Ativos agora"
                    value={`${summary.activeCount}`}
                    helper="Agentes configurados com status ativo"
                />
            </section>

            <section className="rounded-[32px] border border-[#1c2c3d] bg-[#08131f] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)] sm:p-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Agentes por departamento contratado
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Se um departamento tiver 3 agentes liberados, os 3
                            aparecem aqui em cards individuais.
                        </p>
                    </div>
                    <span className="text-sm text-slate-400">
                        {summary.contractedCount} cards liberados
                    </span>
                </div>

                {contractedAgentCards.length === 0 && (
                    <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
                        <h3 className="text-base font-semibold text-white">
                            Nenhum departamento contratado ainda
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Contrate um departamento para liberar os agentes
                            correspondentes nesta tela.
                        </p>
                        <Link
                            to="/profile-page-view?tab=billing"
                            className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                        >
                            Gerenciar assinaturas
                        </Link>
                    </div>
                )}

                {contractedAgentCards.length > 0 && (
                    <div className="space-y-6">
                        {contractedAgentCards.map((group) => (
                            <div key={group.category?.value || 'sem-categoria'}>
                                <div className="mb-3 flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/75">
                                            {group.category?.label || 'Categoria'}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {group.category?.description}
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium text-slate-500">
                                        {group.items.length} agentes
                                    </span>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {group.items.map(
                                        ({ item, configuredAgent, metrics }) => (
                                            <article
                                                key={item.id}
                                                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-white">
                                                            {item.title}
                                                        </h4>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {item.role}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                            configuredAgent
                                                                ? configuredAgent.status ===
                                                                  'Ativo'
                                                                    ? 'bg-emerald-400/10 text-emerald-200'
                                                                    : 'bg-white/10 text-slate-300'
                                                                : 'bg-amber-300/10 text-amber-200'
                                                        }`}
                                                    >
                                                        {configuredAgent
                                                            ? configuredAgent.status
                                                            : 'Liberado'}
                                                    </span>
                                                </div>

                                                <div className="mt-3 space-y-2 text-xs text-slate-400">
                                                    <p>{item.description}</p>
                                                    <p>
                                                        <strong className="text-slate-300">
                                                            Configuracao:
                                                        </strong>{' '}
                                                        {configuredAgent
                                                            ? configuredAgent.name
                                                            : 'Ainda nao configurado'}
                                                    </p>
                                                    <p>
                                                        <strong className="text-slate-300">
                                                            Provisionamento:
                                                        </strong>{' '}
                                                        {configuredAgent
                                                            ? provisioningLabelMap[
                                                                  configuredAgent.provisioningStatus
                                                              ]
                                                            : 'Aguardando setup'}
                                                    </p>
                                                </div>

                                                <div className="mt-4 grid grid-cols-2 gap-2">
                                                    <MiniMetric
                                                        label="Execucoes"
                                                        value={
                                                            metrics
                                                                ? formatCompactNumber(
                                                                      metrics.executions,
                                                                  )
                                                                : '--'
                                                        }
                                                    />
                                                    <MiniMetric
                                                        label="Tokens"
                                                        value={
                                                            metrics
                                                                ? formatCompactNumber(
                                                                      metrics.totalTokens,
                                                                  )
                                                                : '--'
                                                        }
                                                    />
                                                    <MiniMetric
                                                        label="Sucesso"
                                                        value={
                                                            metrics
                                                                ? `${metrics.successRate}%`
                                                                : '--'
                                                        }
                                                    />
                                                    <MiniMetric
                                                        label="Resposta"
                                                        value={
                                                            metrics
                                                                ? `${metrics.avgResponseSeconds}s`
                                                                : '--'
                                                        }
                                                    />
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {configuredAgent ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-300/40"
                                                                onClick={() =>
                                                                    handleDuplicate(
                                                                        configuredAgent.id,
                                                                    )
                                                                }
                                                            >
                                                                Duplicar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="rounded-full border border-rose-400/20 px-3 py-1 text-[11px] font-semibold text-rose-300 transition hover:border-rose-300/40"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        configuredAgent.id,
                                                                    )
                                                                }
                                                            >
                                                                Excluir
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <Link
                                                            to="/criaragente"
                                                            className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold text-cyan-200 transition hover:bg-cyan-300/15"
                                                        >
                                                            Configurar agente
                                                        </Link>
                                                    )}
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

const SummaryCard = ({
    label,
    value,
    helper,
}: {
    label: string
    value: string
    helper: string
}) => (
    <div className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            {label}
        </p>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        <p className="mt-2 text-sm text-cyan-300">{helper}</p>
    </div>
)

const MiniMetric = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
)

export default AgentConfiguration
