import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AgentLibraryCategory } from '@/@types/agents'
import { useSessionUser } from '@/store/authStore'
import {
    getAgentCatalog,
    getLibraryCategories,
    getLibraryCategoryGroups,
} from '@/services/AdminCatalogService'
import {
    getClientAccountSettings,
    isDepartmentSubscribed,
} from '@/services/ClientAccountService'

const BibliotecaView = () => {
    const user = useSessionUser((state) => state.user)
    const libraryCategories = useMemo(() => getLibraryCategories(), [])
    const libraryCategoryGroups = useMemo(() => getLibraryCategoryGroups(), [])
    const agentCatalog = useMemo(() => getAgentCatalog(), [])
    const [selectedCategory, setSelectedCategory] =
        useState<AgentLibraryCategory>(libraryCategories[0]?.value || 'marketing')

    const filteredAgents = useMemo(
        () =>
            agentCatalog.filter((agent) => agent.category === selectedCategory),
        [agentCatalog, selectedCategory],
    )

    const selectedCategoryLabel =
        libraryCategories.find((item) => item.value === selectedCategory)
            ?.label || 'Categoria'
    const accountSettings = useMemo(
        () => getClientAccountSettings(user),
        [user],
    )
    const selectedCategorySubscribed = isDepartmentSubscribed(
        accountSettings,
        selectedCategory,
    )

    return (
        <div className="flex flex-col gap-6">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111c] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
                    <div className="absolute right-0 top-12 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                                Biblioteca
                            </p>
                            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                                Escolha agentes por departamento ou
                                especialidade
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                                Explore modelos de agentes com apresentacao
                                visual, funcao clara e trilhas pensadas para a
                                estrutura real de uma empresa. Departamentos
                                ficam em um bloco e areas especializadas ganham
                                espaco proprio.
                            </p>
                        </div>

                        <div className="flex flex-col items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                                    Catalogo vivo
                                </span>
                            </div>
                            <p className="max-w-xs text-sm leading-6 text-slate-300">
                                Use a biblioteca para descobrir casos de uso e
                                depois siga para a criacao do agente quando a
                                jornada estiver pronta.
                            </p>
                            <Link
                                to="/agentes"
                                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                            >
                                Ver meus agentes
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 xl:grid-cols-2">
                        <div className="xl:col-span-2 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                            {libraryCategoryGroups.map((group, groupIndex) => (
                                <div key={group.id}>
                                    {groupIndex > 0 && (
                                        <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                                    )}

                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="max-w-sm">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/70">
                                                {group.label}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                                {group.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-1 flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-4 lg:justify-end lg:border-t-0 lg:pt-0">
                                            {group.categories.map(
                                                (categoryValue) => {
                                                    const category =
                                                        libraryCategories.find(
                                                            (item) =>
                                                                item.value ===
                                                                categoryValue,
                                                        )

                                                    if (!category) {
                                                        return null
                                                    }

                                                    const isActive =
                                                        selectedCategory ===
                                                        category.value
                                                    const count =
                                                        agentCatalog.filter(
                                                            (item) =>
                                                                item.category ===
                                                                category.value,
                                                        ).length

                                                    return (
                                                        <button
                                                            key={
                                                                category.value
                                                            }
                                                            type="button"
                                                            className="group text-left"
                                                            onClick={() =>
                                                                setSelectedCategory(
                                                                    category.value,
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span
                                                                    className={`text-lg font-semibold transition ${
                                                                        isActive
                                                                            ? 'text-cyan-300'
                                                                            : 'text-white group-hover:text-cyan-200'
                                                                    }`}
                                                                >
                                                                    {
                                                                        category.label
                                                                    }
                                                                </span>
                                                                <span
                                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                                                                        isActive
                                                                            ? 'bg-cyan-300/15 text-cyan-200'
                                                                            : 'bg-white/10 text-slate-300 group-hover:bg-white/15'
                                                                    }`}
                                                                >
                                                                    {count}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className={`mt-2 h-px transition ${
                                                                    isActive
                                                                        ? 'w-full bg-cyan-300'
                                                                        : 'w-0 bg-white/40 group-hover:w-full'
                                                                }`}
                                                            />
                                                        </button>
                                                    )
                                                },
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[32px] border border-[#1c2c3d] bg-[#0a1522] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.32)] sm:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/70">
                            Curadoria
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                            Agentes para {selectedCategoryLabel}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                            Cards com identidade visual, papel do agente e
                            pontos-chave de uso para facilitar a escolha.
                        </p>
                    </div>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-200">
                        {selectedCategorySubscribed
                            ? `${filteredAgents.length} agentes liberados`
                            : `Assine este departamento para liberar os agentes`}
                    </span>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                    {filteredAgents.map((item) => (
                        <article
                            key={item.id}
                            className={`group relative overflow-hidden rounded-[28px] border p-5 transition duration-300 ${
                                item.available
                                    ? 'border-cyan-300/20 bg-[#0d1b2a] hover:-translate-y-1 hover:border-cyan-300/45 hover:shadow-[0_20px_60px_rgba(14,165,233,0.12)]'
                                    : 'border-white/10 bg-[#0d1724] hover:-translate-y-1 hover:border-amber-300/30'
                            }`}
                            style={{
                                backgroundImage: `linear-gradient(180deg, ${item.visual.panel} 0%, rgba(10,21,34,0.96) 58%)`,
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 opacity-70">
                                <div
                                    className="absolute -right-10 top-0 h-32 w-32 rounded-full blur-3xl"
                                    style={{
                                        backgroundColor: item.visual.glow,
                                    }}
                                />
                                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between gap-4">
                                    <AgentArtwork
                                        accent={item.visual.accent}
                                        glow={item.visual.glow}
                                        symbol={item.visual.symbol}
                                        title={item.title}
                                    />
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            selectedCategorySubscribed
                                                ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                                                : 'border border-amber-300/20 bg-amber-300/10 text-amber-200'
                                        }`}
                                    >
                                        {selectedCategorySubscribed
                                            ? 'Departamento ativo'
                                            : 'Assinatura necessaria'}
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                        {item.role}
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold text-white">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-300">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {item.highlights.map((highlight) => (
                                        <span
                                            key={highlight}
                                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    {selectedCategorySubscribed ? (
                                        <Link
                                            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                                            to={item.route}
                                        >
                                            Configurar agente
                                        </Link>
                                    ) : (
                                        <Link
                                            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                                            to="/profile-page-view?tab=billing"
                                        >
                                            Assinar departamento
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}

const AgentArtwork = ({
    accent,
    glow,
    symbol,
    title,
}: {
    accent: string
    glow: string
    symbol: string
    title: string
}) => {
    return (
        <div
            className="relative h-20 w-20 overflow-hidden rounded-[24px] border border-white/10 shadow-[0_14px_32px_rgba(0,0,0,0.35)]"
            style={{
                background: `radial-gradient(circle at 30% 25%, ${accent}66 0%, ${glow} 45%, #050b14 100%)`,
            }}
            aria-hidden="true"
            title={title}
        >
            <svg
                viewBox="0 0 96 96"
                className="h-full w-full"
                role="img"
                aria-label={title}
            >
                <defs>
                    <linearGradient id={`shell-${symbol}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#e2f3ff" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#8ca3b8" stopOpacity="0.35" />
                    </linearGradient>
                </defs>
                <circle cx="48" cy="48" r="24" fill="rgba(7,17,28,0.65)" />
                <ellipse cx="48" cy="45" rx="19" ry="15" fill="rgba(2,6,23,0.9)" />
                <path
                    d="M31 54c2 9 10 15 17 15s15-6 17-15"
                    fill="none"
                    stroke={`url(#shell-${symbol})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <circle cx="40" cy="44" r="4.8" fill={accent} />
                <circle cx="56" cy="44" r="4.8" fill={accent} />
                <rect x="41" y="56" width="14" height="4" rx="2" fill={accent} opacity="0.85" />
                <circle cx="74" cy="22" r="12" fill="rgba(255,255,255,0.08)" />
                <text
                    x="74"
                    y="26"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="700"
                    fill="#f8fafc"
                >
                    {symbol}
                </text>
            </svg>
        </div>
    )
}

export default BibliotecaView
