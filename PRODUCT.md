# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: software engineering recruiters and hiring managers screening candidates
for internships and new-grad roles. They arrive from a resume link, LinkedIn, or a
GitHub profile, usually mid-triage across many candidates, and decide within
seconds whether to keep reading. They skim before they read.

Secondary (not a design driver): peers, collaborators, and anyone Max points here
when asked what he does.

## Product Purpose

A personal portfolio for Max Bader, a Computer Science student at UC Irvine. Its
job is recall: a recruiter should leave remembering him specifically, not just
having read a list of facts. There is no conversion funnel — no form, no signup,
no primary CTA to optimize. Success is being memorable and instantly legible at
skim speed, in that order of difficulty and in the reverse order of urgency.

## Positioning

The thing a neighboring student portfolio cannot truthfully copy is the range:
six real roles inside roughly eighteen months, spanning frontend product work,
AI/ML research, and LLM evaluation, plus a first-author paper. Breadth backed by
shipped work is the claim. Content emphasis follows: experience leads, projects
and research support it.

## Operating Context

- Read on desktop and phone, often in a burst of tabs during candidate triage.
- Frequently reached from a PDF resume link, so the site is the second impression
  and should not merely restate the first.
- Evaluated by people who read a lot of student portfolios and have seen every
  template.

## Capabilities and Constraints

- React 19 + Vite 7, plain CSS (no framework or CSS-in-JS), deployed as a static
  build. No backend, no CMS, no analytics.
- Content lives in `src/data/` — `experience.js`, `projects.js`, `socialLinks.js`.
- Icons from Font Awesome; type from Google Fonts.
- Existing behavior to preserve: Cmd/Ctrl+K command palette, light/dark theme,
  swappable accent colors (five hues plus a theme-aware mono), and an ambient
  particle canvas. All persist to localStorage.
- Reduced motion must be honored throughout.
- Verification constraint: the development preview browser reports
  `visibilityState: hidden` and never fires `requestAnimationFrame`, so motion
  cannot be watched playing. It must be verified by seeking a timeline's clock
  and capturing keyframes.

## Brand Commitments

Name: Max Bader. Voice is plain and unembellished — first person, no superlatives,
no "passionate about" register. Existing identity leans developer/terminal
(monospace accents, a shell prompt motif). None of that is contractually binding
except the name and the plain voice.

## Evidence on Hand

- Six roles with real dates, descriptions, and tech lists in `src/data/experience.js`:
  CodeHS (SWE Intern, 6/26–present), YesMedia (SWE Intern, 10/25–6/26),
  Handshake AI (AI Trainer, 10/25–5/26), DapLab (Software Developer Research
  Assistant, 9/25–6/26), Boundary Remote Subsurface Solutions (Software & AI
  Developer, 5/25–12/25), Algoverse (AI Research, 3/25–7/25).
- Four projects with real screenshots in `public/`: TradeStreet, AskHer, Zotify,
  WakeUp.
- CoVeGAT, a first-author claim-verification paper, at `public/CoVeGAT (6).pdf`.
  Reported result: 96% detection accuracy on adversarial fabrications.
- Resume PDF at `public/MaxBaderResume copy.pdf`; portrait at `public/IMG_5553 copy.png`.
- Contact: mibader@uci.edu, github.com/max-bader, linkedin.com/in/max-bader.

Known gaps future work must not paper over with invention:
- The CodeHS entry has an empty description and tech list; real accomplishments
  land around September 2026.
- Every `liveUrl` in `projects.js` is empty — nothing is deployed yet, so no live
  demo may be implied.
- TradeStreet's repo belongs to a teammate (`tobinsia123/TradeStreet`), not Max.
- No testimonials, metrics, press, or employer endorsements exist.

## Product Principles

1. **Legible at skim speed, memorable on reflection.** A recruiter scanning for
   ten seconds must extract the shape of Max's experience. Distinctiveness may
   never cost that.
2. **Range is the argument.** Six roles across product and research is the fact
   that separates him. Structure should make the breadth visible at a glance,
   not require reading six paragraphs to infer.
3. **Show, don't assert.** Screenshots, a real paper, and dated roles carry the
   claim. No adjectives doing work evidence should do.
4. **The craft is part of the evidence.** For a software candidate, a site that
   is fast, precise, and well-built is itself a work sample. Sloppiness reads as
   a negative signal in a way it would not on a non-engineer's site.
5. **No invented proof.** Absent deployments, metrics, and endorsements stay
   absent.

## Accessibility & Inclusion

No user-specific requirement established beyond standard practice: honor
`prefers-reduced-motion`, keep keyboard navigation working (the palette is
keyboard-first), and maintain readable contrast in both themes.
