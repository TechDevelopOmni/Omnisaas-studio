import { useState } from 'react'
import {
    createCatalogAgent,
    deleteCatalogAgent,
    getAgentCatalog,
    getLibraryCategories,
    updateCatalogAgent,
} from '@/services/AdminCatalogService'
import type { AgentCatalogItem } from '@/@types/agents'

type AgentFormState = {
    category: string
    title: string
    role: string
    description: string
    highlights: string
    available: boolean
    symbol: string
}

const AdminAgentManagement = () => {
    const [categories, setCategories] = useState(() => getLibraryCategories())
    const [catalog, setCatalog] = useState(() => getAgentCatalog())
    const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
    const [formState, setFormState] = useState<AgentFormState>({
        category: categories[0]?.value || '',
        title: '',
        role: '',
        description: '',
        highlights: '',
        available: false,
        symbol: 'AG',
    })

    const refresh = () => {
        setCategories(getLibraryCategories())
        setCatalog(getAgentCatalog())
    }

    const resetForm = () => {
        setEditingAgentId(null)
        setFormState({
            category: categories[0]?.value || '',
            title: '',
            role: '',
            description: '',
            highlights: '',
            available: false,
            symbol: 'AG',
        })
    }

    const handleSubmit = () => {
        if (
            !formState.category ||
            !formState.title.trim() ||
            !formState.role.trim() ||
            !formState.description.trim()
        ) {
            return
        }

        const payload = {
            category: formState.category,
            title: formState.title,
            role: formState.role,
            description: formState.description,
            highlights: formState.highlights
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
            available: formState.available,
            visual: {
                accent: '#22d3ee',
                glow: '#0e7490',
                panel: '#0b1c23',
                symbol: formState.symbol.trim() || 'AG',
            },
        }

        if (editingAgentId) {
            updateCatalogAgent(editingAgentId, payload)
        } else {
            createCatalogAgent(payload)
        }

        resetForm()
        refresh()
    }

    const handleEdit = (agent: AgentCatalogItem) => {
        setEditingAgentId(agent.id)
        setFormState({
            category: agent.category,
            title: agent.title,
            role: agent.role,
            description: agent.description,
            highlights: agent.highlights.join(', '),
            available: agent.available,
            symbol: agent.visual.symbol,
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <section className="rounded-[32px] border border-white/10 bg-[#07111c] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                    Administracao
                </p>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                    Gestao de agentes do catalogo
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                    Controle os modelos liberados na biblioteca do cliente,
                    definindo papel, descricao comercial e disponibilidade.
                </p>
            </section>

            <section className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-6">
                <div className="grid gap-4 lg:grid-cols-4">
                    <Field label="Categoria">
                        <select
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                            value={formState.category}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    category: event.target.value,
                                }))
                            }
                        >
                            {categories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Nome do agente">
                        <input
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                            value={formState.title}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    title: event.target.value,
                                }))
                            }
                        />
                    </Field>
                    <Field label="Papel">
                        <input
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                            value={formState.role}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    role: event.target.value,
                                }))
                            }
                        />
                    </Field>
                    <Field label="Sigla visual">
                        <input
                            maxLength={2}
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                            value={formState.symbol}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    symbol: event.target.value.toUpperCase(),
                                }))
                            }
                        />
                    </Field>
                </div>

                <Field label="Descricao">
                    <textarea
                        rows={3}
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                        value={formState.description}
                        onChange={(event) =>
                            setFormState((current) => ({
                                ...current,
                                description: event.target.value,
                            }))
                        }
                    />
                </Field>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                    <Field label="Destaques separados por virgula">
                        <input
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                            value={formState.highlights}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    highlights: event.target.value,
                                }))
                            }
                        />
                    </Field>
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-300">
                        <input
                            type="checkbox"
                            checked={formState.available}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    available: event.target.checked,
                                }))
                            }
                        />
                        Disponivel agora
                    </label>
                    <div className="flex items-end gap-3">
                        <button
                            type="button"
                            className="rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white"
                            onClick={resetForm}
                        >
                            Limpar
                        </button>
                        <button
                            type="button"
                            className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
                            onClick={handleSubmit}
                        >
                            {editingAgentId ? 'Salvar agente' : 'Criar agente'}
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                {catalog.map((agent) => {
                    const categoryLabel =
                        categories.find((category) => category.value === agent.category)
                            ?.label || agent.category

                    return (
                        <article
                            key={agent.id}
                            className="rounded-[24px] border border-[#1c2c3d] bg-[#08131f] p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70">
                                        {categoryLabel}
                                    </p>
                                    <h2 className="mt-2 text-lg font-semibold text-white">
                                        {agent.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-300">
                                        {agent.role}
                                    </p>
                                </div>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        agent.available
                                            ? 'bg-emerald-400/10 text-emerald-200'
                                            : 'bg-amber-300/10 text-amber-200'
                                    }`}
                                >
                                    {agent.available ? 'Disponivel' : 'Em breve'}
                                </span>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-slate-400">
                                {agent.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {agent.highlights.map((highlight) => (
                                    <span
                                        key={highlight}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                                    >
                                        {highlight}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white"
                                    onClick={() => handleEdit(agent)}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full border border-rose-400/20 px-4 py-2 text-sm font-semibold text-rose-300"
                                    onClick={() => {
                                        deleteCatalogAgent(agent.id)
                                        refresh()
                                    }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </article>
                    )
                })}
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

export default AdminAgentManagement
