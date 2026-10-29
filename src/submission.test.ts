import { expect, test, vi } from 'vitest'
import { initial } from './model'
import { submitAnswers } from './submission'
const endpoint = 'https://formsubmit.co/ajax/test@example.com'
test('accepted response succeeds', async () => { const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: 'true' }) }); await submitAnswers(initial(), endpoint, fetcher); expect(fetcher).toHaveBeenCalledOnce() })
test('unacknowledged response fails and can be retried', async () => { const fetcher = vi.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }); await expect(submitAnswers(initial(), endpoint, fetcher)).rejects.toThrow(); await expect(submitAnswers(initial(), endpoint, fetcher)).resolves.toBeUndefined() })
