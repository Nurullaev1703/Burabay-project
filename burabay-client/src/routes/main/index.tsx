import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../pages/main/Main'

export const Route = createFileRoute('/main/')({
  component: Main,
})


