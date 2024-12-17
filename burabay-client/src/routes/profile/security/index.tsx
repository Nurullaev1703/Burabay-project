import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '../../../pages/security-settings/SettingsPage'

export const Route = createFileRoute('/profile/security/')({
  component: SettingsPage,
})
