import { useEffect, useState } from 'react'
import { api } from './api'
import type { AuthUser } from './types'

const STORAGE_KEY = 'studioia-admin-session'

type Session = {
    token: string
    user: AuthUser
}

const readSession = (): Session | null => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
        return null
    }

    try {
        return JSON.parse(raw) as Session
    } catch {
        return null
    }
}

export const useAdminSession = () => {
    const [session, setSession] = useState<Session | null>(() => readSession())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (session) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [session])

    const signIn = async (email: string, password: string) => {
        setLoading(true)
        setError('')
        try {
            const response = await api.signIn(email, password)
            if (
                !response.user.authority.includes('admin') &&
                !response.user.authority.includes('support')
            ) {
                throw new Error('Este login nao possui acesso administrativo.')
            }

            setSession(response)
        } catch (nextError) {
            setError(
                nextError instanceof Error
                    ? nextError.message
                    : 'Falha ao autenticar.',
            )
        } finally {
            setLoading(false)
        }
    }

    const signOut = () => setSession(null)

    return {
        session,
        loading,
        error,
        signIn,
        signOut,
    }
}
