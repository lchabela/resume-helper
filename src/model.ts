export type Question = { id: string; title: string; help?: string }
export type Job = { id: string; answers: Record<string, string> }
export type Step = { kind: 'question'; section: 0 | 2 | 3; question: string } | { kind: 'job'; jobId: string; question: string } | { kind: 'jobs' } | { kind: 'review' }
export type Interview = { version: 1; answers: Record<string, string>; jobs: Job[]; step: Step; submitted: boolean }
export const sections = ['The Job You Want', 'Your Work History', 'Your Skills and Experience', 'Education and Final Details'] as const
export const questions: Record<0 | 2 | 3, Question[]> = {
  0: [
    { id: 'target', title: 'What job are you applying for?', help: 'If you know the job title or company name, tell me here.' },
    { id: 'interest', title: 'Why are you interested in this job?', help: 'What sounds interesting about the position? What makes you think you’d enjoy doing it?' },
    { id: 'description', title: 'Do you have the job description?', help: 'If you have information about the job, you can put it here. It’s okay to skip this.' },
  ],
  2: [
    { id: 'skills', title: 'What are some things you’re really good at?', help: 'Think about things you’ve learned from working, helping people, or managing responsibilities.' },
    { id: 'equipment', title: 'What computer programs, machines, or equipment have you used?', help: 'Even everyday programs or equipment are worth mentioning.' },
    { id: 'training', title: 'Have you ever trained, supervised, or helped other employees?' },
    { id: 'reputation', title: 'What would your previous coworkers or bosses say you’re good at?' },
    { id: 'achievement', title: 'What’s something you’ve accomplished at work that you’re proud of?', help: 'It doesn’t have to be an award. Maybe you solved a difficult problem, helped someone, or became the person everyone relied on.' },
  ],
  3: [
    { id: 'school', title: 'What school did you attend?', help: 'You can include high school, college, or other education. Mention whether you graduated if you remember.' },
    { id: 'certifications', title: 'Have you completed any special training or earned certifications?' },
    { id: 'awards', title: 'Have you ever received recognition or awards for your work?' },
    { id: 'other', title: 'Is there anything else you’d like me to know?', help: 'Anything you think might help with your resume is worth sharing.' },
  ],
}
export const jobQuestions: Question[] = [
  { id: 'employer', title: 'Where did you work?' },
  { id: 'title', title: 'What was your job title?', help: 'If you don’t remember the exact title, just describe your position.' },
  { id: 'dates', title: 'About when did you work there?', help: 'Approximate years are perfectly fine.' },
  { id: 'duties', title: 'What did you do at this job?', help: 'Think about your normal workday. What were your responsibilities? Who did you help? What kinds of tasks did you handle?' },
  { id: 'strength', title: 'What were you especially good at?', help: 'What did your boss or coworkers count on you for?' },
  { id: 'special', title: 'Did you have any special responsibilities?', help: 'For example, training employees, managing schedules, supervising people, handling money, or solving problems.' },
]
export const initial = (): Interview => ({ version: 1, answers: {}, jobs: [], step: { kind: 'question', section: 0, question: 'target' }, submitted: false })
export const key = 'resume-interview-v1'
export function validStep(step: unknown, jobs: Job[]): step is Step {
  if (!step || typeof step !== 'object') return false
  const s = step as Partial<Step>
  if (s.kind === 'jobs' || s.kind === 'review') return true
  if (s.kind === 'job') return jobs.some(j => j.id === s.jobId) && jobQuestions.some(q => q.id === s.question)
  return s.kind === 'question' && (s.section === 0 || s.section === 2 || s.section === 3) && questions[s.section].some(q => q.id === s.question)
}
export function load(): Interview | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    const d = data as Partial<Interview>
    if (d.version !== 1 || !d.answers || typeof d.answers !== 'object' || Array.isArray(d.answers) || !Object.values(d.answers).every(v => typeof v === 'string') || !Array.isArray(d.jobs)) return null
    if (!d.jobs.every(j => j && typeof j.id === 'string' && j.answers && typeof j.answers === 'object' && !Array.isArray(j.answers) && Object.values(j.answers).every(v => typeof v === 'string'))) return null
    if (!validStep(d.step, d.jobs)) return null
    return { version: 1, answers: d.answers, jobs: d.jobs, step: d.step, submitted: d.submitted === true }
  } catch { return null }
}
export function save(data: Interview): boolean { try { localStorage.setItem(key, JSON.stringify(data)); return true } catch { return false } }
export function next(step: Step): Step {
  if (step.kind === 'review') return step
  if (step.kind === 'jobs') return { kind: 'question', section: 2, question: 'skills' }
  if (step.kind === 'job') { const i = jobQuestions.findIndex(q => q.id === step.question); return i < jobQuestions.length - 1 ? { ...step, question: jobQuestions[i + 1].id } : { kind: 'jobs' } }
  const list = questions[step.section], i = list.findIndex(q => q.id === step.question)
  if (i < list.length - 1) return { ...step, question: list[i + 1].id }
  return step.section === 0 ? { kind: 'jobs' } : step.section === 2 ? { kind: 'question', section: 3, question: 'school' } : { kind: 'review' }
}
export function previous(step: Step, jobs: Job[]): Step | null {
  if (step.kind === 'review') return { kind: 'question', section: 3, question: 'other' }
  if (step.kind === 'jobs') return jobs.length ? { kind: 'job', jobId: jobs[jobs.length - 1].id, question: 'special' } : { kind: 'question', section: 0, question: 'description' }
  if (step.kind === 'job') { const i = jobQuestions.findIndex(q => q.id === step.question); return i ? { ...step, question: jobQuestions[i - 1].id } : { kind: 'jobs' } }
  const list = questions[step.section], i = list.findIndex(q => q.id === step.question)
  if (i) return { ...step, question: list[i - 1].id }
  return step.section === 2 ? { kind: 'jobs' } : step.section === 3 ? { kind: 'question', section: 2, question: 'achievement' } : null
}
export function formatAnswers(data: Interview): string {
  const lines: string[] = []
  for (const section of [0, 2, 3] as const) {
    lines.push(sections[section].toUpperCase())
    for (const q of questions[section]) lines.push(`${q.title}\n${data.answers[q.id]?.trim() || '(No answer)'}`)
    lines.push('')
    if (section === 0) { lines.push('YOUR WORK HISTORY'); data.jobs.forEach((job, i) => { lines.push(`Job ${i + 1}: ${job.answers.employer || '(Employer not given)'}`); for (const q of jobQuestions) lines.push(`${q.title}\n${job.answers[q.id]?.trim() || '(No answer)'}`); lines.push('') }) }
  }
  return lines.join('\n\n')
}
