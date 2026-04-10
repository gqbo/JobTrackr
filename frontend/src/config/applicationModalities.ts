import type { ApplicationModality } from '@/types'

export const MODALITY_LABELS: Record<ApplicationModality, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  on_site: 'On-site',
}

export const MODALITY_OPTIONS = [
  { value: 'remote' as ApplicationModality, label: 'Remote' },
  { value: 'hybrid' as ApplicationModality, label: 'Hybrid' },
  { value: 'on_site' as ApplicationModality, label: 'On-site' },
] as const
