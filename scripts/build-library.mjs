#!/usr/bin/env node
// Snapshot public repository guides into the dashboard-only deployment; no private input.
import {execFileSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync,existsSync,unlinkSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const paths=execFileSync('git',['ls-files','-z','--cached','--others','--exclude-standard','--','*.md'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
const indexFile=resolve(root,'dashboard/library/index.json');
const previous=existsSync(indexFile)?JSON.parse(readFileSync(indexFile,'utf8')).documents:[];
const documents=[];
for(const path of paths){
 if(path.startsWith('dashboard/library/')||path.startsWith('dashboard/assets/vendor/')||path.startsWith('worksheets/')||path.split('/').some(s=>s.startsWith('.'))||['AGENTS.md','CLAUDE.md','TODOS.md'].includes(path))continue;
 const text=readFileSync(resolve(root,path),'utf8');
 const heading=/^#\s+(.+)$/m.exec(text),title=(heading?heading[1]:path.split('/').pop()).replace(/[*`]/g,'');
 const dest=resolve(root,'dashboard/library/source',path);mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,text);documents.push({path,title});
}
const current=new Set(documents.map(item=>item.path));
for(const old of previous){
 if(current.has(old.path))continue;
 if(typeof old.path!=='string'||old.path.startsWith('/')||old.path.split('/').some(part=>!part||part.startsWith('.'))||/[\\%?:#]/.test(old.path))throw new Error('Unsafe prior bundle path');
 const stale=resolve(root,'dashboard/library/source',old.path);if(existsSync(stale))unlinkSync(stale);
}
documents.sort((a,b)=>a.title.localeCompare(b.title));
writeFileSync(resolve(root,'dashboard/library/index.json'),JSON.stringify({version:1,scope:'Public template guides only',documents},null,2)+'\n');
console.log(`${documents.length} public guides bundled`);
