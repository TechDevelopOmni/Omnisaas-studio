import type {
    AuthResponse,
    CatalogAgent,
    CatalogAgentPayload,
    CatalogCategory,
    CatalogCategoryPayload,
    ClientDetails,
    ClientProfile,
    ClientSummary,
    ConfiguredAgent,
    ConfiguredAgentPayload,
    PaymentMethod,
    PlatformSettings,
} from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5202/api'
const SESSION_STORAGE_KEY = 'studioia-admin-session'

const getSessionToken = () => {
    if (typeof window === 'undefined') {
        return ''
    }

    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) {
        return ''
    }

    try {
        const parsed = JSON.parse(raw) as { token?: string }
        return parsed.token || ''
    } catch {
        return ''
    }
}

async function readErrorMessage(response: Response) {
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
        const payload = (await response.json()) as
            | { message?: string; title?: string; detail?: string }
            | undefined
        return (
            payload?.message ||
            payload?.title ||
            payload?.detail ||
            'Falha ao comunicar com a API.'
        )
    }

    const message = await response.text()
    return message || 'Falha ao comunicar com a API.'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = getSessionToken()
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(init?.headers || {}),
        },
        ...init,
    })

    if (!response.ok) {
        throw new Error(await readErrorMessage(response))
    }

    if (response.status === 204) {
        return undefined as T
    }

    return (await response.json()) as T
}

export const api = {
    signIn: (email: string, password: string) =>
        request<AuthResponse>('/auth/sign-in', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
    getCategories: () => request<CatalogCategory[]>('/admin/catalog/categories'),
    createCategory: (payload: CatalogCategoryPayload) =>
        request<CatalogCategory>('/admin/catalog/categories', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
    updateCategory: (id: string, payload: CatalogCategoryPayload) =>
        request<CatalogCategory>(`/admin/catalog/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
    deleteCategory: (id: string) =>
        request<void>(`/admin/catalog/categories/${id}`, { method: 'DELETE' }),
    getAgents: () => request<CatalogAgent[]>('/admin/catalog/agents'),
    createAgent: (payload: CatalogAgentPayload) =>
        request<CatalogAgent>('/admin/catalog/agents', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
    updateAgent: (id: string, payload: CatalogAgentPayload) =>
        request<CatalogAgent>(`/admin/catalog/agents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
    deleteAgent: (id: string) =>
        request<void>(`/admin/catalog/agents/${id}`, { method: 'DELETE' }),
    getClients: () => request<ClientSummary[]>('/client-accounts'),
    getClientDetails: (id: string) =>
        request<ClientDetails>(`/client-accounts/${id}`),
    updateClientProfile: (clientId: string, payload: ClientProfile) =>
        request<ClientDetails>(`/client-accounts/${clientId}/profile`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
    updatePaymentMethod: (clientId: string, payload: PaymentMethod) =>
        request<ClientDetails>(`/client-accounts/${clientId}/payment-method`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
    updateSubscription: (clientId: string, payload: { categoryKey: string; status: string }) =>
        request<ClientDetails>(`/client-accounts/${clientId}/subscriptions`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
    getConfiguredAgents: (clientId: string) =>
        request<ConfiguredAgent[]>(`/client-accounts/${clientId}/configured-agents`),
    createConfiguredAgent: (clientId: string, payload: ConfiguredAgentPayload) =>
        request<ConfiguredAgent>(`/client-accounts/${clientId}/configured-agents`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
    updateConfiguredAgent: (
        clientId: string,
        agentId: string,
        payload: ConfiguredAgentPayload,
    ) =>
        request<ConfiguredAgent>(
            `/client-accounts/${clientId}/configured-agents/${agentId}`,
            {
                method: 'PUT',
                body: JSON.stringify(payload),
            },
        ),
    deleteConfiguredAgent: (clientId: string, agentId: string) =>
        request<void>(`/client-accounts/${clientId}/configured-agents/${agentId}`, {
            method: 'DELETE',
        }),
    getPlatformSettings: () =>
        request<PlatformSettings>('/admin/platform-settings'),
    updatePlatformSettings: (payload: PlatformSettings) =>
        request<PlatformSettings>('/admin/platform-settings', {
            method: 'PUT',
            body: JSON.stringify({
                n8nFolderId: payload.n8nFolderId,
                n8nProjectId: payload.n8nProjectId,
                n8nGuideWorkflowId: payload.n8nGuideWorkflowId,
                publishOnCreate: payload.publishOnCreate,
                openAiCredentialId: payload.openAiCredentialId,
                openAiCredentialName: payload.openAiCredentialName,
                redisCredentialId: payload.redisCredentialId,
                redisCredentialName: payload.redisCredentialName,
                webhookPrefix: payload.webhookPrefix,
            }),
        }),
}
