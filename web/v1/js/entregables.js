/**
 * Controlador del Espacio de Entregables de Clientes y Auditoría SG-SST
 * Asesoría Integral en Propiedad Horizontal
 * Módulos: Diagnóstico Res. 0312, Matriz IPVR GTC 45 con Filtros Dinámicos,
 * Planes de Acción, Cronogramas e Indicadores Semafóricos
 */

let currentCopropiedadId = 1;
let rawMatrizData = [];
let allCopropiedades = [];

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get('copropiedad_id');
  if (paramId) currentCopropiedadId = parseInt(paramId);

  setupTabNavigation();
  initMatrixFilterEvents();
  loadCopropiedadesSelector();
});

// ===================================================================
// NAVEGACIÓN POR PESTAÑAS TÉCNICAS
// ===================================================================
function setupTabNavigation() {
  const tabs = document.querySelectorAll('.deliverable-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');
    });
  });
}

// ===================================================================
// SELECTOR DE COPROPIEDADES Y ENCABEZADO EJECUTIVO
// ===================================================================
async function loadCopropiedadesSelector() {
  const selector = document.getElementById('copropiedadSelector');
  if (!selector) return;

  try {
    const res = await fetch('/api/copropiedades');
    const data = await res.json();
    if (data.status === 'ok' && data.copropiedades) {
      allCopropiedades = data.copropiedades;
      selector.innerHTML = '';

      data.copropiedades.forEach(cp => {
        const opt = document.createElement('option');
        opt.value = cp.id;
        opt.textContent = `${cp.nombre} (NIT: ${cp.nit})`;
        if (cp.id === currentCopropiedadId) opt.selected = true;
        selector.appendChild(opt);
      });

      updateExecutiveHeader(currentCopropiedadId);

      selector.addEventListener('change', (e) => {
        currentCopropiedadId = parseInt(e.target.value);
        updateExecutiveHeader(currentCopropiedadId);
        loadAllDeliverables();
      });

      loadAllDeliverables();
    }
  } catch (e) {
    console.error('Error cargando copropiedades:', e);
    // Carga de fallback para visualización local
    loadAllDeliverables();
  }
}

function updateExecutiveHeader(copropiedadId) {
  const cp = allCopropiedades.find(c => c.id === copropiedadId);
  const avatarEl = document.getElementById('clientAvatar');
  const nameEl = document.getElementById('clientNameHeader');
  const metaEl = document.getElementById('clientMetaHeader');
  const courseBadgeEl = document.getElementById('courseStatusBadge');

  if (!cp) return;

  if (nameEl) nameEl.textContent = cp.nombre;

  // Generar iniciales para el avatar
  if (avatarEl) {
    const initials = cp.nombre
      .replace(/Conjunto|Residencial|Edificio|Condominio|PH/gi, '')
      .trim()
      .split(' ')
      .filter(w => w.length > 0)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('') || 'PH';
    avatarEl.textContent = initials;
  }

  if (metaEl) {
    metaEl.textContent = `NIT: ${cp.nit || 'En trámite'} • ${cp.tipo_ph || 'Residencial'} (${cp.unidades || 96} Unidades, ${cp.torres || 2} Torres) • ${cp.ciudad || 'Bogotá D.C.'}`;
  }

  if (courseBadgeEl) {
    const courseStatus = cp.curso_50h_responsable || 'En Culminación';
    if (courseStatus.toLowerCase().includes('vigente') || courseStatus.toLowerCase().includes('certificado')) {
      courseBadgeEl.className = 'course-status-pill certified';
      courseBadgeEl.innerHTML = `<span class="kpi-status-dot dot-green"></span> Curso 50h SST: Certificado Vigente`;
    } else if (courseStatus.toLowerCase().includes('proceso') || courseStatus.toLowerCase().includes('culminación')) {
      courseBadgeEl.className = 'course-status-pill in-progress';
      courseBadgeEl.innerHTML = `<span class="kpi-status-dot dot-yellow"></span> Curso 50h SST: En Culminación (15 días)`;
    } else {
      courseBadgeEl.className = 'course-status-pill pending';
      courseBadgeEl.innerHTML = `<span class="kpi-status-dot dot-red"></span> Curso 50h SST: Pendiente Radicación`;
    }
  }
}

function loadAllDeliverables() {
  loadDiagnostico();
  loadMatrizPeligros();
  loadPlanesAccion();
  loadCronogramas();
  loadIndicadores();
}

// ===================================================================
// TAB 1: DIAGNÓSTICO INICIAL (RES. 0312 DE 2019) CON SEMÁFOROS
// ===================================================================
async function loadDiagnostico() {
  const container = document.getElementById('diagItemsTable');
  const scoreBadge = document.getElementById('diagScoreBadge');
  const statusBadge = document.getElementById('diagStatusBadge');
  const progressBar = document.getElementById('diagProgressBar');
  const progressText = document.getElementById('diagProgressText');
  const legalAdvice = document.getElementById('diagLegalAdvice');

  if (!container) return;

  try {
    const res = await fetch(`/api/diagnostico?copropiedad_id=${currentCopropiedadId}`);
    const data = await res.json();
    if (data.status === 'ok' && data.diagnostico) {
      const diag = data.diagnostico;
      const score = diag.puntaje_total || 0;

      if (scoreBadge) scoreBadge.textContent = `${score}%`;
      if (progressText) progressText.textContent = `${score} / 100 Pts`;

      if (progressBar) {
        progressBar.style.width = `${score}%`;
        if (score < 60) {
          progressBar.style.background = 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
        } else if (score <= 85) {
          progressBar.style.background = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
        } else {
          progressBar.style.background = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
        }
      }

      if (statusBadge) {
        statusBadge.textContent = diag.clasificacion;
        statusBadge.className = 'status-pill ' + (score < 60 ? 'status-danger' : (score <= 85 ? 'status-warning' : 'status-success'));
      }

      if (legalAdvice) {
        if (score < 60) {
          legalAdvice.style.background = '#fef2f2';
          legalAdvice.style.borderColor = '#fecaca';
          legalAdvice.style.color = '#991b1b';
          legalAdvice.innerHTML = `
            <strong style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              ⚠️ Dictamen Normativo (Res. 0312 Art. 28):
            </strong>
            <span>La copropiedad se encuentra en estado <strong>CRÍTICO (&lt; 60%)</strong>. Es obligatorio formular de inmediato el Plan de Mejoramiento a 3 meses y remitir evidencias de avance a la ARL.</span>
          `;
        } else if (score <= 85) {
          legalAdvice.style.background = '#fffbeb';
          legalAdvice.style.borderColor = '#fde68a';
          legalAdvice.style.color = '#92400e';
          legalAdvice.innerHTML = `
            <strong style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              🟡 Dictamen Normativo (Res. 0312 Art. 28):
            </strong>
            <span>Estado <strong>MODERADAMENTE ACEPTABLE (60%-85%)</strong>. Ejecutar plan de mejora a 6 meses con informe a la ARL.</span>
          `;
        } else {
          legalAdvice.style.background = '#f0fdf4';
          legalAdvice.style.borderColor = '#bbf7d0';
          legalAdvice.style.color = '#166534';
          legalAdvice.innerHTML = `
            <strong style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              🟢 Dictamen Normativo:
            </strong>
            <span>Estado <strong>ACEPTABLE (&gt; 85%)</strong>. Cumplimiento legal robusto. Mantener el Plan de Trabajo Anual y seguimiento de indicadores.</span>
          `;
        }
      }

      container.innerHTML = '';
      if (diag.items_evaluados && Array.isArray(diag.items_evaluados)) {
        diag.items_evaluados.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${item.item}</strong></td>
            <td>${item.nombre}</td>
            <td style="text-align: center;">${item.puntaje}%</td>
            <td style="text-align: center;">
              <span class="badge ${item.cumple ? 'badge-success' : 'badge-danger'}">
                ${item.cumple ? '✓ CUMPLE' : '✕ NO CUMPLE'}
              </span>
            </td>
            <td style="text-align: center;"><strong>${item.obtenido}%</strong></td>
          `;
          container.appendChild(tr);
        });
      }
    }
  } catch (e) {
    console.error('Error al cargar diagnóstico:', e);
  }
}

// ===================================================================
// TAB 2: MATRIZ DE PELIGROS (GTC 45) CON FILTROS DINÁMICOS
// ===================================================================
async function loadMatrizPeligros() {
  try {
    const res = await fetch(`/api/matriz-peligros?copropiedad_id=${currentCopropiedadId}`);
    const data = await res.json();
    if (data.status === 'ok' && data.matriz) {
      rawMatrizData = data.matriz;
      applyMatrixFilters();
    }
  } catch (e) {
    console.error('Error al cargar matriz:', e);
  }
}

function initMatrixFilterEvents() {
  const filterArea = document.getElementById('filterArea');
  const filterPersonal = document.getElementById('filterPersonal');
  const filterRisk = document.getElementById('filterRisk');
  const searchInput = document.getElementById('searchMatrix');

  [filterArea, filterPersonal, filterRisk].forEach(sel => {
    if (sel) sel.addEventListener('change', applyMatrixFilters);
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyMatrixFilters);
  }
}

function applyMatrixFilters() {
  const filterArea = document.getElementById('filterArea')?.value || 'ALL';
  const filterPersonal = document.getElementById('filterPersonal')?.value || 'ALL';
  const filterRisk = document.getElementById('filterRisk')?.value || 'ALL';
  const searchTerm = (document.getElementById('searchMatrix')?.value || '').toLowerCase().trim();

  const filtered = rawMatrizData.filter(row => {
    // Filtro por Área
    if (filterArea !== 'ALL') {
      if (!row.zona_area.toLowerCase().includes(filterArea.toLowerCase())) return false;
    }

    // Filtro por Tipo de Personal
    if (filterPersonal !== 'ALL') {
      if (!row.tipo_personal.toLowerCase().includes(filterPersonal.toLowerCase())) return false;
    }

    // Filtro por Nivel de Riesgo (I, II, III)
    if (filterRisk !== 'ALL') {
      const riskLevel = row.nivel_riesgo || '';
      if (!riskLevel.startsWith(filterRisk)) return false;
    }

    // Buscador textual
    if (searchTerm) {
      const hayMatch = 
        row.zona_area.toLowerCase().includes(searchTerm) ||
        row.proceso_tarea.toLowerCase().includes(searchTerm) ||
        row.peligro_descripcion.toLowerCase().includes(searchTerm) ||
        row.clasificacion_peligro.toLowerCase().includes(searchTerm) ||
        row.medidas_intervencion.toLowerCase().includes(searchTerm);
      if (!hayMatch) return false;
    }

    return true;
  });

  renderMatrizTable(filtered);

  const countBadge = document.getElementById('matrixCountBadge');
  if (countBadge) {
    countBadge.textContent = `Mostrando ${filtered.length} de ${rawMatrizData.length} peligros`;
  }
}

function renderMatrizTable(rows) {
  const tbody = document.getElementById('matrizTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 30px; color: var(--muted);">
          🔍 No se encontraron peligros que coincidan con los filtros seleccionados.
        </td>
      </tr>
    `;
    return;
  }

  rows.forEach(row => {
    const tr = document.createElement('tr');
    const badgeRisk = row.nr >= 600 ? 'risk-i' : (row.nr >= 150 ? 'risk-ii' : 'risk-iii');
    tr.innerHTML = `
      <td><strong>${row.zona_area}</strong><br><small style="color: var(--muted);">${row.proceso_tarea}</small></td>
      <td><span class="pill-tag">${row.tipo_personal}</span></td>
      <td><strong>${row.clasificacion_peligro}</strong><br><small>${row.peligro_descripcion}</small></td>
      <td style="text-align: center;"><strong>${row.np}</strong></td>
      <td style="text-align: center;"><strong>${row.nc}</strong></td>
      <td style="text-align: center;"><span class="risk-badge ${badgeRisk}">${row.nr} (${row.nivel_riesgo.split('-')[0].trim()})</span></td>
      <td><small>${row.medidas_intervencion}</small></td>
    `;
    tbody.appendChild(tr);
  });
}

// ===================================================================
// TAB 3: PLANES DE ACCIÓN Y MEJORA
// ===================================================================
async function loadPlanesAccion() {
  const container = document.getElementById('planesTableBody');
  if (!container) return;

  try {
    const res = await fetch(`/api/planes-accion?copropiedad_id=${currentCopropiedadId}`);
    const data = await res.json();
    if (data.status === 'ok' && data.planes) {
      container.innerHTML = '';
      data.planes.forEach(plan => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${plan.estandar_asociado}</strong></td>
          <td>${plan.hallazgo}</td>
          <td><strong>${plan.accion_propuesta}</strong></td>
          <td>${plan.responsable}</td>
          <td>${plan.recursos}</td>
          <td><span style="font-size: 0.85rem; font-weight: 600;">${plan.fecha_limite}</span></td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="progress-bar-bg" style="width: 80px;">
                <div class="progress-bar-fill" style="width: ${plan.avance_pct}%;"></div>
              </div>
              <span style="font-size: 0.8rem; font-weight: 700;">${plan.avance_pct}%</span>
            </div>
            <small style="color: ${plan.estado === 'Completado' ? 'var(--secondary)' : 'var(--warning)'}; font-weight: 700;">${plan.estado}</small>
          </td>
        `;
        container.appendChild(tr);
      });
    }
  } catch (e) {
    console.error('Error cargando planes de acción:', e);
  }
}

// ===================================================================
// TAB 4: CRONOGRAMAS Y SEGUIMIENTO
// ===================================================================
async function loadCronogramas() {
  const container = document.getElementById('cronogramasTableBody');
  if (!container) return;

  try {
    const res = await fetch(`/api/cronogramas?copropiedad_id=${currentCopropiedadId}`);
    const data = await res.json();
    if (data.status === 'ok' && data.cronogramas) {
      container.innerHTML = '';
      data.cronogramas.forEach(c => {
        const tr = document.createElement('tr');
        const pillClass = c.estado === 'Completado' ? 'badge-success' : (c.estado === 'En Proceso' ? 'badge-warning' : 'badge-neutral');
        tr.innerHTML = `
          <td><strong>${c.tipo_cronograma}</strong></td>
          <td>${c.actividad}</td>
          <td><span class="pill-tag">${c.mes}</span></td>
          <td>${c.responsable}</td>
          <td><span class="badge ${pillClass}">${c.estado}</span></td>
          <td>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${c.porcentaje}%;"></div>
            </div>
            <small style="font-weight: 700;">${c.porcentaje}%</small>
          </td>
        `;
        container.appendChild(tr);
      });
    }
  } catch (e) {
    console.error('Error cargando cronogramas:', e);
  }
}

// ===================================================================
// TAB 5: TABLERO DE 6 INDICADORES OBLIGATORIOS (SEMÁFOROS MEJORADOS)
// ===================================================================
async function loadIndicadores() {
  try {
    const res = await fetch(`/api/indicadores?copropiedad_id=${currentCopropiedadId}`);
    const data = await res.json();
    if (data.status === 'ok' && data.indicadores) {
      const ind = data.indicadores;
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setVal('indFrecuencia', ind.frecuencia_at.toFixed(1));
      setVal('indSeveridad', ind.severidad_at.toFixed(1));
      setVal('indMortalidad', ind.mortalidad_at.toFixed(1) + '%');
      setVal('indAusentismo', ind.ausentismo_pct.toFixed(1) + '%');
      setVal('indCumplimientoPlan', ind.cumplimiento_plan_pct.toFixed(0) + '%');
      setVal('indCapacitacion', ind.cobertura_capacitacion_pct.toFixed(0) + '%');
    }
  } catch (e) {
    console.error('Error al cargar indicadores:', e);
  }
}
