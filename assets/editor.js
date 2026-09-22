(() => {
  'use strict';
  // Authoring is intentionally available only on a local preview.
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname)) return;
  const KEY = 'archaeobiomics.visual-editor.v1';
  const pageName = location.pathname.split('/').pop() || 'index.html';
  const clone = value => JSON.parse(JSON.stringify(value));
  const empty = () => ({texts: {}, hidden: []});
  const readStore = () => {
    const value = JSON.parse(localStorage.getItem(KEY) || '{"version":1,"pages":{}}');
    if (value.version !== 1 || !value.pages || typeof value.pages !== 'object') throw Error('Formato de borrador no reconocido.');
    return value;
  };
  let initialError = '', state;
  try { state = clone(readStore().pages[pageName] || empty()); }
  catch (e) { state = empty(); initialError = 'No se pudo leer el borrador. Exporta una copia antes de cerrar.'; }
  function annotate(doc) {
    const candidates = [...doc.querySelectorAll('main h1,main h2,main h3,main p,main li,main dt,main dd,main a,main .tags span,main .year,main .status-pill,main .art-caption span,main .intro-strip strong,main .intro-strip > span')];
    // Never nest editable regions or include controls/status messages in them.
    const editable = candidates.filter(el => !el.id && !el.querySelector('input,select,button') && !candidates.some(other => other !== el && el.contains(other)));
    editable.forEach((el, i) => { el.dataset.editText = `text-${i}`; });
    const blocks = [...doc.querySelectorAll('main section, main article, main .page-head, main .intro-strip, main .teaching-overview, main .contact-panel')];
    blocks.forEach((el, i) => { el.dataset.editBlock = `block-${i}`; });
    return {editable, blocks};
  }
  function safeHTML(html) {
    const parsed = new DOMParser().parseFromString(String(html), 'text/html');
    const box = document.createElement('div');
    function copy(node, parent) {
      if (node.nodeType === 3) { parent.append(document.createTextNode(node.textContent)); return; }
      if (node.nodeType !== 1 || ['SCRIPT','STYLE','IFRAME','OBJECT'].includes(node.tagName)) return;
      if (['EM','STRONG','BR','SPAN'].includes(node.tagName)) {
        const el = document.createElement(node.tagName.toLowerCase()); parent.append(el);
        node.childNodes.forEach(child => copy(child, el));
      } else {
        if (['DIV','P'].includes(node.tagName) && parent.childNodes.length) parent.append(document.createElement('br'));
        node.childNodes.forEach(child => copy(child, parent));
      }
    }
    parsed.body.childNodes.forEach(node => copy(node, box));
    return box.innerHTML;
  }
  const {editable, blocks} = annotate(document);
  const originals = new Map(editable.map(el => [el.dataset.editText, el.innerHTML]));
  const labels = new Map(blocks.map((el, i) => [el.dataset.editBlock, (el.matches('article') ? 'Ficha: ' : 'Sección: ') + (el.querySelector('h1,h2,h3')?.textContent || el.textContent).trim().replace(/\s+/g,' ').slice(0,68) || `Apartado ${i+1}`]));
  function apply(doc, draft, restore = false) {
    doc.querySelectorAll('[data-edit-text]').forEach(el => {
      const id = el.dataset.editText;
      if (Object.hasOwn(draft.texts || {}, id)) el.innerHTML = safeHTML(draft.texts[id]);
      else if (restore) el.innerHTML = originals.get(id);
    });
    doc.querySelectorAll('[data-edit-block]').forEach(el => {
      if ((draft.hidden || []).includes(el.dataset.editBlock)) el.dataset.editorHidden = 'true';
      else delete el.dataset.editorHidden;
    });
  }
  apply(document, state, true);
  let active = false, history = [clone(state)], historyIndex = 0;
  const ui = document.createElement('aside'); ui.id = 'visual-editor'; ui.setAttribute('aria-label','Editor visual local');
  ui.innerHTML = `<div class="editor-panel" hidden><div class="editor-top"><h2>Editar esta página</h2><button type="button" data-action="minimize" aria-label="Minimizar panel">Minimizar</button></div><p class="editor-help">Pulsa cualquier texto con borde para escribir. Minimiza este panel si tapa el contenido. Los enlaces del menú siguen funcionando.</p><div class="editor-row"><button type="button" data-action="undo">Deshacer</button><button type="button" data-action="redo">Rehacer</button><button type="button" data-action="reset">Restaurar página</button></div><details><summary>Mostrar u ocultar apartados</summary><p>Ocultar un bloque no lo borra: puedes recuperarlo aquí. Un apartado oculto también se excluye de la web exportada.</p><div class="editor-blocks"></div></details><details><summary>Guardar y exportar</summary><p>Guardado automático en este navegador. No modifica los archivos originales ni publica en GitHub. Descarga una copia para conservarla fuera del navegador.</p><div class="editor-row"><button type="button" data-action="backup">Guardar copia</button><button type="button" data-action="import">Abrir copia</button></div><input type="file" accept="application/json,.json" hidden><button type="button" class="editor-primary editor-export" data-action="export">Exportar toda la web (.zip)</button><p>El ZIP reúne todas las páginas con tus cambios y sus imágenes, sin el editor. Sal de edición para navegar y probar los enlaces.</p></details><p class="editor-status" role="status" aria-live="polite"></p></div><div class="editor-footer"><button type="button" data-action="panel" hidden>Panel</button><button type="button" class="editor-primary editor-launch" data-action="toggle">✎ Editar página</button></div>`;
  document.body.append(ui);
  const panel = ui.querySelector('.editor-panel');
  const status = ui.querySelector('.editor-status');
  function message(text, error = false) { status.textContent = text; status.classList.toggle('editor-warning',error); }
  function save() {
    try {
      const store = readStore(); store.pages[pageName] = clone(state);
      localStorage.setItem(KEY,JSON.stringify(store)); message('Guardado en este navegador · '+new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}));
      return true;
    } catch(e) { message('No se pudo guardar. Descarga una copia antes de cerrar.',true); panel.hidden = false; return false; }
  }
  function renderButtons() {
    ui.querySelector('[data-action="undo"]').disabled = historyIndex === 0;
    ui.querySelector('[data-action="redo"]').disabled = historyIndex === history.length-1;
    const list = ui.querySelector('.editor-blocks'); list.replaceChildren();
    blocks.forEach(el => {
      const id = el.dataset.editBlock, hidden = state.hidden.includes(id);
      const row = document.createElement('div'); row.className = 'editor-block';
      const label = document.createElement('span'); label.textContent = labels.get(id);
      if(hidden)label.className='editor-hidden-label';
      const button = document.createElement('button'); button.type='button'; button.textContent=hidden?'Mostrar':'Ocultar';
      button.setAttribute('aria-label',`${hidden?'Mostrar':'Ocultar'}: ${labels.get(id)}`);
      button.onclick = () => { const next=clone(state); next.hidden=hidden?next.hidden.filter(x=>x!==id):[...next.hidden,id]; commit(next,true); };
      row.append(label,button);list.append(row);
    });
  }
  function commit(next, repaint = false) {
    if(JSON.stringify(next)===JSON.stringify(state))return;
    state=next;history=history.slice(0,historyIndex+1);history.push(clone(state));
    if(history.length>150)history.shift();historyIndex=history.length-1;
    if(repaint)apply(document,state,true);save();renderButtons();
  }
  function setActive(value) {
    active=value;document.body.classList.toggle('editor-active',active);
    editable.forEach(el => { if(active){el.contentEditable='true';el.spellcheck=true;}else{el.removeAttribute('contenteditable');el.removeAttribute('spellcheck');} });
    panel.hidden=!active;ui.querySelector('[data-action="panel"]').hidden=!active;
    ui.querySelector('[data-action="toggle"]').textContent=active?'✓ Terminar edición':'✎ Editar página';
  }
  editable.forEach(el => {
    el.addEventListener('input',()=>{if(!active)return;const next=clone(state);next.texts[el.dataset.editText]=safeHTML(el.innerHTML);commit(next);});
    el.addEventListener('click',e=>{if(active&&el.tagName==='A')e.preventDefault();});
    el.addEventListener('paste',e=>{
      if(!active)return;e.preventDefault();const text=e.clipboardData.getData('text/plain');
      const sel=window.getSelection();if(!sel.rangeCount)return;const range=sel.getRangeAt(0);range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);sel.removeAllRanges();sel.addRange(range);el.dispatchEvent(new Event('input',{bubbles:true}));
    });
    el.addEventListener('drop',e=>{if(active)e.preventDefault();});
  });
  function travel(delta){const i=historyIndex+delta;if(i<0||i>=history.length)return;historyIndex=i;state=clone(history[i]);apply(document,state,true);save();renderButtons();}
  document.addEventListener('keydown',e=>{if(active&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();travel(e.shiftKey?1:-1);}});
  function allDrafts(){let store;try{store=readStore();}catch{store={version:1,pages:{}};}store.pages[pageName]=clone(state);return store;}
  function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  async function exportSite() {
    const button=ui.querySelector('[data-action="export"]');button.disabled=true;message('Preparando todas las páginas e imágenes…');
    try{
      const drafts=allDrafts(); const response=await fetch('assets/export-manifest.json',{cache:'no-store'});if(!response.ok)throw Error('No se encuentra la lista de archivos.');
      const files=await response.json();const entries=[];
      for(const name of files){
        if(typeof name!=='string'||name.includes('..')||name.startsWith('/')||name.includes(':'))throw Error('Archivo no válido.');
        const r=await fetch(name,{cache:'no-store'});if(!r.ok)throw Error('No se pudo leer '+name);
        let data;
        if(name.endsWith('.html')){
          const doc=new DOMParser().parseFromString(await r.text(),'text/html');annotate(doc);apply(doc,drafts.pages[name]||empty());
          doc.querySelectorAll('[data-editor-hidden="true"]').forEach(el=>el.remove());
          doc.querySelectorAll('script[src="assets/editor.js"],link[href="assets/editor.css"]').forEach(el=>el.remove());
          doc.querySelectorAll('[data-edit-text],[data-edit-block]').forEach(el=>{el.removeAttribute('data-edit-text');el.removeAttribute('data-edit-block');});
          data=new TextEncoder().encode('<!doctype html>\n'+doc.documentElement.outerHTML);
        }else data=new Uint8Array(await r.arrayBuffer());
        entries.push({name,data});
      }
      download(makeZip(entries),'archaeobiomics-mi-version.zip');message('Web exportada. El ZIP contiene los cambios de todas las páginas.');
    }catch(e){message('No se pudo exportar: '+e.message,true);}finally{button.disabled=false;}
  }
  // Standard uncompressed ZIP (UTF-8 names, CRC32). No external service or dependency.
  function makeZip(entries){
    const encoder=new TextEncoder(),parts=[],central=[];let offset=0,centralLength=0;
    const table=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
    const crc32=data=>{let c=0xffffffff;for(const b of data)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
    for(const entry of entries){
      const name=encoder.encode(entry.name),data=entry.data,crc=crc32(data);
      const local=new Uint8Array(30+name.length),v=new DataView(local.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);local.set(name,30);
      const dir=new Uint8Array(46+name.length),d=new DataView(dir.buffer);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint32(16,crc,true);d.setUint32(20,data.length,true);d.setUint32(24,data.length,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);dir.set(name,46);
      parts.push(local,data);central.push(dir);offset+=local.length+data.length;centralLength+=dir.length;
    }
    const end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,entries.length,true);v.setUint16(10,entries.length,true);v.setUint32(12,centralLength,true);v.setUint32(16,offset,true);
    return new Blob([...parts,...central,end],{type:'application/zip'});
  }
  ui.addEventListener('click',e=>{
    const action=e.target.closest('[data-action]')?.dataset.action;
    if(action==='toggle')setActive(!active);
    if(action==='panel')panel.hidden=!panel.hidden;
    if(action==='minimize')panel.hidden=true;
    if(action==='undo')travel(-1);if(action==='redo')travel(1);
    if(action==='reset'&&confirm('¿Restaurar los textos y apartados originales de esta página? Puedes deshacerlo durante esta sesión.'))commit(empty(),true);
    if(action==='backup')download(new Blob([JSON.stringify(allDrafts(),null,2)],{type:'application/json'}),'archaeobiomics-borrador.json');
    if(action==='import')ui.querySelector('input[type="file"]').click();
    if(action==='export')exportSite();
  });
  ui.querySelector('input[type="file"]').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{
      if(file.size>5000000)throw Error('La copia es demasiado grande.');
      const incoming=JSON.parse(await file.text());
      if(incoming.version!==1||!incoming.pages||typeof incoming.pages!=='object')throw Error('Formato incorrecto.');
      const valid={version:1,pages:{}};
      for(const [page,draft] of Object.entries(incoming.pages)){
        if(!/^(index|research|team|publications|projects|news|teaching|contact|404)\.html$/.test(page)||!draft.texts||!Array.isArray(draft.hidden))throw Error('Página o contenido no válido.');
        const texts={};for(const [key,value] of Object.entries(draft.texts)){
          if(!/^text-\d+$/.test(key)||typeof value!=='string'||value.length>100000)throw Error('Texto no válido.');texts[key]=safeHTML(value);
        }
        if(draft.hidden.some(id=>typeof id!=='string'||!/^block-\d+$/.test(id)))throw Error('Apartado no válido.');
        valid.pages[page]={texts,hidden:[...new Set(draft.hidden)]};
      }
      if(!confirm('¿Abrir esta copia? Sustituirá las pruebas guardadas de todas las páginas. Guarda una copia antes si quieres conservarlas.'))return;
      localStorage.setItem(KEY,JSON.stringify(valid));state=clone(valid.pages[pageName]||empty());history=[clone(state)];historyIndex=0;apply(document,state,true);renderButtons();message('Copia recuperada.');
    }catch(error){message('No se pudo abrir la copia: '+error.message,true);}finally{e.target.value='';}
  });
  window.addEventListener('storage',e=>{
    if(e.key!==KEY)return;
    if(active){message('El borrador cambió en otra pestaña. Termina aquí y recarga antes de seguir editando.',true);return;}
    try{state=clone(readStore().pages[pageName]||empty());apply(document,state,true);history=[clone(state)];historyIndex=0;renderButtons();}catch{message('No se pudo leer el cambio de otra pestaña.',true);}
  });
  renderButtons();message(initialError||'Tus pruebas se guardan aquí, sin publicar en GitHub.',!!initialError);
})();
