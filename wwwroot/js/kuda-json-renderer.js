/*!
 * Kuda JSON Renderer — JavaScript Library
 * Version: 1.0.0
 * Part of kuda-kit. Exposes window.KudaRenderer global.
 *
 * Usage (standalone):
 *   <link rel="stylesheet" href="kuda-json-renderer.css">
 *   <script src="kuda-json-renderer.js"></script>
 *   <script>
 *     const html = KudaRenderer.render(myJsonData, 'auto');
 *     document.getElementById('output').innerHTML = html;
 *   </script>
 *
 * Render modes: 'auto' | 'table' | 'card' | 'tree' | 'list' | 'form'
 * JSON form schema: { form: { title, description, respondent, sections:[{title, questions:[{type,question,options,max,labels,required}]}] } }
 */

(function (global) {
  'use strict';

  /* ── helpers ──────────────────────────────────────────────────────── */
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function typeOf(v) {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    return typeof v;
  }

  function typeBadge(v) {
    const t = typeOf(v);
    const cls = {
      string: 'jr-tag-string',
      number: 'jr-tag-number',
      boolean: v ? 'jr-tag-boolean-true' : 'jr-tag-boolean-false',
      null: 'jr-tag-null'
    };
    if (t === 'object' || t === 'array') return '';
    return `<span class="jr-badge ${cls[t] || ''}">${escHtml(String(v))}</span>`;
  }

  function uid() {
    return 'kr_' + Math.random().toString(36).slice(2, 8);
  }

  function findFirstArray(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
    for (const k of Object.keys(obj)) {
      if (Array.isArray(obj[k])) return obj[k];
    }
    return null;
  }

  /* ── schema collector ─────────────────────────────────────────────── */
  function collectSchema(obj, path, schema) {
    schema = schema || {};
    if (!obj || typeof obj !== 'object') return schema;
    const arr = Array.isArray(obj) ? obj : [obj];
    arr.forEach(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        Object.keys(item).forEach(k => {
          const full = path ? `${path}.${k}` : k;
          const t = typeOf(item[k]);
          schema[full] = { type: t, example: item[k] };
          if (t === 'object' || t === 'array') collectSchema(item[k], full, schema);
        });
      }
    });
    return schema;
  }

  /* ── renderers ────────────────────────────────────────────────────── */

  /** Auto-detect: picks best renderer based on data shape */
  function renderAuto(data) {
    if (Array.isArray(data)) {
      if (data.length && typeof data[0] === 'object' && data[0] !== null) return renderTable(data);
      return renderList(data);
    }
    if (typeof data === 'object' && data !== null) {
      for (const k of Object.keys(data)) {
        if (Array.isArray(data[k]) && data[k].length && typeof data[k][0] === 'object') {
          let out = `<div class="jr-section-title">${escHtml(k)}</div>`;
          out += renderTable(data[k]);
          const rest = {};
          Object.keys(data).forEach(x => { if (x !== k) rest[x] = data[x]; });
          if (Object.keys(rest).length) out = renderKVTable(rest) + out;
          return out;
        }
      }
      return renderKVTable(data);
    }
    return `<div class="jr-badge">${escHtml(String(data))}</div>`;
  }

  /** Array of objects → HTML table */
  function renderTable(arr) {
    if (!arr.length) return '<em>Empty array</em>';
    const allKeys = [...new Set(arr.flatMap(r => (r && typeof r === 'object' ? Object.keys(r) : [])))];
    let html = '<div style="overflow-x:auto"><table class="jr-table"><thead><tr>';
    allKeys.forEach(k => { html += `<th>${escHtml(k)}</th>`; });
    html += '</tr></thead><tbody>';
    arr.forEach(row => {
      html += '<tr>';
      if (row && typeof row === 'object') {
        allKeys.forEach(k => {
          const v = row[k];
          const t = typeOf(v);
          if (t === 'object' || t === 'array') {
            html += `<td><code style="font-size:11px;color:#666;">${escHtml(JSON.stringify(v))}</code></td>`;
          } else {
            html += `<td>${typeBadge(v)}</td>`;
          }
        });
      } else {
        html += `<td colspan="${allKeys.length}">${escHtml(String(row))}</td>`;
      }
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  /** Object → key-value table */
  function renderKVTable(obj) {
    const keys = Object.keys(obj);
    if (!keys.length) return '<em>Empty object</em>';
    let html = '<div style="overflow-x:auto"><table class="jr-table"><tbody>';
    keys.forEach(k => {
      const v = obj[k];
      const t = typeOf(v);
      html += `<tr><td class="key-col">${escHtml(k)}</td><td>`;
      if (t === 'object') html += renderKVTable(v);
      else if (t === 'array') html += renderTable(v);
      else html += typeBadge(v);
      html += '</td></tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  /** Data → card layout */
  function renderCards(data) {
    const arr = Array.isArray(data) ? data : [data];
    if (!arr.length) return '<em>Empty</em>';
    const titleKeys = ['name', 'title', 'label', 'id', 'orderId', 'sku'];
    return arr.map((item, idx) => {
      if (item === null || typeof item !== 'object') {
        return `<div class="jr-card"><span class="jr-badge">${escHtml(String(item))}</span></div>`;
      }
      const titleKey = titleKeys.find(k => k in item);
      const title = titleKey ? item[titleKey] : `Item ${idx + 1}`;
      let html = `<div class="jr-card"><div class="jr-card-title">${escHtml(String(title))}</div>`;
      Object.keys(item).forEach(k => {
        if (k === titleKey) return;
        const v = item[k];
        const t = typeOf(v);
        html += `<div class="jr-card-row"><span class="jr-card-key">${escHtml(k)}</span><span class="jr-card-val">`;
        if (t === 'object' || t === 'array') {
          html += `<code style="font-size:11px;">${escHtml(JSON.stringify(v))}</code>`;
        } else {
          html += typeBadge(v);
        }
        html += '</span></div>';
      });
      html += '</div>';
      return html;
    }).join('');
  }

  /** Data → collapsible tree */
  function renderTree(data, depth) {
    depth = depth || 0;
    const t = typeOf(data);
    if (t === 'object' && data !== null) {
      const keys = Object.keys(data);
      if (!keys.length) return '<span class="tree-val">{}</span>';
      const id = uid();
      const toggle = depth > 0
        ? `<span class="tree-toggle" onclick="var c=document.getElementById('${id}');c.classList.toggle('visible');this.classList.toggle('open');">{&hellip;}</span>`
        : '';
      let inner = `<ul id="${id}" class="collapsible${depth === 0 ? ' visible' : ''}">`;
      keys.forEach(k => {
        inner += `<li><span class="tree-key">${escHtml(k)}</span>: ${renderTree(data[k], depth + 1)}</li>`;
      });
      inner += '</ul>';
      return toggle + inner;
    }
    if (t === 'array') {
      if (!data.length) return '<span class="tree-val">[]</span>';
      const id = uid();
      const toggle = `<span class="tree-toggle" onclick="var c=document.getElementById('${id}');c.classList.toggle('visible');this.classList.toggle('open');">[${data.length}]</span>`;
      let inner = `<ul id="${id}" class="collapsible${depth === 0 ? ' visible' : ''}">`;
      data.forEach((v, i) => { inner += `<li><span class="tree-key">${i}</span>: ${renderTree(v, depth + 1)}</li>`; });
      inner += '</ul>';
      return toggle + inner;
    }
    return typeBadge(data);
  }

  /** Data → numbered list */
  function renderList(data) {
    const arr = Array.isArray(data) ? data : Object.entries(data).map(([k, v]) => ({ key: k, value: v }));
    if (!arr.length) return '<em>Empty</em>';
    const titleKeys = ['name', 'title', 'label', 'event', 'id', 'key'];
    let html = '<ul class="jr-list">';
    arr.forEach((item, i) => {
      html += `<li><span class="li-bullet">${i + 1}</span><div class="li-content">`;
      if (item && typeof item === 'object') {
        const tk = titleKeys.find(k => k in item);
        if (tk) html += `<div class="li-key">${escHtml(String(item[tk]))}</div>`;
        const rest = Object.keys(item).filter(k => k !== tk);
        const sub = rest.map(k => `<strong>${escHtml(k)}:</strong> ${escHtml(String(item[k]))}`).join(' &nbsp;·&nbsp; ');
        if (sub) html += `<div class="li-val">${sub}</div>`;
      } else {
        html += `<div class="li-key">${escHtml(String(item))}</div>`;
      }
      html += '</div></li>';
    });
    html += '</ul>';
    return html;
  }

  /**
   * JSON form schema → interactive questionnaire HTML
   * Schema: { title, description, respondent:{}, sections:[{ id, title, questions:[{type,question,options,max,labels,required}] }] }
   * Supported question types: 'radio', 'checkbox', 'rating'
   */
  function renderForm(form) {
    if (!form || !form.sections) {
      return '<em>JSON tidak memiliki struktur form yang valid. Pastikan ada field <code>form.sections[]</code>.</em>';
    }

    let html = '<div class="jf-wrapper">';

    // header
    html += `<div class="jf-header">
      <div class="jf-header-icon"><i class="fas fa-clipboard-list"></i></div>
      <div>
        <div class="jf-title">${escHtml(form.title || 'Kuesioner')}</div>
        ${form.description ? `<div class="jf-desc">${escHtml(form.description)}</div>` : ''}
      </div>
    </div>`;

    // respondent fields
    if (form.respondent) {
      html += '<div class="jf-respondent">';
      Object.keys(form.respondent).forEach(k => {
        const fid = uid();
        html += `<div class="jf-resp-field">
          <label class="jf-label" for="${fid}">${escHtml(k.charAt(0).toUpperCase() + k.slice(1))}</label>
          <input class="jf-input" id="${fid}" type="text" placeholder="Isi ${escHtml(k)}...">
        </div>`;
      });
      html += '</div>';
    }

    // sections
    form.sections.forEach((sec, si) => {
      html += `<div class="jf-section">
        <div class="jf-section-header">
          <span class="jf-section-num">${si + 1}</span>
          <span class="jf-section-title">${escHtml(sec.title || 'Bagian ' + (si + 1))}</span>
        </div>`;

      if (sec.questions) {
        sec.questions.forEach((q, qi) => {
          const typeLabels = { radio: '⊙ Pilihan Tunggal', checkbox: '☑ Pilihan Ganda', rating: '★ Penilaian' };
          html += `<div class="jf-question">
            <div class="jf-q-header">
              <span class="jf-q-num">${sec.id || 'S' + (si + 1)}.${qi + 1}</span>
              <span class="jf-q-text">${escHtml(q.question)}</span>
              ${q.required ? '<span class="jf-required">Wajib</span>' : '<span class="jf-optional">Opsional</span>'}
            </div>
            <div class="jf-type-badge jf-type-${escHtml(q.type)}">${typeLabels[q.type] || q.type}</div>`;

          if (q.type === 'radio') {
            const gname = uid();
            html += '<div class="jf-options">';
            (q.options || []).forEach(opt => {
              const fid = uid();
              html += `<label class="jf-radio-label" for="${fid}">
                <input type="radio" id="${fid}" name="${gname}" class="jf-radio">
                <span class="jf-radio-circle"></span>
                <span class="jf-opt-text">${escHtml(opt)}</span>
              </label>`;
            });
            html += '</div>';

          } else if (q.type === 'checkbox') {
            html += '<div class="jf-options">';
            (q.options || []).forEach(opt => {
              const fid = uid();
              html += `<label class="jf-check-label" for="${fid}">
                <input type="checkbox" id="${fid}" class="jf-check">
                <span class="jf-check-box"><i class="fas fa-check"></i></span>
                <span class="jf-opt-text">${escHtml(opt)}</span>
              </label>`;
            });
            html += '</div>';

          } else if (q.type === 'rating') {
            const max = q.max || 5;
            const gname = uid();
            html += '<div class="jf-rating-wrap">';
            if (q.labels && q.labels.min) html += `<span class="jf-rating-label-min">${escHtml(q.labels.min)}</span>`;
            html += '<div class="jf-rating-row">';
            for (let i = 1; i <= max; i++) {
              const fid = uid();
              html += `<label class="jf-rating-btn" for="${fid}" title="${i}">
                <input type="radio" id="${fid}" name="${gname}" value="${i}" class="jf-rating-radio">
                <span class="jf-rating-num">${i}</span>
              </label>`;
            }
            html += '</div>';
            if (q.labels && q.labels.max) html += `<span class="jf-rating-label-max">${escHtml(q.labels.max)}</span>`;
            html += '</div>';
          }

          html += '</div>'; // jf-question
        });
      }
      html += '</div>'; // jf-section
    });

    // submit
    html += `<div class="jf-footer">
      <button class="jf-submit"
        onclick="var b=this;b.innerHTML='<i class=\\'fas fa-check me-2\\'></i>Terima Kasih!';b.style.background='#2e7d32';setTimeout(function(){b.innerHTML='<i class=\\'fas fa-paper-plane me-2\\'></i>Kirim Kuesioner';b.style.background='';},2500)">
        <i class="fas fa-paper-plane me-2"></i>Kirim Kuesioner
      </button>
      <div class="jf-footer-note"><i class="fas fa-lock me-1"></i>Jawaban Anda bersifat rahasia dan anonim</div>
    </div>`;

    html += '</div>'; // jf-wrapper
    return html;
  }

  /* ── public API ───────────────────────────────────────────────────── */

  /**
   * KudaRenderer.render(data, mode)
   * @param {any}    data  - Parsed JSON object/array
   * @param {string} mode  - 'auto' | 'table' | 'card' | 'tree' | 'list' | 'form'
   * @returns {string}     - HTML string ready to inject via innerHTML
   */
  function render(data, mode) {
    mode = mode || 'auto';
    // auto-detect questionnaire form
    if (mode === 'auto' && data && data.form && data.form.sections) {
      return renderForm(data.form);
    }
    switch (mode) {
      case 'table': return renderAuto(Array.isArray(data) ? data : findFirstArray(data) || data);
      case 'card':  return renderCards(data);
      case 'tree':  return `<div class="jr-tree">${renderTree(data)}</div>`;
      case 'list':  return renderList(Array.isArray(data) ? data : findFirstArray(data) || data);
      case 'form':  return renderForm(data && data.form ? data.form : data);
      default:      return renderAuto(data);
    }
  }

  /**
   * KudaRenderer.renderJson(jsonString, mode)
   * Convenience: parse + render in one call.
   * @param {string} jsonString
   * @param {string} mode
   * @returns {{ html: string, error: string|null, schema: object }}
   */
  function renderJson(jsonString, mode) {
    try {
      const data = JSON.parse(jsonString);
      return {
        html: render(data, mode || 'auto'),
        error: null,
        schema: collectSchema(data, '')
      };
    } catch (e) {
      return { html: '', error: e.message, schema: {} };
    }
  }

  /**
   * KudaRenderer.autoMount(selector, options)
   * Automatically render all [data-kdr-json] elements on page.
   *
   * HTML usage:
   *   <div data-kdr-json='{"name":"Alice"}' data-kdr-mode="card"></div>
   *   <script>KudaRenderer.autoMount();</script>
   *
   * @param {string} selector - CSS selector (default: '[data-kdr-json]')
   */
  function autoMount(selector) {
    selector = selector || '[data-kdr-json]';
    document.querySelectorAll(selector).forEach(el => {
      const raw  = el.getAttribute('data-kdr-json') || el.textContent.trim();
      const mode = el.getAttribute('data-kdr-mode') || 'auto';
      const result = renderJson(raw, mode);
      if (result.error) {
        el.innerHTML = `<em style="color:#c62828;">JSON Error: ${escHtml(result.error)}</em>`;
      } else {
        el.innerHTML = result.html;
      }
    });
  }

  /* ── expose globally ──────────────────────────────────────────────── */
  global.KudaRenderer = {
    render,
    renderJson,
    autoMount,
    // expose internals for advanced use
    renderTable,
    renderCards,
    renderTree,
    renderList,
    renderForm,
    collectSchema,
    escHtml,
    typeOf
  };

}(typeof window !== 'undefined' ? window : this));
