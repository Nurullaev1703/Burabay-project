import { createFileRoute } from '@tanstack/react-router'
import { MapNav } from '../../pages/mapNav/MapNav'

export const Route = createFileRoute('/mapNav/')({
  component: MapNav,
})

