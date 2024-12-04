import { createFileRoute } from '@tanstack/react-router'
import { WelcomePage } from '../../pages/auth/WelcomePage'

export const Route = createFileRoute('/auth/')({
  component: WelcomePage,
  // заголовок для Header
  staticData: {
    title: "Добро пожаловать"
  }
})