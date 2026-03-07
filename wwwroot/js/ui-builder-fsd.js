/* ═══════════════════════════════════════════════════════════
   FSD (Functional Specification Document) Module - Drag & Drop Maker
   ═══════════════════════════════════════════════════════════ */

const FSD = {
    pages: [{ id: 'fsd-page-1', num: '1', name: 'Halaman User', html: '' }],
    currentPageId: 'fsd-page-1',
    compTemplates: {
        'landscape': `<div class="fsd-comp mb-4 border rounded bg-white p-3"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-circle-info text-primary me-2"></i>General Information</h5><textarea class="form-control" rows="3" placeholder="Jelaskan informasi umum, deskripsi fitur, atau catatan tambahan terkait bab ini di sini..."></textarea></div>`,
        'process': `<div class="fsd-comp mb-4 border rounded bg-white p-3"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-random text-primary me-2"></i>As-Is vs To-Be Process</h5><div class="mb-3"><label class="fw-bold small text-muted">As-Is Process (Current)</label><textarea class="form-control" rows="4" placeholder="Proses berjalan saat ini..."></textarea></div><div><label class="fw-bold small text-muted">To-Be Process (Target)</label><textarea class="form-control" rows="4" placeholder="Target proses baru..."></textarea></div></div>`,
        'roles': `<div class="fsd-comp mb-4 border rounded bg-white p-3 table-comp"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-user-shield text-primary me-2"></i>User Role Access & Entitlements</h5><table class="table table-sm table-bordered mb-0"><thead><tr class="table-light"><th>Role / Actor</th><th>Target Access / Menu</th><th>Permissions (CRUD)</th><th class="fsd-hide-pdf" style="width: 50px;">Act</th></tr></thead><tbody><tr><td contenteditable="true">Admin</td><td contenteditable="true">All Menus</td><td contenteditable="true">CRUD</td><td class="fsd-hide-pdf"><button class="btn btn-sm text-danger p-1" onclick="FSD.removeRow(this)"><i class="fas fa-trash"></i></button></td></tr></tbody></table><button class="btn btn-sm btn-outline-primary mt-2" onclick="FSD.addRow(this, 3)"><i class="fas fa-plus"></i> Add Role Rule</button></div>`,
        'form': `<div class="fsd-comp mb-4 border rounded bg-white p-3 table-comp"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-table-list text-primary me-2"></i>Form & Field Design Limits</h5><table class="table table-sm table-bordered mb-0"><thead><tr class="table-light"><th>Field Name</th><th>Description / Label</th><th style="width: 80px;">M/O</th><th>Data Type & Len</th><th>Logic / Rules</th><th class="fsd-hide-pdf" style="width: 50px;">Act</th></tr></thead><tbody><tr><td contenteditable="true">Username</td><td contenteditable="true">Login User Name Handle</td><td><select class="form-select form-select-sm"><option value="M">M</option><option value="O">O</option></select></td><td contenteditable="true">Varchar(50)</td><td contenteditable="true">Must be unique</td><td class="fsd-hide-pdf"><button class="btn btn-sm text-danger p-1" onclick="FSD.removeRow(this)"><i class="fas fa-trash"></i></button></td></tr></tbody></table><button class="btn btn-sm btn-outline-primary mt-2" onclick="FSD.addFormRow(this)"><i class="fas fa-plus"></i> Add Form Field</button></div>`,
        'datatable': `<div class="fsd-comp mb-4 border rounded bg-white p-3 table-comp"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-table text-primary me-2"></i>Data Table Grid Specifications</h5><table class="table table-sm table-bordered mb-0"><thead><tr class="table-light"><th>Column Label</th><th>Source Data / Model</th><th>Format Pattern</th><th>Search/Sort</th><th class="fsd-hide-pdf" style="width: 50px;">Act</th></tr></thead><tbody><tr><td contenteditable="true">Created Date</td><td contenteditable="true">DB.created_at</td><td contenteditable="true">dd-MM-yyyy HH:mm</td><td contenteditable="true">Both</td><td class="fsd-hide-pdf"><button class="btn btn-sm text-danger p-1" onclick="FSD.removeRow(this)"><i class="fas fa-trash"></i></button></td></tr></tbody></table><button class="btn btn-sm btn-outline-primary mt-2" onclick="FSD.addRow(this, 4)"><i class="fas fa-plus"></i> Add Grid Col</button></div>`,
        'prototype': `<div class="fsd-comp mb-4 border rounded bg-white p-3 fsd-page-break"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-desktop text-primary me-2"></i>Design</h5><div class="mb-3"><button class="btn btn-sm btn-outline-primary fsd-prototype-control" onclick="FSD.loadPrototype(this)"><i class="fa-solid fa-link"></i> Link to Prototype Page</button></div><div class="fsd-prototype-preview border bg-light p-3 rounded" style="min-height: 100px; pointer-events: none; overflow: hidden;"><i class="text-muted fsd-prototype-placeholder">Select a prototype page to render here...</i></div></div>`,
        'erd': `<div class="fsd-comp mb-4 border rounded bg-white p-3 fsd-page-break"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-project-diagram text-primary me-2"></i>Entity Relationship (ERD) Schema</h5><div class="mb-3"><button class="btn btn-sm btn-outline-primary" onclick="FSD.loadERD(this)"><i class="fa-solid fa-sync"></i> Refresh from ERD Canvas</button></div><div class="fsd-erd-preview p-2 rounded" style="min-height: 100px;"><i class="text-muted">Click refresh to fetch current ERD structure...</i></div></div>`
    },

    init() {
        if (!this.initialized) {
            this.initialized = true;
            this.renderPagesList();
            this.switchPage(this.currentPageId);
        }
    },

    renderPagesList() {
        const list = document.getElementById('fsdPagesList');
        if (!list) return;
        list.innerHTML = '';
        this.pages.forEach((page) => {
            const isActive = page.id === this.currentPageId;
            const item = document.createElement('div');
            item.className = `page-item ${isActive ? 'active' : ''}`;
            item.onclick = () => this.switchPage(page.id);
            let html = `<span><i class="far fa-file-alt me-2 text-primary"></i> <b contenteditable="${isActive}" onblur="FSD.renamePageNum('${page.id}', this.innerText)" onclick="event.stopPropagation()">${page.num}</b> - <span contenteditable="${isActive}" onblur="FSD.renamePageName('${page.id}', this.innerText)" onclick="event.stopPropagation()">${page.name}</span></span>`;
            if (this.pages.length > 1) html += `<button class="btn btn-sm text-danger p-0" onclick="event.stopPropagation(); FSD.deletePage('${page.id}')"><i class="fas fa-trash"></i></button>`;
            item.innerHTML = html;
            list.appendChild(item);
        });
    },

    switchPage(id) {
        if (id === this.currentPageId && document.getElementById('fsdCanvas').innerHTML.trim() !== '') return;

        // Save current page html
        const canvas = document.getElementById('fsdCanvas');
        if (canvas) {
            const cd = this.pages.find(p => p.id === this.currentPageId);
            if (cd) cd.html = canvas.innerHTML;
        }

        this.currentPageId = id;
        const nd = this.pages.find(p => p.id === id);

        let targetHtml = nd ? nd.html : '';
        if (!targetHtml || targetHtml.trim() === '') {
            // Auto inject base FSD drop zone if blank
            targetHtml = `<div class="fsd-header mb-4" style="border-bottom: 2px solid var(--primary); padding-bottom: 16px;">
                    <h2 style="font-weight: 800; color: #0f172a;"><span contenteditable="true">${nd?.num || '1'}</span>. <span contenteditable="true">${nd?.name || 'FSD Concept'}</span></h2>
                    <p style="color:var(--text-muted);margin:0;font-size:14px;font-weight:600;text-transform:uppercase;">Technical / Functional specification</p>
                </div>
                <div class="drop-zone nested-drop fsd-drop-zone" style="min-height:300px; padding:10px; border:2px dashed transparent;" ondrop="FSD.drop(event)" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)"></div>`;
        }

        if (canvas) canvas.innerHTML = targetHtml;
        this.renderPagesList();
    },

    addNewPage() {
        document.getElementById('newFsdPageNumInput').value = '';
        document.getElementById('newFsdPageNameInput').value = '';
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('addFsdPageModal'));
        modal.show();
    },

    confirmAddPage() {
        const num = document.getElementById('newFsdPageNumInput').value.trim() || ((this.pages.length > 0 ? parseFloat(this.pages[this.pages.length - 1].num) : 0) + 1).toString();
        const name = document.getElementById('newFsdPageNameInput').value.trim() || 'Undocumented Spec';

        const newId = 'fsd-page-' + Date.now();
        const canvas = document.getElementById('fsdCanvas');
        if (canvas) {
            const cd = this.pages.find(p => p.id === this.currentPageId);
            if (cd) cd.html = canvas.innerHTML;
            canvas.innerHTML = '';
        }

        this.pages.push({ id: newId, num: num, name: name, html: '' });
        this.currentPageId = newId;
        this.renderPagesList();
        this.switchPage(newId);

        const modal = bootstrap.Modal.getInstance(document.getElementById('addFsdPageModal'));
        if (modal) modal.hide();
    },

    deletePage(id) {
        if (confirm("Delete this entire FSD Page?")) {
            this.pages = this.pages.filter(p => p.id !== id);
            if (this.currentPageId === id) this.switchPage(this.pages[0].id);
            else this.renderPagesList();
        }
    },

    renamePageNum(id, newNum) { const p = this.pages.find(x => x.id === id); if (p) p.num = newNum; },
    renamePageName(id, newName) { const p = this.pages.find(x => x.id === id); if (p) p.name = newName; },

    drag(ev) {
        ev.dataTransfer.setData("fsd-type", ev.target.getAttribute('data-fsd-type'));
    },

    drop(ev) {
        ev.preventDefault(); ev.stopPropagation();
        document.querySelectorAll('.active-drag').forEach(el => el.classList.remove('active-drag'));
        let target = ev.target;
        if (!target.classList.contains('fsd-drop-zone') && !target.classList.contains('nested-drop')) target = target.closest('.drop-zone');
        if (!target) target = document.querySelector('.fsd-drop-zone.nested-drop') || document.getElementById('fsdCanvas');
        if (!target) return;

        const type = ev.dataTransfer.getData("fsd-type");
        if (type && this.compTemplates[type]) {
            const w = document.createElement('div');
            w.className = 'canvas-element fsd-element';
            w.innerHTML = `<div class="canvas-element-actions" style="right:-10px; top:-10px;">
                    <button class="action-btn" title="Move Up" onclick="FSD.moveEl(this,-1)"><i class="fa-solid fa-arrow-up"></i></button>
                    <button class="action-btn" title="Move Down" onclick="FSD.moveEl(this,1)"><i class="fa-solid fa-arrow-down"></i></button>
                    <button class="action-btn delete" title="Remove Comp" onclick="FSD.deleteEl(this)"><i class="fa-solid fa-trash"></i></button>
                </div>` + this.compTemplates[type];
            target.appendChild(w);
        }
    },

    deleteEl(btn) { btn.closest('.canvas-element').remove(); },
    moveEl(btn, dir) {
        const el = btn.closest('.canvas-element'), p = el.parentNode;
        if (dir === -1 && el.previousElementSibling && el.previousElementSibling.classList.contains('canvas-element')) p.insertBefore(el, el.previousElementSibling);
        else if (dir === 1 && el.nextElementSibling) p.insertBefore(el.nextElementSibling, el);
    },

    addRow(btn, cols) {
        let tdHtml = '';
        for (let i = 0; i < cols; i++) tdHtml += '<td contenteditable="true">...</td>';
        tdHtml += `<td class="fsd-hide-pdf"><button class="btn btn-sm text-danger p-1" onclick="FSD.removeRow(this)"><i class="fas fa-trash"></i></button></td>`;

        const tbody = btn.closest('.table-comp').querySelector('tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = tdHtml;
        tbody.appendChild(tr);
    },

    addFormRow(btn) {
        const tdHtml = `<td contenteditable="true">New Field</td><td contenteditable="true">Desc</td><td><select class="form-select form-select-sm"><option value="M">M</option><option value="O">O</option></select></td><td contenteditable="true">String()</td><td contenteditable="true">None</td><td class="fsd-hide-pdf"><button class="btn btn-sm text-danger p-1" onclick="FSD.removeRow(this)"><i class="fas fa-trash"></i></button></td>`;
        const tbody = btn.closest('.table-comp').querySelector('tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = tdHtml;
        tbody.appendChild(tr);
    },

    removeRow(btn) {
        btn.closest('tr').remove();
    },

    loadPrototype(btn) {
        if (typeof pages === 'undefined') return;
        let sel = '<select class="form-select w-auto d-inline-block fsd-prototype-control" onchange="FSD.renderPrototype(this)"><option value="">-- Choose Prototype Page --</option>';
        pages.forEach(p => {
            sel += `<option value="${p.id}">${p.name}</option>`;
        });
        sel += '</select>';
        btn.outerHTML = sel;
    },

    renderPrototype(select) {
        const id = select.value;
        const container = select.closest('.fsd-comp').querySelector('.fsd-prototype-preview');
        if (!id) {
            container.innerHTML = '<i class="text-muted fsd-prototype-placeholder">Select a prototype page to render here...</i>';
            return;
        }

        let targetHtml = '';
        if (typeof currentPageId !== 'undefined' && id === currentPageId) {
            const protoCanvas = document.getElementById('mainCanvas');
            if (protoCanvas) targetHtml = protoCanvas.innerHTML;
        } else {
            const p = pages.find(x => x.id === id);
            if (p) targetHtml = p.html;
        }

        if (targetHtml) {
            const div = document.createElement('div');
            div.innerHTML = targetHtml;
            div.querySelectorAll('.canvas-element-actions').forEach(a => a.remove());
            div.querySelectorAll('.drop-zone').forEach(dz => {
                dz.classList.remove('drop-zone', 'active-drag', 'nested-drop');
                ["ondrop", "ondragover", "ondragenter", "ondragleave"].forEach(attr => dz.removeAttribute(attr));
                if (dz.classList.length === 0) dz.removeAttribute('class');
            });
            div.querySelectorAll('[contenteditable]').forEach(e => e.removeAttribute('contenteditable'));

            // Clear styles interfering with static preview
            div.style.pointerEvents = "none";
            container.innerHTML = div.innerHTML || '<div class="text-muted fst-italic">Empty Prototype Page</div>';
        } else {
            container.innerHTML = '<div class="text-muted fst-italic">Empty Prototype Page</div>';
        }
    },

    loadERD(btn) {
        if (typeof ERD === 'undefined' || !ERD.entities) {
            btn.closest('.fsd-comp').querySelector('.fsd-erd-preview').innerHTML = '<span class="text-danger">ERD Builder is not accessible. Go to ERD tab first.</span>';
            return;
        }
        let html = '<div class="row g-3">';
        ERD.entities.forEach(ent => {
            html += `<div class="col-md-6 position-relative erd-fsd-ent">
                        <button class="btn btn-sm text-danger position-absolute top-0 end-0" onclick="this.closest('.erd-fsd-ent').remove()" title="Remove this entity from spec"><i class="fas fa-trash"></i></button>
                        <h6 class="mb-2 fw-bold text-success"><i class="fa-solid fa-table me-1"></i>${ent.name}</h6>`;
            html += `<table class="table table-sm table-bordered shadow-sm bg-white" style="font-size:12px;"><thead><tr class="table-light"><th>Column Name</th><th>Data Type</th><th>Modifiers</th></tr></thead><tbody>`;
            ent.fields.forEach(f => {
                let flags = [];
                if (f.pk) flags.push('<span class="badge bg-warning text-dark"><i class="fa-solid fa-key"></i> PK</span>');
                if (f.isFK) flags.push('<span class="badge bg-info text-dark">FK</span>');
                if (!f.allowNull && !f.pk) flags.push('<span class="badge bg-secondary">Required</span>');
                html += `<tr><td><strong>${f.name}</strong></td><td><code class="text-pink">${f.type}</code></td><td>${flags.join(' ')}</td></tr>`;
            });
            html += `</tbody></table></div>`;
        });
        html += '</div>';

        if (ERD.relationships && ERD.relationships.length > 0) {
            html += `<div class="mt-4"><h6 class="mb-2 fw-bold text-info"><i class="fa-solid fa-link me-1"></i>Relationships</h6>`;
            html += `<ul class="list-group list-group-sm" style="font-size:13px;">`;
            ERD.relationships.forEach(r => {
                const from = ERD.entities.find(e => e.id === r.from);
                const to = ERD.entities.find(e => e.id === r.to);
                html += `<li class="list-group-item d-flex justify-content-between align-items-center position-relative erd-fsd-rel">
                            <span><strong>${from ? from.name : '?'}</strong> <i class="fa-solid fa-arrow-right mx-2 text-muted"></i> <strong>${to ? to.name : '?'}</strong> <span class="badge bg-light text-dark border ms-2">${r.label}</span></span>
                            <button class="btn btn-sm text-danger p-0" onclick="this.closest('.erd-fsd-rel').remove()" title="Remove relation"><i class="fas fa-trash"></i></button>
                         </li>`;
            });
            html += `</ul></div>`;
        }

        const container = btn.closest('.fsd-comp').querySelector('.fsd-erd-preview');
        container.innerHTML = ERD.entities.length ? html : '<i class="text-muted">No entities found. Create entities in ERD Builder first.</i>';

        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Refreshed';
        btn.classList.add('btn-success');
        btn.classList.remove('btn-outline-primary');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-outline-primary');
        }, 2000);
    }
};

window.FSD = FSD;
