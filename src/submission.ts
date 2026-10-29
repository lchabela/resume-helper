import { formatAnswers, type Interview } from './model'
export async function submitAnswers(data: Interview, endpoint: string, fetcher: typeof fetch = fetch): Promise<void> {
  if (!/^https:\/\/formsubmit\.co\/ajax\/[A-Za-z0-9@._+-]+$/.test(endpoint)) throw new Error('Email sending is not set up yet. Please ask your family member for help.')
  const response = await fetcher(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ _subject: 'Resume interview answers', message: formatAnswers(data) }) })
  if (!response.ok) throw new Error('Your answers could not be sent. Please try again.')
  const result: unknown = await response.json()
  if (!result || typeof result !== 'object' || !('success' in result) || (result as { success: unknown }).success !== 'true' && (result as { success: unknown }).success !== true) throw new Error('Your answers could not be confirmed as sent. Please try again.')
}
