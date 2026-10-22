// Run: node --test tests/editable-rows.test.js
// Executes shipped row handlers against synthetic storage and editor boundaries.
const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const state=require('../dashboard/assets/state');
const source=readFileSync(require.resolve('../dashboard/index.html'),'utf8');
function section(start,end){
  const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
  assert.ok(a>=0&&b>a,'Shipped handler boundaries must exist');
  return source.slice(a,b);
}
function setup(){
  const values=new Map([
    ['lifeos_tasks_v1',JSON.stringify([{id:'task',title:'Initial task',area:'learning',priority:'P2',status:'open',due:''}])],
    ['lifeos_habits_v1',JSON.stringify([{id:'habit',name:'Initial habit',keystone:false,weekOf:'2026-10-19',days:{mon:false,tue:false}}])]
  ]);
  const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),
    get length(){return values.size;},key:i=>[...values.keys()][i]??null};
  const elements=new Map(),document={activeElement:null,getElementById(id){
    if(!elements.has(id)) elements.set(id,{listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}});
    return elements.get(id);
  }};
  function row(id,classes){
    const controls={};
    const result={dataset:{id},querySelector:selector=>controls[selector]||null,
      querySelectorAll:selector=>Object.values(controls).filter(el=>el.classList.contains(selector.slice(1))),
      classList:{toggle(){}}};
    for(const [key,className,day] of classes){
      const el={className,dataset:day?{day}:{},attrs:{},value:'',textContent:'',
        setAttribute(name,value){this.attrs[name]=String(value);},getAttribute(name){return this.attrs[name];},
        closest(){return result;},focus(){document.activeElement=this;}};
      el.classList={contains:name=>el.className.split(' ').includes(name),toggle(name,force){
        const set=new Set(el.className.split(' '));const on=force??!set.has(name);on?set.add(name):set.delete(name);el.className=[...set].join(' ');return on;
      }};
      controls[key]=el;
    }
    return {row:result,controls};
  }
  const task=row('task',[['.ed-title','ed-title'],['.ed-done','ed-done'],['.ed-area','ed-area'],
    ['.ed-prio','ed-prio prio-P2'],['.ed-due','ed-due'],['.ed-del','ed-del']]);
  const habit=row('habit',[['.ed-hname','ed-hname'],['.ed-star','ed-star'],['.ed-hdel','ed-hdel'],
    ['mon','ed-day','mon'],['tue','ed-day','tue']]);
  let message='',queued=0;
  const context={document,localStorage:storage,_seededInlineThisLoad:{tasks:null,habits:null},
    nowIso:()=> '2026-10-22T12:00:00Z',DAY_LABEL:{mon:'Mon',tue:'Tue'},
    queueSync(){queued++;},syncNote:value=>{message=value;},
    renderTasks(){throw Error('Row handlers must not replace unfinished editors');},
    renderHabits(){throw Error('Row handlers must not replace unfinished editors');}};
  vm.createContext(context);
  vm.runInContext(section('  function getTasks(){','  function seedIfEmpty(){'),context);
  vm.runInContext(section('  // Update names in place;','  // ---- Event delegation ----'),context);
  vm.runInContext(section('  // ---- Event delegation ----','  /* ---- Task composer'),context);
  vm.runInContext(section("  document.getElementById('habitList').addEventListener('change'","  document.getElementById('habitQuickAdd').addEventListener('keydown'"),context);
  return {context,document,storage,task,habit,get message(){return message;},get queued(){return queued;},
    emit(list,type,element){document.getElementById(list).listeners[type]({target:element});}};
}

test('priority cycle immediately updates text, announced value and persistence without replacing an editor',()=>{
  const r=setup(),input=r.task.controls['.ed-title'],button=r.task.controls['.ed-prio'];
  input.value='Unfinished text';input.focus();
  r.emit('taskList','click',button);
  assert.equal(JSON.parse(r.storage.getItem('lifeos_tasks_v1'))[0].priority,'P3');
  assert.equal(button.textContent,'P3');assert.ok(button.classList.contains('prio-P3'));
  assert.match(button.getAttribute('aria-label'),/Priority P3/);
  assert.equal(input.value,'Unfinished text');assert.equal(r.document.activeElement,input);
});
test('habit day and keystone toggles announce the exact persisted state immediately in both directions',()=>{
  const r=setup();
  for(const [control,read] of [[r.habit.controls.mon,h=>h.days.mon],[r.habit.controls['.ed-star'],h=>h.keystone]]){
    for(const next of [true,false]){
      r.emit('habitList','click',control);
      assert.equal(read(JSON.parse(r.storage.getItem('lifeos_habits_v1'))[0]),next);
      assert.equal(control.classList.contains('on'),next);
      assert.equal(control.getAttribute('aria-pressed'),String(next));
    }
  }
});
test('renames refresh contextual names in place, while blank edits preserve valid exportable records',()=>{
  const r=setup();
  for(const [list,entry,inputKey,field,labelKeys] of [
    ['taskList',r.task,'.ed-title','title',['.ed-done','.ed-area','.ed-prio','.ed-due','.ed-del']],
    ['habitList',r.habit,'.ed-hname','name',['.ed-star','.ed-hdel','mon','tue']]
  ]){
    const input=entry.controls[inputKey],name='New "quoted" name';input.value=name;input.focus();
    r.emit(list,'change',input);
    for(const key of labelKeys) assert.ok(entry.controls[key].getAttribute('aria-label').includes(name));
    assert.equal(r.document.activeElement,input);assert.equal(input.value,name);
    const count=r.queued;input.value='  ';r.emit(list,'change',input);
    assert.equal(input.value,name);assert.equal(r.queued,count);assert.match(r.message,/previous .* kept/i);
    const key=list==='taskList'?'lifeos_tasks_v1':'lifeos_habits_v1';
    assert.equal(JSON.parse(r.storage.getItem(key))[0][field],name);
  }
  assert.doesNotThrow(()=>state.records(JSON.parse(r.storage.getItem('lifeos_tasks_v1')),'tasks'));
  assert.doesNotThrow(()=>state.records(JSON.parse(r.storage.getItem('lifeos_habits_v1')),'habits'));
});
