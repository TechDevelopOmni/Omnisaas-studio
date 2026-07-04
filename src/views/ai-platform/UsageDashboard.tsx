import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSessionUser } from '@/store/authStore'
import { listAgentsByUser } from '@/services/AgentService'
import {
    getActiveSubscriptionCount,
    getClientAccountSettings,
    getMonthlyRecurringRevenue,
} from '@/services/ClientAccountService'
import { getLibraryCategories } from '@/services/AdminCatalogService'

const UsageDashboard: React.FC = () => {
    const user = useSessionUser((state) => state.user)
    const libraryCategories = useMemo(() => getLibraryCategories(), [])
    const agents = useMemo(() => listAgentsByUser(user), [user])
    const accountSettings = useMemo(
        () => getClientAccountSettings(user),
        [user],
    )

    const activeAgents = agents.filter((agent) => agent.status === 'Ativo')
    const draftAgents = agents.filter(
        (agent) => agent.provisioningStatus === 'rascunho-local',
    )
    const subscribedCategories = accountSettings.subscriptions.filter(
        (item) => item.status === 'active',
    )
    const subscribedCategoryLabels = subscribedCategories
        .map(
            (item) =>
                libraryCategories.find(
                    (category) => category.value === item.category,
                )?.label || item.category,
        )
        .slice(0, 8)

    const metrics = [
        {
            id: 'met-01',
            label: 'Agentes configurados',
            value: `${agents.length}`,
            trend: `${activeAgents.length} ativos na operacao`,
        },
        {
            id: 'met-02',
            label: 'Departamentos contratados',
            value: `${getActiveSubscriptionCount(accountSettings)}`,
            trend: 'Biblioteca liberada por assinatura',
        },
        {
            id: 'met-03',
            label: 'Mensalidade recorrente',
            value: `R$ ${getMonthlyRecurringRevenue(accountSettings)
                .toFixed(2)
                .replace('.', ',')}`,
            trend: 'Modelo atual por departamento',
        },
        {
            id: 'met-04',
            label: 'Agentes em rascunho',
            value: `${draftAgents.length}`,
            trend: 'Pendentes de configuracao final',
        },
    ]

    const dashboardActions = [
        {
            id: 'act-01',
            title: 'Contratar novas areas',
            description:
                'Ative departamentos adicionais para liberar mais agentes da biblioteca.',
            href: '/profile-page-view?tab=billing',
            cta: 'Gerenciar assinaturas',
        },
        {
            id: 'act-02',
            title: 'Explorar novos agentes',
            description:
                'Use a biblioteca para descobrir quais fluxos podem entrar na sua operacao.',
            href: '/Biblioteca',
            cta: 'Abrir biblioteca',
        },
        {
            id: 'act-03',
            title: 'Criar novo agente',
            description:
                'Avance para a configuracao operacional dos agentes ja liberados para sua conta.',
            href: '/criaragente',
            cta: 'Criar agora',
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111c] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
                    <div className="absolute right-0 top-12 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                            Dashboard
                        </p>
                        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                            Visao executiva da operacao do cliente final
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                            Um resumo do que ja foi contratado, configurado e do
                            que ainda precisa acontecer para colocar os agentes
                            em producao de forma consistente.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                            Conta principal
                        </p>
                        <p className="mt-3 text-lg font-semibold text-white">
                            {accountSettings.profile.companyName ||
                                user.userName ||
                                'Sua empresa'}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                            {accountSettings.profile.email ||
                                user.email ||
                                'E-mail principal nao informado'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                                to="/profile-page-view"
                                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Configurar conta
                            </Link>
                            <Link
                                to="/agentes"
                                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                            >
                                Ver agentes
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.id}
                        className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
                    >
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                            {metric.label}
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-white">
                            {metric.value}
                        </p>
                        <p className="mt-2 text-sm text-cyan-300">
                            {metric.trend}
                        </p>
                    </div>
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[32px] border border-[#1c2c3d] bg-[#0a1522] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.32)] sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/70">
                                Assinaturas
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-white">
                                Departamentos ativos
                            </h2>
                        </div>
                        <Link
                            to="/profile-page-view?tab=billing"
                            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                        >
                            Gerenciar
                        </Link>
                    </div>

                    {subscribedCategoryLabels.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {subscribedCategoryLabels.map((label) => (
                                <span
                                    key={label}
                                    className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-300">
                            Nenhum departamento ativo ainda. Contrate uma area
                            para liberar os agentes correspondentes na
                            biblioteca.
                        </div>
                    )}

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {dashboardActions.map((action) => (
                            <article
                                key={action.id}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                            >
                                <h3 className="text-sm font-semibold text-white">
                                    {action.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {action.description}
                                </p>
                                <Link
                                    to={action.href}
                                    className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                                >
                                    {action.cta}
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="rounded-[32px] border border-[#1c2c3d] bg-[#08131f] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)] sm:p-8">
                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/70">
                            Operacao
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                            Saude da base atual
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <StatusCard
                            title="Agentes ativos"
                            value={`${activeAgents.length}`}
                            tone="success"
                            helper="Itens prontos para operar na conta do cliente."
                        />
                        <StatusCard
                            title="Provisionamento pendente"
                            value={`${draftAgents.length}`}
                            tone="warning"
                            helper="Fluxos ainda em modo local ou aguardando backend real."
                        />
                        <StatusCard
                            title="Preparacao de producao"
                            value="Em andamento"
                            tone="neutral"
                            helper="Billing, provisionamento e liberacao por departamento ja tem base visual no frontend."
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-[32px] border border-[#1c2c3d] bg-[#08131f] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)] sm:p-8">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-white">
                        Atividade recente da conta
                    </h2>
                    <span className="text-sm text-slate-400">
                        Resumo operacional
                    </span>
                </div>

                <div className="space-y-3">
                    <ActivityItem
                        title="Assinaturas ativas"
                        description={`${subscribedCategories.length} departamentos contratados no modelo recorrente.`}
                    />
                    <ActivityItem
                        title="Agentes em configuracao"
                        description={`${agents.length} agentes registrados para o usuario atual, com ${draftAgents.length} ainda em rascunho.`}
                    />
                    <ActivityItem
                        title="Proximo passo recomendado"
                        description="Conectar billing real, backend de provisionamento e criacao dinamica por departamento."
                    />
                </div>
            </section>
        </div>
    )
}

const StatusCard = ({
    title,
    value,
    helper,
    tone,
}: {
    title: string
    value: string
    helper: string
    tone: 'success' | 'warning' | 'neutral'
}) => {
    const toneClassMap = {
        success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
        warning: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
        neutral: 'border-white/10 bg-white/[0.03] text-slate-200',
    }

    return (
        <div className={`rounded-2xl border p-4 ${toneClassMap[tone]}`}>
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold">{title}</h3>
                <span className="text-sm font-semibold">{value}</span>
            </div>
            <p className="mt-2 text-sm opacity-90">{helper}</p>
        </div>
    )
}

const ActivityItem = ({
    title,
    description,
}: {
    title: string
    description: string
}) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
)

export default UsageDashboard
