import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import SignInForm from '@/views/auth/SignIn/components/SignInForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'

const AdminSignIn = () => {
    const [message, setMessage] = useTimeOutMessage()
    const mode = useThemeStore((state) => state.mode)

    return (
        <>
            <div className="mb-8">
                <Logo
                    type="streamline"
                    mode={mode}
                    imgClass="mx-auto"
                    logoWidth={60}
                />
            </div>
            <div className="mb-10">
                <h2 className="mb-2">Acesso administrativo</h2>
                <p className="font-semibold heading-text">
                    Entre com o login da operacao da plataforma para gerenciar
                    catalogo, clientes e suporte.
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                Use `admin@studioia.com` ou `suporte@studioia.com` com a senha
                `123Qwe` no modo mock atual.
            </div>
            <SignInForm
                defaultEmail="admin@studioia.com"
                defaultPassword="123Qwe"
                submitLabel="Entrar como administracao"
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2">
                        <ActionLink
                            to="/sign-in"
                            className="font-semibold heading-text mt-2 underline"
                            themeColor={false}
                        >
                            Voltar para o login do cliente
                        </ActionLink>
                    </div>
                }
            />
        </>
    )
}

export default AdminSignIn
