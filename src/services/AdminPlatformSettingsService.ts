import type { AdminPlatformSettings } from '@/@types/agents'

const LOCAL_STORAGE_KEY = 'studio.ia.admin-platform-settings'

const defaultAdminPlatformSettings: AdminPlatformSettings = {
    n8n: {
        folderId: 'folder-clinic-attendants',
        projectId: 'default-project',
        guideWorkflowId: 'tool-get-guide',
        publishOnCreate: false,
    },
    credentials: {
        openAiCredentialId: 'openai-default',
        openAiCredentialName: 'OpenAi account',
        redisCredentialId: 'redis-default',
        redisCredentialName: 'Redis account',
    },
    defaults: {
        webhookPrefix: 'clinic-attendant',
    },
}

export const getAdminPlatformSettings = (): AdminPlatformSettings => {
    const rawValue = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!rawValue) {
        return defaultAdminPlatformSettings
    }

    try {
        const parsedValue = JSON.parse(rawValue) as Partial<AdminPlatformSettings>

        return {
            n8n: {
                ...defaultAdminPlatformSettings.n8n,
                ...parsedValue.n8n,
            },
            credentials: {
                ...defaultAdminPlatformSettings.credentials,
                ...parsedValue.credentials,
            },
            defaults: {
                ...defaultAdminPlatformSettings.defaults,
                ...parsedValue.defaults,
            },
        }
    } catch {
        return defaultAdminPlatformSettings
    }
}

export const saveAdminPlatformSettings = (
    settings: AdminPlatformSettings,
) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings))
}

export const getDefaultAdminPlatformSettings = () => {
    return defaultAdminPlatformSettings
}
