/* ============================================================
   LifeOS — shared chrome behavior.
   Load from <head> WITHOUT defer: the theme boot below must run
   before first paint. DOM-dependent work waits for LifeOS.init(...).
   Persona/greeting content stays in the pages (config-driven).
   ============================================================ */

/* ---- Theme boot: apply the saved choice before paint (no flash) ---- */
(function(){
  try{ var t=localStorage.getItem('lifeos_theme'); if(t) document.documentElement.setAttribute('data-theme',t); }catch(e){}
  try{ document.documentElement.classList.toggle('motion-ok', !matchMedia('(prefers-reduced-motion: reduce)').matches); }
  catch(e){ document.documentElement.classList.add('motion-ok'); }
})();

/* ---- Theme (day / evening) — global because pages use onclick="toggleTheme()" ---- */
function effectiveTheme(){
  return document.documentElement.getAttribute('data-theme')
    || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
}
function updateThemeIcon(){
  var btn = document.getElementById('themeToggle'); if(!btn) return;
  var dark = effectiveTheme() === 'dark';
  btn.textContent = dark ? '☀️' : '🌙';
  btn.title = dark ? 'Switch to day' : 'Switch to evening';
  btn.setAttribute('aria-label', btn.title);
}
function toggleTheme(){
  var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try{ localStorage.setItem('lifeos_theme', next); }catch(e){}
  updateThemeIcon();
}

var LifeOS = (function(){

  /* The single nav model: every page shows the same sections + pages. */
  var SECTIONS = [
    {href:'#hero',      icon:'🎯', label:'One thing',  title:'The one thing'},
    {href:'#work',      icon:'🗓️', label:'This week',  title:'This week'},
    {href:'#daily',     icon:'🔁', label:'Daily',      title:'Daily basics'},
    {href:'#reflect',   icon:'🪞', label:'Reflect',    title:'Reflect'},
    {href:'#finance',   icon:'💰', label:'Finance',    title:'Finance'},
    {href:'#later',     icon:'🌱', label:'Later',      title:'After the gate'},
    {href:'#vision',    icon:'🌅', label:'Vision',     title:'Vision'},
    {href:'#reference', icon:'🧠', label:'Reference',  title:'Reference'},
  ];
  var PAGES = [
    {key:'anchor',    href:'anchor.html',    icon:'⚓', label:'Inner OS',  title:'Inner OS — The Anchor'},
    {key:'knowledge', href:'knowledge.html', icon:'📚', label:'Knowledge', title:'Knowledge Base'},
  ];

  function el(html){
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  /* Render the dock into <nav id="dock">, plus the mobile FAB + scrim, then
     wire the bottom-sheet behavior. Options:
       page: 'index' | 'anchor' | 'knowledge'
       sync: true on index only — renders the Notion sync group
             (buttons call global flushQueue/pullFromNotion from index's script) */
  function setWorkspaceCurrent(key){
    document.querySelectorAll('[data-workspace-link]').forEach(function(link){
      if(link.dataset.workspaceLink===key) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
  }
  function initDock(opts){
    var dock=document.getElementById('dock');if(!dock)return;
    document.body.classList.add('has-workspace-nav');
    var base=opts.page==='index'?'':'index.html';
    function destinations(parent){
      [['home','Home'],['projects','Projects'],['library','Library'],['reviews','Reviews']].forEach(function(item){
        var a=document.createElement('a');a.href=base+'#'+item[0];a.dataset.workspaceLink=item[0];a.className='dock-btn';a.textContent=item[1];parent.appendChild(a);
      });
    }
    dock.replaceChildren();dock.setAttribute('aria-label','LifeOS navigation');
    var brand=document.createElement('a');brand.className='workspace-brand';brand.href=base+'#home';brand.textContent='LifeOS';dock.appendChild(brand);
    var closeButton=document.createElement('button');closeButton.type='button';closeButton.id='dockClose';closeButton.textContent='Close navigation';dock.appendChild(closeButton);
    var primary=document.createElement('div');primary.className='workspace-primary';destinations(primary);dock.appendChild(primary);
    var reading=document.createElement('details'),label=document.createElement('summary');label.textContent='Reading tools';reading.appendChild(label);
    PAGES.forEach(function(page){var a=document.createElement('a');a.className='dock-btn';a.href=page.href;a.textContent=page.label;if(page.key===opts.page){a.setAttribute('aria-current','page');reading.open=true;}reading.appendChild(a);});dock.appendChild(reading);
    var settings=document.createElement('a');settings.className='dock-btn workspace-settings';settings.href=base+'#settings';settings.textContent='Backup & settings';dock.appendChild(settings);
    var status=document.createElement('a');status.href=base+'#settings';status.className='workspace-status';status.innerHTML='<span class="status-dot local-only"'+(opts.sync?' data-sync-dot':'')+'></span><span'+(opts.sync?' data-sync-text':'')+'>Local browser</span>';dock.appendChild(status);
    var mobile=document.createElement('nav');mobile.className='workspace-mobile';mobile.setAttribute('aria-label','Workspace');destinations(mobile);
    var more=document.createElement('button');more.id='dockFab';more.type='button';more.textContent='More';more.setAttribute('aria-controls','dock');more.setAttribute('aria-expanded','false');mobile.appendChild(more);document.body.appendChild(mobile);
    var scrim=document.createElement('div');scrim.className='dock-scrim';scrim.hidden=true;document.body.appendChild(scrim);var opener;
    function close(){if(!dock.classList.contains('open'))return;dock.classList.remove('open');scrim.hidden=true;more.setAttribute('aria-expanded','false');if(opener&&opener.isConnected&&opener.getClientRects().length)opener.focus();}
    more.addEventListener('click',function(){if(dock.classList.contains('open'))return close();opener=document.activeElement;dock.classList.add('open');scrim.hidden=false;more.setAttribute('aria-expanded','true');closeButton.focus();});
    closeButton.addEventListener('click',close);scrim.addEventListener('click',close);
    [dock,mobile].forEach(function(nav){nav.addEventListener('click',function(e){if(e.target.closest('a'))close();});});
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&!document.querySelector('dialog[open]'))close();
      if(e.key==='Tab'&&dock.classList.contains('open')){var nodes=Array.from(dock.querySelectorAll('a,button,summary')).filter(function(n){return n.getClientRects().length;});var first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    });
    var narrow=matchMedia('(max-width:899px)');if(narrow.addEventListener)narrow.addEventListener('change',function(e){if(!e.matches)close();});
    setWorkspaceCurrent(opts.page==='index'?'home':'library');
  }

  // ---- In-page copy and sync-key dialogs; no native prompts or implicit sends. ----
  var textDialog=null, textDialogMode='', textDialogSave=null, textDialogReturnFocus=null, textDialogSession=0;
  function textField(id){ return document.getElementById(id); }
  function ensureTextDialog(){
    if(textDialog) return;
    textDialog=el('<dialog id="textDialog" class="text-dialog" aria-labelledby="textDialogTitle" aria-describedby="textDialogHelp">'+
      '<h2 id="textDialogTitle"></h2><p id="textDialogHelp"></p>'+
      '<label id="textDialogLabel" for="textDialogText">Text to copy</label>'+
      '<textarea id="textDialogText" rows="6" readonly spellcheck="false"></textarea>'+
      '<input id="textDialogKey" type="password" autocomplete="off" spellcheck="false" autocapitalize="off" hidden>'+
      '<div class="text-dialog-actions"><button type="button" id="textDialogSelect">Select text</button>'+
      '<button type="button" id="textDialogCopy">Copy text</button><button type="button" id="textDialogSave">Save key</button>'+
      '<button type="button" id="textDialogClear">Clear saved key</button><button type="button" id="textDialogClose">Cancel</button></div>'+
      '<p id="textDialogMessage" role="status" aria-live="polite"></p></dialog>');
    document.body.appendChild(textDialog);
    textField('textDialogSelect').addEventListener('click',selectTextDialog);
    textField('textDialogCopy').addEventListener('click',copyTextDialog);
    textField('textDialogSave').addEventListener('click',function(){saveTextDialogKey(false);});
    textField('textDialogClear').addEventListener('click',function(){saveTextDialogKey(true);});
    textField('textDialogClose').addEventListener('click',function(){textDialog.close();});
    textField('textDialogKey').addEventListener('keydown',function(event){
      if(event.key==='Enter' && !event.isComposing){event.preventDefault();saveTextDialogKey(false);}
    });
    textDialog.addEventListener('cancel',function(event){event.preventDefault();textDialog.close();});
    textDialog.addEventListener('close',function(){
      textDialogSession++; textField('textDialogKey').value=''; textField('textDialogText').value='';
      textDialogSave=null; textDialogMode='';
      if(textDialogReturnFocus && textDialogReturnFocus.isConnected) textDialogReturnFocus.focus();
    });
  }
  function showTextDialog(mode,title,text,returnFocus,save){
    ensureTextDialog(); textDialogSession++; textDialogMode=mode; textDialogSave=save||null;
    textDialogReturnFocus=returnFocus||document.activeElement;
    var keyMode=mode==='key';
    textField('textDialogTitle').textContent=title;
    textField('textDialogHelp').textContent=keyMode
      ? 'Use the key for your authorized private endpoint. Saving or clearing it sends nothing. Existing keys are never shown.'
      : 'Select and copy this text. Nothing is sent until you choose where to paste or share it.';
    textField('textDialogLabel').textContent=keyMode?'New sync key':'Text to copy';
    textField('textDialogLabel').htmlFor=keyMode?'textDialogKey':'textDialogText';
    textField('textDialogText').value=keyMode?'':text; textField('textDialogText').hidden=keyMode;
    textField('textDialogKey').value=''; textField('textDialogKey').hidden=!keyMode;
    ['Select','Copy'].forEach(function(name){textField('textDialog'+name).hidden=keyMode;});
    ['Save','Clear'].forEach(function(name){textField('textDialog'+name).hidden=!keyMode;});
    textField('textDialogClose').textContent=keyMode?'Cancel':'Done';
    textField('textDialogMessage').textContent=keyMode?'':'Clipboard access is unavailable here. Use Select text and your browser’s Copy command.';
    textDialog.showModal();
    if(keyMode) textField('textDialogKey').focus(); else selectTextDialog();
  }
  function selectTextDialog(){var field=textField('textDialogText');field.focus();field.select();}
  async function copyTextDialog(){
    var session=textDialogSession, text=textField('textDialogText').value; selectTextDialog();
    try{
      if(!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if(session===textDialogSession) textField('textDialogMessage').textContent='Text copied.';
    }catch(_){
      if(session===textDialogSession) textField('textDialogMessage').textContent='Clipboard access is unavailable here. The text is selected: use your browser’s Copy command.';
    }
  }
  function saveTextDialogKey(clear){
    if(textDialogMode!=='key' || !textDialogSave) return;
    var next=clear?'':textField('textDialogKey').value.trim(), error;
    if(!clear && !next){textField('textDialogMessage').textContent='Enter a key, or choose Clear saved key.';textField('textDialogKey').focus();return;}
    try{error=textDialogSave(next);}catch(_){error='The browser could not save the key. Your current setting is unchanged.';}
    if(error){textField('textDialogMessage').textContent=error;return;}
    textDialog.close();
  }
  async function copyText(text,title){
    var returnFocus=document.activeElement;
    try{
      if(!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text); return true;
    }catch(_){showTextDialog('copy',title||'Copy text',text,returnFocus);return false;}
  }
  function editSyncKey(save){showTextDialog('key','Sync key for this browser','',document.activeElement,save);}

  /* One call per page. Renders the dock and syncs the theme icon.
     Greeting stays in the page (config-driven, async). Runs synchronously
     when the dock mount already exists; otherwise waits for the DOM. */
  function init(opts){
    function run(){ initDock(opts); updateThemeIcon(); }
    if(document.getElementById('dock')) run();
    else if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
  }

  return { setWorkspaceCurrent:setWorkspaceCurrent, init:init, copyText:copyText, editSyncKey:editSyncKey };
})();
