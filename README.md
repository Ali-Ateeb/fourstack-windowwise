# WindowWise

Find shared meeting windows for four teammates without uploading their schedules.

Created October 22, 2026 for NextSpark Hacks, during the October 21–27 build window. This is a separate new product, not a reuse of TraceTutor, LabLedger or a previous winning project.

Live app: https://ali-ateeb.github.io/fourstack-windowwise/
Source: https://github.com/Ali-Ateeb/fourstack-windowwise

## Run and verify

Serve this directory with `python -m http.server 8773 --bind 127.0.0.1` and open http://127.0.0.1:8773/ . No packages, accounts or API keys are required. With Node 18+: `node --test core.test.mjs`.

Enter four names, IANA time zones and weekly local availability, such as `Mon 18:00-21:00`. Choose a date, one to seven UTC days, and a 15–120 minute meeting length. The app finds all shared starts on a 15-minute grid, shows each person's local date/time, and downloads a UTC calendar event. The global example uses invented people and availability, not the FourStack members' actual schedules.

## What is implemented

- Strict weekday, hour, date, duration and timezone validation.
- Intersections across all four members for the whole real duration.
- Real UTC instants translated through the runtime's IANA timezone data, including DST gaps and repeats.
- No-conflict results, all-result expansion, stale-result invalidation on edits.
- UTC `.ics` export; the app never sends an invitation or books a calendar.
- JSON plan export with an explicit notice that it contains entered names and schedules.
- Keyboard-accessible forms, responsive layout, text-only rendering of user input.

## Limits and privacy

Only weekly recurring availability and 15-minute boundaries are supported. Split overnight availability at midnight. Searches cover complete UTC dates, so a person's local date range may differ. Timezone behavior depends on the browser's timezone database. No holidays, date-specific exceptions, calendar connections, fairness scoring or automatic attendance confirmation are implemented. Review local dates and confirm with teammates before relying on a plan.

Inputs are not uploaded or persisted by the app. Exported JSON contains your inputs; share it deliberately. Hosting providers still receive normal page requests. No analytics, external fonts or third-party JavaScript are used.

## AI assistance and attribution

Codex assisted with planning, implementation, tests, styling and documentation. There is no integrated AI model; schedule matching is deterministic. Personal team authorship and learning claims are not invented. Members must review and understand the code and describe their own actual contributions. Timezone formatting uses standard JavaScript `Intl.DateTimeFormat`; calendar output follows the basic RFC 5545 UTC event format. Original application code; MIT licensed.

## Demo and submission status

Unlisted 1:46 demo: https://youtu.be/jfM0npO_QQA

The video uses actual browser captures, invented schedules and synthetic Windows narration. Codex assisted with demo preparation. Local MP4, transcript and timed captions are in `media/`. The entire MP4 decodes without error; public YouTube playback was verified. Studio confirmed English captions published, though the public player initially reported them unavailable.

Submitted October 22, 2026. The existing Devpost entry contains with description, credits, source/app links, two screenshots and the published video saved. Ali Ateeb and Ali Zulfikar are joined. Anas and Obaidullah still need their own registrations and joins. Final agreement was accepted after explicit action-time confirmation. Deadline: October 27, 2026 at 08:00 Pakistan time. Every intended member should review the implementation and describe only their actual contributions.


Confirmed submitted entry: https://devpost.com/software/windowwise

Devpost confirmation: Project submitted! Edit deadline October 27, 2026 at 08:00 Pakistan time. Current joined team: Ali Ateeb and Ali Zulfikar. Anas and Obaidullah remain pending.
