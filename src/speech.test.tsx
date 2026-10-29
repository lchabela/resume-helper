import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { useSpeech } from './speech'
type MockEvent = { resultIndex: number; results: ArrayLike<{ isFinal: boolean; [index: number]: { transcript: string } }> }
class MockRecognition {
  continuous = false; interimResults = false; lang = ''
  onresult: ((event: MockEvent) => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
  onend: (() => void) | null = null
  start = vi.fn(); stop = vi.fn(() => this.onend?.())
  constructor() { latest = this }
}
let latest: MockRecognition
afterEach(() => { delete window.SpeechRecognition })
test('unsupported recognition offers keyboard dictation', () => { delete window.SpeechRecognition; const { result } = renderHook(() => useSpeech(vi.fn())); expect(result.current.fallback).toBe(true) })
test('speech final results accumulate once and end updates state', () => { window.SpeechRecognition = MockRecognition; const onFinal = vi.fn(); const { result } = renderHook(() => useSpeech(onFinal)); act(() => result.current.start()); expect(result.current.listening).toBe(true); act(() => latest.onresult?.({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: 'Hello.' } }] })); act(() => latest.onresult?.({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: 'Hello.' } }] })); expect(onFinal).toHaveBeenCalledTimes(1); act(() => latest.onend?.()); expect(result.current.listening).toBe(false) })
test('permission failure shows understandable fallback', () => { window.SpeechRecognition = MockRecognition; const { result } = renderHook(() => useSpeech(vi.fn())); act(() => result.current.start()); act(() => latest.onerror?.({ error: 'not-allowed' })); expect(result.current.fallback).toBe(true); expect(result.current.status).toContain('Microphone access') })
