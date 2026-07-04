import { useEffect, useState } from 'react'
import { api } from '../api'
import type { CatalogCategory } from '../types'

const emptyForm = {
    id: '',
    key: '',
    label: '',
    description: '',
    groupId: 'departamentos',
    monthlyPrice: 299,
}

export const DepartmentsPage = () => {
    const [categories, setCategories] = useState<CatalogCategory[]>([])
    const [form, setForm] = useState<CatalogCategory>(emptyForm)

    const load = async () => setCategories(await api.getCategories())

    useEffect(() => {
        void load()
    }, [])

    return (
        <div className="stack">
            <section className="panel">
                <h2>Cadastro de categorias</h2>
                <div className="form-grid">
                    <input
                        placeholder="key"
                        value={form.key}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                key: event.target.value,
                            }))
                        }
                    />
                    <input
                        placeholder="label"
                        value={form.label}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                label: event.target.value,
                            }))
                        }
                    />
                    <select
                        value={form.groupId}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                groupId: event.target.value,
                            }))
                        }
                    >
                        <option value="departamentos">Departamentos</option>
                        <option value="especialidades">Especialidades</option>
                    </select>
                    <input
                        type="number"
                        placeholder="299"
                        value={form.monthlyPrice}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                monthlyPrice: Number(event.target.value || 0),
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
                <div className="actions">
                    <button
                        className="ghost-button"
                        onClick={() => setForm(emptyForm)}
                    >
                        Limpar
                    </button>
                    <button
                        className="primary-button"
                        onClick={async () => {
                            if (form.id) {
                                await api.updateCategory(form.id, form)
                            } else {
                                await api.createCategory(form)
                            }
                            setForm(emptyForm)
                            await load()
                        }}
                    >
                        {form.id ? 'Salvar' : 'Criar categoria'}
                    </button>
                </div>
            </section>

            <section className="panel">
                <h2>Categorias cadastradas</h2>
                <div className="list">
                    {categories.map((category) => (
                        <article className="list-card" key={category.id}>
                            <div>
                                <strong>{category.label}</strong>
                                <p>{category.description}</p>
                                <small>
                                    {category.key} · {category.groupId} · R${' '}
                                    {category.monthlyPrice}
                                </small>
                            </div>
                            <div className="actions">
                                <button
                                    className="ghost-button"
                                    onClick={() => setForm(category)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="danger-button"
                                    onClick={async () => {
                                        await api.deleteCategory(category.id)
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
