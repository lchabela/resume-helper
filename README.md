# Resume Interview App

A mobile-first, one-question-at-a-time interview for collecting resume information. Answers stay in the current browser until the user opens an email draft. No account or app install is needed.

## Local development

Requires Node 22 or newer.

```sh
npm ci
npm start
```

Open the URL printed by Vite. `npm run dev` also starts the development server. Run `npm test`, `npm run typecheck`, and `npm run build` to verify the app. `npm run build` creates `dist/`.

## Sending answers

On the review screen, **Open Email Draft** opens the device's email app through a `mailto:` link. The To field is deliberately empty; the user adds the family member's email address and taps Send in the email app. The website cannot confirm that the email app opened or that the message was sent. It never claims delivery and keeps answers saved locally.

Email links have practical length limits that vary by device and email app. For long interviews, the app first provides a **Copy My Answers** button and selectable text, then opens a draft without the body. The user must paste those answers into the email before sending. Test this flow on the intended iPhone and email app before sharing the link.

## GitHub Pages

Push to `main`. In repository Settings → Pages, choose **GitHub Actions** as the build and deployment source. The workflow sets Vite's base path to `/<repository-name>/`, runs tests and build, then deploys `dist`. The app uses in-memory navigation, so refreshes load the same page. The published link is HTTPS. For a custom domain or user site, adjust `VITE_BASE_PATH` in the workflow.

## Speech and privacy

The app tries `SpeechRecognition` or `webkitSpeechRecognition` when available. Browser support and permission behavior vary across iOS Safari versions; even a present constructor can fail. The standard textarea always works. On iPhone, tap the answer box and use the microphone on the Apple keyboard for dictation. The app never records or stores raw audio. Browser speech recognition may send speech to an external service. Answers are stored in localStorage on this device and browser, which Safari or the user can clear. No answers are sent to a service by the website. The chosen email app sends the email when the user taps Send. Do not include Social Security numbers, birth dates, addresses, or financial details.

## Manual testing

Use a physical iPhone with Safari before sharing the link. Open it from a text message; type and dictate with the Apple keyboard; try custom speech input for a long answer, stop it, deny permission, and interrupt it; switch between speaking and typing. Navigate back, refresh, close and reopen Safari, add and delete multiple jobs, review and edit, open a draft with unanswered questions, test a long answer and copy/paste fallback, and confirm actual email receipt. Also check Android Chrome and desktop browsers, keyboard focus, 200% zoom, and large text. Physical-device testing has not been performed as part of this repository setup.
