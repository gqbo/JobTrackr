import { APPLICATION_STATUSES } from '@/config/applicationStatuses'
import type { ApplicationStatus } from '@/types'

interface StatusBadgeProps { status: ApplicationStatus }

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, badgeBg, badgeText } = APPLICATION_STATUSES[status]
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
      style={{ backgroundColor: badgeBg, color: badgeText }}
    >
      {label}
    </span>
  )
}
