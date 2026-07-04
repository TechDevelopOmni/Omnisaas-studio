import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import ColorBends from './ColorBends'

const typingPhrases = [
    'Crie seus agentes de IA que executam processos, de forma simples.',
    'Automatize, reduza, integre e escale com IA.',
]

const MainView: React.FC = () => {
    const typingSpeed = 75
    const pauseDuration = 1500
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const currentPhrase = typingPhrases[phraseIndex]
        let timeoutId: ReturnType<typeof setTimeout>

        if (!isDeleting && charIndex === currentPhrase.length) {
            timeoutId = setTimeout(() => {
                setIsDeleting(true)
            }, pauseDuration)
        } else if (isDeleting && charIndex === 0) {
            timeoutId = setTimeout(() => {
                setIsDeleting(false)
                setPhraseIndex((prev) => (prev + 1) % typingPhrases.length)
            }, 300)
        } else {
            timeoutId = setTimeout(() => {
                setCharIndex((prev) => prev + (isDeleting ? -1 : 1))
            }, isDeleting ? typingSpeed / 2 : typingSpeed)
        }

        return () => clearTimeout(timeoutId)
    }, [charIndex, isDeleting, pauseDuration, phraseIndex, typingSpeed])

    const currentPhrase = typingPhrases[phraseIndex]
    const typedText = currentPhrase.slice(0, charIndex)

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 text-white">
            <div className="pointer-events-none absolute inset-0">
                <ColorBends
                    colors={['#ff5c7a', '#8a5cff', '#00ffd1']}
                    rotation={0}
                    speed={0.1}
                    scale={1}
                    frequency={1}
                    warpStrength={1}
                    mouseInfluence={1}
                    parallax={0.9}
                    noise={0.1}
                    transparent
                    autoRotate={0}
                    className="opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/40 to-slate-950" />
            </div>
            <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center">
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Bem-vindo(a) ao studio.IA
                </span>
                <h1 className="mt-6 min-h-[3.75em] text-4xl font-semibold leading-tight text-white sm:text-5xl">
                    {typedText}
                </h1>
                <p className="mt-4 text-base text-white/70 sm:text-lg">
                    Escolha um caminho para comecar: criar um agente, explorar bibliotecas prontas ou acompanhar seus resultados.
                </p>
                <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
                    <Link
                        to="/criaragente"
                        className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/0 p-6 text-left shadow-[0_12px_40px_rgba(16,0,43,0.35)] backdrop-blur transition hover:-translate-y-1 hover:border-white/30 hover:from-white/15 hover:via-white/10"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold uppercase text-white/80">
                            IA
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-white">
                            Criar agentes
                        </h2>
                        <p className="mt-2 text-sm text-white/70">
                            Inicie um novo agente e personalize o fluxo ideal.
                        </p>
                    </Link>
                    <Link
                        to="/Biblioteca"
                        className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/0 p-6 text-left shadow-[0_12px_40px_rgba(16,0,43,0.35)] backdrop-blur transition hover:-translate-y-1 hover:border-white/30 hover:from-white/15 hover:via-white/10"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold uppercase text-white/80">
                            Lib
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-white">
                            Biblioteca
                        </h2>
                        <p className="mt-2 text-sm text-white/70">
                            Explore agentes prontos para implantar integracoes.
                        </p>
                    </Link>
                    <Link
                        to="/agentes"
                        className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/0 p-6 text-left shadow-[0_12px_40px_rgba(16,0,43,0.35)] backdrop-blur transition hover:-translate-y-1 hover:border-white/30 hover:from-white/15 hover:via-white/10"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold uppercase text-white/80">
                            Ops
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-white">
                            Meus agentes
                        </h2>
                        <p className="mt-2 text-sm text-white/70">
                            Gerencie seus agentes ativos e acompanhe resultados.
                        </p>
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default MainView
