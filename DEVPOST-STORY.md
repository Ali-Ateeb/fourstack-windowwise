## Inspiration

Four student teammates can be free on the same weekday and still have no shared hour. Timezone conversions, local midnight and daylight-saving changes make the search harder. WindowWise makes that shared window visible without asking people to upload a calendar.

## What it does

Enter weekly local availability for four people, each with an IANA time zone. Choose a real date, a one-to-seven-day search horizon and a 15–120 minute session. WindowWise finds all shared starts on a 15-minute grid and shows the local day, date and time for everyone. Download a UTC calendar event or a JSON plan containing the entered schedules. Nothing is sent to another person or booked automatically.

The global example contains invented names and availability, not the real FourStack members' schedules.

## How it was built and AI assistance

This is a new October 22, 2026 NextSpark build using plain JavaScript, HTML and CSS. No code from TraceTutor, LabLedger, ReliefBoard or past winning projects was reused. Codex assisted with planning, implementation, styling, tests and documentation. There is no integrated AI model: matching is deterministic. Team members' actual personal contributions and learning experiences are not invented.

The matcher enumerates real UTC instants and translates each 15-minute slice to every participant's local weekly availability using JavaScript Intl.DateTimeFormat. This avoids constructing nonexistent spring-forward wall times and preserves distinct instants during a repeated fall-back hour. Every participant must be available throughout the session. Calendar events use UTC DTSTART/DTEND fields in a small RFC 5545 file.

## Challenges and verification

Checking just a meeting's start is insufficient: someone may become unavailable halfway through. The matcher checks the whole duration. Local weekdays can differ for the same UTC instant. Exports must become unavailable when the user changes a schedule, so old results cannot be silently reused.

Ten core tests pass, covering intersections, exact boundaries, multiple local dates, DST gaps/repeats, invalid inputs and calendar serialization. Actual browser checks found seven shared one-hour starts for the synthetic global example beginning October 22, including the London DST change. Both the calendar file and JSON plan were downloaded and inspected. Editing invalidates results; conflicting schedules show no overlap; an invalid time zone produces a readable error.

## Privacy and limits

Inputs are not uploaded or persisted by the app. JSON exports contain names, time zones and schedules, and should be shared deliberately. Hosting still involves ordinary page requests. Calendar export creates a file without sending invitations or confirming attendance.

The prototype supports four people, weekly recurring hours, 15-minute boundaries and searches of up to seven UTC days. Overnight windows must be split at midnight. It does not read real calendars, handle holidays/date exceptions, rank fairness, or prove anyone will attend. Timezone behavior depends on the runtime's timezone database. Users should check local dates and confirm with teammates.

## What's next

Future work could add date-specific exceptions, optional fairness scoring and consent-based calendar integrations. Those features are not implemented.


## Demo production

The 1:46 demonstration is an edited walkthrough of actual browser captures using invented people and schedules, with synthetic Windows text-to-speech narration. Codex assisted with demo preparation. It is not a continuous recording. Timed English captions accompany the video.
