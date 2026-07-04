import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'dashboard',
        path: '/dashboard',
        component: lazy(() => import('@/views/dashboard')),
        authority: [],
    },
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/ai-platform/UsageDashboard')),
        authority: [],
    },
    {
        key: 'main',
        path: '/main',
        component: lazy(() => import('@/views/main')),
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'arquivos',
        path: '/Arquivos',
        component: lazy(() => import('@/views/Arquivos')),
        authority: [],
    },
    {
        key: 'agentConfiguration',
        path: '/agentes',
        component: lazy(
            () => import('@/views/ai-platform/AgentConfiguration')
        ),
        authority: [],
    },
    {
        key: 'biblioteca',
        path: '/Biblioteca',
        component: lazy(() => import('@/views/Biblioteca')),
        authority: [],
    },
    {
        key: 'createAgent',
        path: '/criaragente',
        component: lazy(() => import('@/views/ai-platform/CreateAgent')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'Cliente',
        path: '/cliente',
        component: lazy(() => import('@/views/layouts/ClienteView')),
        authority: [],
    },
    {
        key: 'CriarCliente',
        path: '/Criar-Cliente',
        component: lazy(() => import('@/views/layouts/customers/CustomerCreate')),
        authority: [],
    },
    {
        key: 'ListaCliente',
        path: '/Lista-Cliente',
        component: lazy(() => import('@/views/layouts/customers/CustomerList')),
        authority: [],
    },
    {
        key: 'DetalheCliente',
        path: '/Detalhe-Cliente',
        component: lazy(() => import('@/views/layouts/customers/CustomerDetails')),
        authority: [],
    },
    {
        key: 'editarCliente',
        path: '/Editar-Cliente',
        component: lazy(() => import('@/views/layouts/customers/CustomerEdit')),
        authority: [],
    },
    {
        key: '',
        path: '/profile-page-view',
        component: lazy(() =>
            import('@/views/layouts/profilepage/Settings')
        ),
        authority: [],
    },
    ...othersRoute,
]
