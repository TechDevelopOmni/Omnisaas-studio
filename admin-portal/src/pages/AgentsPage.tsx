import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import type { CatalogAgent, CatalogCategory } from '../types'

type AgentForm = {
    id: string
    catalogCategoryId: string
    title: string
    role: string
    description: string
    highlights: string
    available: boolean
    symbol: string
}

const emptyForm: AgentForm = {
    id: '',
    catalogCategoryId: '',
    title: '',
    role: '',
    description: '',
    highlights: '',
    available: false,
    symbol: 'AG',
}

export const AgentsPage = () => {
    const [categories, setCategories] = useState<CatalogCategory[]>([])
    const [agents, setAgents] = useState<CatalogAgent[]>([])
    const [form, setForm] = useState<AgentForm>(emptyForm)

    const load = async () => {
        const [nextCategories, nextAgents] = await Promise.all([
            api.getCategories(),
            api.getAgents(),
        ])
        setCategories(nextCategories)
        setAgents(nextAgents)
        setForm((current) => ({
            ...current,
            catalogCategoryId:
                current.catalogCategoryId || nextCategories[0]?.id || '',
        }))
    }

    useEffect(() => {
        void load()
    }, [])

    const categoryLabelMap = useMemo(
        () => Object.fromEntries(categories.map((item) => [item.key, item.label])),
        [categories],
    )

    return (
        <div className="stack">
            <section className="panel">
                <h2>Catálogo de agentes</h2>
                <div className="form-grid">
                    <select
                        value={form.catalogCategoryId}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                catalogCategoryId: event.target.value,
                            }))
                        }
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                    <input
                        placeholder="Nome"
                        value={form.title}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                title: event.target.value,
                            }))
                        }
                    />
                    <input
                        placeholder="Papel"
                        value={form.role}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                role: event.target.value,
                            }))
                        }
                    />
                    <input
                        placeholder="Sigla"
                        value={form.symbol}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                symbol: event.target.value.toUpperCase(),
                            }))
                        }
                    />
                </div>
                <textarea
                    placeholder="Descrição"
                    value={form.description}
                    onChange={(event) =>
                        setForm((current) => ({
                            ...current,
                            description: event.target.value,
                        }))
                    }
                />
                <input
                    placeholder="Highlights separados por vírgula"
                    value={form.highlights}
                    onChange={(event) =>
                        setForm((current) => ({
                            ...current,
                            highlights: event.target.value,
                        }))
                    }
                />
                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={form.available}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                available: event.target.checked,
                            }))
                        }
                    />
                    Disponível agora
                </label>
                <div className="actions">
                    <button
                        className="ghost-button"
                        onClick={() =>
                            setForm({
                                ...emptyForm,
                                catalogCategoryId: categories[0]?.id || '',
                            })
                        }
                    >
                        Limpar
                    </button>
                    <button
                        className="primary-button"
                        onClick={async () => {
                            const payload = {
                                catalogCategoryId: form.catalogCategoryId,
                                title: form.title,
                                role: form.role,
                                description: form.description,
                                highlights: form.highlights
                                    .split(',')
                                    .map((item) => item.trim())
                                    .filter(Boolean),
                                route: '/criaragente',
                                available: form.available,
                                visual: {
                                    accent: '#22d3ee',
                                    glow: '#0e7490',
                                    panel: '#0b1c23',
                                    symbol: form.symbol || 'AG',
                                },
                            }

                            if (form.id) {
                                await api.updateAgent(form.id, payload)
                            } else {
                                await api.createAgent(payload)
                            }

                            setForm({
                                ...emptyForm,
                                catalogCategoryId: categories[0]?.id || '',
                            })
                            await load()
                        }}
                    >
                        {form.id ? 'Salvar agente' : 'Criar agente'}
                    </button>
                </div>
            </section>

            <section className="panel">
                <h2>Agentes cadastrados</h2>
                <div className="list">
                    {agents.map((agent) => (
                        <article className="list-card" key={agent.id}>
                            <div>
                                <strong>{agent.title}</strong>
                                <p>{agent.description}</p>
                                <small>
                                    {categoryLabelMap[agent.categoryKey] || agent.categoryKey} ·{' '}
                                    {agent.role}
                                </small>
                            </div>
                            <div className="actions">
                                <button
                                    className="ghost-button"
                                    onClick={() =>
                                        setForm({
                                            id: agent.id,
                                            catalogCategoryId: agent.catalogCategoryId,
                                            title: agent.title,
                                            role: agent.role,
                                            description: agent.description,
                                            highlights: agent.highlights.join(', '),
                                            available: agent.available,
                                            symbol: agent.visual.symbol,
                                        })
                                    }
                                >
                                    Editar
                                </button>
                                <button
                                    className="danger-button"
                                    onClick={async () => {
                                        await api.deleteAgent(agent.id)
                                        await load()
                                    }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
