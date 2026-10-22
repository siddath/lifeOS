// Shipped copy/key handlers and deferred network responses, with synthetic browser boundaries.
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=readFileSync(path.join(root,'dashboard/index.html'),'utf8');
const shared=readFileSync(path.join(root,'dashboard/assets/shared.js'),'utf8');
const state=require('../dashboard/assets/state');
function section(text,start,end){
  const a=text.indexOf(start),b=text.indexOf(end,a+start.length);
  assert.ok(a>=0 && b>a,'Shipped handler boundaries must exist');return text.slice(a,b);
}
function store(){
  const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
}
function browser(){
  const elements=new Map(),document={activeElement:null,body:{appendChild(){}},getElementById(id){
    if(!elements.has(id))elements.set(id,{id,value:'',hidden:false,isConnected:true,listeners:{},
      addEventListener(type,callback){this.listeners[type]=callback;},focus(){document.activeElement=this;},select(){this.selected=true;},
      showModal(){this.open=true;},close(){this.open=false;this.listeners.close?.();}});
    return elements.get(id);
  }};document.getElementById('opener').focus();return document;
}
function dialogRuntime(){
  const document=browser();let markup='';
  const context={document,navigator:{clipboard:{writeText:async()=>{throw Error('denied');}}},
    el:html=>{markup=html;return document.getElementById('textDialog');}};
  vm.createContext(context);vm.runInContext(section(shared,'  // ---- In-page copy','  /* One call per page.'),context);
  return {context,document,get markup(){return markup;}};
}
test('denied clipboard leaves complete selectable Unicode text, and Escape restores focus',async()=>{
  const r=dialogRuntime(),text='Private synthetic text — தமிழ் 🪷\nSecond line';
  assert.equal(await r.context.copyText(text,'Copy daily review'),false);
  const field=r.document.getElementById('textDialogText'),dialog=r.document.getElementById('textDialog');
  assert.equal(dialog.open,true);assert.equal(field.value,text);assert.equal(field.selected,true);
  assert.equal(r.document.activeElement,field);assert.equal(r.document.getElementById('textDialogKey').hidden,true);
  await r.context.copyTextDialog();assert.match(r.document.getElementById('textDialogMessage').textContent,/browser’s Copy command/);
  let prevented=false;dialog.listeners.cancel({preventDefault(){prevented=true;}});
  assert.equal(prevented,true);assert.equal(dialog.open,false);assert.equal(field.value,'');
  assert.equal(r.document.activeElement.id,'opener');
});
test('password key dialog starts empty; blank/error/cancel preserve settings; save and clear scrub fields',()=>{
  const r=dialogRuntime(),writes=[];let error='';
  const save=value=>{if(error)return error;writes.push(value);};r.context.editSyncKey(save);
  const key=r.document.getElementById('textDialogKey'),dialog=r.document.getElementById('textDialog');
  assert.match(r.markup,/type="password"/);assert.equal(key.value,'');assert.equal(key.hidden,false);
  assert.equal(r.document.getElementById('textDialogText').hidden,true);assert.equal(r.document.activeElement,key);
  key.value='  ';r.context.saveTextDialogKey(false);assert.deepEqual(writes,[]);assert.equal(dialog.open,true);
  error='Storage blocked';key.value='synthetic-new-key';r.context.saveTextDialogKey(false);
  assert.equal(dialog.open,true);assert.match(r.document.getElementById('textDialogMessage').textContent,/Storage blocked/);
  dialog.listeners.cancel({preventDefault(){}});assert.equal(key.value,'');assert.deepEqual(writes,[]);
  error='';r.context.editSyncKey(save);key.value=' synthetic-new-key ';
  key.listeners.keydown({key:'Enter',preventDefault(){}});
  assert.deepEqual(writes,['synthetic-new-key']);assert.equal(key.value,'');assert.equal(dialog.open,false);
  r.context.editSyncKey(save);r.context.saveTextDialogKey(true);assert.deepEqual(writes,['synthetic-new-key','']);
  assert.equal(r.document.activeElement.id,'opener');
});
test('key setting and clearing keep the queue local and report storage failure without claiming success',()=>{
  const storage=store();storage.setItem('lifeos_sync_secret','synthetic-old-key');let blocked=false,save,cleared=0,message='';
  const context={localStorage:{...storage,setItem(key,value){if(blocked)throw Error('blocked');storage.setItem(key,value);}},
    LifeOS:{editSyncKey:callback=>{save=callback;}},notionEnabled:()=>true,localOnly(){},syncNote:text=>{message=text;},
    clearTimeout(){cleared++;},syncTimer:1,apiConfigured:false,fetch(){throw Error('Saving a key must not send');},flushQueue(){throw Error('Saving a key must not flush');}};
  vm.createContext(context);vm.runInContext(section(source,'  // Key changes are local settings.','  async function flushQueue()'),context);
  context.setSyncSecret();assert.equal(storage.getItem('lifeos_sync_secret'),'synthetic-old-key');
  blocked=true;assert.match(save('replacement'),/could not save/);assert.equal(storage.getItem('lifeos_sync_secret'),'synthetic-old-key');assert.equal(message,'');
  blocked=false;assert.equal(save('replacement'),undefined);assert.equal(storage.getItem('lifeos_sync_secret'),'replacement');assert.equal(cleared,1);assert.match(message,/Press Push/);
  assert.equal(save(''),undefined);assert.equal(storage.getItem('lifeos_sync_secret'),null);assert.equal(cleared,2);assert.match(message,/stay on this device/);
});
test('opting out during a pending pull discards the response and keeps local data/status',async()=>{
  let enabled=true,resolveFetch,merged=0,rendered=0,message='',status='',scheduled=0;
  const document=browser(),storage=store();
  const context={document,localStorage:storage,notionEnabled:()=>enabled,syncInFlight:false,editorRevision:0,getQueue:()=>[],
    syncHeaders:()=>({}),SYNC_PULL:'/synthetic/pull',fetch:()=>new Promise(resolve=>{resolveFetch=resolve;}),
    setStatus:value=>{status=value;},localOnly(){status='local-only';},syncNote:text=>{message=text;},
    mergeRemoteTasks(){merged++;},mergeRemoteHabits(){merged++;},renderTasks(){rendered++;},renderHabits(){rendered++;},
    nowIso:()=> '2030-01-02T00:00:00Z',lastSyncedLabel:()=> 'Synced',scheduleFlush(){scheduled++;}};
  vm.createContext(context);vm.runInContext(section(source,'  async function pullFromNotion(){','  function mergeRemoteTasks(remote){'),context);
  const pending=context.pullFromNotion();enabled=false;resolveFetch({status:200,ok:true,json:async()=>({tasks:[{}],habits:[{}]})});await pending;
  assert.equal(merged,0);assert.equal(rendered,0);assert.equal(storage.getItem('lifeos_last_synced'),null);
  assert.equal(status,'local-only');assert.equal(scheduled,0);assert.match(message,/disabled while pulling/);
});
test('opt-out keeps acknowledgements for an already-sent push but schedules no retry',async()=>{
  let enabled=true,resolveFetch,scheduled=0,status='',applied=0;
  let queue=[{queueId:'q1',type:'task',action:'upsert',payload:{id:'one'}},{queueId:'q2',type:'task',action:'upsert',payload:{id:'two'}}];
  const context={LifeOSState:state,localStorage:store(),notionEnabled:()=>enabled,syncInFlight:false,syncTimer:1,apiConfigured:true,
    getQueue:()=>queue,setQueue:value=>{queue=value;},syncHeaders:value=>value,SYNC_PUSH:'/synthetic/push',
    fetch:()=>new Promise(resolve=>{resolveFetch=resolve;}),setStatus:value=>{status=value;},localOnly(){status='local-only';},syncNote(){},
    applyResults(){applied++;},nowIso:()=> '2030-01-02T00:00:00Z',lastSyncedLabel:()=> 'Synced',clearTimeout(){},setTimeout(){scheduled++;}};
  vm.createContext(context);vm.runInContext(section(source,'  function scheduleFlush(','  // Optional shared secret'),context);
  vm.runInContext(section(source,'  async function flushQueue(){','  function lastSyncedLabel(){'),context);
  const pending=context.flushQueue();enabled=false;resolveFetch({status:200,ok:true,json:async()=>({results:[{localId:'one',ok:true,notionId:'synthetic-remote'}]})});await pending;
  assert.equal(applied,1);assert.equal(queue.length,1);assert.equal(queue[0].payload.id,'two');
  assert.equal(scheduled,0);assert.equal(status,'local-only');assert.equal(context.syncInFlight,false);
});
test('daily-review copy uses the same local date as storage, and share failure exposes copy fallback',async()=>{
  let copied='',calls=0;
  const context={LifeOSState:{localDate:()=> '2030-01-02'},LifeOS:{copyText:async text=>{copied=text;calls++;return false;}},
    document:browser(),localStorage:store(),collectReview:()=>({ratings:{},g:[]}),drKey:()=> 'lifeos_review_2030-01-02',DR_AREAS:[],
    navigator:{share:async()=>{throw Error('Share unavailable');}},curQuote:{text:'Synthetic quote',author:'Demo'},qToast(){}};
  vm.createContext(context);vm.runInContext(section(source,'  function copyReview(){','  // ---- Stepper controls ----'),context);
  context.copyReview();await Promise.resolve();assert.match(copied,/^# Daily Review — 2030-01-02/);
  vm.runInContext(section(source,'  async function shareQuote(){','  function buildFilterPop()'),context);
  await context.shareQuote();assert.match(copied,/Synthetic quote/);assert.equal(calls,2);
  context.navigator.share=async()=>{const e=Error('Cancelled');e.name='AbortError';throw e;};await context.shareQuote();assert.equal(calls,2);
});

test('quick-add rejects impossible due tokens without losing text and valid leap dates survive backup restore',()=>{
  const storage=store();storage.setItem('lifeos_tasks_v1','[]');storage.setItem('lifeos_habits_v1','[]');
  // snapshot enumerates storage using the browser Storage interface.
  const keys=['lifeos_tasks_v1','lifeos_habits_v1'];Object.defineProperty(storage,'length',{get:()=>keys.length});storage.key=i=>keys[i]??null;
  const document=browser();let message='',queued=0;
  const composer={input:document.getElementById('taskQuickAdd'),sel:{area:null,priority:null,due:null,dueDate:''}};
  const context={LifeOSState:state,localStorage:storage,AREA_CODES:['mindset'],composer,document,
    getTasks:()=>JSON.parse(storage.getItem('lifeos_tasks_v1')),setTasks:tasks=>storage.setItem('lifeos_tasks_v1',JSON.stringify(tasks)),
    queueSync(){queued++;},syncNote:text=>{message=text;},uid:()=> 'synthetic-task',nowIso:()=> '2030-01-02T00:00:00Z',
    renderTasks(){},refreshComposerChips(){},requestAnimationFrame(){}};
  vm.createContext(context);
  for(const [start,end] of [['  function resolveDueToken(','  // ---- Rendering ----'],['  function composerNL(){','  function buildComposerChips(){'],
    ['  function resolveComposer(){','  // Wiring'],['  function addTaskFromQuickAdd(){','  function updateHabit(']])vm.runInContext(section(source,start,end),context);
  for(const date of ['2026-02-31','2026-02-29','2026-13-01','nextweek']){
    const raw='Pay invoice due:'+date;composer.input.value=raw;
    assert.equal(context.parseQuickAdd(raw).due,'');context.addTaskFromQuickAdd();
    assert.equal(composer.input.value,raw);assert.equal(storage.getItem('lifeos_tasks_v1'),'[]');assert.equal(queued,0);
    assert.match(message,/real YYYY-MM-DD date/);
  }
  composer.input.value='Pay invoice due:2028-02-29';context.addTaskFromQuickAdd();assert.equal(queued,1);
  const code='LIFEOS3:'+Buffer.from(JSON.stringify(state.snapshot(storage)),'utf8').toString('base64');
  const restored=state.parseBackup(code);assert.equal(JSON.parse(restored.lifeos_tasks_v1)[0].due,'2028-02-29');
  assert.equal(JSON.parse(restored.lifeos_tasks_v1)[0].title,'Pay invoice');
});
