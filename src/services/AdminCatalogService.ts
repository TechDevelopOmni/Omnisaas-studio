import createUID from '@/components/ui/utils/createUid'
import {
    agentCatalog as defaultAgentCatalog,
    libraryCategories as defaultLibraryCategories,
    libraryCategoryGroups as defaultLibraryCategoryGroups,
} from '@/constants/agent-catalog.constant'
import type {
    AgentCatalogItem,
    AgentLibraryCategory,
    AgentLibraryCategoryGroupId,
    AgentLibraryCategoryGroupRecord,
    AgentLibraryCategoryRecord,
} from '@/@types/agents'

type AdminCatalogState = {
    categories: AgentLibraryCategoryRecord[]
    groups: AgentLibraryCategoryGroupRecord[]
    agents: AgentCatalogItem[]
    updatedAt: string
}

const LOCAL_STORAGE_KEY = 'studio.ia.admin-catalog'
const DEFAULT_MONTHLY_PRICE = 299

const normalizeSlug = (value: string) =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

const ensureUniqueSlug = (
    baseValue: string,
    categories: AgentLibraryCategoryRecord[],
) => {
    const normalizedBase = normalizeSlug(baseValue) || 'categoria'
    let candidate = normalizedBase
    let counter = 2

    while (categories.some((category) => category.value === candidate)) {
        candidate = `${normalizedBase}-${counter}`
        counter += 1
    }

    return candidate
}

const buildDefaultGroups = (): AgentLibraryCategoryGroupRecord[] =>
    defaultLibraryCategoryGroups.map((group) => ({
        id: group.id,
        label: group.label,
        description: group.description,
    }))

const buildDefaultCategories = (): AgentLibraryCategoryRecord[] =>
    defaultLibraryCategories.map((category) => ({
        ...category,
        groupId:
            defaultLibraryCategoryGroups.find((group) =>
                group.categories.includes(category.value),
            )?.id || 'departamentos',
        monthlyPrice: DEFAULT_MONTHLY_PRICE,
    }))

const buildDefaultState = (): AdminCatalogState => ({
    groups: buildDefaultGroups(),
    categories: buildDefaultCategories(),
    agents: defaultAgentCatalog,
    updatedAt: new Date().toISOString(),
})

const readStorage = (): AdminCatalogState | null => {
    const rawValue = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!rawValue) {
        return null
    }

    try {
        return JSON.parse(rawValue) as AdminCatalogState
    } catch {
        return null
    }
}

const writeStorage = (state: AdminCatalogState) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
}

const sanitizeState = (state?: AdminCatalogState | null): AdminCatalogState => {
    const defaultState = buildDefaultState()

    if (!state) {
        writeStorage(defaultState)
        return defaultState
    }

    const nextState: AdminCatalogState = {
        groups: Array.isArray(state.groups) ? state.groups : defaultState.groups,
        categories: Array.isArray(state.categories)
            ? state.categories
            : defaultState.categories,
        agents: Array.isArray(state.agents) ? state.agents : defaultState.agents,
        updatedAt: state.updatedAt || new Date().toISOString(),
    }

    writeStorage(nextState)
    return nextState
}

const getState = () => sanitizeState(readStorage())

const saveState = (state: AdminCatalogState) => {
    const nextState = {
        ...state,
        updatedAt: new Date().toISOString(),
    }

    writeStorage(nextState)
    return nextState
}

export const getAdminCatalogSnapshot = () => getState()

export const getLibraryCategoryGroups = () => {
    const state = getState()

    return state.groups.map((group) => ({
        ...group,
        categories: state.categories
            .filter((category) => category.groupId === group.id)
            .map((category) => category.value),
    }))
}

export const getLibraryCategories = () => getState().categories

export const getLibraryCategoryByValue = (value: AgentLibraryCategory) =>
    getState().categories.find((category) => category.value === value)

export const getCategoryMonthlyPrice = (value: AgentLibraryCategory) =>
    getLibraryCategoryByValue(value)?.monthlyPrice || DEFAULT_MONTHLY_PRICE

export const getAgentCatalog = () =>
    [...getState().agents].sort((left, right) =>
        left.title.localeCompare(right.title),
    )

export const getAgentCatalogByCategory = (category: AgentLibraryCategory) =>
    getAgentCatalog().filter((item) => item.category === category)

export const createLibraryCategory = (input: {
    label: string
    description: string
    groupId: AgentLibraryCategoryGroupId
    monthlyPrice?: number
}) => {
    const state = getState()
    const value = ensureUniqueSlug(input.label, state.categories)
    const nextCategory: AgentLibraryCategoryRecord = {
        value,
        label: input.label.trim(),
        description: input.description.trim(),
        groupId: input.groupId,
        monthlyPrice: input.monthlyPrice || DEFAULT_MONTHLY_PRICE,
    }

    return saveState({
        ...state,
        categories: [...state.categories, nextCategory],
    })
}

export const updateLibraryCategory = (
    value: AgentLibraryCategory,
    input: Partial<
        Pick<
            AgentLibraryCategoryRecord,
            'label' | 'description' | 'groupId' | 'monthlyPrice'
        >
    >,
) => {
    const state = getState()

    return saveState({
        ...state,
        categories: state.categories.map((category) =>
            category.value === value
                ? {
                      ...category,
                      ...input,
                  }
                : category,
        ),
    })
}

export const deleteLibraryCategory = (value: AgentLibraryCategory) => {
    const state = getState()

    return saveState({
        ...state,
        categories: state.categories.filter((category) => category.value !== value),
        agents: state.agents.filter((agent) => agent.category !== value),
    })
}

export const createCatalogAgent = (input: {
    category: AgentLibraryCategory
    title: string
    role: string
    description: string
    highlights: string[]
    route?: string
    available?: boolean
    visual?: AgentCatalogItem['visual']
}) => {
    const state = getState()
    const symbol = normalizeSlug(input.title).slice(0, 2).toUpperCase() || 'AG'
    const nextAgent: AgentCatalogItem = {
        id: createUID(12),
        category: input.category,
        title: input.title.trim(),
        role: input.role.trim(),
        description: input.description.trim(),
        highlights: input.highlights.filter(Boolean),
        route: input.route || '/criaragente',
        available: input.available ?? false,
        visual:
            input.visual || {
                accent: '#22d3ee',
                glow: '#0e7490',
                panel: '#0b1c23',
                symbol,
            },
    }

    return saveState({
        ...state,
        agents: [nextAgent, ...state.agents],
    })
}

export const updateCatalogAgent = (
    agentId: string,
    input: Partial<
        Pick<
            AgentCatalogItem,
            | 'category'
            | 'title'
            | 'role'
            | 'description'
            | 'highlights'
            | 'route'
            | 'available'
            | 'visual'
        >
    >,
) => {
    const state = getState()

    return saveState({
        ...state,
        agents: state.agents.map((agent) =>
            agent.id === agentId
                ? {
                      ...agent,
                      ...input,
                  }
                : agent,
        ),
    })
}

export const deleteCatalogAgent = (agentId: string) => {
    const state = getState()

    return saveState({
        ...state,
        agents: state.agents.filter((agent) => agent.id !== agentId),
    })
}
