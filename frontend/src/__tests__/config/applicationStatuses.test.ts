import { describe, it, expect } from 'vitest'
import { APPLICATION_STATUSES, ORDERED_STATUSES } from '@/config/applicationStatuses'

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/
const STATUS_KEYS = ['bookmarked', 'applied', 'interviewing', 'accepted', 'rejected', 'ghosted'] as const

describe('APPLICATION_STATUSES', () => {
  it('contains exactly 6 statuses', () => {
    expect(Object.keys(APPLICATION_STATUSES)).toHaveLength(6)
  })

  it('includes all required status keys', () => {
    STATUS_KEYS.forEach(key => {
      expect(APPLICATION_STATUSES).toHaveProperty(key)
    })
  })

  it('each entry has value matching its key', () => {
    STATUS_KEYS.forEach(key => {
      expect(APPLICATION_STATUSES[key].value).toBe(key)
    })
  })

  it('each entry has a non-empty label string', () => {
    STATUS_KEYS.forEach(key => {
      expect(typeof APPLICATION_STATUSES[key].label).toBe('string')
      expect(APPLICATION_STATUSES[key].label.length).toBeGreaterThan(0)
    })
  })

  it('each pillarColor is a valid 6-digit hex', () => {
    STATUS_KEYS.forEach(key => {
      expect(APPLICATION_STATUSES[key].pillarColor).toMatch(HEX_REGEX)
    })
  })

  it('each badgeBg is a valid 6-digit hex', () => {
    STATUS_KEYS.forEach(key => {
      expect(APPLICATION_STATUSES[key].badgeBg).toMatch(HEX_REGEX)
    })
  })

  it('each badgeText is a valid 6-digit hex', () => {
    STATUS_KEYS.forEach(key => {
      expect(APPLICATION_STATUSES[key].badgeText).toMatch(HEX_REGEX)
    })
  })

  it('each order is a positive integer', () => {
    STATUS_KEYS.forEach(key => {
      const { order } = APPLICATION_STATUSES[key]
      expect(Number.isInteger(order)).toBe(true)
      expect(order).toBeGreaterThan(0)
    })
  })

  it('order values are unique across all statuses', () => {
    const orders = STATUS_KEYS.map(k => APPLICATION_STATUSES[k].order)
    expect(new Set(orders).size).toBe(orders.length)
  })

  it('order values are sequential 1 through 6', () => {
    const orders = STATUS_KEYS.map(k => APPLICATION_STATUSES[k].order).sort((a, b) => a - b)
    expect(orders).toEqual([1, 2, 3, 4, 5, 6])
  })
})

describe('ORDERED_STATUSES', () => {
  it('has length 6', () => {
    expect(ORDERED_STATUSES).toHaveLength(6)
  })

  it('is sorted ascending by order', () => {
    for (let i = 1; i < ORDERED_STATUSES.length; i++) {
      expect(ORDERED_STATUSES[i].order).toBeGreaterThan(ORDERED_STATUSES[i - 1].order)
    }
  })
})
