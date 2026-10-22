import {findWindows,calendarInvite} from './core.js';
const $=s=>document.querySelector(s), form=$('#planner'), results=$('#results');
const zones=['Asia/Karachi','Europe/London','America/New_York','Asia/Singapore','Asia/Kolkata','Europe/Berlin','America/Los_Angeles','Australia/Sydney','UTC'];
let analysis=null,shown=12;
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const sample=[
 {name:'Ari',zone:'Asia/Karachi',availability:'Mon 18:00-21:00\nTue 18:00-21:00\nThu 18:00-21:00'},
 {name:'Bo',zone:'Europe/London',availability:'Mon 14:00-17:00\nTue 14:00-17:00\nThu 14:00-17:00'},
 {name:'Casey',zone:'America/New_York',availability:'Mon 09:00-12:00\nTue 09:00-12:00\nThu 09:00-12:00'},
 {name:'Dara',zone:'Asia/Singapore',availability:'Mon 21:00-23:00\nTue 21:00-23:00\nThu 21:00-23:00'}
];
$('#date').value=new Date().toISOString().slice(0,10);
function buildMembers(people){
 $('#members').replaceChildren();
 people.forEach((p,i)=>{
  const card=el('section',undefined,'person');card.append(el('div',`0${i+1}`,'number'));
  for(const [key,label,type] of [['name','Teammate name','input'],['zone','Time zone','input'],['availability','Weekly availability','textarea']]){
   const id=`${key}-${i}`,l=el('label',label);l.htmlFor=id;const field=el(type);field.id=id;field.name=key;field.value=p[key];field.required=true;
   if(key==='name')field.maxLength=60;
   if(key==='zone'){field.setAttribute('list','zones');field.spellcheck=false;}
   if(key==='availability'){field.maxLength=3000;field.spellcheck=false;field.placeholder='Mon 18:00-21:00';}
   card.append(l,field);
  }
  $('#members').append(card);
 });
}
const zoneList=el('datalist');zoneList.id='zones';for(const zone of zones){const o=el('option');o.value=zone;zoneList.append(o);}form.append(zoneList);
buildMembers(Array.from({length:4},(_,i)=>({name:`Teammate ${i+1}`,zone:'Asia/Karachi',availability:''})));
function invalidate(){if(analysis){analysis=null;results.replaceChildren(el('p','Schedules changed. Find shared windows again before exporting.','summary'));}}
form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
$('#example').addEventListener('click',()=>{buildMembers(sample);invalidate();results.replaceChildren(el('p','Synthetic example loaded: four invented teammates, not your actual availability. Choose a start date, then find shared windows.','summary'));});
function download(name,text,type){const href=URL.createObjectURL(new Blob([text],{type})),a=el('a');a.href=href;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);}
function render(){
 const a=analysis;results.replaceChildren(el('p','03 / SHARED WINDOWS','eyebrow'),el('h2',a.windows.length?'Time to make something.':'No shared window yet.'));
 results.append(el('p',`${a.windows.length} possible ${a.settings.duration}-minute starts across ${a.settings.days} UTC days, starting ${a.settings.date}. Starts use a 15-minute grid; overlapping suggestions are alternatives, not separate commitments.`,'summary'));
 if(!a.windows.length){results.append(el('p','Try a shorter session or adjust the availability with your teammates. No calendar file has been created.'));return;}
 const controls=el('div',undefined,'exports');const json=el('button','Download plan (includes schedules)','quiet');json.type='button';json.onclick=()=>download('windowwise-plan.json',JSON.stringify({...a,notice:'Contains entered names, time zones and weekly availability. Share deliberately.'},null,2),'application/json');controls.append(json);results.append(controls);
 a.windows.slice(0,shown).forEach((w,i)=>{
  const card=el('article',undefined,'window'),title=el('div');title.append(el('h3',`Option ${i+1} · ${w.start.slice(0,10)}`),el('small',`${w.start.slice(11,16)}–${w.end.slice(11,16)} UTC`));
  const times=el('div',undefined,'times');w.local.forEach(p=>{const d=el('div');d.append(el('strong',p.name),el('span',`${p.start.day} ${p.start.date} · ${p.start.time} → ${p.end.date===p.start.date?'':p.end.date+' '}${p.end.time}`),el('br'),el('small',p.zone));times.append(d);});
  const button=el('button','Download .ics ↗','quiet');button.type='button';button.setAttribute('aria-label',`Download calendar for option ${i+1}`);button.onclick=()=>download(`windowwise-${w.start.slice(0,10)}-${w.start.slice(11,16).replace(':','')}.ics`,calendarInvite(w),'text/calendar;charset=utf-8');card.append(title,times,button);results.append(card);
 });
 if(shown<a.windows.length){const more=el('button',`Show all ${a.windows.length} options`,'quiet');more.type='button';more.onclick=()=>{shown=a.windows.length;render();};results.append(more);}
 results.append(el('p','Calendar export creates a file only. It does not send invitations, book a room or confirm attendance.','note'));
}
form.addEventListener('submit',event=>{
 event.preventDefault();analysis=null;
 try{
  const members=Array.from({length:4},(_,i)=>({name:$(`#name-${i}`).value,zone:$(`#zone-${i}`).value.trim(),availability:$(`#availability-${i}`).value}));
  const settings={date:$('#date').value,days:Number($('#days').value),duration:Number($('#duration').value)};
  analysis={created_at:new Date().toISOString(),members,settings,windows:findWindows(members,settings)};shown=12;render();
 }catch(e){results.replaceChildren(el('h2','Let’s check those hours.'),el('p',e.message,'error'));}
});
