import { lazy, Suspense, useEffect } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import SettingsMenu from './components/SettingsMenu'
import SettingMobileMenu from './components/SettingMobileMenu'
import useResponsive from '@/utils/hooks/useResponsive'
import { useSettingsStore } from './store/settingsStore'
import { useSearchParams } from 'react-router-dom'

const Profile = lazy(() => import('./components/SettingsProfile'))
const Billing = lazy(() => import('./components/SettingsBilling'))

const Settings = () => {
    const { currentView, setCurrentView } = useSettingsStore()
    const [searchParams] = useSearchParams()

    const { smaller, larger } = useResponsive()

    useEffect(() => {
        const requestedTab = searchParams.get('tab')

        if (requestedTab === 'billing' || requestedTab === 'profile') {
            setCurrentView(requestedTab)
        }
    }, [searchParams, setCurrentView])

    return (
        <AdaptiveCard className="h-full">
            <div className="flex flex-auto h-full">
                {larger.lg && (
                    <div className="'w-[200px] xl:w-[280px]">
                        <SettingsMenu />
                    </div>
                )}
                <div className="ltr:xl:pl-6 rtl:xl:pr-6 flex-1 py-2">
                    {smaller.lg && (
                        <div className="mb-6">
                            <SettingMobileMenu />
                        </div>
                    )}
                    <Suspense fallback={<></>}>
                        {currentView === 'profile' && <Profile />}
                        {currentView === 'billing' && <Billing />}
                    </Suspense>
                </div>
            </div>
        </AdaptiveCard>
    )
}

export default Settings
