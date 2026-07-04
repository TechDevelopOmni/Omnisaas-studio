import { Link } from 'react-router-dom'
import { listAllAgents } from '@/services/AgentService'
import {
    getAgentCatalog,
    getLibraryCategories,
} from '@/services/AdminCatalogService'
import { listClientAccounts } from '@/services/ClientAccountService'

const AdminDashboard = () => {
    const categories = getLibraryCategories()
    const catalogAgents = getAgentCatalog()
    const clientAccounts = listClientAccounts()
    const configuredAgents = listAllAgents()
    const activeClients = clientAccounts.filter(
        ({ settings }) =>
            settings.subscriptions.filter((item) => item.status === 'active').length > 0,
    )

    const metrics = [
        {
            label: 'Departamentos e especialidades',
            value: `${categories.length}`,
            helper: 'Catalogo vivo administrado pela plataforma.',
        },
        {
            label: 'Modelos de agente',
            value: `${catalogAgents.length}`,
            helper: 'Cards liberados para a jornada comercial do cliente.',
        },
        {
            label: 'Clientes identificados',
            value: `${clientAccounts.length}`,
            helper: 'Contas com configuracao local registrada.',
        },
        {
            label: 'Agentes configurados',
            value: `${configuredAgents.length}`,
            helper: 'Instancias criadas por clientes ou pela equipe interna.',
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <section className="rounded-[32px] border border-white/10 bg-[#07111c] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                            Administracao
                        </p>
                        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                            Console operacional da plataforma
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                            Area dedicada para operacao interna, gestao do
                            catalogo e suporte ao cliente final em um ambiente
                            preparado para a rotina de producao.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                            Operacao ativa
                        </p>
                        <p className="mt-3 text-lg font-semibold text-white">
                            {activeClients.length} contas com assinatura
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                            {configuredAgents.length} agentes em base local
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
                    >
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                            {metric.label}
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-white">
                            {metric.value}
                        </p>
                        <p className="mt-2 text-sm text-cyan-300">
                            {metric.helper}
                        </p>
                    </div>
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
                <AdminActionCard
                    title="Gerenciar departamentos"
                    description="Crie, edite ou remova departamentos e especialidades que abastecem a biblioteca do cliente."
                    href="/admin/departamentos"
                    cta="Abrir departamentos"
                />
                <AdminActionCard
                    title="Gerenciar agentes"
                    description="Controle os cards do catalogo, papeis disponiveis e estado de disponibilidade de cada agente."
                    href="/admin/agentes"
                    cta="Abrir agentes"
                />
                <AdminActionCard
                    title="Operar contas de clientes"
                    description="Visualize assinaturas, acompanhe agentes da conta e configure fluxos em nome do cliente."
                    href="/admin/clientes"
                    cta="Abrir operacao do cliente"
                />
            </section>
        </div>
    )
}

const AdminActionCard = ({
    title,
    description,
    href,
    cta,
}: {
    title: string
    description: string
    href: string
    cta: string
}) => (
    <article className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
        <Link
            to={href}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
        >
            {cta}
        </Link>
    </article>
)

export default AdminDashboard
