/* ═══════════════════════════════════════════════════════════
   Flowchart Builder Module
   ═══════════════════════════════════════════════════════════ */

const Flowchart = {
    diagrams: [{ id: 'fc-page-1', num: '1.0', name: 'Main Flow', nodes: [], edges: [] }],
    currentPageId: 'fc-page-1',
    nextPageId: 2,

    get nodes() {
        const page = this.diagrams.find(p => p.id === this.currentPageId);
        return page ? page.nodes : [];
    },
    set nodes(val) {
        const page = this.diagrams.find(p => p.id === this.currentPageId);
        if (page) page.nodes = val;
    },

    get edges() {
        const page = this.diagrams.find(p => p.id === this.currentPageId);
        return page ? page.edges : [];
    },
    set edges(val) {
        const page = this.diagrams.find(p => p.id === this.currentPageId);
        if (page) page.edges = val;
    },
    nextId: 1,
    dragging: null,
    dragOffset: { x: 0, y: 0 },
    selectedNode: null,
    edgeMode: false,
    edgeSource: null,

    init() {
        const canvas = document.getElementById('flowchartCanvas');
        if (!canvas) return;
        canvas.addEventListener('mousemove', e => this._onMouseMove(e));
        canvas.addEventListener('mouseup', () => this._onMouseUp());
        canvas.addEventListener('mousedown', e => {
            if (this.edgeMode && !e.target.closest('.fc-node')) {
                this._cancelEdgeMode();
            }
        });
        this.renderPagesList();
        this.switchPage(this.currentPageId);
    },

    // --- PAGE MANAGEMENT ---
    addNewPageModal() {
        const modal = new bootstrap.Modal(document.getElementById('addFcPageModal'));
        document.getElementById('newFcPageNameInput').value = `Diagram ${this.nextPageId}`;
        modal.show();
    },

    confirmAddPage() {
        const num = document.getElementById('newFcPageNumInput').value || '1.' + this.diagrams.length;
        const name = document.getElementById('newFcPageNameInput').value || `Diagram ${this.nextPageId}`;
        const newId = 'fc-page-' + this.nextPageId++;

        this.diagrams.push({ id: newId, num: num, name: name, nodes: [], edges: [] });

        const modal = bootstrap.Modal.getInstance(document.getElementById('addFcPageModal'));
        if (modal) modal.hide();

        this.renderPagesList();
        this.switchPage(newId);
    },

    switchPage(id) {
        this.currentPageId = id;
        this.renderPagesList();

        // Clear canvas visually
        document.querySelectorAll('.fc-node').forEach(n => n.remove());
        const svg = document.getElementById('flowchartSvg');
        if (svg) svg.innerHTML = '';
        document.querySelectorAll('.fc-edge-label').forEach(l => l.remove());

        // Re-render active page elements
        this.nodes.forEach(n => this._renderNode(n));
        this._drawLines();
        this.renderSidebar();
        this._updateCanvasSize();
    },

    deletePage(id) {
        if (this.diagrams.length <= 1) {
            alert('Cannot delete the last diagram.');
            return;
        }
        if (confirm('Delete this diagram? This cannot be undone.')) {
            this.diagrams = this.diagrams.filter(p => p.id !== id);
            if (this.currentPageId === id) {
                this.switchPage(this.diagrams[0].id);
            } else {
                this.renderPagesList();
            }
        }
    },

    clearCanvas() {
        if (confirm('Clear all objects from this diagram?')) {
            this.nodes = [];
            this.edges = [];
            document.querySelectorAll('.fc-node').forEach(n => n.remove());
            this._drawLines();
            this.renderSidebar();
            this._updateCanvasSize();
        }
    },

    renderPagesList() {
        const list = document.getElementById('fcPagesList');
        if (!list) return;

        list.innerHTML = this.diagrams.map(p => `
            <div class="card mb-2 ${p.id === this.currentPageId ? 'border-primary' : ''}" style="cursor:pointer;" onclick="Flowchart.switchPage('${p.id}')">
                <div class="card-body p-2 d-flex justify-content-between align-items-center ${p.id === this.currentPageId ? 'bg-light' : ''}">
                    <div style="font-size:12px; font-weight:600;">
                        <span class="text-primary me-1">${p.num || ''}</span> ${p.name}
                    </div>
                </div>
            </div>
        `).join('');
    },
    // -----------------------

    drag(ev) {
        ev.dataTransfer.setData("fc-type", ev.target.getAttribute('data-fc-type'));
    },

    allowDrop(ev) {
        ev.preventDefault();
    },

    drop(ev) {
        ev.preventDefault();
        const type = ev.dataTransfer.getData("fc-type");
        if (!type) return;

        const canvas = document.getElementById('flowchartCanvas');
        if (!canvas) return;
        const cRect = canvas.getBoundingClientRect();

        let x = ev.clientX - cRect.left + canvas.scrollLeft;
        let y = ev.clientY - cRect.top + canvas.scrollTop;

        const labels = {
            'start': 'Start/End',
            'process': 'Process',
            'decision': 'Condition',
            'data': 'Data / IO'
        };

        const node = {
            id: 'fc-' + this.nextId++,
            type: type,
            text: labels[type] || 'Process',
            x: Math.max(0, x - 50), // center the drop roughly
            y: Math.max(0, y - 30),
            width: type === 'decision' ? 120 : 150,
            height: type === 'decision' ? 120 : 60
        };

        this.nodes.push(node);
        this._renderNode(node);
        this.renderSidebar();
        this._updateCanvasSize();
    },

    _updateCanvasSize() {
        const canvas = document.getElementById('flowchartCanvas');
        if (!canvas) return;

        // Default minimal sizes
        let maxX = 794;
        let maxY = 400;

        this.nodes.forEach(n => {
            const right = n.x + n.width + 60; // 60px padding
            const bottom = n.y + n.height + 60;
            if (right > maxX) maxX = right;
            if (bottom > maxY) maxY = bottom;
        });

        canvas.style.minWidth = maxX + 'px';
        canvas.style.width = maxX + 'px';
        canvas.style.minHeight = maxY + 'px';
        canvas.style.height = maxY + 'px';
    },

    _renderNode(node) {
        const canvas = document.getElementById('flowchartCanvas');
        const el = document.createElement('div');
        el.className = `fc-node fc-${node.type}`;
        el.id = node.id;
        el.style.left = node.x + 'px';
        el.style.top = node.y + 'px';
        el.style.width = node.width + 'px';
        el.style.height = node.height + 'px';

        // Setup inner content based on shape
        let innerHtml = '';
        if (node.type === 'decision') {
            innerHtml = `
            <div class="fc-shape-decision"></div>
            <div class="fc-content">
                <textarea onchange="Flowchart._updateText('${node.id}', this.value)" onclick="event.stopPropagation()">${node.text}</textarea>
            </div>`;
        } else if (node.type === 'data') {
            innerHtml = `
            <div class="fc-shape-data"></div>
            <div class="fc-content">
                <textarea onchange="Flowchart._updateText('${node.id}', this.value)" onclick="event.stopPropagation()">${node.text}</textarea>
            </div>`;
        } else if (node.type === 'start') {
            innerHtml = `
            <div class="fc-shape-start"></div>
            <div class="fc-content">
                <textarea onchange="Flowchart._updateText('${node.id}', this.value)" onclick="event.stopPropagation()">${node.text}</textarea>
            </div>`;
        } else {
            innerHtml = `
            <div class="fc-shape-process"></div>
            <div class="fc-content">
                <textarea onchange="Flowchart._updateText('${node.id}', this.value)" onclick="event.stopPropagation()">${node.text}</textarea>
            </div>`;
        }

        // Action Buttons
        const actions = `
            <div class="fc-actions">
                <button onclick="event.stopPropagation();Flowchart._startEdge('${node.id}')" title="Connect"><i class="fas fa-arrow-right"></i></button>
                <button onclick="event.stopPropagation();Flowchart.removeNode('${node.id}')" style="color:#ef4444;" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;

        el.innerHTML = innerHtml + actions;
        el.onmousedown = (e) => this._onMouseDown(e, node);
        canvas.appendChild(el);
    },

    _updateText(id, text) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            node.text = text;
            this.renderSidebar();
        }
    },

    removeNode(id) {
        this.nodes = this.nodes.filter(n => n.id !== id);
        this.edges = this.edges.filter(e => e.from !== id && e.to !== id);
        const el = document.getElementById(id);
        if (el) el.remove();
        this._drawLines();
        this.renderSidebar();
        this._updateCanvasSize();
    },

    removeEdge(index) {
        this.edges.splice(index, 1);
        this._drawLines();
        this.renderSidebar();
    },

    _onMouseDown(e, node) {
        // Prioritize edge connection even if user clicked right on the textarea
        if (this.edgeMode) {
            this._endEdge(node.id);
            return;
        }

        // Prevent drag on text inputs and buttons
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

        this.dragging = node;
        const el = document.getElementById(node.id);
        const rect = el.getBoundingClientRect();
        this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        // bring to front
        document.querySelectorAll('.fc-node').forEach(n => n.style.zIndex = 10);
        el.style.zIndex = 100;
    },

    _onMouseMove(e) {
        const canvas = document.getElementById('flowchartCanvas');
        if (!canvas) return;
        const cRect = canvas.getBoundingClientRect();

        // Add scroll offsets so it matches the canvas absolute space
        const x = e.clientX - cRect.left + canvas.scrollLeft;
        const y = e.clientY - cRect.top + canvas.scrollTop;

        // Give a live tracing line when drawing an edge
        if (this.edgeMode && this.edgeSource) {
            this._drawLines(x, y);
            return;
        }

        if (!this.dragging) return;

        this.dragging.x = Math.max(0, x - this.dragOffset.x);
        this.dragging.y = Math.max(0, y - this.dragOffset.y);

        const el = document.getElementById(this.dragging.id);
        if (el) {
            el.style.left = this.dragging.x + 'px';
            el.style.top = this.dragging.y + 'px';
        }
        this._drawLines();
        this._updateCanvasSize();
    },

    _onMouseUp() {
        this.dragging = null;
    },

    // Edges Connection Logic
    _startEdge(nodeId) {
        this.edgeMode = true;
        this.edgeSource = nodeId;
        document.getElementById('flowchartCanvas').style.cursor = 'crosshair';
        const el = document.getElementById(nodeId);
        if (el) el.classList.add('fc-selected');
    },

    _endEdge(targetId) {
        if (!this.edgeSource || this.edgeSource === targetId) {
            this._cancelEdgeMode();
            return;
        }

        // Only allow one identical direction
        const exists = this.edges.find(e => e.from === this.edgeSource && e.to === targetId);

        if (!exists) {
            let label = '';
            const sourceNode = this.nodes.find(n => n.id === this.edgeSource);
            if (sourceNode && sourceNode.type === 'decision') {
                const ans = prompt('Condition (e.g. Yes/No)?', 'Yes');
                if (ans) label = ans;
            }

            this.edges.push({ from: this.edgeSource, to: targetId, label: label });
            this._drawLines();
            this.renderSidebar();
        }
        this._cancelEdgeMode();
    },

    _cancelEdgeMode() {
        this.edgeMode = false;
        document.getElementById('flowchartCanvas').style.cursor = 'default';
        document.querySelectorAll('.fc-node.fc-selected').forEach(e => e.classList.remove('fc-selected'));
        this.edgeSource = null;
    },

    _drawLines(mouseX = null, mouseY = null) {
        const svg = document.getElementById('flowchartSvg');
        if (!svg) return;

        // Define arrow heads
        svg.innerHTML = `
            <defs>
                <marker id="fc-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#475569"></polygon>
                </marker>
                <marker id="fc-arrow-temp" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444"></polygon>
                </marker>
            </defs>`;

        // Clear existing labels
        document.querySelectorAll('.fc-edge-label').forEach(l => l.remove());
        const canvas = document.getElementById('flowchartCanvas');

        this.edges.forEach(edge => {
            const fromNode = this.nodes.find(n => n.id === edge.from);
            const toNode = this.nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return;

            // Simple center-to-center for now
            const x1 = fromNode.x + (fromNode.width / 2);
            const y1 = fromNode.y + (fromNode.height / 2);
            const x2 = toNode.x + (toNode.width / 2);
            const y2 = toNode.y + (toNode.height / 2);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            // Smooth cubic bezier curve routing
            let d = '';
            if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
                // Horizontal dominant
                const midX = (x1 + x2) / 2;
                d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
            } else {
                // Vertical dominant
                const midY = (y1 + y2) / 2;
                d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
            }

            path.setAttribute('d', d);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', '#475569');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('marker-end', 'url(#fc-arrow)');
            svg.appendChild(path);

            // Label text if it is a decision output
            if (edge.label) {
                const lbl = document.createElement('div');
                lbl.className = 'fc-edge-label';
                lbl.innerText = edge.label;
                const tx = (x1 + x2) / 2;
                const ty = (y1 + y2) / 2;
                lbl.style.left = (tx - 10) + 'px';
                lbl.style.top = (ty - 10) + 'px';
                canvas.appendChild(lbl);
            }
        });

        // Temporary edge line
        if (this.edgeMode && this.edgeSource && mouseX !== null && mouseY !== null) {
            const snode = this.nodes.find(n => n.id === this.edgeSource);
            if (snode) {
                const x1 = snode.x + (snode.width / 2);
                const y1 = snode.y + (snode.height / 2);
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                path.setAttribute('x1', x1);
                path.setAttribute('y1', y1);
                path.setAttribute('x2', mouseX);
                path.setAttribute('y2', mouseY);
                path.setAttribute('stroke', '#ef4444');
                path.setAttribute('stroke-width', '3');
                path.setAttribute('stroke-dasharray', '5,5');
                path.setAttribute('marker-end', 'url(#fc-arrow-temp)');
                svg.appendChild(path);
            }
        }
    },

    renderSidebar() {
        const list = document.getElementById('fcNodeList');
        if (!list) return;

        let html = '';
        if (this.nodes.length === 0) {
            html += '<p class="text-muted text-center" style="font-size:12px; padding:20px;">No objects on canvas.</p>';
        } else {
            html += this.nodes.map(n => `
                <div style="font-size:12px; padding:8px; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; cursor:pointer;" onclick="Flowchart._focusNode('${n.id}')">
                    <i class="fas fa-shapes me-2 text-primary"></i>
                    <div style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        ${n.text || n.type}
                    </div>
                </div>
            `).join('');
        }

        // Add Connections mapping
        if (this.edges.length > 0) {
            html += '<div class="fw-bold mt-3 mb-2 px-2" style="font-size:12px; color:var(--text-muted)">Connections</div>';
            html += this.edges.map((e, index) => {
                const from = this.nodes.find(n => n.id === e.from);
                const to = this.nodes.find(n => n.id === e.to);
                return `
                <div style="font-size:12px; padding:8px; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between;">
                    <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 140px;">
                        ${from ? from.text : '?'} <i class="fas fa-arrow-right mx-1 text-muted"></i> ${to ? to.text : '?'}
                        ${e.label ? `<span class="badge bg-light text-dark border ms-1">${e.label}</span>` : ''}
                    </div>
                    <button class="btn btn-sm text-danger p-0 m-0" onclick="Flowchart.removeEdge(${index})" title="Delete Connection"><i class="fas fa-times"></i></button>
                </div>
                `;
            }).join('');
        }

        list.innerHTML = html;
    },

    _focusNode(id) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('fc-blink');
            setTimeout(() => el.classList.remove('fc-blink'), 1500);
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Flowchart.init();
});
