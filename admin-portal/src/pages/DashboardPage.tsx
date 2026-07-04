import { useEffect, useState } from 'react'
import { api } from '../api'
import type { CatalogAgent, CatalogCategory, ClientSummary } from '../types'

export const DashboardPage = () => {
    const [categories, setCategories] = useState<CatalogCategory[]>([])
    const [agents, setAgents] = useState<CatalogAgent[]>([])
    const [clients, setClients] = useState<ClientSummary[]>([])

    useEffect(() => {
        void Promise.all([
            api.getCategories(),
            api.getAgents(),
            api.getClients(),
        ]).then(([nextCategories, nextAgents, nextClients]) => {
            setCategories(nextCategories)
            setAgents(nextAgents)
            setClients(nextClients)
        })
    }, [])

    const activeClients = clients.filter(
        (client) => client.activeSubscriptionCount > 0,
    ).length

    return (
        <div className="page-grid">
            <section className="metric-card">
                <span>Categorias</span>
                <strong>{categories.length}</strong>
                <small>Departamentos e especialidades do catálogo</small>
            </section>
            <section className="metric-card">
                <span>Agentes</span>
                <strong>{agents.length}</strong>
                <small>Modelos disponíveis na mesma API</small>
            </section>
            <section className="metric-card">
                <span>Clientes</span>
                <strong>{clients.length}</strong>
                <small>Contas operadas pela plataforma</small>
            </section>
            <section className="metric-card">
                <span>Clientes ativos</span>
                <strong>{activeClients}</strong>
                <small>Com pelo menos uma assinatura ativa</small>
            </section>
        </div>
    )
}
