import { APPLICATION_STATUSES } from '@/config/applicationStatuses'
import type { ApplicationStatus } from '@/types'

interface StatusPillarProps { status: ApplicationStatus }

export function StatusPillar({ status }: StatusPillarProps) {
  const { pillarColor } = APPLICATION_STATUSES[status]
  return <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: pillarColor }} />
}
