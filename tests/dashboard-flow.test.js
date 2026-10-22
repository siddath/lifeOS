// Exercise the shipped dashboard handlers, with browser/network boundaries supplied by the test.
// These are interaction regressions, not a replacement for the live-browser check.
const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const state=require('../dashboard/assets/state');
const source=readFileSync(require.resolve('../dashboard/index.html'),'utf8');
function section(start,end){
  const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
  assert.ok(a>=0 && b>a,'Dashboard handler boundaries must exist');
  return source.slice(a,b);
}
function store(values={}){
  const map=new Map(Object.entries(values));
  return {get length(){return map.size;},key:i=>[...map.keys()][i]??null,getItem:k=>map.get(k)??null,
    setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
}
function browser(){
  const elements=new Map();
  const document={activeElement:null,getElementById:id=>{
    if(!elements.has(id)){
      const element={id,value:'',hidden:false,disabled:false,readOnly:false,isConnected:true,listeners:{},
        addEventListener(type,callback){this.listeners[type]=callback;},
        focus(){document.activeElement=this;},select(){this.selected=true;},matches(){return false;},
        showModal(){this.open=true;},close(){this.open=false;this.listeners.close?.();}};
      elements.set(id,element);
    }
    return elements.get(id);
  }};
  document.getElementById('opener').focus();
  return document;
}
const task={id:'one',title:'Original task',area:'learning',priority:'P2',status:'open',due:''};
function backupRuntime(){
  const document=browser();
  const storage=store({lifeos_tasks_v1:JSON.stringify([task]),lifeos_habits_v1:'[]',lifeos:'{"a":true}',
    lifeos_sync_secret:'synthetic-existing-key',lifeos_syncqueue_v1:'pending'});
  const context={document,localStorage:storage,LifeOSState:state,navigator:{clipboard:{writeText:async()=>{throw Error('denied');}}},
    window:{prompt(){throw Error('Native prompt unavailable');}},confirm(){throw Error('Native confirm unavailable');},
    btoa:s=>Buffer.from(s,'binary').toString('base64'),unescape,encodeURIComponent,
    uid:()=> 'generated-id',currentWeekMonday:()=> '2026-10-19',DAYS:['mon','tue','wed','thu','fri','sat','sun'],
    syncInFlight:false,syncTimer:null,clearTimeout(){},_seededInlineThisLoad:{tasks:'seed',habits:'seed'},
    load(){},rollHabitWeekIfNeeded(){},renderTasks(){},renderHabits(){},renderHabitHistory(){},renderReview(){},localOnly(){}};
  vm.createContext(context);
  vm.runInContext(section('  // ---- Versioned browser backup.','\n  /* ============================================================\n     NAV UX'),context);
  return {context,document,storage};
}
function replacementCode(){
  return 'LIFEOS3:'+Buffer.from(JSON.stringify({version:3,data:{lifeos_tasks_v1:JSON.stringify([{...task,title:'Restored task'}]),lifeos_habits_v1:'[]'}}),'utf8').toString('base64');
}

test('export keeps a usable selected code when clipboard and native prompts are unavailable',async()=>{
  const {context,document}=backupRuntime();
  context.exportState();
  const code=document.getElementById('backupCode');
  assert.equal(document.getElementById('backupDialog').open,true);
  assert.match(code.value,/^LIFEOS3:/);
  assert.equal(code.readOnly,true);
  await context.copyBackupCode();
  assert.equal(code.selected,true);
  assert.equal(JSON.parse(state.parseBackup(code.value).lifeos_tasks_v1)[0].title,'Original task');
  assert.match(document.getElementById('backupMessage').textContent,/Clipboard access is unavailable/);
  context.closeBackupDialog();
  assert.equal(document.activeElement.id,'opener');
});

test('import validates and previews without writes; Escape, Cancel and changed code are safe',()=>{
  const {context,document,storage}=backupRuntime();
  context.importState();
  const code=document.getElementById('backupCode'),original=storage.getItem('lifeos_tasks_v1');
  code.value='broken'; context.previewBackup(); context.restoreBackup();
  assert.equal(storage.getItem('lifeos_tasks_v1'),original);
  assert.equal(document.getElementById('backupRestore').disabled,true);
  code.value=replacementCode();context.previewBackup();
  assert.equal(storage.getItem('lifeos_tasks_v1'),original);
  assert.equal(document.getElementById('backupRestore').disabled,false);
  let prevented=false;
  document.getElementById('backupDialog').listeners.cancel({preventDefault(){prevented=true;}});
  assert.equal(prevented,true);
  assert.equal(document.activeElement.id,'opener');
  assert.equal(storage.getItem('lifeos_tasks_v1'),original);
  context.importState();code.value=replacementCode();context.previewBackup();
  code.value='changed';code.listeners.input();context.restoreBackup();
  assert.equal(storage.getItem('lifeos_tasks_v1'),original);
  context.closeBackupDialog();
  assert.equal(document.activeElement.id,'opener');
});

test('only explicit restore commits the preview, preserving credentials and clearing stale queued work',()=>{
  const {context,document,storage}=backupRuntime();
  context.importState();document.getElementById('backupCode').value=replacementCode();context.previewBackup();
  context.restoreBackup();
  assert.equal(JSON.parse(storage.getItem('lifeos_tasks_v1'))[0].title,'Restored task');
  assert.equal(storage.getItem('lifeos_sync_secret'),'synthetic-existing-key');
  assert.equal(storage.getItem('lifeos_syncqueue_v1'),'[]');
  assert.equal(context._seededInlineThisLoad.tasks,null);
  assert.equal(document.getElementById('backupRestore').disabled,true);
  assert.match(document.getElementById('backupMessage').textContent,/No data was sent to Notion/);
});

test('saving current mission checks preserves older mission keys and records unchecked values',()=>{
  const storage=store({lifeos:'{"older:w1":true,"current:w1":true}'});
  const context={localStorage:storage,LifeOSState:state,boxes:()=>[{id:'current:w1',checked:false},{id:'current:e1',checked:true}],
    updateProgress(){},syncNote(){}};
  vm.createContext(context);
  vm.runInContext(section('  function save(){','  function load(){'),context);
  context.save();
  assert.deepEqual(JSON.parse(storage.getItem('lifeos')),{'older:w1':true,'current:w1':false,'current:e1':true});
});

test('a deferred pull cannot replace unfinished task or habit text entered through the actual input handlers',async()=>{
  for(const list of ['taskList','habitList']){
    const document=browser();
    const editor=document.getElementById('editor');editor.value='Original';
    let resolveFetch,rendered=0,merged=0,message='';
    const context={document,_seededInlineThisLoad:{tasks:'seed',habits:'seed'},notionEnabled:()=>true,
      syncInFlight:false,getQueue:()=>[],setStatus(){},syncNote:text=>{message=text;},syncHeaders:()=>({}),SYNC_PULL:'/test/pull',
      fetch:()=>new Promise(resolve=>{resolveFetch=resolve;}),localStorage:store(),nowIso:()=> '2026-10-22T00:00:00Z',
      mergeRemoteTasks(){merged++;},mergeRemoteHabits(){merged++;},
      renderTasks(){rendered++;editor.value='Stored title';},renderHabits(){rendered++;editor.value='Stored habit';},
      lastSyncedLabel:()=> 'Synced',scheduleFlush(){},localOnly(){}};
    vm.createContext(context);
    vm.runInContext(section('  // ---- Event delegation ----',"  document.getElementById('taskList').addEventListener('change'"),context);
    vm.runInContext(section('  async function pullFromNotion(){','  function mergeRemoteTasks(remote){'),context);
    const pending=context.pullFromNotion();
    editor.value='Unfinished text';
    document.getElementById(list).listeners.input({target:editor});
    resolveFetch({status:200,ok:true,json:async()=>({tasks:[],habits:[]})});
    await pending;
    assert.equal(editor.value,'Unfinished text');
    assert.equal(rendered,0);assert.equal(merged,0);
    assert.match(message,/Your text is preserved/);
    assert.equal(context.syncInFlight,false);
    const retry=context.pullFromNotion();
    resolveFetch({status:200,ok:true,json:async()=>({tasks:[],habits:[]})});
    await retry;
    assert.equal(rendered,2);assert.equal(merged,2);
    assert.match(message,/Pulled Tasks/);
  }
});
