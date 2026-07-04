import { useState } from 'react'
import {
    createLibraryCategory,
    deleteLibraryCategory,
    getAgentCatalogByCategory,
    getLibraryCategories,
    getLibraryCategoryGroups,
    updateLibraryCategory,
} from '@/services/AdminCatalogService'
import type {
    AgentLibraryCategoryGroupId,
    AgentLibraryCategoryRecord,
} from '@/@types/agents'

type CategoryFormState = {
    label: string
    description: string
    groupId: AgentLibraryCategoryGroupId
    monthlyPrice: string
}

const defaultFormState: CategoryFormState = {
    label: '',
    description: '',
    groupId: 'departamentos',
    monthlyPrice: '299',
}

const AdminDepartmentManagement = () => {
    const [formState, setFormState] = useState<CategoryFormState>(defaultFormState)
    const [editingValue, setEditingValue] = useState<string | null>(null)
    const [groups, setGroups] = useState(() => getLibraryCategoryGroups())
    const [categories, setCategories] = useState(() => getLibraryCategories())

    const handleRefresh = () => {
        setGroups(getLibraryCategoryGroups())
        setCategories(getLibraryCategories())
    }

    const handleSubmit = () => {
        if (!formState.label.trim() || !formState.description.trim()) {
            return
        }

        const payload = {
            label: formState.label,
            description: formState.description,
            groupId: formState.groupId,
            monthlyPrice: Number(formState.monthlyPrice || 299),
        }

        if (editingValue) {
            updateLibraryCategory(editingValue, payload)
        } else {
            createLibraryCategory(payload)
        }

        setFormState(defaultFormState)
        setEditingValue(null)
        handleRefresh()
    }

    const handleEdit = (category: AgentLibraryCategoryRecord) => {
        setEditingValue(category.value)
        setFormState({
            label: category.label,
            description: category.description,
            groupId: category.groupId,
            monthlyPrice: `${category.monthlyPrice}`,
        })
    }

    const handleDelete = (value: string) => {
        deleteLibraryCategory(value)
        if (editingValue === value) {
            setEditingValue(null)
            setFormState(defaultFormState)
        }
        handleRefresh()
    }

    return (
        <div className="flex flex-col gap-6">
            <section className="rounded-[32px] border border-white/10 bg-[#07111c] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                    Administracao
                </p>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                    Gestao de departamentos e especialidades
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                    Esta area controla as categorias que aparecem na biblioteca
                    do cliente e tambem define o valor mensal de cada frente
                    contratada.
                </p>
            </section>

            <section className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-6">
                <div className="grid gap-4 lg:grid-cols-4">
                    <Field label="Nome">
                        <input
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                            value={formState.label}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    label: event.target.value,
                                }))
                            }
                        />
                    </Field>
                    <Field label="Grupo">
                        <select
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                            value={formState.groupId}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    groupId: event.target
                                        .value as AgentLibraryCategoryGroupId,
                                }))
                            }
                        >
                            <option value="departamentos">Departamentos</option>
                            <option value="especialidades">Especialidades</option>
                        </select>
                    </Field>
                    <Field label="Mensalidade">
                        <input
                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                            value={formState.monthlyPrice}
                            onChange={(event) =>
                                setFormState((current) => ({
                                    ...current,
                                    monthlyPrice: event.target.value,
                                }))
                            }
                        />
                    </Field>
                    <div className="flex items-end gap-3">
                        <button
                            type="button"
                            className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
                            onClick={handleSubmit}
                        >
                            {editingValue ? 'Salvar alteracoes' : 'Criar categoria'}
                        </button>
                    </div>
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
            </section>

            {groups.map((group) => {
                const groupCategories = categories.filter(
                    (category) => category.groupId === group.id,
                )

                return (
                    <section
                        key={group.id}
                        className="rounded-[28px] border border-[#1c2c3d] bg-[#08131f] p-6"
                    >
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold text-white">
                                {group.label}
                            </h2>
                            <p className="mt-2 text-sm text-slate-400">
                                {group.description}
                            </p>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-2">
                            {groupCategories.map((category) => (
                                <article
                                    key={category.value}
                                    className="rounded-[24px] border border-white/10 bg-black/20 p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {category.label}
                                            </h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                                {category.description}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                                            {getAgentCatalogByCategory(category.value).length} agentes
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                                        <span>Slug: {category.value}</span>
                                        <span>R$ {category.monthlyPrice},00/mes</span>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white"
                                            onClick={() => handleEdit(category)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-full border border-rose-400/20 px-4 py-2 text-sm font-semibold text-rose-300"
                                            onClick={() => handleDelete(category.value)}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )
            })}
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

export default AdminDepartmentManagement
