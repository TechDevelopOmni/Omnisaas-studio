import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { useAdminSession } from './auth'
import { DashboardPage } from './pages/DashboardPage'
import { DepartmentsPage } from './pages/DepartmentsPage'
import { AgentsPage } from './pages/AgentsPage'
import { ClientsPage } from './pages/ClientsPage'
import { SettingsPage } from './pages/SettingsPage'

const LoginPage = ({
    loading,
    error,
    onSignIn,
}: {
    loading: boolean
    error: string
    onSignIn: (email: string, password: string) => Promise<void>
}) => {
    return (
        <div className="login-shell">
            <form
                className="login-card"
                onSubmit={async (event) => {
                    event.preventDefault()
                    const formData = new FormData(event.currentTarget)
                    await onSignIn(
                        String(formData.get('email') || ''),
                        String(formData.get('password') || ''),
                    )
                }}
            >
                <p className="eyebrow">studio.IA Admin</p>
                <h1>Plataforma administrativa isolada</h1>
                <p className="muted">
                    Esta aplicacao atende apenas a operacao interna e usa a mesma
                    API `.NET 8` do ecossistema.
                </p>
                <label>
                    <span>E-mail</span>
                    <input name="email" defaultValue="admin@studioia.com" />
                </label>
                <label>
                    <span>Senha</span>
                    <input
                        name="password"
                        type="password"
                        defaultValue="123Qwe"
                    />
                </label>
                {error ? <div className="alert error">{error}</div> : null}
                <button className="primary-button" type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    )
}

const Shell = ({
    userName,
    onSignOut,
}: {
    userName: string
    onSignOut: () => void
}) => {
    const location = useLocation()
    const title = useMemo(() => {
        if (location.pathname.includes('/departamentos')) return 'Departamentos'
        if (location.pathname.includes('/agentes')) return 'Agentes'
        if (location.pathname.includes('/clientes')) return 'Clientes'
        if (location.pathname.includes('/settings')) return 'Configurações'
        return 'Dashboard'
    }, [location.pathname])

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div>
                    <p className="eyebrow">studio.IA</p>
                    <h2>Admin Portal</h2>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/departamentos">Departamentos</NavLink>
                    <NavLink to="/agentes">Agentes</NavLink>
                    <NavLink to="/clientes">Clientes</NavLink>
                    <NavLink to="/settings">Settings API</NavLink>
                </nav>
                <div className="sidebar-footer">
                    <p>{userName}</p>
                    <button className="ghost-button" onClick={onSignOut}>
                        Sair
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <header className="page-header">
                    <div>
                        <p className="eyebrow">Operação interna</p>
                        <h1>{title}</h1>
                    </div>
                </header>
                <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/departamentos" element={<DepartmentsPage />} />
                    <Route path="/agentes" element={<AgentsPage />} />
                    <Route path="/clientes" element={<ClientsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </div>
    )
}

const App = () => {
    const { session, loading, error, signIn, signOut } = useAdminSession()

    if (!session) {
        return <LoginPage loading={loading} error={error} onSignIn={signIn} />
    }

    return <Shell userName={session.user.userName} onSignOut={signOut} />
}

export default App
