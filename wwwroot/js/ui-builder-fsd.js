/* ═══════════════════════════════════════════════════════════
   FSD (Functional Specification Document) Module - Advanced Structure
   ═══════════════════════════════════════════════════════════ */

const FSD = {
    data: {
        projectName: 'Project Name',
        version: '1.0',
        author: '',
        date: new Date().toISOString().split('T')[0],

        landscape: '',
        asisProcess: '',
        tobeProcess: '',

        roles: [
            { role: 'Administrator', access: 'Full Configuration Access' }
        ],

        fields: [
            { name: 'Username', desc: 'Login username', mandatory: 'M', dataType: 'String', source: 'User Input', linkedPage: '' }
        ],

        businessRules: ''
    },

    init() {
        this.render();
    },

    render() {
        const container = document.getElementById('fsdContent');
        if (!container) return;

        container.innerHTML = `
            <div class="fsd-paper" style="padding: 40px; background: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,.1);">
                <div class="fsd-header" style="border-bottom: 2px solid var(--primary); padding-bottom: 16px; margin-bottom: 24px;">
                    <h1 contenteditable="true" oninput="FSD.data.projectName=this.innerText" style="font-size: 28px; margin-bottom: 4px; font-weight: 800;">${this.data.projectName}</h1>
                    <p style="color:var(--text-muted);margin:0;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">1. Document Control</p>
                    <div class="fsd-meta" style="display:flex; gap:24px; margin-top:16px;">
                        <div><label style="font-size:11px;color:var(--text-muted);display:block;">Version</label><input type="text" value="${this.data.version}" onchange="FSD.data.version=this.value" style="border:1px solid #ccc;border-radius:4px;padding:4px;"></div>
                        <div><label style="font-size:11px;color:var(--text-muted);display:block;">Author</label><input type="text" value="${this.data.author}" placeholder="Author name" onchange="FSD.data.author=this.value" style="border:1px solid #ccc;border-radius:4px;padding:4px;"></div>
                        <div><label style="font-size:11px;color:var(--text-muted);display:block;">Date</label><input type="date" value="${this.data.date}" onchange="FSD.data.date=this.value" style="border:1px solid #ccc;border-radius:4px;padding:4px;"></div>
                    </div>
                </div>

                ${this._renderSection('2', 'fa-network-wired', 'Application Landscape', 'landscape', this.data.landscape, 'Jelaskan arsitektur sistem dan hubungan antar entitas (External, Internal, Third-party).')}
                
                <div class="fsd-section" style="margin-bottom: 24px;">
                    <div class="fsd-section-title" style="display:flex;align-items:center;cursor:pointer;background:#f8fafc;padding:12px 16px;border-radius:6px;font-weight:700;margin-bottom:12px;" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
                        <span style="color:var(--primary);font-size:14px;margin-right:8px;">3.</span>
                        <i class="fas fa-random" style="color:var(--primary);margin-right:8px;"></i> Functional Aspect (As-Is vs To-Be)
                        <i class="fas fa-chevron-down toggle" style="margin-left:auto;"></i>
                    </div>
                    <div class="fsd-section-body" style="padding: 0 16px;">
                        <label style="font-size:12px;font-weight:700;color:#475569;margin-bottom:4px;display:block;">Alur As-Is (Saat Ini):</label>
                        <textarea placeholder="Jelaskan proses berjalan saat ini..." oninput="FSD.data.asisProcess=this.value" style="width:100%;min-height:80px;border:1px solid #cbd5e1;border-radius:6px;padding:12px;margin-bottom:16px;font-family:inherit;">${this.data.asisProcess}</textarea>
                        
                        <label style="font-size:12px;font-weight:700;color:#475569;margin-bottom:4px;display:block;">Alur To-Be (Target):</label>
                        <textarea placeholder="Jelaskan target proses baru..." oninput="FSD.data.tobeProcess=this.value" style="width:100%;min-height:80px;border:1px solid #cbd5e1;border-radius:6px;padding:12px;font-family:inherit;">${this.data.tobeProcess}</textarea>
                    </div>
                </div>

                ${this._renderRolesSection()}
                ${this._renderFieldsSection()}
                ${this._renderSection('6', 'fa-scale-balanced', 'Action Control & Business Rules', 'businessRules', this.data.businessRules, 'Jelaskan logika tombol (Save, Submit) dan validasi/aturan bisnis sistem.')}
                ${this._renderPrototypesPreview()}
            </div>
        `;
    },

    _renderSection(num, icon, title, key, value, placeholder) {
        return `
            <div class="fsd-section" style="margin-bottom: 24px;">
                <div class="fsd-section-title" style="display:flex;align-items:center;cursor:pointer;background:#f8fafc;padding:12px 16px;border-radius:6px;font-weight:700;margin-bottom:12px;" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
                    <span style="color:var(--primary);font-size:14px;margin-right:8px;">${num}.</span>
                    <i class="fas ${icon}" style="color:var(--primary);margin-right:8px;"></i> ${title}
                    <i class="fas fa-chevron-down toggle" style="margin-left:auto;"></i>
                </div>
                <div class="fsd-section-body" style="padding: 0 16px;">
                    <textarea placeholder="${placeholder || 'Describe ' + title + '...'}" oninput="FSD.data.${key}=this.value" style="width:100%;min-height:100px;border:1px solid #cbd5e1;border-radius:6px;padding:12px;font-family:inherit;font-size:13px;">${value}</textarea>
                </div>
            </div>
        `;
    },

    _renderRolesSection() {
        let rows = this.data.roles.map((r, i) => `
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:8px;"><input value="${r.role}" onchange="FSD.data.roles[${i}].role=this.value" placeholder="Role Name" style="width:100%;border:1px solid #cbd5e1;border-radius:4px;padding:4px 8px;"></td>
                <td style="padding:8px;"><input value="${r.access}" onchange="FSD.data.roles[${i}].access=this.value" placeholder="Access Description" style="width:100%;border:1px solid #cbd5e1;border-radius:4px;padding:4px 8px;"></td>
                <td style="padding:8px;text-align:center;"><button onclick="FSD.removeRole(${i})" style="border:none;background:transparent;color:#ef4444;cursor:pointer;"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join('');

        return `
            <div class="fsd-section" style="margin-bottom: 24px;">
                <div class="fsd-section-title" style="display:flex;align-items:center;background:#f8fafc;padding:12px 16px;border-radius:6px;font-weight:700;margin-bottom:12px;">
                    <span style="color:var(--primary);font-size:14px;margin-right:8px;">4.</span>
                    <i class="fas fa-user-shield" style="color:var(--primary);margin-right:8px;"></i> User Roles & Access
                </div>
                <div class="fsd-section-body" style="padding: 0 16px;">
                    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:12px;">
                        <thead>
                            <tr style="background:#f1f5f9;text-align:left;">
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;width:30%;">Role</th>
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;">Access Description</th>
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;width:50px;"></th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <button onclick="FSD.addRole()" style="background:#f8fafc;border:1px dashed #cbd5e1;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:#475569;cursor:pointer;"><i class="fas fa-plus me-1"></i> Add Role</button>
                </div>
            </div>
        `;
    },

    _renderFieldsSection() {
        let rows = this.data.fields.map((f, i) => `
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:4px;"><input value="${f.name}" onchange="FSD.data.fields[${i}].name=this.value" placeholder="Field Name" style="width:100%;border:1px solid #cbd5e1;border-radius:4px;padding:4px;"></td>
                <td style="padding:4px;"><input value="${f.desc}" onchange="FSD.data.fields[${i}].desc=this.value" placeholder="Description" style="width:100%;border:1px solid #cbd5e1;border-radius:4px;padding:4px;"></td>
                <td style="padding:4px;">
                    <select onchange="FSD.data.fields[${i}].mandatory=this.value" style="width:100%;border:1px solid #cbd5e1;border-radius:4px;padding:4px;">
                        <option value="M" ${f.mandatory === 'M' ? 'selected' : ''}>M</option>
                        <option value="O" ${f.mandatory === 'O' ? 'selected' : ''}>O</option>
                    </select>
                </td>
                <td style="padding:4px;"><input value="${f.dataType}" onchange="FSD.data.fields[${i}].dataType=this.value" placeholder="Type" style="width:100%;border:1px solid #cbd5e1;border-radius:4px;padding:4px;"></td>
                <td style="padding:4px;"><input value="${f.source}" onchange="FSD.data.fields[${i}].source=this.value" placeholder="Logic" style="width:100%;border:1px solid #cbd5e1;border-radius:4px;padding:4px;"></td>
                <td style="padding:4px;">
                    <select onchange="FSD.data.fields[${i}].linkedPage=this.value" style="width:100%;border:1px solid #cbd5e1;border-radius:4px;padding:4px;">
                        <option value="">— Page —</option>
                        ${(typeof pages !== 'undefined' ? pages : []).map(p => `<option value="${p.id}" ${f.linkedPage === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                    </select>
                </td>
                <td style="padding:4px;text-align:center;"><button onclick="FSD.removeField(${i})" style="border:none;background:transparent;color:#ef4444;cursor:pointer;"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join('');

        return `
            <div class="fsd-section" style="margin-bottom: 24px;">
                <div class="fsd-section-title" style="display:flex;align-items:center;background:#f8fafc;padding:12px 16px;border-radius:6px;font-weight:700;margin-bottom:12px;">
                    <span style="color:var(--primary);font-size:14px;margin-right:8px;">5.</span>
                    <i class="fas fa-table-list" style="color:var(--primary);margin-right:8px;"></i> Form & Design (Field Description)
                </div>
                <div class="fsd-section-body" style="padding: 0 16px;">
                    <p style="font-size:12px;color:#64748b;margin-bottom:8px;">M: Mandatory, O: Optional. *Pilih "Linked Page" untuk mengaktifkan preview desain di bawah.</p>
                    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px;">
                        <thead>
                            <tr style="background:#f1f5f9;text-align:left;">
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;width:15%;">Field Name</th>
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;width:25%;">Description</th>
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;width:8%;">M/O</th>
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;width:15%;">Data Type</th>
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;width:17%;">Source/Logic</th>
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;width:15%;">Linked Page</th>
                                <th style="padding:8px;border-bottom:2px solid #e2e8f0;width:5%;"></th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <button onclick="FSD.addField()" style="background:#f8fafc;border:1px dashed #cbd5e1;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;color:#475569;cursor:pointer;"><i class="fas fa-plus me-1"></i> Add Field Definition</button>
                </div>
            </div>
        `;
    },

    addRole() {
        this.data.roles.push({ role: '', access: '' });
        this.render();
    },

    removeRole(index) {
        if (this.data.roles.length <= 1) return;
        this.data.roles.splice(index, 1);
        this.render();
    },

    addField() {
        this.data.fields.push({ name: '', desc: '', mandatory: 'M', dataType: '', source: '', linkedPage: '' });
        this.render();
    },

    removeField(index) {
        if (this.data.fields.length <= 1) return;
        this.data.fields.splice(index, 1);
        this.render();
    },

    exportMarkdown() {
        let md = `# ${this.data.projectName}\n`;
        md += `## 1. Document Control\n**Version:** ${this.data.version} | **Author:** ${this.data.author} | **Date:** ${this.data.date}\n\n---\n\n`;
        md += `## 2. Application Landscape\n${this.data.landscape}\n\n`;
        md += `## 3. Functional Aspect\n### As-Is Process\n${this.data.asisProcess}\n\n### To-Be Process\n${this.data.tobeProcess}\n\n`;

        md += `## 4. User Roles & Access\n| Role | Access Description |\n|---|---|\n`;
        this.data.roles.forEach(r => { md += `| ${r.role} | ${r.access} |\n`; });
        md += `\n`;

        md += `## 5. Form & Design (Field Description)\n| Field Name | Description | M/O | Data Type | Source/Logic |\n|---|---|---|---|---|\n`;
        this.data.fields.forEach(f => { md += `| ${f.name} | ${f.desc} | ${f.mandatory} | ${f.dataType} | ${f.source} |\n`; });
        md += `\n`;

        md += `## 6. Action Control & Business Rules\n${this.data.businessRules}\n`;
        return md;
    },

    _renderPrototypesPreview() {
        if (typeof pages === 'undefined' || pages.length === 0) return '';

        // Find which pages are actually linked in the fields
        const linkedPageIds = new Set();
        this.data.fields.forEach(f => {
            if (f.linkedPage) linkedPageIds.add(f.linkedPage);
        });

        if (linkedPageIds.size === 0) return '';

        let html = `
            <div class="fsd-section fsd-prototype-previews" style="margin-top: 32px; border-top: 2px dashed #cbd5e1; padding-top: 24px;">
                <div class="fsd-section-title" style="display:flex;align-items:center;font-weight:700;margin-bottom:12px;cursor:pointer;" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'block'">
                    <span style="color:var(--primary);font-size:14px;margin-right:8px;">7.</span>
                    <i class="fas fa-desktop" style="color:var(--primary);margin-right:8px;"></i> Prototype Design Previews
                    <i class="fas fa-chevron-down toggle" style="margin-left:auto;"></i>
                </div>
                <div class="fsd-section-body">
                    <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">The following UI designs correspond to pages linked in the Form & Field Definitions above.</p>
        `;

        pages.forEach(p => {
            if (linkedPageIds.has(p.id)) {
                let contentHTML = p.html;
                if (typeof currentPageId !== 'undefined' && p.id === currentPageId) {
                    const canvas = document.getElementById('mainCanvas');
                    if (canvas) contentHTML = canvas.innerHTML;
                }

                let div = document.createElement('div');
                div.innerHTML = contentHTML || '<div style="color:#94a3b8;font-style:italic;">[Empty Page]</div>';

                div.querySelectorAll('.canvas-element').forEach(w => {
                    const a = w.querySelector('.canvas-element-actions');
                    if (a) a.remove();
                    w.outerHTML = w.innerHTML;
                });
                div.querySelectorAll('.drop-zone').forEach(dz => {
                    dz.classList.remove('drop-zone', 'active-drag', 'nested-drop');
                    ["ondrop", "ondragover", "ondragenter", "ondragleave"].forEach(attr => dz.removeAttribute(attr));
                    if (dz.classList.length === 0) dz.removeAttribute('class');
                });
                div.querySelectorAll('[contenteditable]').forEach(e => e.removeAttribute('contenteditable'));

                html += `
                    <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 6px; background: #fff; overflow:hidden;">
                        <div style="background: #f8fafc; padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 13px;">
                            <i class="far fa-window-maximize me-2 text-primary"></i> Page: ${p.name}
                        </div>
                        <div style="padding: 24px; pointer-events: none;">
                            ${div.innerHTML}
                        </div>
                    </div>
                `;
            }
        });

        html += `</div></div>`;
        return html;
    }
};
