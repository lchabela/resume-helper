import { formatAnswers, type Interview } from './model'

const MAX_MAILTO_LENGTH = 8000

export function emailDraft(data: Interview): { url: string; needsPaste: boolean; body: string } {
  const body = formatAnswers(data)
  const subject = encodeURIComponent('Resume interview answers')
  const fullUrl = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`
  return {
    url: fullUrl.length <= MAX_MAILTO_LENGTH ? fullUrl : `mailto:?subject=${subject}`,
    needsPaste: fullUrl.length > MAX_MAILTO_LENGTH,
    body,
  }
}
