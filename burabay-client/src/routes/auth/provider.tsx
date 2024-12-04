import { createFileRoute } from '@tanstack/react-router'
import { Login } from '../../pages/auth/Login'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/auth/provider')({
  component: () => {
    const { t } = useTranslation()
    return <Login role={t('providerRole')} />
  }
})