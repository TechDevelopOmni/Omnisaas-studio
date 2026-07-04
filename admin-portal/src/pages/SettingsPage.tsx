import { useEffect, useState } from 'react'
import { api } from '../api'
import type { PlatformSettings } from '../types'

export const SettingsPage = () => {
    const [settings, setSettings] = useState<PlatformSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        void (async () => {
            setLoading(true)
            setError('')
            try {
                setSettings(await api.getPlatformSettings())
            } catch (nextError) {
                setError(
                    nextError instanceof Error
                        ? nextError.message
                        : 'Falha ao carregar configuracoes.',
                )
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) {
        return (
            <section className="panel">
                <h2>Configuracao global da API</h2>
                <p className="muted">Carregando...</p>
            </section>
        )
    }

    if (!settings) {
        return (
            <section className="panel">
                <h2>Configuracao global da API</h2>
                <p className="muted">{error || 'Nenhuma configuracao encontrada.'}</p>
            </section>
        )
    }

    return (
        <section className="panel">
            <div className="section-heading">
                <div>
                    <h2>Configuracao global da API</h2>
                    <p className="muted">
                        Ajuste defaults operacionais usados na criacao e
                        provisionamento dos agentes.
                    </p>
                </div>
                <span className="soft-badge">
                    Atualizado em{' '}
                    {new Date(settings.updatedAtUtc).toLocaleString('pt-BR')}
                </span>
            </div>

            {error ? <div className="alert error">{error}</div> : null}
            {success ? <div className="alert success">{success}</div> : null}

            <div className="form-grid">
                <label>
                    <span>Pasta n8n</span>
                    <input
                        value={settings.n8nFolderId}
                        onChange={(event) =>
                            setSettings((current) =>
                                current
                                    ? {
                                          ...current,
                                          n8nFolderId: event.target.value,
                                      }
                                    : current,
                            )
                        }
                    />
                </label>
                <label>
                    <span>Projeto n8n</span>
                    <input
                        value={settings.n8nProjectId}
                        onChange={(event) =>
                            setSettings((current) =>
                                current
                                    ? {
                                          ...current,
                                          n8nProjectId: event.target.value,
                                      }
                                    : current,
                            )
                        }
                    />
                </label>
                <label>
                    <span>Guide workflow</span>
                    <input
                        value={settings.n8nGuideWorkflowId}
                        onChange={(event) =>
                            setSettings((current) =>
                                current
                                    ? {
                                          ...current,
                                          n8nGuideWorkflowId:
                                              event.target.value,
                                      }
                                    : current,
                            )
                        }
                    />
                </label>
                <label>
                    <span>Webhook prefix</span>
                    <input
                        value={settings.webhookPrefix}
                        onChange={(event) =>
                            setSettings((current) =>
                                current
                                    ? {
                                          ...current,
                                          webhookPrefix: event.target.value,
                                      }
                                    : current,
                            )
                        }
                    />
                </label>
                <label>
                    <span>OpenAI credential ID</span>
                    <input
                        value={settings.openAiCredentialId}
                        onChange={(event) =>
                            setSettings((current) =>
                                current
                                    ? {
                                          ...current,
                                          openAiCredentialId:
                                              event.target.value,
                                      }
                                    : current,
                            )
                        }
                    />
                </label>
                <label>
                    <span>OpenAI credential name</span>
                    <input
                        value={settings.openAiCredentialName}
                        onChange={(event) =>
                            setSettings((current) =>
                                current
                                    ? {
                                          ...current,
                                          openAiCredentialName:
                                              event.target.value,
                                      }
                                    : current,
                            )
                        }
                    />
                </label>
                <label>
                    <span>Redis credential ID</span>
                    <input
                        value={settings.redisCredentialId}
                        onChange={(event) =>
                            setSettings((current) =>
                                current
                                    ? {
                                          ...current,
                                          redisCredentialId:
                                              event.target.value,
                                      }
                                    : current,
                            )
                        }
                    />
                </label>
                <label>
                    <span>Redis credential name</span>
                    <input
                        value={settings.redisCredentialName}
                        onChange={(event) =>
                            setSettings((current) =>
                                current
                                    ? {
                                          ...current,
                                          redisCredentialName:
                                              event.target.value,
                                      }
                                    : current,
                            )
                        }
                    />
                </label>
            </div>

            <label className="checkbox-row">
                <input
                    type="checkbox"
                    checked={settings.publishOnCreate}
                    onChange={(event) =>
                        setSettings((current) =>
                            current
                                ? {
                                      ...current,
                                      publishOnCreate: event.target.checked,
                                  }
                                : current,
                        )
                    }
                />
                Publicar workflow automaticamente na criacao
            </label>

            <div className="actions">
                <button
                    className="ghost-button"
                    onClick={async () => {
                        setError('')
                        setSuccess('')
                        setLoading(true)
                        try {
                            setSettings(await api.getPlatformSettings())
                        } catch (nextError) {
                            setError(
                                nextError instanceof Error
                                    ? nextError.message
                                    : 'Falha ao recarregar configuracoes.',
                            )
                        } finally {
                            setLoading(false)
                        }
                    }}
                >
                    Recarregar
                </button>
                <button
                    className="primary-button"
                    disabled={saving}
                    onClick={async () => {
                        setSaving(true)
                        setError('')
                        setSuccess('')
                        try {
                            const updated = await api.updatePlatformSettings(
                                settings,
                            )
                            setSettings(updated)
                            setSuccess('Configuracoes salvas na API.')
                        } catch (nextError) {
                            setError(
                                nextError instanceof Error
                                    ? nextError.message
                                    : 'Falha ao salvar configuracoes.',
                            )
                        } finally {
                            setSaving(false)
                        }
                    }}
                >
                    {saving ? 'Salvando...' : 'Salvar configuracoes'}
                </button>
            </div>
        </section>
    )
}
