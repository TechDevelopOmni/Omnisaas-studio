import Menu from '@/components/ui/Menu'
import ScrollBar from '@/components/ui/ScrollBar'
import { useSettingsStore } from '../store/settingsStore'
import {
    TbFileDollar,
    TbUserSquare,
} from 'react-icons/tb'
import type { View } from '../types'
import type { ReactNode } from 'react'

const { MenuItem } = Menu

const menuList: { label: string; value: View; icon: ReactNode }[] = [
    { label: 'Dados pessoais', value: 'profile', icon: <TbUserSquare /> },
    {
        label: 'Pagamento e assinaturas',
        value: 'billing',
        icon: <TbFileDollar />,
    },
]

export const SettingsMenu = ({ onChange }: { onChange?: () => void }) => {
    const { currentView, setCurrentView } = useSettingsStore()

    const handleSelect = (value: View) => {
        setCurrentView(value)
        onChange?.()
    }

    return (
        <div className="flex h-full flex-col justify-between">
            <ScrollBar className="h-full overflow-y-auto">
                <Menu className="mx-2 mb-10">
                    {menuList.map((menu) => (
                        <MenuItem
                            key={menu.value}
                            eventKey={menu.value}
                            className={`mb-2 ${
                                currentView === menu.value
                                    ? 'bg-gray-100 dark:bg-gray-700'
                                    : ''
                            }`}
                            isActive={currentView === menu.value}
                            onSelect={() => handleSelect(menu.value)}
                        >
                            <span className="text-2xl ltr:mr-2 rtl:ml-2">
                                {menu.icon}
                            </span>
                            <span>{menu.label}</span>
                        </MenuItem>
                    ))}
                </Menu>
            </ScrollBar>
        </div>
    )
}

export default SettingsMenu
