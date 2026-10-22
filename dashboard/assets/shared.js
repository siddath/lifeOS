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
  function initDock(opts){
    var page = opts.page, dock = document.getElementById('dock');
    if(!dock) return;
    var onIndex = page === 'index';
    var html = '';

    if(opts.sync){
      html += '<div class="dock-sync">' +
        '<button class="dock-btn dock-sync-btn" id="dockSyncBtn" onclick="flushQueue()" aria-live="polite" title="Sync status — click to push now">' +
          '<span class="status-dot" data-sync-dot></span><span class="dock-label" data-sync-text>Local only</span></button>' +
        '<button class="dock-btn" onclick="pullFromNotion()" title="Pull from Notion">⬇ <span class="dock-label">Pull</span></button>' +
        '<button class="dock-btn" onclick="flushQueue()" title="Push to Notion">⬆ <span class="dock-label">Push</span></button>' +
      '</div>';
    } else {
      html += '<div class="dock-sync">' +
        '<a class="dock-btn" href="index.html" title="Open the dashboard"><span class="status-dot"></span> ' +
        '<span class="dock-label">Dashboard</span></a></div>';
    }
    html += '<div class="dock-sep" role="presentation"></div><div class="dock-nav">';
    SECTIONS.forEach(function(s){
      var href = onIndex ? s.href : 'index.html' + s.href;
      html += '<a class="dock-btn" href="' + href + '" title="' + s.title + '">' +
              s.icon + ' <span class="dock-label">' + s.label + '</span></a>';
    });
    html += '</div><div class="dock-sep" role="presentation"></div><div class="dock-pages">';
    PAGES.forEach(function(p){
      var current = p.key === page ? ' aria-current="page"' : '';
      html += '<a class="dock-btn" href="' + p.href + '"' + current + ' title="' + p.title + '">' +
              p.icon + ' <span class="dock-label">' + p.label + '</span></a>';
    });
    html += '</div>';
    if(onIndex) html += '<div class="dock-thread" aria-hidden="true"><div id="dockThreadFill"></div></div>';
    dock.innerHTML = html;

    var fab = document.getElementById('dockFab');
    if(!fab){
      fab = el('<button id="dockFab" class="dock-fab" aria-expanded="false" aria-controls="dock" ' +
               'aria-label="Open navigation">🧭' + (opts.sync ? '<span class="status-dot fab-dot" data-sync-dot></span>' : '') + '</button>');
      dock.insertAdjacentElement('afterend', fab);
    }
    var scrim = document.getElementById('dockScrim');
    if(!scrim){
      scrim = el('<div id="dockScrim" class="dock-scrim" hidden></div>');
      fab.insertAdjacentElement('afterend', scrim);
    }
    function open(){ dock.classList.add('open'); fab.setAttribute('aria-expanded','true'); scrim.hidden=false;
      var f=dock.querySelector('.dock-btn'); if(f) f.focus(); }
    function close(){ if(!dock.classList.contains('open')) return; dock.classList.remove('open');
      fab.setAttribute('aria-expanded','false'); scrim.hidden=true; fab.focus(); }
    fab.addEventListener('click', function(){ dock.classList.contains('open') ? close() : open(); });
    scrim.addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && !document.querySelector('dialog[open]')) close(); });
    dock.addEventListener('click', function(e){ if(e.target.closest('a')) close(); });
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

  return { init:init, copyText:copyText, editSyncKey:editSyncKey };
})();
