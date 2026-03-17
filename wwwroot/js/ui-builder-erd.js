/* ═══════════════════════════════════════════════════════════
   ERD (Entity Relationship Diagram) Module
   ═══════════════════════════════════════════════════════════ */

const ERD = {
    entities: [],
    relationships: [],
    nextId: 1,
    dragging: null,
    dragOffset: { x: 0, y: 0 },
    selectedEntity: null,
    relMode: false,
    relSource: null,

    init() {
        const canvas = document.getElementById('erdCanvas');
        if (!canvas) return;

        if (!this.initialized) {
            canvas.addEventListener('mousemove', e => this._onMouseMove(e));
            canvas.addEventListener('mouseup', () => this._onMouseUp());
            this.initialized = true;
        }

        // Bersihkan canvas visually
        document.querySelectorAll('.erd-entity').forEach(n => n.remove());

        // Re-render entitas di kanvas berdasarkan data di memori / Cloud
        this.entities.forEach(ent => this._renderEntity(ent));

        // Gambar relasi garis-garis koneksi
        setTimeout(() => {
            this._drawLines();
            this._updateCanvasSize();
        }, 50);

        this.renderSidebar();
    },

    addEntity(name) {
        let eName = name;
        if (!eName) {
            eName = prompt('Enter Table Name:', `Table_${this.nextId}`);
        }

        if (!eName) return; // Cancelled

        // Validate uniqueness
        const exists = this.entities.some(e => e.name.toLowerCase() === eName.toLowerCase());
        if (exists) {
            alert(`Table name "${eName}" already exists in this project!`);
            return;
        }

        const canvas = document.getElementById('erdCanvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const entity = {
            id: 'ent-' + this.nextId++,
            name: eName,
            x: 40 + Math.random() * (rect.width - 280),
            y: 40 + Math.random() * (rect.height - 200),
            fields: [
                { name: 'id', type: 'INT', pk: true },
                { name: 'name', type: 'VARCHAR' },
                { name: 'created_at', type: 'DATETIME' }
            ]
        };
        this.entities.push(entity);
        this._renderEntity(entity);
        this.renderSidebar();
        this._updateCanvasSize();
    },

    _renderEntity(entity) {
        const canvas = document.getElementById('erdCanvas');
        const el = document.createElement('div');
        el.className = 'erd-entity';
        el.id = entity.id;
        el.style.left = entity.x + 'px';
        el.style.top = entity.y + 'px';
        el.onmousedown = (e) => this._onMouseDown(e, entity);
        this._updateEntityHTML(el, entity);
        canvas.appendChild(el);
    },

    _updateCanvasSize() {
        const canvas = document.getElementById('erdCanvas');
        if (!canvas) return;

        let maxX = 1200;
        let maxY = 800;

        this.entities.forEach(ent => {
            const el = document.getElementById(ent.id);
            const width = el ? el.offsetWidth : 200;
            const height = el ? el.offsetHeight : 150;
            const right = ent.x + width + 100;
            const bottom = ent.y + height + 100;
            if (right > maxX) maxX = right;
            if (bottom > maxY) maxY = bottom;
        });

        canvas.style.width = maxX + 'px';
        canvas.style.height = maxY + 'px';
    },

    _updateEntityHTML(el, entity) {
        let fieldsHTML = entity.fields.map((f, i) => `
            <div class="erd-field">
                <span class="erd-field-icon">${f.pk ? '<i class="fas fa-key" style="color:#d97706;"></i>' : '<i class="fas fa-circle"></i>'}</span>
                <span class="erd-field-name"><input value="${f.name}" onchange="ERD._updateField('${entity.id}',${i},'name',this.value)" onclick="event.stopPropagation()"></span>
                <span class="erd-field-type">
                    <select onchange="ERD._updateField('${entity.id}',${i},'type',this.value)" onclick="event.stopPropagation()">
                        ${['INT', 'VARCHAR', 'TEXT', 'BOOLEAN', 'DATETIME', 'FLOAT', 'DECIMAL', 'DATE', 'BIGINT'].map(t => `<option ${f.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </span>
                <span class="erd-field-actions">
                    <button onclick="event.stopPropagation();ERD._togglePK('${entity.id}',${i})" title="Toggle PK"><i class="fas fa-key"></i></button>
                    <button onclick="event.stopPropagation();ERD._removeField('${entity.id}',${i})" title="Remove"><i class="fas fa-times"></i></button>
                </span>
            </div>
        `).join('');

        el.innerHTML = `
            <div class="erd-entity-header">
                <input value="${entity.name}" onchange="ERD._renameEntity('${entity.id}',this.value)" onclick="event.stopPropagation()">
                <div style="display:flex;gap:4px;">
                    <button onclick="event.stopPropagation();ERD._startRelation('${entity.id}')" style="border:none;background:rgba(255,255,255,.2);color:#fff;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:10px;" title="Connect"><i class="fas fa-link"></i></button>
                    <button onclick="event.stopPropagation();ERD.removeEntity('${entity.id}')" style="border:none;background:rgba(255,255,255,.2);color:#fff;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:10px;" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="erd-entity-body">${fieldsHTML}</div>
            <div class="erd-add-field">
                <button onclick="event.stopPropagation();ERD._addField('${entity.id}')"><i class="fas fa-plus me-1"></i> Add Field</button>
            </div>
        `;
    },

    _renameEntity(id, name) {
        const ent = this.entities.find(e => e.id === id);
        if (ent) { ent.name = name; this.renderSidebar(); }
    },

    _addField(entityId) {
        const ent = this.entities.find(e => e.id === entityId);
        if (!ent) return;
        ent.fields.push({ name: 'new_field', type: 'VARCHAR', pk: false });
        const el = document.getElementById(entityId);
        this._updateEntityHTML(el, ent);
        this._updateCanvasSize();
    },

    _removeField(entityId, index) {
        const ent = this.entities.find(e => e.id === entityId);
        if (!ent || ent.fields.length <= 1) return;
        ent.fields.splice(index, 1);
        const el = document.getElementById(entityId);
        this._updateEntityHTML(el, ent);
        this._updateCanvasSize();
    },

    _updateField(entityId, index, prop, value) {
        const ent = this.entities.find(e => e.id === entityId);
        if (ent) ent.fields[index][prop] = value;
    },

    _togglePK(entityId, index) {
        const ent = this.entities.find(e => e.id === entityId);
        if (!ent) return;
        ent.fields[index].pk = !ent.fields[index].pk;
        const el = document.getElementById(entityId);
        this._updateEntityHTML(el, ent);
        this._updateCanvasSize();
    },

    removeEntity(id) {
        this.entities = this.entities.filter(e => e.id !== id);
        this.relationships = this.relationships.filter(r => r.from !== id && r.to !== id);
        const el = document.getElementById(id);
        if (el) el.remove();
        this._drawLines();
        this.renderSidebar();
        this._updateCanvasSize();
    },

    // Drag logic
    _onMouseDown(e, entity) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') return;
        if (this.relMode) { this._endRelation(entity.id); return; }

        this.dragging = entity;
        this.dragStartMouse = { x: e.clientX, y: e.clientY };
        this.dragStartPos = { x: entity.x, y: entity.y };

        const el = document.getElementById(entity.id);
        if (el) el.style.zIndex = 100;
    },

    _onMouseMove(e) {
        if (!this.dragging) return;

        // Calculate delta from start of drag
        const dx = e.clientX - this.dragStartMouse.x;
        const dy = e.clientY - this.dragStartMouse.y;

        // Update position based on initial position + movement
        this.dragging.x = Math.max(0, this.dragStartPos.x + dx);
        this.dragging.y = Math.max(0, this.dragStartPos.y + dy);

        const el = document.getElementById(this.dragging.id);
        if (el) {
            el.style.left = this.dragging.x + 'px';
            el.style.top = this.dragging.y + 'px';
        }

        this._drawLines();
        // Periodic update of canvas size to avoid stuttering, or just call it
        this._updateCanvasSize();
    },

    _onMouseUp() {
        if (this.dragging) {
            const el = document.getElementById(this.dragging.id);
            if (el) el.style.zIndex = 2;
        }
        this.dragging = null;
    },

    // Relationships
    _startRelation(entityId) {
        this.relMode = true;
        this.relSource = entityId;
        document.getElementById('erdCanvas').style.cursor = 'crosshair';
        const el = document.getElementById(entityId);
        if (el) el.classList.add('selected');
    },

    _endRelation(targetId) {
        if (!this.relSource || this.relSource === targetId) {
            this._cancelRelMode();
            return;
        }
        const exists = this.relationships.find(r =>
            (r.from === this.relSource && r.to === targetId) ||
            (r.from === targetId && r.to === this.relSource)
        );
        if (!exists) {
            const type = prompt('Relationship type:\n1 = One to One (1:1)\n2 = One to Many (1:N)\n3 = Many to Many (N:N)', '2');
            const labels = { '1': '1 : 1', '2': '1 : N', '3': 'N : N' };
            this.relationships.push({ from: this.relSource, to: targetId, label: labels[type] || '1 : N' });
            this._drawLines();
            this.renderSidebar();
        }
        this._cancelRelMode();
    },

    _cancelRelMode() {
        this.relMode = false;
        document.getElementById('erdCanvas').style.cursor = 'default';
        document.querySelectorAll('.erd-entity.selected').forEach(e => e.classList.remove('selected'));
        this.relSource = null;
    },

    _drawLines() {
        const svg = document.getElementById('erdSvg');
        if (!svg) return;
        // Clear existing
        svg.innerHTML = '<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3b9d82"></polygon></marker></defs>';

        // Remove old labels
        document.querySelectorAll('.erd-rel-label').forEach(l => l.remove());
        const canvas = document.getElementById('erdCanvas');

        this.relationships.forEach(rel => {
            const fromEl = document.getElementById(rel.from);
            const toEl = document.getElementById(rel.to);
            if (!fromEl || !toEl) return;

            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();

            const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
            const y1 = fromRect.top + fromRect.height / 2 - canvasRect.top;
            const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
            const y2 = toRect.top + toRect.height / 2 - canvasRect.top;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1); line.setAttribute('y1', y1);
            line.setAttribute('x2', x2); line.setAttribute('y2', y2);
            line.setAttribute('marker-end', 'url(#arrowhead)');
            svg.appendChild(line);

            // Label
            const label = document.createElement('div');
            label.className = 'erd-rel-label';
            label.textContent = rel.label;
            label.style.left = ((x1 + x2) / 2 - 20) + 'px';
            label.style.top = ((y1 + y2) / 2 - 10) + 'px';
            canvas.appendChild(label);
        });
    },

    renderSidebar() {
        const list = document.getElementById('erdEntityList');
        if (!list) return;
        if (this.entities.length === 0) {
            list.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:20px;">No entities yet.<br>Click "Add Entity" to start.</p>';
            return;
        }
        list.innerHTML = this.entities.map(e => `
            <div class="erd-entity-list-item" onclick="ERD._focusEntity('${e.id}')">
                <span><i class="fas fa-table me-2" style="color:var(--primary);"></i>${e.name}</span>
                <span style="font-size:11px;color:var(--text-muted);">${e.fields.length} fields</span>
            </div>
        `).join('');

        // Relationships
        const relList = document.getElementById('erdRelList');
        if (relList) {
            if (this.relationships.length === 0) {
                relList.innerHTML = '<p style="color:var(--text-muted);font-size:12px;text-align:center;">No relationships</p>';
            } else {
                relList.innerHTML = this.relationships.map((r, i) => {
                    const from = this.entities.find(e => e.id === r.from);
                    const to = this.entities.find(e => e.id === r.to);
                    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border-color);font-size:12px;">
                        <span>${from ? from.name : '?'} → ${to ? to.name : '?'} <span style="color:var(--primary);font-weight:600;">(${r.label})</span></span>
                        <button onclick="ERD._removeRel(${i})" style="border:none;background:transparent;color:#dc2626;cursor:pointer;font-size:11px;"><i class="fas fa-times"></i></button>
                    </div>`;
                }).join('');
            }
        }
    },

    _focusEntity(id) {
        const el = document.getElementById(id);
        if (el) {
            document.querySelectorAll('.erd-entity.selected').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            setTimeout(() => el.classList.remove('selected'), 1500);
        }
    },

    _removeRel(index) {
        this.relationships.splice(index, 1);
        this._drawLines();
        this.renderSidebar();
    },

    exportSQL() {
        let sql = '-- Generated SQL Schema\n\n';

        // 1. Create Main Tables
        this.entities.forEach(ent => {
            sql += `CREATE TABLE ${ent.name} (\n`;
            let lines = [];
            let pks = [];

            // Add fields
            ent.fields.forEach(f => {
                let typeSql = f.type;
                if (f.type === 'VARCHAR') typeSql = 'VARCHAR(255)';
                lines.push(`    ${f.name} ${typeSql}`);
                if (f.pk) pks.push(f.name);
            });

            // Add implicit FK fields for 1:1 or 1:N if they don't exist in destination
            this.relationships.forEach(rel => {
                if (rel.to === ent.id && (rel.label === '1 : N' || rel.label === '1 : 1')) {
                    const fromEnt = this.entities.find(e => e.id === rel.from);
                    if (fromEnt) {
                        const fkFieldName = `${fromEnt.name.toLowerCase()}_id`;
                        const exists = ent.fields.some(f => f.name.toLowerCase() === fkFieldName.toLowerCase());
                        if (!exists) {
                            lines.push(`    ${fkFieldName} INT`);
                        }
                    }
                }
            });

            if (pks.length > 0) {
                lines.push(`    PRIMARY KEY (${pks.join(', ')})`);
            }

            sql += lines.join(',\n') + '\n);\n\n';
        });

        // 2. Create Junction Tables for N:N
        this.relationships.forEach(rel => {
            if (rel.label === 'N : N') {
                const fromEnt = this.entities.find(e => e.id === rel.from);
                const toEnt = this.entities.find(e => e.id === rel.to);
                if (fromEnt && toEnt) {
                    const tableName = `${fromEnt.name}_${toEnt.name}`;
                    const fromFk = `${fromEnt.name.toLowerCase()}_id`;
                    const toFk = `${toEnt.name.toLowerCase()}_id`;

                    sql += `CREATE TABLE ${tableName} (\n`;
                    sql += `    ${fromFk} INT,\n`;
                    sql += `    ${toFk} INT,\n`;
                    sql += `    PRIMARY KEY (${fromFk}, ${toFk})\n`;
                    sql += ');\n\n';
                }
            }
        });

        // 3. Add Foreign Key Constraints (ALTER TABLE)
        if (this.relationships.length > 0) {
            sql += '-- Relationships (Constraints)\n';
            this.relationships.forEach(rel => {
                const fromEnt = this.entities.find(e => e.id === rel.from);
                const toEnt = this.entities.find(e => e.id === rel.to);

                if (fromEnt && toEnt) {
                    const fromPk = fromEnt.fields.find(f => f.pk)?.name || 'id';

                    if (rel.label === '1 : N' || rel.label === '1 : 1') {
                        const fkFieldName = `${fromEnt.name.toLowerCase()}_id`;
                        sql += `ALTER TABLE ${toEnt.name} ADD CONSTRAINT FK_${toEnt.name}_${fromEnt.name}\n    FOREIGN KEY (${fkFieldName}) REFERENCES ${fromEnt.name}(${fromPk});\n\n`;
                    } else if (rel.label === 'N : N') {
                        const tableName = `${fromEnt.name}_${toEnt.name}`;
                        const toPk = toEnt.fields.find(f => f.pk)?.name || 'id';
                        sql += `ALTER TABLE ${tableName} ADD CONSTRAINT FK_${tableName}_${fromEnt.name}\n    FOREIGN KEY (${fromEnt.name.toLowerCase()}_id) REFERENCES ${fromEnt.name}(${fromPk});\n`;
                        sql += `ALTER TABLE ${tableName} ADD CONSTRAINT FK_${tableName}_${toEnt.name}\n    FOREIGN KEY (${toEnt.name.toLowerCase()}_id) REFERENCES ${toEnt.name}(${toPk});\n\n`;
                    }
                }
            });
        }

        return sql;
    }
};
