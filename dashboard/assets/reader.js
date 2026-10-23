/* A token reader, never an HTML parser. Document locations come from the public bundle. */
(function(){
'use strict';
function allowedPath(value){return typeof value==='string'&&value.length>0&&!value.startsWith('/')&&!value.includes('\\')&&!/[\u0000-\u001f%?#:]/.test(value)&&value.split('/').every(function(part){return part&&!part.startsWith('.');})&&value.endsWith('.md');}
function safeLink(value,source){try{var url=new URL(value,source);return ['https:','http:','mailto:','tel:'].includes(url.protocol)?url:null;}catch(_){return null;}}
function bodyOnly(text){return text.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/,'');}
function render(tokens,doc,source,documents){
 var result=doc.createDocumentFragment(),used=new Set(),tableCount=0;
 function make(tag,text){var element=doc.createElement(tag);if(text!==undefined)element.textContent=text;return element;}
 function inlineText(value){return String(value||'').replace(/&(amp|lt|gt|quot|apos|nbsp);/g,function(_,key){return {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[key];});}
 function address(value){var url=safeLink(value,'https://repository.invalid/'+source);if(!url)return null;if(url.origin==='https://repository.invalid'){var path;try{path=decodeURIComponent(url.pathname.slice(1));}catch(_){return null;}if(documents.some(function(item){return item.path===path;}))return 'reader.html?doc='+encodeURIComponent(path)+url.hash;return 'https://github.com/siddath/lifeOS/blob/main/'+url.pathname.slice(1)+url.hash;}return url.href;}
 function fill(parent,items){(items||[]).forEach(function(token){var element;
  switch(token.type){
   case 'space':case 'checkbox':return;
   case 'text':if(token.tokens){fill(parent,token.tokens);return;}parent.appendChild(doc.createTextNode(inlineText(token.text)));return;
   case 'escape':parent.appendChild(doc.createTextNode(inlineText(token.text)));return;
   case 'heading':element=make('h'+Math.min(6,Math.max(1,token.depth)));fill(element,token.tokens);var base=element.textContent.toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu,'').trim().replace(/\s+/g,'-')||'section',id=base,n=1;while(used.has(id))id=base+'-'+n++;used.add(id);element.id=id;break;
   case 'paragraph':element=make('p');fill(element,token.tokens);break;
   case 'strong':case 'em':case 'del':element=make(token.type);fill(element,token.tokens);break;
   case 'codespan':element=make('code',token.text);break;
   case 'code':element=make('pre');element.appendChild(make('code',token.text));break;
   case 'br':case 'hr':element=make(token.type);break;
   case 'blockquote':element=make('blockquote');fill(element,token.tokens);break;
   case 'list':element=make(token.ordered?'ol':'ul');if(token.ordered&&Number.isFinite(token.start))element.start=token.start;(token.items||[]).forEach(function(item){var li=make('li');if(item.task)li.appendChild(make('span',item.checked?'Completed in source. ':'Not completed in source. '));fill(li,item.tokens);element.appendChild(li);});break;
   case 'link':var href=address(token.href);if(!href){fill(parent,token.tokens);return;}element=make('a');element.href=href;element.rel='noopener noreferrer';fill(element,token.tokens);break;
   case 'image':var image=address(token.href);element=make(image?'a':'span','Image: '+(token.text||'open source image'));if(image){element.href=image;element.rel='noopener noreferrer';}break;
   case 'table':element=make('div');element.className='reader-table';element.tabIndex=0;element.setAttribute('role','region');element.setAttribute('aria-label','Guide table '+(++tableCount));var table=make('table'),head=make('thead'),row=make('tr'),tbody=make('tbody');token.header.forEach(function(cell){var th=make('th');th.scope='col';fill(th,cell.tokens);row.appendChild(th);});head.appendChild(row);table.appendChild(head);token.rows.forEach(function(cells){var tr=make('tr');cells.forEach(function(cell){var td=make('td');fill(td,cell.tokens);tr.appendChild(td);});tbody.appendChild(tr);});table.appendChild(tbody);element.appendChild(table);break;
   case 'html':if(/^\s*<!--[\s\S]*-->\s*$/.test(token.text||token.raw||''))return;element=make('code',token.text||token.raw||'');break;
   default:parent.appendChild(doc.createTextNode(token.text||token.raw||''));return;
  }if(element)parent.appendChild(element);
 });}
 fill(result,tokens);return result;
}
if(typeof module!=='undefined'&&module.exports){module.exports={allowedPath,safeLink,bodyOnly,render};return;}
LifeOS.init({page:'reader',sync:false});var content=document.getElementById('readerContent'),status=document.getElementById('readerStatus'),error=document.getElementById('readerError'),path=new URLSearchParams(location.search).get('doc');
async function load(){error.hidden=true;content.replaceChildren();content.setAttribute('aria-busy','true');status.textContent='Loading the guide…';try{
 if(!allowedPath(path))throw new Error('Choose a guide from the Library.');
 var response=await fetch('library/index.json',{cache:'no-store'});if(!response.ok)throw new Error('The guide directory could not load.');var catalog=await response.json(),record=catalog.documents.find(function(item){return item.path===path;});if(!record)throw new Error('This document is not in the bundled Library.');
 var url='library/source/'+path.split('/').map(encodeURIComponent).join('/'),raw=await fetch(url,{cache:'no-store'});if(!raw.ok)throw new Error('The guide could not load. Return to Library or try again.');var text=await raw.text();content.appendChild(render(marked.lexer(bodyOnly(text),{gfm:true}),document,path,catalog.documents));if(!content.querySelector('h1'))content.prepend(Object.assign(document.createElement('h1'),{textContent:record.title}));document.title=record.title+' · LifeOS';status.textContent='Read-only public template guide. Source files and browser entries are separate.';var source=document.getElementById('readerRaw');source.href=url;source.hidden=false;var fragment;try{fragment=decodeURIComponent(location.hash.slice(1));}catch(_){fragment='';}var target=fragment&&content.querySelectorAll('[id]');if(target){var anchor=Array.from(target).find(function(el){return el.id===fragment;});if(anchor)anchor.scrollIntoView();}
 }catch(problem){status.textContent='';error.hidden=false;document.getElementById('readerErrorText').textContent=problem.message||'The guide is unavailable.';}finally{content.setAttribute('aria-busy','false');}}
document.getElementById('readerRetry').addEventListener('click',load);load();
})();
