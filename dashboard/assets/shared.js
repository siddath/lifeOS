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
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
    dock.addEventListener('click', function(e){ if(e.target.closest('a')) close(); });
  }

  /* One call per page. Renders the dock and syncs the theme icon.
     Greeting stays in the page (config-driven, async). Runs synchronously
     when the dock mount already exists; otherwise waits for the DOM. */
  function init(opts){
    function run(){ initDock(opts); updateThemeIcon(); }
    if(document.getElementById('dock')) run();
    else if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
  }

  return { init:init };
})();
