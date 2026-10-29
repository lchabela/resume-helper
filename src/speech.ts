import { useEffect, useRef, useState } from 'react'
type Result = { isFinal: boolean; [index: number]: { transcript: string } }
type Event = { resultIndex: number; results: ArrayLike<Result> }
type Recognition = { continuous: boolean; interimResults: boolean; lang: string; onresult: ((event: Event) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; stop: () => void }
type Constructor = new () => Recognition
declare global { interface Window { SpeechRecognition?: Constructor; webkitSpeechRecognition?: Constructor } }
const friendlyError = (error: string) => error === 'not-allowed' || error === 'service-not-allowed' ? 'Microphone access was not allowed. You can use your iPhone keyboard microphone or type instead.' : error === 'no-speech' ? 'I couldn’t hear anything. That’s okay! You can try talking again or type your answer instead.' : error === 'network' ? 'Talking is unavailable right now. Please try again or use your keyboard microphone.' : 'Talking stopped unexpectedly. Your words are saved; you can try again.'
export function appendSpeech(existing: string, spoken: string): string { const trimmed = spoken.trim(); return trimmed ? `${existing.trimEnd()}${existing.trim() ? ' ' : ''}${trimmed}` : existing }
export function useSpeech(onFinal: (text: string) => void) {
  const ctor = typeof window === 'undefined' ? undefined : window.SpeechRecognition || window.webkitSpeechRecognition
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [status, setStatus] = useState('')
  const [fallback, setFallback] = useState(!ctor)
  const recognition = useRef<Recognition | null>(null)
  const finalCallback = useRef(onFinal)
  finalCallback.current = onFinal
  useEffect(() => () => { if (recognition.current) { recognition.current.onend = null; recognition.current.stop() } }, [])
  function stop() { recognition.current?.stop(); setListening(false); setInterim(''); setStatus('Stopped listening. You can start talking again whenever you’re ready.') }
  function start() {
    if (!ctor) { setFallback(true); return }
    try {
      const r = new ctor(); recognition.current = r; r.continuous = true; r.interimResults = true; r.lang = 'en-US'
      let finalized = new Set<number>()
      r.onresult = event => {
        let preview = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i], words = result[0]?.transcript || ''
          if (result.isFinal && !finalized.has(i)) { finalized.add(i); finalCallback.current(words) }
          else if (!result.isFinal) preview += words
        }
        setInterim(preview)
      }
      r.onerror = event => { setStatus(friendlyError(event.error)); setFallback(true); setInterim(''); setListening(false) }
      r.onend = () => { setListening(false); setInterim(''); setStatus(current => current && current !== 'Listening… Go ahead and talk.' ? current : 'Stopped listening. You can start talking again whenever you’re ready.'); recognition.current = null }
      r.start(); setListening(true); setStatus('Listening… Go ahead and talk.'); setInterim(''); finalized = new Set<number>()
    } catch { setFallback(true); setListening(false); setStatus('Talking is unavailable here. You can use your keyboard microphone or type instead.') }
  }
  return { listening, interim, status, fallback, start, stop }
}
