/* ═══════════════════════════════════════════════════════════
   FSD (Functional Specification Document) Module - Drag & Drop Maker
   ═══════════════════════════════════════════════════════════ */

const FSD = {
    pages: [
        { id: 'fsd-page-cover', num: 'Cover', name: 'Document Title', html: '' },
        { id: 'fsd-page-1', num: '1.0', name: 'Halaman User', html: '' }
    ],
    currentPageId: 'fsd-page-cover',
    compTemplates: {
        'cover': `<div class="fsd-comp mb-4 bg-white p-5 fsd-page-break" style="min-height: 260mm; display:flex; flex-direction:column; position:relative; border: 1px solid transparent;"><div style="margin-bottom: 60px;"><img src="/image/kn.jpg" alt="Logo" style="max-height: 80px; max-width: 250px; cursor: pointer; padding: 5px;" onclick="const url=prompt('Enter Image URL:', this.src); if(url) this.src=url;"></div><div class="text-end mb-5"><h1 style="font-weight: 800; font-family: 'KalbeGeometric', sans-serif; font-size: 2.5rem; margin:0; outline:none;" contenteditable="true">Functional Specification</h1><p style="font-size: 1.2rem; font-weight: bold; margin-top:5px; outline:none;">Version <span contenteditable="true" style="color: #4f81bd; font-style: italic;">[1.0.0]</span></p></div><div class="text-center" style="margin-top: 70px; margin-bottom: 70px;"><h2 style="font-weight: 800; color: #4f81bd; font-style: italic; font-size: 2.2rem; text-transform: uppercase; padding: 0 20px; outline:none; line-height: 1.5;" contenteditable="true">[FPRS - SPG DAILY PRODUCTIVITY MONITORING WITH AI UTILIZATION]</h2></div><div class="text-center" style="margin-top: auto;"><h4 style="font-weight: bold; margin-bottom: 5px; outline:none;">Prepared By</h4><p style="color: #4f81bd; font-style: italic; font-size: 1.2rem; margin-bottom: 50px; outline:none;" contenteditable="true">[Albet]</p><h4 style="font-weight: bold; margin-bottom: 50px; outline:none;" contenteditable="true">PT. Sanghiang Perkasa</h4><h4 style="font-weight: bold; margin-bottom: 5px; outline:none;">Date</h4><p style="color: #4f81bd; font-style: italic; font-size: 1.2rem; outline:none;" contenteditable="true">[01/03/2026]</p></div><div style="margin-top: 60px; display:flex; justify-content:space-between; align-items:flex-end; font-size: 12px; padding-top: 20px;"><span contenteditable="true" style="outline:none;">Company Confidential &copy;</span><span contenteditable="true" style="font-weight:bold; outline:none;">1</span></div></div>`,
        'landscape': `<div class="fsd-comp mb-4 border rounded bg-white p-3"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-circle-info text-primary me-2"></i>General Information</h5><textarea class="form-control" rows="3" placeholder="Jelaskan informasi umum, deskripsi fitur, atau catatan tambahan terkait bab ini di sini..."></textarea></div>`,
        'process': `<div class="fsd-comp mb-4 border rounded bg-white p-3"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-random text-primary me-2"></i>As-Is vs To-Be Process</h5><div class="mb-3"><label class="fw-bold small text-muted">As-Is Process (Current)</label><textarea class="form-control" rows="4" placeholder="Proses berjalan saat ini..."></textarea></div><div><label class="fw-bold small text-muted">To-Be Process (Target)</label><textarea class="form-control" rows="4" placeholder="Target proses baru..."></textarea></div></div>`,
        'roles': `<div class="fsd-comp mb-4 border rounded bg-white p-3 table-comp"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-user-shield text-primary me-2"></i>User Role Access & Entitlements</h5><table class="table table-sm table-bordered mb-0"><thead><tr class="table-light"><th>Role / Actor</th><th>Target Access / Menu</th><th>Permissions (CRUD)</th><th class="fsd-hide-pdf" style="width: 50px;">Act</th></tr></thead><tbody><tr><td contenteditable="true">Admin</td><td contenteditable="true">All Menus</td><td contenteditable="true">CRUD</td><td class="fsd-hide-pdf"><button class="btn btn-sm text-danger p-1" onclick="FSD.removeRow(this)"><i class="fas fa-trash"></i></button></td></tr></tbody></table><button class="btn btn-sm btn-outline-primary mt-2" onclick="FSD.addRow(this, 3)"><i class="fas fa-plus"></i> Add Role Rule</button></div>`,
        'form': `<div class="fsd-comp mb-4 border rounded bg-white p-3 table-comp"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-table-list text-primary me-2"></i>Form & Field Design Limits</h5><table class="table table-sm table-bordered mb-0"><thead><tr class="table-light"><th>Field Name</th><th>Description / Label</th><th style="width: 80px;">M/O</th><th>Data Type & Len</th><th>Logic / Rules</th><th class="fsd-hide-pdf" style="width: 50px;">Act</th></tr></thead><tbody><tr><td contenteditable="true">Username</td><td contenteditable="true">Login User Name Handle</td><td><select class="form-select form-select-sm"><option value="M">M</option><option value="O">O</option></select></td><td contenteditable="true">Varchar(50)</td><td contenteditable="true">Must be unique</td><td class="fsd-hide-pdf"><button class="btn btn-sm text-danger p-1" onclick="FSD.removeRow(this)"><i class="fas fa-trash"></i></button></td></tr></tbody></table><button class="btn btn-sm btn-outline-primary mt-2" onclick="FSD.addFormRow(this)"><i class="fas fa-plus"></i> Add Form Field</button></div>`,
        'datatable': `<div class="fsd-comp mb-4 border rounded bg-white p-3 table-comp"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-table text-primary me-2"></i>Data Table Grid Specifications</h5><table class="table table-sm table-bordered mb-0"><thead><tr class="table-light"><th>Column Label</th><th>Source Data / Model</th><th>Format Pattern</th><th>Search/Sort</th><th class="fsd-hide-pdf" style="width: 50px;">Act</th></tr></thead><tbody><tr><td contenteditable="true">Created Date</td><td contenteditable="true">DB.created_at</td><td contenteditable="true">dd-MM-yyyy HH:mm</td><td contenteditable="true">Both</td><td class="fsd-hide-pdf"><button class="btn btn-sm text-danger p-1" onclick="FSD.removeRow(this)"><i class="fas fa-trash"></i></button></td></tr></tbody></table><button class="btn btn-sm btn-outline-primary mt-2" onclick="FSD.addRow(this, 4)"><i class="fas fa-plus"></i> Add Grid Col</button></div>`,
        'prototype': `<div class="fsd-comp mb-4 border rounded bg-white p-3 fsd-page-break"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-desktop text-primary me-2"></i>Design</h5><div class="mb-3"><button class="btn btn-sm btn-outline-primary fsd-prototype-control" onclick="FSD.loadPrototype(this)"><i class="fa-solid fa-link"></i> Link to Prototype Page</button></div><div class="fsd-prototype-preview border bg-light p-3 rounded" style="min-height: 100px; pointer-events: none; overflow: hidden;"><i class="text-muted fsd-prototype-placeholder">Select a prototype page to render here...</i></div></div>`,
        'erd': `<div class="fsd-comp mb-4 border rounded bg-white p-3 fsd-page-break"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-project-diagram text-primary me-2"></i>Entity Relationship (ERD) Schema</h5><div class="mb-3"><button class="btn btn-sm btn-outline-primary" onclick="FSD.loadERD(this)"><i class="fa-solid fa-sync"></i> Refresh from ERD Canvas</button></div><div class="fsd-erd-preview p-2 rounded" style="min-height: 100px;"><i class="text-muted">Click refresh to fetch current ERD structure...</i></div></div>`,
        'flowchart': `<div class="fsd-comp mb-4 border rounded bg-white p-3 fsd-page-break"><h5 contenteditable="true" class="mb-3 border-bottom pb-2"><i class="fa-solid fa-sitemap text-primary me-2"></i>Flowchart Diagram</h5><div class="mb-3"><button class="btn btn-sm btn-outline-primary" onclick="FSD.loadFlowchart(this)"><i class="fa-solid fa-sync"></i> Refresh from Flowchart Canvas</button></div><div class="fsd-flowchart-preview p-2 rounded" style="min-height: 200px; position: relative; overflow: hidden; background: #f8f9fa; border: 1px dashed #ced4da;"><i class="text-muted">Click refresh to capture current flowchart diagram...</i></div></div>`
    },

    init() {
        if (!this.initialized) {
            this.initialized = true;
        }
        this.renderPagesList();
        this.switchPage(this.currentPageId);
    },

    renderPagesList() {
        const list = document.getElementById('fsdPagesList');
        if (!list) return;

        // Auto-sort pages by outline numbers
        this.pages.sort((a, b) => {
            const numA = a.num ? a.num.toString().toLowerCase() : '';
            const numB = b.num ? b.num.toString().toLowerCase() : '';
            if (numA === 'cover') return -1;
            if (numB === 'cover') return 1;
            return numA.localeCompare(numB, undefined, { numeric: true, sensitivity: 'base' });
        });

        list.innerHTML = '';
        this.pages.forEach((page) => {
            const isActive = page.id === this.currentPageId;
            const item = document.createElement('div');
            item.className = `page-item ${isActive ? 'active' : ''}`;
            item.onclick = () => this.switchPage(page.id);
            const isCover = page.num && page.num.toString().toLowerCase() === 'cover';
            const editableClass = isCover ? 'false' : isActive;
            let html = `<span><i class="far fa-file-alt me-2 ${isCover ? 'text-warning' : 'text-primary'}"></i> <b contenteditable="${editableClass}" onblur="FSD.renamePageNum('${page.id}', this.innerText)" onclick="event.stopPropagation()">${page.num}</b> - <span contenteditable="${editableClass}" onblur="FSD.renamePageName('${page.id}', this.innerText)" onclick="event.stopPropagation()">${page.name}</span></span>`;
            if (this.pages.length > 1 && !isCover) html += `<button class="btn btn-sm text-danger p-0" onclick="event.stopPropagation(); FSD.deletePage('${page.id}')"><i class="fas fa-trash"></i></button>`;
            item.innerHTML = html;
            list.appendChild(item);
        });
    },

    switchPage(id) {
        const canvas = document.getElementById('fsdCanvas');
        if (id === this.currentPageId && canvas && canvas.innerHTML.trim() !== '' && !canvas.innerHTML.includes('<!-- FSD Content goes here -->')) return;

        // Save current page html
        if (canvas) {
            const cd = this.pages.find(p => p.id === this.currentPageId);
            if (cd && !canvas.innerHTML.includes('<!-- FSD Content goes here -->')) cd.html = canvas.innerHTML;
        }

        this.currentPageId = id;
        const nd = this.pages.find(p => p.id === id);

        let targetHtml = nd ? nd.html : '';
        if (!targetHtml || targetHtml.trim() === '' || targetHtml.includes('<!-- FSD Content goes here -->')) {
            if (nd && nd.num && nd.num.toString().toLowerCase() === 'cover') {
                targetHtml = this.compTemplates['cover'];
            } else {
                // Auto inject base FSD drop zone if blank
                targetHtml = `<div class="fsd-header mb-4" style="border-bottom: 2px solid var(--primary); padding-bottom: 16px;">
                        <h2 style="font-weight: 800; color: #0f172a;"><span contenteditable="true">${nd?.num || '1'}</span>. <span contenteditable="true">${nd?.name || 'FSD Concept'}</span></h2>
                        <p style="color:var(--text-muted);margin:0;font-size:14px;font-weight:600;text-transform:uppercase;">Technical / Functional specification</p>
                    </div>
                    <div class="drop-zone nested-drop fsd-drop-zone" style="min-height:300px; padding:10px; border:2px dashed transparent;" ondrop="FSD.drop(event)" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)"></div>`;
            }
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
        const page = this.pages.find(p => p.id === id);
        if (page && page.num && page.num.toString().toLowerCase() === 'cover') {
            alert("The Cover page cannot be deleted.");
            return;
        }

        if (confirm("Delete this entire FSD Page?")) {
            this.pages = this.pages.filter(p => p.id !== id);
            if (this.currentPageId === id) this.switchPage(this.pages[0].id);
            else this.renderPagesList();
        }
    },

    renamePageNum(id, newNum) { const p = this.pages.find(x => x.id === id); if (p) { p.num = newNum; this.renderPagesList(); } },
    renamePageName(id, newName) { const p = this.pages.find(x => x.id === id); if (p) { p.name = newName; this.renderPagesList(); } },

    drag(ev) {
        ev.dataTransfer.setData("fsd-type", ev.target.getAttribute('data-fsd-type'));
    },

    drop(ev) {
        ev.preventDefault(); ev.stopPropagation();
        document.querySelectorAll('.active-drag').forEach(el => el.classList.remove('active-drag'));

        const currentPage = this.pages.find(p => p.id === this.currentPageId);
        if (currentPage && currentPage.num && currentPage.num.toString().toLowerCase() === 'cover') {
            alert("Components cannot be added to the Cover page.");
            return;
        }

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
    },

    loadFlowchart(btn) {
        if (typeof Flowchart === 'undefined' || !Flowchart.nodes) {
            btn.closest('.fsd-comp').querySelector('.fsd-flowchart-preview').innerHTML = '<span class="text-danger">Flowchart Builder is not accessible. Go to Flowchart tab first.</span>';
            return;
        }

        const sourceCanvas = document.getElementById('flowchartCanvas');
        if (!sourceCanvas) return;

        // Find boundaries with padding for transformations and labels
        if (Flowchart.nodes.length === 0) {
            btn.closest('.fsd-comp').querySelector('.fsd-flowchart-preview').innerHTML = '<i class="text-muted">No flowchart items found. Create diagram first.</i>';
            return;
        }

        let minX = 99999, minY = 99999, maxX = -99999, maxY = -99999;

        // Accurate bounding box calculation
        Flowchart.nodes.forEach(n => {
            // Account for decision rotation and potential text overflow
            const extra = (n.type === 'decision') ? 40 : 20;
            const left = n.x - extra;
            const right = n.x + n.width + extra;
            const top = n.y - extra;
            const bottom = n.y + n.height + extra;

            if (left < minX) minX = left;
            if (right > maxX) maxX = right;
            if (top < minY) minY = top;
            if (bottom > maxY) maxY = bottom;
        });

        // Extend for edge labels
        Flowchart.edges.forEach(e => {
            if (e.label) {
                const from = Flowchart.nodes.find(n => n.id === e.from);
                const to = Flowchart.nodes.find(n => n.id === e.to);
                if (from && to) {
                    const tx = (from.x + from.width / 2 + to.x + to.width / 2) / 2;
                    const ty = (from.y + from.height / 2 + to.y + to.height / 2) / 2;
                    if (tx - 50 < minX) minX = tx - 50;
                    if (tx + 50 > maxX) maxX = tx + 50;
                    if (ty - 20 < minY) minY = ty - 20;
                    if (ty + 20 > maxY) maxY = ty + 20;
                }
            }
        });

        // Use integers for viewBox to avoid rendering artifacts
        minX = Math.floor(minX);
        minY = Math.floor(minY);
        const outWidth = Math.ceil(maxX - minX);
        const outHeight = Math.ceil(maxY - minY);

        let svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${outWidth} ${outHeight}" width="${outWidth}" height="${outHeight}" style="display:block; max-width:100%; height:auto; margin: 0 auto; background:transparent;">
            <defs>
                <marker id="fc-arrow-pdf" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#475569"></polygon>
                </marker>
            </defs>`;

        // 1. Draw Edges
        Flowchart.edges.forEach(edge => {
            const fromNode = Flowchart.nodes.find(n => n.id === edge.from);
            const toNode = Flowchart.nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return;
            const x1 = (fromNode.x + (fromNode.width / 2)) - minX;
            const y1 = (fromNode.y + (fromNode.height / 2)) - minY;
            const x2 = (toNode.x + (toNode.width / 2)) - minX;
            const y2 = (toNode.y + (toNode.height / 2)) - minY;

            let d = '';
            if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
                const midX = (x1 + x2) / 2;
                d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
            } else {
                const midY = (y1 + y2) / 2;
                d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
            }

            svgHtml += `<path d="${d}" fill="none" stroke="#475569" stroke-width="3" marker-end="url(#fc-arrow-pdf)"></path>`;

            if (edge.label) {
                const tx = (x1 + x2) / 2;
                const ty = (y1 + y2) / 2;
                svgHtml += `<rect x="${tx - 20}" y="${ty - 10}" width="40" height="20" fill="#ffffff" rx="4" stroke="#e2e8f0"></rect>
                            <text x="${tx}" y="${ty + 4}" font-family="inherit" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">${edge.label}</text>`;
            }
        });

        // 2. Draw Nodes
        Flowchart.nodes.forEach(n => {
            const cx = (n.x + n.width / 2) - minX;
            const cy = (n.y + n.height / 2) - minY;
            const nx = n.x - minX;
            const ny = n.y - minY;

            if (n.type === 'start') {
                svgHtml += `<rect x="${nx}" y="${ny}" width="${n.width}" height="${n.height}" rx="30" fill="#eff6ff" stroke="#60a5fa" stroke-width="2"></rect>`;
            } else if (n.type === 'decision') {
                // Diamond shape logic
                svgHtml += `<polygon points="${cx},${ny} ${nx + n.width},${cy} ${cx},${ny + n.height} ${nx},${cy}" fill="#fffbeb" stroke="#fbbf24" stroke-width="2"></polygon>`;
            } else if (n.type === 'data') {
                // Parallelogram logic
                const offset = 20;
                svgHtml += `<polygon points="${nx + offset},${ny} ${nx + n.width},${ny} ${nx + n.width - offset},${ny + n.height} ${nx},${ny + n.height}" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"></polygon>`;
            } else {
                svgHtml += `<rect x="${nx}" y="${ny}" width="${n.width}" height="${n.height}" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2"></rect>`;
            }

            // Allow line breaks in SVG text by splitting \n
            const lines = (n.text || '').split(/\r?\n/);
            let startY = cy + 4 - ((lines.length - 1) * 6);

            lines.forEach((line, i) => {
                svgHtml += `<text x="${cx}" y="${startY + (i * 14)}" font-family="inherit" font-size="12" font-weight="bold" fill="#333" text-anchor="middle">${line}</text>`;
            });
        });

        svgHtml += `</svg>`;

        const container = btn.closest('.fsd-comp').querySelector('.fsd-flowchart-preview');
        container.innerHTML = svgHtml;
        container.style.height = 'auto';
        container.style.overflow = 'visible'; // Ensure no container clipping

        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Refreshed';
        btn.classList.add('btn-success');
        btn.classList.remove('btn-outline-primary');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-outline-primary');
        }, 2000);
    },

    compactDiagram() {
        if (!Flowchart.nodes || Flowchart.nodes.length === 0) return;

        // Find current top-left
        let minX = Math.min(...Flowchart.nodes.map(n => n.x));
        let minY = Math.min(...Flowchart.nodes.map(n => n.y));

        // Shift all nodes to start at (50, 50)
        Flowchart.nodes.forEach(n => {
            n.x = n.x - minX + 50;
            n.y = n.y - minY + 50;
        });

        // Check if any node is too far right for A4 (794px)
        const canvasWidth = 794;
        const rightmost = Math.max(...Flowchart.nodes.map(n => n.x + n.width));

        if (rightmost > canvasWidth - 50) {
            const scale = (canvasWidth - 100) / (rightmost - 50);
            Flowchart.nodes.forEach(n => {
                n.x = 50 + (n.x - 50) * scale;
                // n.y = 50 + (n.y - 50) * scale; // Keep vertical as is or scale too? let's just scale X to fit
            });
        }

        Flowchart.switchPage(Flowchart.currentPageId);
        Flowchart.renderSidebar();
        alert("Diagram telah dirapikan agar muat di ukuran A4.");
    }
};

window.FSD = FSD;
