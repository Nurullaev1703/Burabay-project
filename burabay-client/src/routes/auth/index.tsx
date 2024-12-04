import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({
  component: () => {},
  // заголовок для Header
  staticData: {
    title: "Добро пожаловать"
  }
})