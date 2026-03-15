const uid = "tab123";
const code = `
const ID = '${uid}';
let tabs = [
    { id: 't1', label: 'Tab 1' },
    { id: 't2', label: 'Tab 2' }
];
let activeId = 't1';
let nextId = 3;

function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

window['TABS_'+ID] = {
    switchTab: function(id) { activeId = id; console.log("switch", id); },
    addTab: function() { const newId = 't'+nextId++; tabs.push({id:newId, label:'New Tab'}); activeId=newId; console.log("add"); },
    removeTab: function() { if(tabs.length<=1)return; tabs=tabs.filter(t=>t.id!==activeId); activeId=tabs[0].id; console.log("rm"); },
    updateLabel: function(id, text) { const t=tabs.find(t=>t.id===id); if(t)t.label=text; console.log("update", text); }
};
`;

try { eval(code); console.log("Tab JS valid!"); } catch(e) { console.error("Syntax Error", e); }
