import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useSessionUser } from '@/store/authStore'
import {
    getClientAccountSettings,
    saveClientProfileSettings,
} from '@/services/ClientAccountService'

type ProfileFormState = {
    fullName: string
    companyName: string
    email: string
    phone: string
    document: string
    role: string
}

const SettingsProfile = () => {
    const user = useSessionUser((state) => state.user)
    const [formState, setFormState] = useState<ProfileFormState>({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        document: '',
        role: '',
    })
    const [savedMessage, setSavedMessage] = useState('')

    useEffect(() => {
        const settings = getClientAccountSettings(user)
        setFormState(settings.profile)
    }, [user])

    const handleChange = (field: keyof ProfileFormState, value: string) => {
        setFormState((current) => ({
            ...current,
            [field]: value,
        }))
        setSavedMessage('')
    }

    const handleSubmit = () => {
        saveClientProfileSettings(user, formState)
        setSavedMessage('Dados da conta atualizados com sucesso.')
    }

    return (
        <div className="space-y-6">
            <div>
                <h4 className="mb-2">Dados pessoais</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure os dados da conta principal do cliente final e
                    mantenha as informacoes comerciais em dia.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Nome completo">
                            <Input
                                value={formState.fullName}
                                placeholder="Nome do responsavel"
                                onChange={(event) =>
                                    handleChange(
                                        'fullName',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Empresa">
                            <Input
                                value={formState.companyName}
                                placeholder="Nome da empresa"
                                onChange={(event) =>
                                    handleChange(
                                        'companyName',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="E-mail">
                            <Input
                                type="email"
                                value={formState.email}
                                placeholder="contato@empresa.com"
                                onChange={(event) =>
                                    handleChange('email', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Celular">
                            <Input
                                value={formState.phone}
                                placeholder="(11) 99999-9999"
                                onChange={(event) =>
                                    handleChange('phone', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="CPF ou CNPJ">
                            <Input
                                value={formState.document}
                                placeholder="Documento principal da conta"
                                onChange={(event) =>
                                    handleChange(
                                        'document',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Cargo">
                            <Input
                                value={formState.role}
                                placeholder="Ex.: Diretora financeira"
                                onChange={(event) =>
                                    handleChange('role', event.target.value)
                                }
                            />
                        </Field>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        {savedMessage ? (
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
                                {savedMessage}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Esses dados serao usados como referencia da
                                conta e do faturamento.
                            </span>
                        )}
                        <Button variant="solid" onClick={handleSubmit}>
                            Salvar dados
                        </Button>
                    </div>
                </section>

                <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h5 className="mb-4">Checklist de producao</h5>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <InfoRow
                            label="Responsavel principal"
                            value={formState.fullName || 'Pendente'}
                        />
                        <InfoRow
                            label="Empresa"
                            value={formState.companyName || 'Pendente'}
                        />
                        <InfoRow
                            label="Documento"
                            value={formState.document || 'Pendente'}
                        />
                        <InfoRow
                            label="Contato financeiro"
                            value={formState.email || 'Pendente'}
                        />
                    </div>
                    <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                        Para operacao real, essa conta ainda deve evoluir com
                        validacao documental, aceite contratual e auditoria de
                        alteracoes.
                    </div>
                </aside>
            </div>
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
    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <span>{label}</span>
        {children}
    </label>
)

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-4">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-right font-medium text-gray-900 dark:text-gray-100">
            {value}
        </span>
    </div>
)

export default SettingsProfile
