export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const STEP = 15 * 60_000;
const formatters = new Map();
export function localParts(time, zone) {
  if (!formatters.has(zone)) formatters.set(zone, new Intl.DateTimeFormat('en-GB', {
    timeZone:zone, weekday:'short', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'
  }));
  const p = Object.fromEntries(formatters.get(zone).formatToParts(new Date(time)).map(x=>[x.type,x.value]));
  return {day:p.weekday, minute:Number(p.hour)*60+Number(p.minute), date:`${p.year}-${p.month}-${p.day}`, time:`${p.hour}:${p.minute}`};
}
function minute(value, end=false) {
  if (!/^\d{2}:\d{2}$/.test(value)) throw Error('Use HH:MM with two digits.');
  const [h,m]=value.split(':').map(Number);
  if (m>59 || h>23 && !(end && h===24 && m===0) || m%15) throw Error('Times must use 15-minute steps; 24:00 is allowed only as an end.');
  return h*60+m;
}
export function parseAvailability(text) {
  if (typeof text!=='string' || text.length>3000) throw Error('Availability is missing or too long.');
  const out=[];
  for (const raw of text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean)) {
    const m=raw.match(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
    if (!m) throw Error(`Invalid line: ${raw.slice(0,65)}. Use Mon 18:00-21:00.`);
    const start=minute(m[2]),end=minute(m[3],true);
    if (end<=start) throw Error('Each end must follow its start. Split overnight availability across two days.');
    out.push({day:m[1],start,end});
  }
  if (!out.length || out.length>28) throw Error('Enter between 1 and 28 availability lines.');
  return out;
}
export function utcDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw Error('Choose a real start date.');
  const n=Date.parse(value+'T00:00:00Z');
  if (!Number.isFinite(n) || new Date(n).toISOString().slice(0,10)!==value || Number(value.slice(0,4))<2020 || Number(value.slice(0,4))>2100) throw Error('Choose a real date from 2020 through 2100.');
  return n;
}
export function findWindows(members,{date,days=7,duration=60}) {
  const start=utcDate(date);
  if (!Number.isInteger(days)||days<1||days>7) throw Error('Search from one to seven UTC days.');
  if (!Number.isInteger(duration)||duration<15||duration>120||duration%15) throw Error('Meeting length must be 15–120 minutes in 15-minute steps.');
  if (!Array.isArray(members)||members.length!==4) throw Error('Provide exactly four teammates.');
  const people=members.map((m,i)=>{
    if (!m.name?.trim() || m.name.length>60) throw Error(`Teammate ${i+1} needs a name of at most 60 characters.`);
    try {localParts(start,m.zone);} catch {throw Error(`${m.name}: choose a valid IANA time zone.`);}
    try {return {...m,name:m.name.trim(),windows:parseAvailability(m.availability)};} catch(e) {throw Error(`${m.name}: ${e.message}`);}
  });
  const end=start+days*86_400_000, results=[];
  // Evaluate real UTC instants, then translate each slice into local wall time.
  // DST repeats remain distinct instants; skipped local times never appear.
  for (let t=start;t+duration*60_000<=end;t+=STEP) {
    const fits=people.every(p=>{
      for (let offset=0;offset<duration;offset+=15) {
        const local=localParts(t+offset*60_000,p.zone);
        if (!p.windows.some(w=>w.day===local.day && local.minute>=w.start && local.minute+15<=w.end)) return false;
      }
      return true;
    });
    if (fits) results.push({start:new Date(t).toISOString(),end:new Date(t+duration*60_000).toISOString(),
      local:people.map(p=>({name:p.name,zone:p.zone,start:localParts(t,p.zone),end:localParts(t+duration*60_000,p.zone)}))});
  }
  return results;
}
const compact = time => new Date(time).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
const escapeICS = text => String(text).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
export function calendarInvite(window,{now=new Date().toISOString(),title='Team focus session'}={}) {
  const start=Date.parse(window.start),end=Date.parse(window.end);
  if (!Number.isFinite(start)||!Number.isFinite(end)||end<=start) throw Error('Choose a valid meeting window.');
  if (title.length>100 || /[^\x20-\x7e]/.test(title)) throw Error('Calendar title must be short printable ASCII.');
  const summary='SUMMARY:'+escapeICS(title);
  const folded=summary.match(/.{1,70}/g).join('\r\n ');
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//FourStack//WindowWise//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
    `UID:${compact(start)}-${compact(end)}@windowwise.local`,`DTSTAMP:${compact(now)}`,`DTSTART:${compact(start)}`,`DTEND:${compact(end)}`,folded,
    'DESCRIPTION:Confirm availability with everyone before attending.','END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
