# Resume Interview App

A mobile-first, one-question-at-a-time interview for collecting resume information. Answers stay in the current browser until the user chooses to send them. No account or app install is needed.

## Local development

Requires Node 22 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Run `npm test`, `npm run typecheck`, and `npm run build` to verify the app. `npm run build` creates `dist/`.

## Email setup

Set `VITE_FORMSUBMIT_ENDPOINT` in `.env.local` and as a GitHub Actions repository **variable**. Use a FormSubmit AJAX endpoint such as `https://formsubmit.co/ajax/recipient@example.com` or its activated alias. The endpoint and recipient are public in frontend code; do not put private keys or SMTP credentials here. The app sends one readable message with every question and work-history entry. It treats only an HTTP success plus FormSubmit's `success` acknowledgment as a successful submission. An acknowledgment means the provider accepted the request, not that email arrived in the inbox. If the endpoint is missing, sending stays disabled through a clear error on the review screen.

Before sharing the link, make a test submission, follow FormSubmit's activation email, confirm the message arrived, and check spam filtering. FormSubmit may apply anti-abuse checks or CAPTCHA; test the actual published flow with the recipient endpoint. If the AJAX flow is blocked by those checks, choose a provider with a browser-compatible confirmed response or implement a provider-supported full-page flow before sharing. Do not assume unverified submissions are delivered. FormSubmit documents its [AJAX fetch endpoint](https://formsubmit.co/ajax-documentation), [activation](https://formsubmit.co/), and [spam guidance](https://formsubmit.co/help).

## GitHub Pages

Push to `main`. In repository Settings → Pages, choose **GitHub Actions** as the build and deployment source. Set the repository variable `VITE_FORMSUBMIT_ENDPOINT` before deploying. The workflow sets Vite's base path to `/<repository-name>/`, runs tests and build, then deploys `dist`. The app uses in-memory navigation, so refreshes always load the same page. The published link is HTTPS. For a custom domain or user site, adjust `VITE_BASE_PATH` in the workflow.

## Speech and privacy

The app tries `SpeechRecognition` or `webkitSpeechRecognition` when available. Browser support and permission behavior vary across iOS Safari versions; even a present constructor can fail. The standard textarea always works. On iPhone, tap the answer box and use the microphone on the Apple keyboard for dictation. The app never records or stores raw audio. Browser speech recognition may send speech to an external service. Answers are stored in localStorage on this device and browser, which Safari or the user can clear. Submission sends answers through FormSubmit. Do not include Social Security numbers, birth dates, addresses, or financial details.

## Manual testing

Use a physical iPhone with Safari before sharing the link. Open it from a text message; type and dictate with the Apple keyboard; try custom speech input for a long answer, stop it, deny permission, and interrupt it; switch between speaking and typing. Navigate back, refresh, close and reopen Safari, add and delete multiple jobs, review and edit, submit with unanswered questions, test a failed submission and retry, then confirm actual email receipt. Also check Android Chrome and desktop browsers, keyboard focus, 200% zoom, and large text. Physical-device testing has not been performed as part of this repository setup.
