import { validatePhone, formatPhoneWithCountry } from '../utils/phoneUtils'

describe('Phone Validation', () => {
  describe('validatePhone', () => {
    it('returns true for valid phone numbers', () => {
      expect(validatePhone('700000000', 'TZ')).toBe(true)
      expect(validatePhone('9012345678', 'JP')).toBe(true)
      expect(validatePhone('4155551234', 'US')).toBe(true)
      expect(validatePhone('712345678', 'KE')).toBe(true)
    })

    it('returns false for invalid phone numbers', () => {
      expect(validatePhone('123', 'US')).toBe(false)
      expect(validatePhone('', 'TZ')).toBe(true) // empty is optional
    })

    it('rejects non-numeric characters', () => {
      expect(validatePhone('abc', 'TZ')).toBe(false)
    })

    it('rejects too short numbers', () => {
      expect(validatePhone('123456', 'TZ')).toBe(false)
    })
  })

  describe('formatPhoneWithCountry', () => {
    it('adds country code when missing', () => {
      expect(formatPhoneWithCountry('700000000', 'TZ')).toBe('+255700000000')
      expect(formatPhoneWithCountry('9012345678', 'JP')).toBe('+819012345678')
      expect(formatPhoneWithCountry('4155551234', 'US')).toBe('+14155551234')
    })

    it('does not double-add if already has +', () => {
      expect(formatPhoneWithCountry('+255700000000', 'TZ')).toBe('+255700000000')
    })

    it('strips leading zeros', () => {
      expect(formatPhoneWithCountry('0700000000', 'TZ')).toBe('+255700000000')
    })
  })
})
