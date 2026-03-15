const ID = "xxx";
let tabs = [{id:'t1', label:'Tab 1'}];
let activeId='t1';
const esc=s=>s;
const rNav = () => {
return tabs.map(t => {
            const isActive = t.id === activeId;
            return '<li class="nav-item"><button class="nav-link ' + (isActive ? 'active' : '') + '" style="outline:none;border-bottom:none;background:'+(isActive?'#fff':'transparent')+';" onblur="TABS_'+ID+'.lbl(&quot;'+t.id+'&quot;, this.innerText)" '+(isActive?'contenteditable="true"':'onclick="TABS_'+ID+'.sw(&quot;'+t.id+'&quot;)"')+'>' + esc(t.label) + '</button></li>';
        }).join('');
}

console.log(rNav());
