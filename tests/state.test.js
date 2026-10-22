const test = require('node:test');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const state = require('../dashboard/assets/state');

function memoryStore(initial={}){
  const values=new Map(Object.entries(initial));
  return {get length(){return values.size;},key:i=>[...values.keys()][i]??null,
    getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
}
const task={id:'task-1',title:'Read a chapter 📚',area:'learning',priority:'P2',status:'open',due:''};
const habit={id:'habit-1',name:'Walk',days:{mon:true},weekOf:'2026-10-19'};
const encode=(value,prefix='LIFEOS3:')=>prefix+Buffer.from(JSON.stringify(value),'utf8').toString('base64');

test('late first-run seeds preserve edits, while intentionally empty files replace untouched demos',()=>{
  const storage=memoryStore({tasks:'demo'});
  assert.equal(state.hydrateSeed(storage,'tasks','demo',[]),true);
  assert.equal(storage.getItem('tasks'),'[]');
  storage.setItem('tasks','user edit');
  assert.equal(state.hydrateSeed(storage,'tasks','demo',[task]),false);
  assert.equal(storage.getItem('tasks'),'user edit');
});

test('backup round-trip includes Unicode, reviews and history, excluding credentials and network work',()=>{
  const storage=memoryStore({lifeos_tasks_v1:JSON.stringify([task]),lifeos_habits_v1:JSON.stringify([habit]),
    lifeos:'{"mission:w1":false}',lifeos_review_2026_10_22:'not a supported key',
    'lifeos_review_2026-10-22':JSON.stringify({oneThing:'திட்டம்',g:['Rest'],ratings:{health:3}}),
    lifeos_habits_history_v1:'{"2026-10-12":{"Walk":4}}',lifeos_quote_favs:'["a"]',
    lifeos_sync_secret:'synthetic-secret',lifeos_syncqueue_v1:'queued',unrelated:'keep'});
  const backup=state.snapshot(storage),parsed=state.parseBackup(encode(backup));
  assert.equal(JSON.parse(parsed.lifeos_tasks_v1)[0].title,task.title);
  assert.equal(JSON.parse(parsed['lifeos_review_2026-10-22']).oneThing,'திட்டம்');
  for(const key of ['lifeos_sync_secret','lifeos_syncqueue_v1','unrelated','lifeos_review_2026_10_22']) assert.ok(!(key in parsed));
  const target=memoryStore({lifeos_sync_secret:'existing-key',unrelated:'keep'});
  state.restore(target,parsed,true);
  assert.equal(target.getItem('lifeos_sync_secret'),'existing-key');
  assert.equal(target.getItem('unrelated'),'keep');
  assert.equal(target.getItem('lifeos_syncqueue_v1'),'[]');
});

test('legacy checks and v2 backups remain importable without erasing unrelated entries',()=>{
  assert.deepEqual(state.parseBackup(encode({a:false},'LIFEOS:')),{lifeos:'{"a":false}'});
  const data=state.parseBackup(encode({checks:{a:true},tasks:[task],habits:[habit]},'LIFEOS2:'));
  assert.deepEqual(JSON.parse(data.lifeos_tasks_v1),[task]);
  assert.deepEqual(JSON.parse(data.lifeos_habits_v1),[habit]);
});

test('malformed backups, impossible dates, duplicate IDs and injected settings are refused before writes',()=>{
  const invalid=[null,[],{checks:{a:'yes'},tasks:[],habits:[]},
    {checks:{},tasks:[{...task,due:'2026-02-31'}],habits:[]},
    {checks:{},tasks:[task,task],habits:[]},
    {checks:{},tasks:[],habits:[{...habit,days:{mon:'yes'}}]},
    {checks:{},tasks:null,habits:[]}];
  for(const value of invalid) assert.throws(()=>state.parseBackup(encode(value,'LIFEOS2:')));
  for(const key of ['lifeos_sync_secret','lifeos_syncqueue_v1','unrelated']){
    assert.throws(()=>state.parseBackup(encode({version:3,data:{lifeos_tasks_v1:'[]',lifeos_habits_v1:'[]',[key]:'overwrite'}})));
  }
  assert.throws(()=>state.parseBackup('eyJhIjp0cnVlfQ=='));
  assert.throws(()=>state.parseBackup('LIFEOS3:broken'));
  const storage=memoryStore({lifeos:'{"a":true}'});
  assert.throws(()=>state.restore(storage,{lifeos:'{"a":false}',lifeos_tasks_v1:'null'}));
  assert.equal(storage.getItem('lifeos'),'{"a":true}');
});

test('storage failure rolls back prior writes and preserves the pending sync queue',()=>{
  const storage=memoryStore({lifeos:'{"a":true}',lifeos_tasks_v1:'[]',lifeos_syncqueue_v1:'pending'});
  const write=storage.setItem;
  let fail=true;
  storage.setItem=(key,value)=>{if(key==='lifeos_tasks_v1'&&fail){fail=false;throw Error('quota');} write(key,value);};
  assert.throws(()=>state.restore(storage,{lifeos:'{"a":false}',lifeos_tasks_v1:JSON.stringify([task])},true),/storage/);
  assert.equal(storage.getItem('lifeos'),'{"a":true}');
  assert.equal(storage.getItem('lifeos_tasks_v1'),'[]');
  assert.equal(storage.getItem('lifeos_syncqueue_v1'),'pending');
});

test('sync acknowledgement retains in-flight edits and supplies the created Notion identity',()=>{
  const original={queueId:'one',type:'task',action:'upsert',payload:{...task,notionId:null}};
  const later={...original,queueId:'two',payload:{...task,title:'Later edit',notionId:null}};
  const pending=state.acknowledgeQueue([original,later],[original],[{localId:task.id,ok:true,notionId:'page-1'}]);
  assert.equal(pending.length,1);
  assert.equal(pending[0].payload.title,'Later edit');
  assert.equal(pending[0].payload.notionId,'page-1');
  assert.equal(later.payload.notionId,null);
});

test('partial and omitted sync results remain queued; only the latest unsent mutation is submitted',()=>{
  const a={queueId:'one',type:'task',action:'upsert',payload:task};
  const b={queueId:'two',type:'habit',action:'upsert',payload:habit};
  const c={...a,queueId:'three',action:'delete'};
  assert.deepEqual(state.compactQueue([a,b,c]),[c,b]);
  assert.deepEqual(state.acknowledgeQueue([a,b],[a,b],[{localId:task.id,ok:false}]),[a,b]);
  assert.deepEqual(state.acknowledgeQueue([a,b],[a,b],[{localId:task.id,ok:true,notionId:'page'}]),[b]);
});

test('calendar dates use the local day around midnight on both sides of UTC',()=>{
  for(const [tz,instant,expected] of [['Asia/Kolkata','2026-10-21T19:00:00Z','2026-10-22'],['America/Los_Angeles','2026-10-22T02:00:00Z','2026-10-21']]){
    const script=`const s=require(${JSON.stringify(require.resolve('../dashboard/assets/state'))});process.stdout.write(s.localDate(new Date(${JSON.stringify(instant)})))`;
    const result=spawnSync(process.execPath,['-e',script],{env:{...process.env,TZ:tz},encoding:'utf8'});
    assert.equal(result.status,0); assert.equal(result.stdout,expected);
  }
  assert.equal(state.validDate('2028-02-29'),true);
  assert.equal(state.validDate('2026-02-29'),false);
});
