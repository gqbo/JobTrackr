import type { ApplicationStatus } from '@/types'

export interface StatusConfig {
  value: ApplicationStatus
  label: string
  pillarColor: string
  badgeBg: string
  badgeText: string
  order: number
}

export const APPLICATION_STATUSES: Record<ApplicationStatus, StatusConfig> = {
  bookmarked:   { value: 'bookmarked',   label: 'Bookmarked',   pillarColor: '#b3b1b4', badgeBg: '#f0f0f0', badgeText: '#5f5f61', order: 1 },
  applied:      { value: 'applied',      label: 'Applied',      pillarColor: '#005ac2', badgeBg: '#d8e2ff', badgeText: '#004fab', order: 2 },
  interviewing: { value: 'interviewing', label: 'Interviewing',  pillarColor: '#d97706', badgeBg: '#fef3c7', badgeText: '#92400e', order: 3 },
  accepted:     { value: 'accepted',     label: 'Accepted',      pillarColor: '#16a34a', badgeBg: '#dcfce7', badgeText: '#166534', order: 4 },
  rejected:     { value: 'rejected',     label: 'Rejected',      pillarColor: '#ba1a1a', badgeBg: '#fde8e8', badgeText: '#ba1a1a', order: 5 },
  ghosted:      { value: 'ghosted',      label: 'Ghosted',       pillarColor: '#6b7280', badgeBg: '#f3f4f6', badgeText: '#374151', order: 6 },
}

export const ORDERED_STATUSES: StatusConfig[] = Object.values(APPLICATION_STATUSES).sort((a, b) => a.order - b.order)
