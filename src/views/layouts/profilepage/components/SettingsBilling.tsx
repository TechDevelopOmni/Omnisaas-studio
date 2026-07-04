import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
    DEPARTMENT_MONTHLY_PRICE,
    getActiveSubscriptionCount,
    getClientAccountSettings,
    getMonthlyRecurringRevenue,
    isDepartmentSubscribed,
    saveClientPaymentMethod,
    setDepartmentSubscriptionStatus,
} from '@/services/ClientAccountService'
import { useSessionUser } from '@/store/authStore'
import {
    getLibraryCategories,
    getLibraryCategoryGroups,
} from '@/services/AdminCatalogService'

type PaymentFormState = {
    brand: string
    holderName: string
    last4: string
    expiryMonth: string
    expiryYear: string
    billingEmail: string
}

const SettingsBilling = () => {
    const user = useSessionUser((state) => state.user)
    const libraryCategories = useMemo(() => getLibraryCategories(), [])
    const libraryCategoryGroups = useMemo(() => getLibraryCategoryGroups(), [])
    const [paymentForm, setPaymentForm] = useState<PaymentFormState>({
        brand: 'Visa',
        holderName: '',
        last4: '',
        expiryMonth: '',
        expiryYear: '',
        billingEmail: '',
    })
    const [accountSettings, setAccountSettings] = useState(() =>
        getClientAccountSettings(user),
    )
    const [savedMessage, setSavedMessage] = useState('')

    useEffect(() => {
        const settings = getClientAccountSettings(user)
        setAccountSettings(settings)
        setPaymentForm(settings.paymentMethod)
    }, [user])

    const monthlyTotal = useMemo(
        () => getMonthlyRecurringRevenue(accountSettings),
        [accountSettings],
    )

    const activePlans = useMemo(
        () => getActiveSubscriptionCount(accountSettings),
        [accountSettings],
    )

    const hasPaymentMethod =
        paymentForm.holderName.trim() &&
        paymentForm.last4.trim() &&
        paymentForm.expiryMonth.trim() &&
        paymentForm.expiryYear.trim()

    const refreshAccountSettings = () => {
        setAccountSettings(getClientAccountSettings(user))
    }

    const handlePaymentChange = (
        field: keyof PaymentFormState,
        value: string,
    ) => {
        setPaymentForm((current) => ({
            ...current,
            [field]: value,
        }))
        setSavedMessage('')
    }

    const handleSavePaymentMethod = () => {
        saveClientPaymentMethod(user, paymentForm)
        refreshAccountSettings()
        setSavedMessage('Forma de pagamento atualizada com sucesso.')
    }

    const handleSubscriptionToggle = (
        category: (typeof libraryCategories)[number],
        subscribe: boolean,
    ) => {
        if (subscribe && !hasPaymentMethod) {
            setSavedMessage(
                'Cadastre uma forma de pagamento antes de contratar um departamento.',
            )
            return
        }

        setDepartmentSubscriptionStatus(
            user,
            category.value,
            subscribe ? 'active' : 'inactive',
        )
        refreshAccountSettings()
        setSavedMessage(
            subscribe
                ? `${category.label} contratado por R$ ${DEPARTMENT_MONTHLY_PRICE},00/mensais.`
                : `${category.label} removido da cobranca recorrente.`,
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h4 className="mb-2">Pagamento e assinaturas</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estruture a cobranca recorrente da conta e defina quais
                    departamentos ficam liberados para configuracao.
                </p>
            </div>

            <section className="grid gap-4 xl:grid-cols-3">
                <SummaryCard
                    label="Departamentos ativos"
                    value={`${activePlans}`}
                    helper="Categorias cobradas mensalmente nesta conta."
                />
                <SummaryCard
                    label="Mensalidade recorrente"
                    value={`R$ ${monthlyTotal.toFixed(2).replace('.', ',')}`}
                    helper="Soma das assinaturas contratadas."
                />
                <SummaryCard
                    label="Preco por departamento"
                    value={`R$ ${DEPARTMENT_MONTHLY_PRICE},00`}
                    helper="Modelo atual de cobranca fixa por area contratada."
                />
            </section>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4">
                        <h5>Forma de pagamento</h5>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Base simples para a cobranca recorrente do cliente
                            final. Em producao real, isso deve ser integrado a
                            um gateway como Stripe, Pagar.me ou Asaas.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Bandeira">
                            <Input
                                value={paymentForm.brand}
                                placeholder="Visa"
                                onChange={(event) =>
                                    handlePaymentChange(
                                        'brand',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Titular do cartao">
                            <Input
                                value={paymentForm.holderName}
                                placeholder="Nome impresso no cartao"
                                onChange={(event) =>
                                    handlePaymentChange(
                                        'holderName',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Ultimos 4 digitos">
                            <Input
                                value={paymentForm.last4}
                                maxLength={4}
                                placeholder="1234"
                                onChange={(event) =>
                                    handlePaymentChange(
                                        'last4',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="E-mail de cobranca">
                            <Input
                                type="email"
                                value={paymentForm.billingEmail}
                                placeholder="financeiro@empresa.com"
                                onChange={(event) =>
                                    handlePaymentChange(
                                        'billingEmail',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Mes de expiracao">
                            <Input
                                value={paymentForm.expiryMonth}
                                placeholder="08"
                                onChange={(event) =>
                                    handlePaymentChange(
                                        'expiryMonth',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Ano de expiracao">
                            <Input
                                value={paymentForm.expiryYear}
                                placeholder="28"
                                onChange={(event) =>
                                    handlePaymentChange(
                                        'expiryYear',
                                        event.target.value,
                                    )
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
                                O cadastro local serve como simulacao comercial
                                ate a integracao real com o gateway de pagamento.
                            </span>
                        )}
                        <Button variant="solid" onClick={handleSavePaymentMethod}>
                            Salvar forma de pagamento
                        </Button>
                    </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4">
                        <h5>Assinaturas por departamento</h5>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Ao contratar uma area, o cliente final passa a ter
                            acesso ao conjunto de agentes daquele departamento na
                            biblioteca.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {libraryCategoryGroups.map((group) => (
                            <div key={group.id}>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {group.label}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {group.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    {group.categories.map((categoryValue) => {
                                        const category = libraryCategories.find(
                                            (item) =>
                                                item.value === categoryValue,
                                        )

                                        if (!category) {
                                            return null
                                        }

                                        const subscribed =
                                            isDepartmentSubscribed(
                                                accountSettings,
                                                category.value,
                                            )

                                        return (
                                            <div
                                                key={category.value}
                                                className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-950 md:flex-row md:items-center md:justify-between"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            {category.label}
                                                        </h6>
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                                subscribed
                                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
                                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                                            }`}
                                                        >
                                                            {subscribed
                                                                ? 'Ativo'
                                                                : 'Inativo'}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                        {category.description}
                                                    </p>
                                                    <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                        R$ {category.monthlyPrice}
                                                        ,00 por mes
                                                    </p>
                                                </div>

                                                <Button
                                                    variant={
                                                        subscribed
                                                            ? 'default'
                                                            : 'solid'
                                                    }
                                                    onClick={() =>
                                                        handleSubscriptionToggle(
                                                            category,
                                                            !subscribed,
                                                        )
                                                    }
                                                >
                                                    {subscribed
                                                        ? 'Cancelar assinatura'
                                                        : 'Contratar departamento'}
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
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

const SummaryCard = ({
    label,
    value,
    helper,
}: {
    label: string
    value: string
    helper: string
}) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {value}
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {helper}
        </p>
    </div>
)

export default SettingsBilling
