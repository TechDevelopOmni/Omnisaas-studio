import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import type {
    CatalogAgent,
    CatalogCategory,
    ClientDetails,
    ClientProfile,
    ClientSummary,
    ConfiguredAgent,
    ConfiguredAgentPayload,
    PaymentMethod,
    PlatformSettings,
} from '../types'

type AgentEditorForm = {
    id: string
    catalogAgentId: string
    templateKey: string
    libraryCategoryKey: string
    name: string
    clinicName: string
    description: string
    status: string
    tags: string
    channelLabel: string
    provisioningStatus: string
    provisioningMessage: string
    n8nFolderId: string
    n8nProjectId: string
    n8nWorkflowId: string
    n8nWorkflowUrl: string
    configurationJson: string
}

const createEmptyAgentForm = (
    settings?: PlatformSettings | null,
    details?: ClientDetails | null,
    catalogAgent?: CatalogAgent,
): AgentEditorForm => ({
    id: '',
    catalogAgentId: catalogAgent?.id || '',
    templateKey: 'clinic-attendant',
    libraryCategoryKey: catalogAgent?.categoryKey || '',
    name: '',
    clinicName: details?.profile.companyName || details?.profile.fullName || '',
    description: '',
    status: 'Ativo',
    tags: 'admin-portal',
    channelLabel: 'WhatsApp / Z-API',
    provisioningStatus: 'rascunho-local',
    provisioningMessage: 'Criado ou ajustado pela equipe interna.',
    n8nFolderId: settings?.n8nFolderId || '',
    n8nProjectId: settings?.n8nProjectId || '',
    n8nWorkflowId: '',
    n8nWorkflowUrl: '',
    configurationJson: '{}',
})

const mapConfiguredAgentToForm = (
    agent: ConfiguredAgent,
    settings?: PlatformSettings | null,
): AgentEditorForm => ({
    id: agent.id,
    catalogAgentId: agent.catalogAgentId || '',
    templateKey: agent.templateKey,
    libraryCategoryKey: agent.libraryCategoryKey,
    name: agent.name,
    clinicName: agent.clinicName,
    description: agent.description,
    status: agent.status,
    tags: agent.tags.join(', '),
    channelLabel: agent.channelLabel,
    provisioningStatus: agent.provisioningStatus,
    provisioningMessage: agent.provisioningMessage,
    n8nFolderId: agent.n8nFolderId || settings?.n8nFolderId || '',
    n8nProjectId: agent.n8nProjectId || settings?.n8nProjectId || '',
    n8nWorkflowId: agent.n8nWorkflowId || '',
    n8nWorkflowUrl: agent.n8nWorkflowUrl || '',
    configurationJson: agent.configurationJson || '{}',
})

const buildConfiguredAgentPayload = (
    form: AgentEditorForm,
): ConfiguredAgentPayload => ({
    catalogAgentId: form.catalogAgentId || null,
    templateKey: form.templateKey,
    libraryCategoryKey: form.libraryCategoryKey,
    name: form.name,
    clinicName: form.clinicName,
    description: form.description,
    status: form.status,
    tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    channelLabel: form.channelLabel,
    provisioningStatus: form.provisioningStatus,
    provisioningMessage: form.provisioningMessage,
    n8nFolderId: form.n8nFolderId,
    n8nProjectId: form.n8nProjectId,
    n8nWorkflowId: form.n8nWorkflowId || null,
    n8nWorkflowUrl: form.n8nWorkflowUrl || null,
    configurationJson: form.configurationJson || '{}',
})

export const ClientsPage = () => {
    const [clients, setClients] = useState<ClientSummary[]>([])
    const [categories, setCategories] = useState<CatalogCategory[]>([])
    const [catalogAgents, setCatalogAgents] = useState<CatalogAgent[]>([])
    const [platformSettings, setPlatformSettings] = useState<PlatformSettings | null>(
        null,
    )
    const [selectedClientId, setSelectedClientId] = useState('')
    const [details, setDetails] = useState<ClientDetails | null>(null)
    const [configuredAgents, setConfiguredAgents] = useState<ConfiguredAgent[]>([])
    const [profileForm, setProfileForm] = useState<ClientProfile | null>(null)
    const [paymentForm, setPaymentForm] = useState<PaymentMethod | null>(null)
    const [agentForm, setAgentForm] = useState<AgentEditorForm>(
        createEmptyAgentForm(),
    )
    const [loadingClient, setLoadingClient] = useState(false)
    const [savingSection, setSavingSection] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const loadBase = async () => {
        const [nextClients, nextCategories, nextCatalogAgents, nextSettings] =
            await Promise.all([
                api.getClients(),
                api.getCategories(),
                api.getAgents(),
                api.getPlatformSettings(),
            ])

        setClients(nextClients)
        setCategories(nextCategories)
        setCatalogAgents(nextCatalogAgents)
        setPlatformSettings(nextSettings)
        setSelectedClientId((current) => current || nextClients[0]?.id || '')
    }

    const loadSelectedClient = async (clientId: string) => {
        setLoadingClient(true)
        setError('')

        try {
            const [nextDetails, nextConfiguredAgents] = await Promise.all([
                api.getClientDetails(clientId),
                api.getConfiguredAgents(clientId),
            ])

            setDetails(nextDetails)
            setConfiguredAgents(nextConfiguredAgents)
            setProfileForm(nextDetails.profile)
            setPaymentForm(nextDetails.paymentMethod)
            setAgentForm(
                createEmptyAgentForm(
                    platformSettings,
                    nextDetails,
                    nextCatalogAgentsForClient(
                        catalogAgents,
                        nextDetails.subscriptions,
                    )[0],
                ),
            )
        } catch (nextError) {
            setError(
                nextError instanceof Error
                    ? nextError.message
                    : 'Falha ao carregar o cliente.',
            )
        } finally {
            setLoadingClient(false)
        }
    }

    useEffect(() => {
        void loadBase().catch((nextError) => {
            setError(
                nextError instanceof Error
                    ? nextError.message
                    : 'Falha ao carregar a base administrativa.',
            )
        })
    }, [])

    useEffect(() => {
        if (!selectedClientId) {
            return
        }

        void loadSelectedClient(selectedClientId)
    }, [selectedClientId])

    const activeSubscriptionKeys = useMemo(
        () =>
            new Set(
                details?.subscriptions
                    .filter((item) => item.status === 'active')
                    .map((item) => item.categoryKey) || [],
            ),
        [details],
    )

    const availableCatalogAgents = useMemo(
        () => nextCatalogAgentsForClient(catalogAgents, details?.subscriptions || []),
        [catalogAgents, details?.subscriptions],
    )

    const categoryLabelMap = useMemo(
        () => Object.fromEntries(categories.map((item) => [item.key, item.label])),
        [categories],
    )

    const resetAgentForm = () => {
        setAgentForm(
            createEmptyAgentForm(
                platformSettings,
                details,
                availableCatalogAgents[0],
            ),
        )
    }

    return (
        <div className="split-layout">
            <section className="panel">
                <h2>Clientes</h2>
                {error ? <div className="alert error">{error}</div> : null}
                <div className="list">
                    {clients.map((client) => (
                        <button
                            className={`list-card selectable ${
                                selectedClientId === client.id ? 'selected' : ''
                            }`}
                            key={client.id}
                            onClick={() => {
                                setSuccess('')
                                setSelectedClientId(client.id)
                            }}
                        >
                            <div>
                                <strong>{client.companyName || client.userName}</strong>
                                <p>{client.email}</p>
                                <small>
                                    {client.activeSubscriptionCount} assinaturas ·{' '}
                                    {client.configuredAgentCount} agentes
                                </small>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <div className="stack">
                <section className="panel">
                    <div className="section-heading">
                        <div>
                            <h2>{details?.profile.companyName || 'Conta do cliente'}</h2>
                            <p className="muted">
                                {details?.profile.fullName || 'Selecione um cliente'} ·{' '}
                                {details?.profile.email || '-'}
                            </p>
                        </div>
                        {details ? (
                            <span className="soft-badge">
                                Atualizado em{' '}
                                {new Date(details.updatedAtUtc).toLocaleString('pt-BR')}
                            </span>
                        ) : null}
                    </div>
                    {success ? <div className="alert success">{success}</div> : null}
                    {loadingClient ? <p className="muted">Carregando cliente...</p> : null}
                    <div className="chips">
                        {categories.map((category) => {
                            const active = activeSubscriptionKeys.has(category.key)
                            return (
                                <button
                                    key={category.id}
                                    className={`chip-button ${active ? 'active' : ''}`}
                                    onClick={async () => {
                                        if (!details) return
                                        setSavingSection('subscription')
                                        setError('')
                                        setSuccess('')
                                        try {
                                            const nextDetails =
                                                await api.updateSubscription(details.id, {
                                                    categoryKey: category.key,
                                                    status: active
                                                        ? 'inactive'
                                                        : 'active',
                                                })
                                            setDetails(nextDetails)
                                            setSuccess(
                                                `Assinatura de ${category.label} atualizada.`,
                                            )
                                        } catch (nextError) {
                                            setError(
                                                nextError instanceof Error
                                                    ? nextError.message
                                                    : 'Falha ao atualizar assinatura.',
                                            )
                                        } finally {
                                            setSavingSection('')
                                        }
                                    }}
                                >
                                    {category.label}
                                </button>
                            )
                        })}
                    </div>
                    {savingSection === 'subscription' ? (
                        <p className="muted compact">Salvando assinatura...</p>
                    ) : null}
                </section>

                <section className="panel">
                    <div className="section-heading">
                        <h2>Perfil e cobranca</h2>
                    </div>
                    <div className="form-grid">
                        <label>
                            <span>Nome completo</span>
                            <input
                                value={profileForm?.fullName || ''}
                                onChange={(event) =>
                                    setProfileForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  fullName: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>Empresa</span>
                            <input
                                value={profileForm?.companyName || ''}
                                onChange={(event) =>
                                    setProfileForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  companyName: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>E-mail</span>
                            <input
                                value={profileForm?.email || ''}
                                onChange={(event) =>
                                    setProfileForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  email: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>Telefone</span>
                            <input
                                value={profileForm?.phone || ''}
                                onChange={(event) =>
                                    setProfileForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  phone: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>CPF/CNPJ</span>
                            <input
                                value={profileForm?.document || ''}
                                onChange={(event) =>
                                    setProfileForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  document: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>Cargo</span>
                            <input
                                value={profileForm?.role || ''}
                                onChange={(event) =>
                                    setProfileForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  role: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>Bandeira</span>
                            <input
                                value={paymentForm?.brand || ''}
                                onChange={(event) =>
                                    setPaymentForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  brand: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>Titular</span>
                            <input
                                value={paymentForm?.holderName || ''}
                                onChange={(event) =>
                                    setPaymentForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  holderName: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>Final do cartao</span>
                            <input
                                value={paymentForm?.last4 || ''}
                                onChange={(event) =>
                                    setPaymentForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  last4: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>Mes</span>
                            <input
                                value={paymentForm?.expiryMonth || ''}
                                onChange={(event) =>
                                    setPaymentForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  expiryMonth: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>Ano</span>
                            <input
                                value={paymentForm?.expiryYear || ''}
                                onChange={(event) =>
                                    setPaymentForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  expiryYear: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                        <label>
                            <span>E-mail de cobranca</span>
                            <input
                                value={paymentForm?.billingEmail || ''}
                                onChange={(event) =>
                                    setPaymentForm((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  billingEmail: event.target.value,
                                              }
                                            : current,
                                    )
                                }
                            />
                        </label>
                    </div>
                    <div className="actions">
                        <button
                            className="ghost-button"
                            disabled={!selectedClientId}
                            onClick={() => {
                                if (details) {
                                    setProfileForm(details.profile)
                                    setPaymentForm(details.paymentMethod)
                                }
                            }}
                        >
                            Desfazer alteracoes
                        </button>
                        <button
                            className="primary-button"
                            disabled={
                                !details || !profileForm || savingSection === 'profile'
                            }
                            onClick={async () => {
                                if (!details || !profileForm) return
                                setSavingSection('profile')
                                setError('')
                                setSuccess('')
                                try {
                                    const nextDetails =
                                        await api.updateClientProfile(
                                            details.id,
                                            profileForm,
                                        )
                                    setDetails(nextDetails)
                                    setProfileForm(nextDetails.profile)
                                    setSuccess('Perfil do cliente atualizado.')
                                } catch (nextError) {
                                    setError(
                                        nextError instanceof Error
                                            ? nextError.message
                                            : 'Falha ao salvar perfil.',
                                    )
                                } finally {
                                    setSavingSection('')
                                }
                            }}
                        >
                            {savingSection === 'profile'
                                ? 'Salvando perfil...'
                                : 'Salvar perfil'}
                        </button>
                        <button
                            className="primary-button"
                            disabled={
                                !details || !paymentForm || savingSection === 'payment'
                            }
                            onClick={async () => {
                                if (!details || !paymentForm) return
                                setSavingSection('payment')
                                setError('')
                                setSuccess('')
                                try {
                                    const nextDetails =
                                        await api.updatePaymentMethod(
                                            details.id,
                                            paymentForm,
                                        )
                                    setDetails(nextDetails)
                                    setPaymentForm(nextDetails.paymentMethod)
                                    setSuccess('Forma de pagamento atualizada.')
                                } catch (nextError) {
                                    setError(
                                        nextError instanceof Error
                                            ? nextError.message
                                            : 'Falha ao salvar pagamento.',
                                    )
                                } finally {
                                    setSavingSection('')
                                }
                            }}
                        >
                            {savingSection === 'payment'
                                ? 'Salvando pagamento...'
                                : 'Salvar pagamento'}
                        </button>
                    </div>
                </section>

                <section className="panel">
                    <div className="section-heading">
                        <div>
                            <h2>Agentes configurados</h2>
                            <p className="muted">
                                Crie ou edite agentes do cliente usando o mesmo
                                backend da plataforma.
                            </p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <label>
                            <span>Agente do catalogo</span>
                            <select
                                value={agentForm.catalogAgentId}
                                onChange={(event) => {
                                    const selectedAgent = catalogAgents.find(
                                        (item) => item.id === event.target.value,
                                    )
                                    setAgentForm((current) => ({
                                        ...current,
                                        catalogAgentId: event.target.value,
                                        libraryCategoryKey:
                                            selectedAgent?.categoryKey ||
                                            current.libraryCategoryKey,
                                        description:
                                            current.description ||
                                            selectedAgent?.description ||
                                            '',
                                        name:
                                            current.name ||
                                            selectedAgent?.title ||
                                            '',
                                    }))
                                }}
                            >
                                <option value="">Selecionar agente</option>
                                {availableCatalogAgents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.title} ·{' '}
                                        {categoryLabelMap[agent.categoryKey] ||
                                            agent.categoryKey}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span>Template</span>
                            <input
                                value={agentForm.templateKey}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        templateKey: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>Categoria</span>
                            <input
                                value={agentForm.libraryCategoryKey}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        libraryCategoryKey: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>Nome do agente</span>
                            <input
                                value={agentForm.name}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        name: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>Empresa/base</span>
                            <input
                                value={agentForm.clinicName}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        clinicName: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>Status</span>
                            <input
                                value={agentForm.status}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        status: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>Canal</span>
                            <input
                                value={agentForm.channelLabel}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        channelLabel: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>Provisionamento</span>
                            <input
                                value={agentForm.provisioningStatus}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        provisioningStatus: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>Tags</span>
                            <input
                                value={agentForm.tags}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        tags: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>N8N folder</span>
                            <input
                                value={agentForm.n8nFolderId}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        n8nFolderId: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>N8N project</span>
                            <input
                                value={agentForm.n8nProjectId}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        n8nProjectId: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>Workflow ID</span>
                            <input
                                value={agentForm.n8nWorkflowId}
                                onChange={(event) =>
                                    setAgentForm((current) => ({
                                        ...current,
                                        n8nWorkflowId: event.target.value,
                                    }))
                                }
                            />
                        </label>
                    </div>

                    <label>
                        <span>Descricao</span>
                        <textarea
                            value={agentForm.description}
                            onChange={(event) =>
                                setAgentForm((current) => ({
                                    ...current,
                                    description: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <label>
                        <span>Mensagem de provisionamento</span>
                        <textarea
                            value={agentForm.provisioningMessage}
                            onChange={(event) =>
                                setAgentForm((current) => ({
                                    ...current,
                                    provisioningMessage: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <label>
                        <span>Configuration JSON</span>
                        <textarea
                            value={agentForm.configurationJson}
                            onChange={(event) =>
                                setAgentForm((current) => ({
                                    ...current,
                                    configurationJson: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <div className="actions">
                        <button className="ghost-button" onClick={resetAgentForm}>
                            Novo agente
                        </button>
                        <button
                            className="primary-button"
                            disabled={!details || savingSection === 'agent'}
                            onClick={async () => {
                                if (!details || !agentForm.name.trim()) return

                                setSavingSection('agent')
                                setError('')
                                setSuccess('')

                                try {
                                    const payload = buildConfiguredAgentPayload(
                                        agentForm,
                                    )

                                    if (agentForm.id) {
                                        await api.updateConfiguredAgent(
                                            details.id,
                                            agentForm.id,
                                            payload,
                                        )
                                        setSuccess('Agente atualizado na API.')
                                    } else {
                                        await api.createConfiguredAgent(
                                            details.id,
                                            payload,
                                        )
                                        setSuccess('Agente criado na API.')
                                    }

                                    const refreshedAgents =
                                        await api.getConfiguredAgents(details.id)
                                    setConfiguredAgents(refreshedAgents)
                                    resetAgentForm()
                                } catch (nextError) {
                                    setError(
                                        nextError instanceof Error
                                            ? nextError.message
                                            : 'Falha ao salvar agente.',
                                    )
                                } finally {
                                    setSavingSection('')
                                }
                            }}
                        >
                            {savingSection === 'agent'
                                ? 'Salvando agente...'
                                : agentForm.id
                                  ? 'Salvar agente'
                                  : 'Criar agente'}
                        </button>
                    </div>

                    <div className="list">
                        {configuredAgents.map((agent) => (
                            <article className="list-card" key={agent.id}>
                                <div>
                                    <strong>{agent.name}</strong>
                                    <p>{agent.description}</p>
                                    <small>
                                        {categoryLabelMap[agent.libraryCategoryKey] ||
                                            agent.libraryCategoryKey}{' '}
                                        · {agent.status} · {agent.provisioningStatus}
                                    </small>
                                </div>
                                <div className="actions compact-actions">
                                    <button
                                        className="ghost-button"
                                        onClick={() =>
                                            setAgentForm(
                                                mapConfiguredAgentToForm(
                                                    agent,
                                                    platformSettings,
                                                ),
                                            )
                                        }
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="danger-button"
                                        onClick={async () => {
                                            if (!details) return
                                            setSavingSection('agent-delete')
                                            setError('')
                                            setSuccess('')
                                            try {
                                                await api.deleteConfiguredAgent(
                                                    details.id,
                                                    agent.id,
                                                )
                                                setConfiguredAgents(
                                                    await api.getConfiguredAgents(
                                                        details.id,
                                                    ),
                                                )
                                                setSuccess('Agente removido.')
                                                if (agentForm.id === agent.id) {
                                                    resetAgentForm()
                                                }
                                            } catch (nextError) {
                                                setError(
                                                    nextError instanceof Error
                                                        ? nextError.message
                                                        : 'Falha ao excluir agente.',
                                                )
                                            } finally {
                                                setSavingSection('')
                                            }
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
        </div>
    )
}

function nextCatalogAgentsForClient(
    catalogAgents: CatalogAgent[],
    subscriptions: ClientDetails['subscriptions'],
) {
    const activeKeys = new Set(
        subscriptions
            .filter((item) => item.status === 'active')
            .map((item) => item.categoryKey),
    )

    return catalogAgents.filter(
        (agent) => activeKeys.has(agent.categoryKey) || agent.available,
    )
}
