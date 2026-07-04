export type AuthUser = {
    userId: string
    userName: string
    email: string
    avatar: string
    authority: string[]
}

export type AuthResponse = {
    token: string
    user: AuthUser
}

export type CatalogCategory = {
    id: string
    key: string
    label: string
    description: string
    groupId: string
    monthlyPrice: number
}

export type CatalogVisual = {
    accent: string
    glow: string
    panel: string
    symbol: string
}

export type CatalogAgent = {
    id: string
    catalogCategoryId: string
    categoryKey: string
    title: string
    role: string
    description: string
    highlights: string[]
    route: string
    available: boolean
    visual: CatalogVisual
}

export type ClientSummary = {
    id: string
    userAccountId: string
    userName: string
    companyName: string
    email: string
    activeSubscriptionCount: number
    configuredAgentCount: number
}

export type ClientDetails = {
    id: string
    userAccountId: string
    userName: string
    profile: {
        fullName: string
        companyName: string
        email: string
        phone: string
        document: string
        role: string
    }
    paymentMethod: {
        brand: string
        holderName: string
        last4: string
        expiryMonth: string
        expiryYear: string
        billingEmail: string
    }
    subscriptions: Array<{
        id: string
        categoryKey: string
        categoryLabel: string
        status: string
        monthlyPrice: number
        startedAtUtc?: string | null
    }>
    updatedAtUtc: string
}

export type ConfiguredAgent = {
    id: string
    clientAccountId: string
    catalogAgentId?: string | null
    templateKey: string
    libraryCategoryKey: string
    name: string
    clinicName: string
    description: string
    status: string
    tags: string[]
    channelLabel: string
    provisioningStatus: string
    provisioningMessage: string
    n8nFolderId: string
    n8nProjectId: string
    n8nWorkflowId?: string | null
    n8nWorkflowUrl?: string | null
    configurationJson: string
    createdAtUtc: string
    updatedAtUtc: string
}

export type PlatformSettings = {
    id: string
    n8nFolderId: string
    n8nProjectId: string
    n8nGuideWorkflowId: string
    publishOnCreate: boolean
    openAiCredentialId: string
    openAiCredentialName: string
    redisCredentialId: string
    redisCredentialName: string
    webhookPrefix: string
    updatedAtUtc: string
}

export type ClientProfile = ClientDetails['profile']

export type PaymentMethod = ClientDetails['paymentMethod']

export type CatalogCategoryPayload = {
    key: string
    label: string
    description: string
    groupId: string
    monthlyPrice: number
}

export type CatalogAgentPayload = {
    catalogCategoryId: string
    title: string
    role: string
    description: string
    highlights: string[]
    route: string
    available: boolean
    visual: CatalogVisual
}

export type ConfiguredAgentPayload = {
    catalogAgentId?: string | null
    templateKey: string
    libraryCategoryKey: string
    name: string
    clinicName: string
    description: string
    status: string
    tags: string[]
    channelLabel: string
    provisioningStatus: string
    provisioningMessage: string
    n8nFolderId: string
    n8nProjectId: string
    n8nWorkflowId?: string | null
    n8nWorkflowUrl?: string | null
    configurationJson: string
}
