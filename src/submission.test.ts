import { expect, test } from 'vitest'
import { initial } from './model'
import { emailDraft } from './submission'

test('email draft leaves recipient blank and includes answers', () => {
  const data = initial()
  data.answers.target = 'Receptionist'
  const draft = emailDraft(data)
  expect(draft.url).toMatch(/^mailto:\?subject=/)
  expect(draft.url).toContain('Receptionist')
  expect(draft.needsPaste).toBe(false)
})

test('long answers are never truncated', () => {
  const data = initial()
  data.answers.target = 'A'.repeat(10000)
  const draft = emailDraft(data)
  expect(draft.needsPaste).toBe(true)
  expect(draft.url).not.toContain('AAAA')
  expect(draft.body).toContain('A'.repeat(10000))
})
