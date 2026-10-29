import { beforeEach, expect, test } from 'vitest'
import { appendSpeech } from './speech'
import { formatAnswers, initial, key, load, next, previous, save } from './model'
const memory = new Map<string, string>()
Object.defineProperty(globalThis, 'localStorage', { value: { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => memory.set(k, v), clear: () => memory.clear() }, configurable: true })
beforeEach(() => localStorage.clear())
test('navigation moves through sections and job questions', () => { const first = initial().step; expect(next(first)).toEqual({ kind: 'question', section: 0, question: 'interest' }); const jobs = next(next(next(first))); expect(jobs).toEqual({ kind: 'jobs' }); expect(previous(jobs, [])).toEqual({ kind: 'question', section: 0, question: 'description' }) })
test('saved answers and jobs restore; malformed storage is ignored', () => { const data = initial(); data.answers.target = 'Nurse'; data.jobs.push({ id: 'job-1', answers: { employer: 'Clinic' } }); data.step = { kind: 'job', jobId: 'job-1', question: 'title' }; expect(save(data)).toBe(true); expect(load()).toEqual(data); localStorage.setItem(key, '{broken'); expect(load()).toBeNull() })
test('speech appends without discarding typed text', () => expect(appendSpeech('Typed first.', 'Spoken next.')).toBe('Typed first. Spoken next.'))
test('submission text includes unanswered questions and every job', () => { const data = initial(); data.jobs = [{ id: 'a', answers: { employer: 'A' } }, { id: 'b', answers: { employer: 'B' } }]; const text = formatAnswers(data); expect(text).toContain('Job 1: A'); expect(text).toContain('Job 2: B'); expect(text).toContain('(No answer)') })
