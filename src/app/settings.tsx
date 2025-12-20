import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AccountSettings } from '@/components/settings/AccountSettings'
import { ConnectionsSettings } from '@/components/settings/ConnectionsSettings'
import { DataSettings } from '@/components/settings/DataSettings'
import { GeneralSettings } from '@/components/settings/GeneralSettings'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { SecuritySettings } from '@/components/settings/SecuritySettings'
import { type SettingSection, SettingsSidebar } from '@/components/settings/SettingsSidebar'
import { Toaster } from '@/components/ui/toaster'
import { useThemeStore } from '@/stores/themeStore'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  )
}

function SettingsPageContent() {
  const [activeSection, setActiveSection] = useState<SettingSection>('general')
  const { isDark, toggleDarkMode } = useThemeStore()
  const [siliconflowApiKey, setSiliconflowApiKey] = useState('')
  const [showSiliconflowApiKey, setShowSiliconflowApiKey] = useState(false)
  const [siliconflowApiKeySaved, setSiliconflowApiKeySaved] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    const savedKey = localStorage.getItem('siliconflow_api_key')
    if (savedKey) setSiliconflowApiKey(savedKey)

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }, [])

  const handleSaveSiliconflowApiKey = () => {
    if (siliconflowApiKey.trim()) {
      localStorage.setItem('siliconflow_api_key', siliconflowApiKey.trim())
      setSiliconflowApiKeySaved(true)
      setTimeout(() => setSiliconflowApiKeySaved(false), 2000)
    }
  }

  const handleClearSiliconflowApiKey = () => {
    setSiliconflowApiKey('')
    localStorage.removeItem('siliconflow_api_key')
  }

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked && typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      setNotificationsEnabled(permission === 'granted')
    } else {
      setNotificationsEnabled(false)
    }
  }

  const handleTestNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('测试通知', { body: '这是一条来自库无忧助手的测试通知消息 🎉' })
    }
  }

  const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window

  return (
    <div className="flex h-screen bg-background">
      <Toaster />
      <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">
          {activeSection === 'general' && (
            <GeneralSettings darkMode={isDark} onDarkModeToggle={toggleDarkMode} />
          )}
          {activeSection === 'notifications' && (
            <NotificationSettings
              isSupported={isNotificationSupported}
              permission={notificationPermission}
              notificationsEnabled={notificationsEnabled}
              onNotificationToggle={handleNotificationToggle}
              onTestNotification={handleTestNotification}
            />
          )}
          {activeSection === 'connections' && (
            <ConnectionsSettings
              siliconflowApiKey={siliconflowApiKey}
              showSiliconflowApiKey={showSiliconflowApiKey}
              siliconflowApiKeySaved={siliconflowApiKeySaved}
              onSiliconflowApiKeyChange={setSiliconflowApiKey}
              onToggleShowSiliconflowApiKey={() => setShowSiliconflowApiKey(!showSiliconflowApiKey)}
              onSaveSiliconflowApiKey={handleSaveSiliconflowApiKey}
              onClearSiliconflowApiKey={handleClearSiliconflowApiKey}
            />
          )}
          {activeSection === 'data' && <DataSettings />}
          {activeSection === 'security' && <SecuritySettings />}
          {activeSection === 'account' && <AccountSettings />}
        </div>
      </div>
    </div>
  )
}
