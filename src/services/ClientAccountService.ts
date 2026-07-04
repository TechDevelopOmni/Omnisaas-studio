import { getCategoryMonthlyPrice } from '@/services/AdminCatalogService'
import type { AgentLibraryCategory } from '@/@types/agents'
import type { User } from '@/@types/auth'

export type ClientProfileSettings = {
    fullName: string
    companyName: string
    email: string
    phone: string
    document: string
    role: string
}

export type ClientPaymentMethod = {
    brand: string
    holderName: string
    last4: string
    expiryMonth: string
    expiryYear: string
    billingEmail: string
}

export type DepartmentSubscription = {
    category: AgentLibraryCategory
    status: 'active' | 'inactive'
    monthlyPrice: number
    startedAt?: string
}

export type ClientAccountSettings = {
    profile: ClientProfileSettings
    paymentMethod: ClientPaymentMethod
    subscriptions: DepartmentSubscription[]
    updatedAt: string
}

const LOCAL_STORAGE_KEY = 'studio-ia-client-account'
export const DEPARTMENT_MONTHLY_PRICE = 299

const buildOwnerKey = (user?: User) =>
    user?.userId || user?.email || 'anonymous-client'

const defaultProfile = (user?: User): ClientProfileSettings => ({
    fullName: user?.userName || '',
    companyName: '',
    email: user?.email || '',
    phone: '',
    document: '',
    role: '',
})

const defaultPaymentMethod = (user?: User): ClientPaymentMethod => ({
    brand: 'Visa',
    holderName: user?.userName || '',
    last4: '',
    expiryMonth: '',
    expiryYear: '',
    billingEmail: user?.email || '',
})

const defaultSettings = (user?: User): ClientAccountSettings => ({
    profile: defaultProfile(user),
    paymentMethod: defaultPaymentMethod(user),
    subscriptions: [],
    updatedAt: new Date().toISOString(),
})

const readStorage = (): Record<string, ClientAccountSettings> => {
    const rawValue = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!rawValue) {
        return {}
    }

    try {
        return JSON.parse(rawValue) as Record<string, ClientAccountSettings>
    } catch {
        return {}
    }
}

const writeStorage = (value: Record<string, ClientAccountSettings>) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value))
}

export const listClientAccounts = () => {
    const storage = readStorage()

    return Object.entries(storage).map(([ownerKey, settings]) => ({
        ownerKey,
        settings,
    }))
}

export const getClientAccountSettingsByOwnerKey = (ownerKey: string) => {
    const storage = readStorage()
    return storage[ownerKey]
}

export const saveClientAccountSettingsByOwnerKey = (
    ownerKey: string,
    settings: ClientAccountSettings,
) => {
    const storage = readStorage()

    storage[ownerKey] = {
        ...settings,
        updatedAt: new Date().toISOString(),
    }

    writeStorage(storage)
    return storage[ownerKey]
}

export const getClientAccountSettings = (user?: User) => {
    const ownerKey = buildOwnerKey(user)
    const storage = readStorage()
    const currentSettings = storage[ownerKey]

    if (!currentSettings) {
        const settings = defaultSettings(user)
        storage[ownerKey] = settings
        writeStorage(storage)
        return settings
    }

    return {
        ...defaultSettings(user),
        ...currentSettings,
        profile: {
            ...defaultProfile(user),
            ...currentSettings.profile,
        },
        paymentMethod: {
            ...defaultPaymentMethod(user),
            ...currentSettings.paymentMethod,
        },
        subscriptions: currentSettings.subscriptions || [],
    }
}

export const saveClientAccountSettings = (
    user: User | undefined,
    settings: ClientAccountSettings,
) => {
    const ownerKey = buildOwnerKey(user)
    const storage = readStorage()

    storage[ownerKey] = {
        ...settings,
        updatedAt: new Date().toISOString(),
    }

    writeStorage(storage)
    return storage[ownerKey]
}

export const saveClientProfileSettings = (
    user: User | undefined,
    profile: ClientProfileSettings,
) => {
    const currentSettings = getClientAccountSettings(user)

    return saveClientAccountSettings(user, {
        ...currentSettings,
        profile,
    })
}

export const saveClientPaymentMethod = (
    user: User | undefined,
    paymentMethod: ClientPaymentMethod,
) => {
    const currentSettings = getClientAccountSettings(user)

    return saveClientAccountSettings(user, {
        ...currentSettings,
        paymentMethod,
    })
}

export const setDepartmentSubscriptionStatus = (
    user: User | undefined,
    category: AgentLibraryCategory,
    status: 'active' | 'inactive',
) => {
    const currentSettings = getClientAccountSettings(user)
    const existingSubscriptions = currentSettings.subscriptions || []
    const existingSubscription = existingSubscriptions.find(
        (item) => item.category === category,
    )

    const nextSubscription: DepartmentSubscription = {
        category,
        status,
        monthlyPrice: getCategoryMonthlyPrice(category),
        startedAt:
            status === 'active'
                ? existingSubscription?.startedAt || new Date().toISOString()
                : existingSubscription?.startedAt,
    }

    const subscriptions = existingSubscription
        ? existingSubscriptions.map((item) =>
              item.category === category ? nextSubscription : item,
          )
        : [...existingSubscriptions, nextSubscription]

    return saveClientAccountSettings(user, {
        ...currentSettings,
        subscriptions,
    })
}

export const isDepartmentSubscribed = (
    settings: ClientAccountSettings,
    category: AgentLibraryCategory,
) =>
    settings.subscriptions.some(
        (item) => item.category === category && item.status === 'active',
    )

export const getActiveSubscriptionCount = (settings: ClientAccountSettings) =>
    settings.subscriptions.filter((item) => item.status === 'active').length

export const getMonthlyRecurringRevenue = (settings: ClientAccountSettings) =>
    settings.subscriptions
        .filter((item) => item.status === 'active')
        .reduce((total, item) => total + item.monthlyPrice, 0)
