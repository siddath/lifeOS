/* Browser-state boundaries. No build step; also loaded by the Node regression tests. */
var LifeOSState = (function(){
  'use strict';
  const DAYS = ['mon','tue','wed','thu','fri','sat','sun'];
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  function requireValue(ok, message){ if(!ok) throw new Error(message); }
  function localDate(date = new Date()){
    return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
  }
  function validDate(value){
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
      && localDate(new Date(value+'T12:00:00')) === value;
  }
  function checks(value){
    requireValue(object(value) && Object.values(value).every(v=>typeof v==='boolean'), 'Checkboxes must contain true/false values.');
    return value;
  }
  function records(value, kind){
    requireValue(Array.isArray(value), kind+' must be a list.');
    const ids = new Set();
    return value.map(row=>{
      requireValue(object(row), kind+' contains an invalid entry.');
      const label = kind==='tasks' ? row.title : row.name;
      requireValue(typeof label==='string' && label.trim().length>0, kind+' contains a blank name.');
      if(row.id!==undefined){
        requireValue(typeof row.id==='string' && row.id.length>0 && !ids.has(row.id), kind+' contains invalid or duplicate IDs.');
        ids.add(row.id);
      }
      requireValue(row.notionId==null || typeof row.notionId==='string', 'Invalid Notion ID.');
      if(kind==='tasks'){
        requireValue(typeof row.area==='string' && row.area.length>0 && ['P1','P2','P3'].includes(row.priority), 'Task area or priority is invalid.');
        requireValue(row.status===undefined || ['open','in-progress','done'].includes(row.status), 'Task status is invalid.');
        requireValue(row.due===undefined || row.due==='' || validDate(row.due), 'Task due date is invalid.');
      } else {
        requireValue(row.days===undefined || (object(row.days) && Object.entries(row.days).every(([d,v])=>DAYS.includes(d) && typeof v==='boolean')), 'Habit days must contain true/false values.');
        requireValue(row.weekOf===undefined || validDate(row.weekOf), 'Habit week is invalid.');
        for(const flag of ['keystone','active']) requireValue(row[flag]===undefined || typeof row[flag]==='boolean', 'Habit '+flag+' is invalid.');
      }
      return {...row};
    });
  }
  // A late seed response may replace only the exact inline fallback it started with.
  function hydrateSeed(storage, key, initial, rows){
    if(initial===null || storage.getItem(key)!==initial) return false;
    storage.setItem(key, JSON.stringify(rows));
    return true;
  }
  function portableKey(key){
    return ['lifeos','lifeos_tasks_v1','lifeos_habits_v1','lifeos_habits_history_v1','lifeos_anchor','lifeos_theme',
      'lifeos_quote_favs','lifeos_quote_filter','lifeos_quote_id','lifeos_quote_date','lifeos_quote_idx',
      'lifeos_composer_last_area','lifeos_hint_seen','lifeos_checks_migrated_v1'].includes(key)
      || /^lifeos_review_\d{4}-\d{2}-\d{2}$/.test(key) || /^lifeos_zone_[\w-]+$/.test(key);
  }
  function snapshot(storage){
    const data = {};
    for(let i=0;i<storage.length;i++){
      const key=storage.key(i);
      if(portableKey(key)) data[key]=storage.getItem(key);
    }
    return {version:3, exportedAt:new Date().toISOString(), data};
  }
  function validateEntry(key, raw){
    requireValue(typeof raw==='string', 'Backup values must be text.');
    if(key==='lifeos') checks(JSON.parse(raw));
    else if(key==='lifeos_tasks_v1') records(JSON.parse(raw),'tasks');
    else if(key==='lifeos_habits_v1') records(JSON.parse(raw),'habits');
    else if(key==='lifeos_habits_history_v1'){
      const history=JSON.parse(raw);
      requireValue(object(history) && Object.entries(history).every(([week,rows])=>validDate(week) && object(rows)
        && Object.values(rows).every(n=>Number.isInteger(n) && n>=0 && n<=7)), 'Habit history is invalid.');
    } else if(key.startsWith('lifeos_review_')){
      const review=JSON.parse(raw);
      requireValue(object(review), 'Daily review is invalid.');
      for(const field of ['presence','overthink','oneThing']) requireValue(review[field]===undefined || typeof review[field]==='string', 'Review text is invalid.');
      requireValue(review.g===undefined || (Array.isArray(review.g) && review.g.every(v=>typeof v==='string')), 'Gratitude entries are invalid.');
      requireValue(review.ratings===undefined || (object(review.ratings) && Object.values(review.ratings).every(v=>Number.isInteger(v) && v>=0 && v<=5)), 'Review ratings are invalid.');
    } else if(key==='lifeos_quote_favs') requireValue(Array.isArray(JSON.parse(raw)) && JSON.parse(raw).every(v=>typeof v==='string'), 'Quote favorites are invalid.');
    else if(key==='lifeos_theme') requireValue(['light','dark'].includes(raw), 'Theme is invalid.');
  }
  function parseBackup(raw){
    const match=raw.trim().match(/^(LIFEOS3|LIFEOS2|LIFEOS):(.+)$/s);
    requireValue(!!match, 'Paste the complete LIFEOS3:, LIFEOS2:, or LIFEOS: code.');
    let parsed;
    try{ parsed=JSON.parse(decodeURIComponent(escape(atob(match[2])))); }
    catch(_){ throw new Error('This is not a valid encoded backup. Copy the complete code and try again.'); }
    let data;
    if(match[1]==='LIFEOS3'){
      requireValue(object(parsed) && parsed.version===3 && object(parsed.data), 'Unsupported backup version.');
      data=parsed.data;
      requireValue('lifeos_tasks_v1' in data && 'lifeos_habits_v1' in data, 'Backup is missing tasks or habits.');
    } else if(match[1]==='LIFEOS2'){
      requireValue(object(parsed), 'Backup is invalid.');
      data={lifeos:JSON.stringify(checks(parsed.checks||{})), lifeos_tasks_v1:JSON.stringify(records(parsed.tasks,'tasks')),
        lifeos_habits_v1:JSON.stringify(records(parsed.habits,'habits'))};
    } else data={lifeos:JSON.stringify(checks(parsed))};
    for(const [key,value] of Object.entries(data)){
      requireValue(portableKey(key), 'Backup contains an unsupported setting.');
      validateEntry(key,value);
    }
    return data;
  }
  // Validate first, then write with rollback if browser storage refuses any write.
  function restore(storage, data, clearQueue=false){
    for(const [key,value] of Object.entries(data)){ requireValue(portableKey(key), 'Unsupported setting.'); validateEntry(key,value); }
    const writes={...data};
    if(clearQueue) writes.lifeos_syncqueue_v1='[]';
    const previous=new Map(Object.keys(writes).map(key=>[key,storage.getItem(key)]));
    try{ for(const [key,value] of Object.entries(writes)) storage.setItem(key,value); }
    catch(error){
      for(const [key,value] of previous){ try{ if(value===null) storage.removeItem(key); else storage.setItem(key,value); }catch(_){} }
      throw new Error('Browser storage could not restore the backup. Export the current state and free browser storage before retrying.');
    }
  }
  function compactQueue(queue){
    const last=new Map();
    queue.forEach(item=>last.set(item.type+':'+item.payload.id,item));
    return [...last.values()];
  }
  // Acknowledge only the submitted entries; later edits and omitted results stay queued.
  function acknowledgeQueue(current, sent, results){
    const successes=new Map(results.filter(r=>r && r.ok===true).map(r=>[r.localId,r.notionId]));
    const acknowledged=new Set(sent.filter(item=>successes.has(item.payload.id)).map(item=>item.queueId));
    return current.filter(item=>!acknowledged.has(item.queueId)).map(item=>successes.get(item.payload.id)
      ? {...item,payload:{...item.payload,notionId:successes.get(item.payload.id)}} : item);
  }
  return {localDate,validDate,checks,records,hydrateSeed,snapshot,parseBackup,restore,compactQueue,acknowledgeQueue};
})();
if(typeof module!=='undefined' && module.exports) module.exports=LifeOSState;
