/**
 * Controlador de Frontend, Cotizador Inteligente y Experiencia UI/UX
 * Asesoría Integral en SG-SST para Propiedad Horizontal en Colombia
 * Resolución 0312 de 2019 • Decreto 1072 de 2015 • Ley 675 de 2001
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initRoleSelector();
  initLiveEstimator();
  initFaqAccordion();
  initFormHandler();
  initPolicyModals();
});

// ===================================================================
// NAVEGACIÓN Y SCROLL SUAVE
// ===================================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===================================================================
// SELECTOR RÁPIDO DE PERFIL HUMANO Y EMPÁTICO (HERO SECTION)
// ===================================================================
function initRoleSelector() {
  const roleButtons = document.querySelectorAll('.role-tab-btn');
  const roleContentBox = document.getElementById('roleContentBox');
  if (!roleButtons.length || !roleContentBox) return;

  const roleMessages = {
    admin: `🛡️ <strong>Para Administradores:</strong> Libérate de la angustia por requerimientos del MinTrabajo. Te acompañamos mes a mes con actas de COPASST, matriz GTC 45 viva e inspecciones locativas listas para presentar ante el Consejo y la ARL sin comprometer tu patrimonio personal.`,
    consejo: `⚖️ <strong>Para Consejeros de Administración:</strong> Blindamos la responsabilidad civil solidaria de la copropiedad. Cero sorpresas presupuestales ni demandas por accidentes de contratistas en fachadas, bombas o cubiertas. Aprobación transparente y pedagógica en asamblea.`,
    residente: `🏡 <strong>Para Residentes y Propietarios:</strong> Tu conjunto seguro, con protocolos de emergencia auditados, extintores vigentes, ascensores certificados y piscinas seguras para el bienestar de tu familia y la valorización de tu patrimonio.`
  };

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const role = btn.getAttribute('data-role');
      if (roleMessages[role]) {
        roleContentBox.innerHTML = roleMessages[role];
        roleContentBox.style.animation = 'none';
        // Forzar reflow para reiniciar la animación
        void roleContentBox.offsetWidth;
        roleContentBox.style.animation = 'fadeIn 0.3s ease-out';
      }
    });
  });
}

// ===================================================================
// ESTIMADOR EN TIEMPO REAL (COTIZADOR INTERACTIVO)
// ===================================================================
function initLiveEstimator() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const unitsInput = form.querySelector('#unidades_ph');
  const towersInput = form.querySelector('#torres_ph');
  const typeSelect = form.querySelector('#tipo_ph');
  const checkboxes = form.querySelectorAll('input[name="zonas_comunes"]');

  const updateEstimate = () => {
    const units = parseInt(unitsInput?.value) || 60;
    const towers = parseInt(towersInput?.value) || 2;
    const type = typeSelect?.value || 'Residencial';

    let hasCriticalAreas = false;
    checkboxes.forEach(cb => {
      if (cb.checked && (cb.value === 'Piscina / Zonas Húmedas' || cb.value === 'Subestación Eléctrica' || cb.value === 'Ascensores')) {
        hasCriticalAreas = true;
      }
    });

    const packageNameEl = document.getElementById('estimatePackageName');
    const detailsEl = document.getElementById('estimateDetails');
    const priceValEl = document.getElementById('estimatePriceVal');

    if (!packageNameEl || !priceValEl) return;

    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    });

    if (units <= 35 && !hasCriticalAreas && type === 'Residencial') {
      packageNameEl.textContent = 'Cumplimiento Básico PH';
      if (detailsEl) detailsEl.textContent = `Ideal para ${units} unidades y ${towers} torre(s). Matriz base, diagnóstico inicial y plan de trabajo anual.`;
      priceValEl.textContent = formatter.format(380000);
    } else if (units > 120 || (hasCriticalAreas && units > 80) || type === 'Comercial' || type === 'Condominio Campestre') {
      packageNameEl.textContent = 'Blindaje Total y Reingeniería (Premium)';
      if (detailsEl) detailsEl.textContent = `Máxima cobertura para ${units} unidades con zonas críticas. Auditoría PILA, protocolo alturas Res. 4272 e informe oficial asistido.`;
      priceValEl.textContent = formatter.format(980000);
    } else {
      packageNameEl.textContent = 'Gestión Integral y Acompañamiento Continuo';
      if (detailsEl) detailsEl.textContent = `El plan preferido para ${units} unidades. Visitas técnicas mensuales, matriz GTC 45 viva y actas de COPASST.`;
      priceValEl.textContent = formatter.format(650000);
    }
  };

  // Escuchar eventos en los controles del cotizador
  [unitsInput, towersInput, typeSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', updateEstimate);
      input.addEventListener('change', updateEstimate);
    }
  });

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateEstimate);
  });

  // Ejecutar cálculo inicial
  updateEstimate();
}

// ===================================================================
// ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ INTERACTIVO)
// ===================================================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Cerrar los demás acordeones para un efecto fluido tipo acordeón único
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        if (isOpen) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });
}

// ===================================================================
// MANEJADOR DEL FORMULARIO DE COTIZACIÓN Y GENERADOR DE PROPUESTAS
// ===================================================================
function initFormHandler() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg> Analizando Copropiedad y Generando Propuesta Oficial...
    `;
    submitBtn.disabled = true;

    // Recolectar datos del formulario
    const zonasChecked = [];
    form.querySelectorAll('input[name="zonas_comunes"]:checked').forEach(cb => {
      zonasChecked.push(cb.value);
    });

    const payload = {
      nombre: form.querySelector('#nombre_ph').value,
      nit: form.querySelector('#nit_ph').value,
      tipo_ph: form.querySelector('#tipo_ph').value,
      ciudad: form.querySelector('#ciudad_ph').value,
      direccion: form.querySelector('#direccion_ph').value,
      unidades: parseInt(form.querySelector('#unidades_ph').value) || 0,
      torres: parseInt(form.querySelector('#torres_ph').value) || 1,
      zonas_comunes: zonasChecked,
      personal_ops: form.querySelector('#personal_ops').value,
      personal_subcontratado: form.querySelector('#personal_sub').value,
      estado_sst: form.querySelector('#estado_sst').value,
      contacto_nombre: form.querySelector('#contacto_nombre').value,
      contacto_email: form.querySelector('#contacto_email').value,
      contacto_telefono: form.querySelector('#contacto_tel').value
    };

    try {
      const response = await fetch('/api/cotizar-copropiedad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === 'ok' && data.propuesta) {
        showProposalModal(data.propuesta);
        form.reset();
        initLiveEstimator();
      } else {
        alert('Hubo un inconveniente al procesar la solicitud: ' + (data.error || 'Intente nuevamente.'));
      }
    } catch (err) {
      console.warn('API local no disponible o error de red, ejecutando cálculo en cliente:', err);
      renderLocalProposal(payload);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===================================================================
// MODAL DE PROPUESTA ECONÓMICA FORMAL (MEMBRETE EJECUTIVO)
// ===================================================================
function showProposalModal(propuesta) {
  const modal = document.getElementById('proposalModal');
  const content = document.getElementById('proposalModalContent');
  if (!modal || !content) return;

  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });

  const fechaHoy = propuesta.fecha_emision || new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const propuestaCod = propuesta.codigo || `PROP-PH-2026-${String(propuesta.id || 101).padStart(4, '0')}`;

  content.innerHTML = `
    <div class="proposal-sheet" style="font-family: inherit; line-height: 1.55;">
      <!-- Membrete Ejecutivo -->
      <div class="proposal-branding" style="padding-bottom: 18px; border-bottom: 2px solid var(--primary); margin-bottom: 22px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 46px; height: 46px; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.4rem; box-shadow: 0 4px 10px rgba(5,150,105,0.25);">
            🛡️
          </div>
          <div>
            <h2 style="color: var(--primary); font-size: 1.35rem; font-weight: 800; margin: 0; letter-spacing: -0.3px;">SST INTEGRAL PROPIEDAD HORIZONTAL</h2>
            <p style="font-size: 0.82rem; color: var(--muted); margin: 2px 0 0 0;">Asesoría, Auditorías & Reingeniería SG-SST • Licencia MinTrabajo • NIT: 901.884.210-5</p>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.8rem; font-weight: 800; color: #1e3a8a; background: #eff6ff; border: 1px solid #bfdbfe; padding: 4px 12px; border-radius: 6px;">
            ${propuestaCod}
          </span>
          <div style="font-size: 0.78rem; color: var(--muted); margin-top: 6px;">Fecha: <strong>${fechaHoy}</strong></div>
          <div style="font-size: 0.74rem; color: var(--secondary); font-weight: 600;">Validez: 30 Días Calendario</div>
        </div>
      </div>

      <!-- Ficha del Cliente -->
      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 18px 20px; margin-bottom: 22px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--dark); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--secondary);"></span>
          1. Identificación de la Copropiedad Cliente
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.88rem;">
          <div><span style="color: var(--muted);">Razón Social:</span><br><strong>${propuesta.copropiedad}</strong></div>
          <div><span style="color: var(--muted);">NIT:</span><br><strong>${propuesta.nit || 'En Trámite / Registrado'}</strong></div>
          <div><span style="color: var(--muted);">Tipología:</span><br><strong>${propuesta.tipo_ph}</strong></div>
          <div><span style="color: var(--muted);">Dimensionamiento:</span><br><strong>${propuesta.unidades} unidades (${propuesta.torres} torres)</strong></div>
        </div>
      </div>

      <!-- Plan Técnico Sugerido -->
      <div style="border: 2px solid var(--secondary); border-radius: 10px; padding: 22px; background: #ffffff; margin-bottom: 22px; box-shadow: 0 4px 14px rgba(5,150,105,0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; letter-spacing: 0.8px;">Plan Técnico Personalizado</span>
            <h3 style="color: var(--dark); font-size: 1.3rem; margin: 2px 0 0 0;">${propuesta.paquete_sugerido}</h3>
          </div>
          <span style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 99px;">
            A la Medida de la Copropiedad
          </span>
        </div>
        <p style="font-size: 0.88rem; color: var(--muted); margin-bottom: 16px;">
          Estructurado meticulosamente bajo los Estándares Mínimos de la Resolución 0312 de 2019, garantizando blindaje jurídico al Administrador(a) y Consejo de Administración frente a responsabilidades del Decreto 1072 de 2015.
        </p>

        <!-- Cronograma de 4 Fases de Entregables -->
        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 14px 18px; margin-bottom: 16px;">
          <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--dark); margin-bottom: 8px; text-transform: uppercase;">
            Cronograma de Implementación de Entregables:
          </h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; font-size: 0.82rem;">
            <div style="border-left: 3px solid var(--primary); padding-left: 8px;">
              <strong>Fase 1: Diagnóstico Inicial</strong><br>
              <span style="color: var(--muted);">Autoevaluación Res. 0312 y asignación de responsabilidades.</span>
            </div>
            <div style="border-left: 3px solid var(--secondary); padding-left: 8px;">
              <strong>Fase 2: Matriz IPVR (GTC 45)</strong><br>
              <span style="color: var(--muted);">Inspección cuartos de bombas, tanques, subestación y shut.</span>
            </div>
            <div style="border-left: 3px solid var(--warm-accent); padding-left: 8px;">
              <strong>Fase 3: Brigadas & Alturas</strong><br>
              <span style="color: var(--muted);">Auditoría PILA contratistas y plan de emergencias copropiedad.</span>
            </div>
            <div style="border-left: 3px solid var(--primary-light); padding-left: 8px;">
              <strong>Fase 4: Tablero & Auditoría</strong><br>
              <span style="color: var(--muted);">6 indicadores obligatorios y reporte oficial con evidencias.</span>
            </div>
          </div>
        </div>

        <ul style="list-style: none; font-size: 0.88rem; line-height: 1.6; color: var(--dark);">
          <li>✓ <strong>Matriz IPVR (GTC 45) Viva:</strong> Diferenciación técnica entre personal OPS y subcontratistas (aseo y vigilancia).</li>
          <li>✓ <strong>Plan Anual de Trabajo y Capacitaciones:</strong> Formato auditable para presentar ante Consejo y Asamblea.</li>
          <li>✓ <strong>Auditoría Estricta de Contratistas:</strong> Verificación de PILA, coordinadores y cursos de alturas (Res. 4272/2021).</li>
          <li>✓ <strong>Acompañamiento Técnico Mensual:</strong> Visitas periódicas y actas de COPASST o Vigía de SST.</li>
        </ul>
      </div>

      <!-- Cuadro de Inversión Transparente -->
      <div class="proposal-price-box" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #94a3b8; border-radius: 10px; padding: 22px; text-align: center; margin-bottom: 22px;">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px;">
          Inversión Propuesta para la Copropiedad
        </div>
        <div style="font-size: 2.3rem; font-weight: 800; color: var(--primary); margin: 6px 0;">
          ${formatter.format(propuesta.valor_mensual)} <span style="font-size: 0.95rem; font-weight: 500; color: var(--muted);">/ mes</span>
        </div>
        <div style="font-size: 0.92rem; color: var(--dark); font-weight: 600;">
          Inversión Total Anual (12 Meses de Cobertura): <span style="color: var(--secondary);">${formatter.format(propuesta.valor_total_anual)}</span>
        </div>
        <p style="font-size: 0.82rem; color: var(--muted); margin: 8px 0 0 0;">
          Condiciones de Pago: ${propuesta.condiciones_pago || 'Mensualidades vencidas contra entrega de informe mensual de actividades.'}
        </p>
      </div>

      <!-- ADVERTENCIAS LEGALES FISCALIZADAS OBLIGATORIAS (AUDITORÍA SST) -->
      <div class="proposal-badge-notice" style="background: #fffbeb; border-left: 4px solid var(--warning); padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
        <h5 style="font-size: 0.9rem; font-weight: 800; color: #92400e; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.4px;">
          ⚖ Requisitos y Condiciones Normativas Obligatorias:
        </h5>
        <ul style="margin-left: 18px; font-size: 0.83rem; line-height: 1.55; color: #78350f;">
          <li style="margin-bottom: 6px;">
            <strong>Responsable Interno de la Copropiedad (Res. 0312/2019):</strong> La persona jurídica de la propiedad horizontal debe contar con un Administrador(a) o responsable interno designado con certificación vigente del <strong>Curso Virtual de 50 Horas en SST</strong> (o actualización de 20 horas). Nuestra firma brinda acompañamiento técnico y formula todos los planes, pero la responsabilidad legal patronal recae en la administración.
          </li>
          <li>
            <strong>Condición Ineludible para Reporte ante ARL y MinTrabajo:</strong> El cargue oficial de la autoevaluación anual en el Fondo de Riesgos Laborales del Ministerio del Trabajo y ante la ARL se realizará <strong>exclusivamente de acuerdo a la revisión previa y con base en evidencias fidedignas y verificables</strong> entregadas formalmente por la administración de la copropiedad.
          </li>
        </ul>
      </div>

      <!-- Acciones de Descarga y Navegación -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding-top: 10px;">
        <div style="font-size: 0.8rem; color: var(--muted);">
          🏢 Documento técnico emitido para aprobación en Consejo / Asamblea.
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-outline" onclick="window.print()" style="font-size: 0.88rem; padding: 10px 18px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Imprimir / Guardar en PDF
          </button>
          <a href="/entregables.html?copropiedad_id=${propuesta.id || 1}" class="btn btn-primary" style="font-size: 0.88rem; padding: 10px 18px;">
            Acceder al Portal de Entregables →
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// Fallback en caso de prueba estática sin servidor
function renderLocalProposal(payload) {
  const units = payload.unidades || 60;
  const isHighRisk = units > 120 || (payload.zonas_comunes && payload.zonas_comunes.includes('Piscina / Zonas Húmedas'));
  const isSmall = units <= 35 && (!payload.zonas_comunes || (!payload.zonas_comunes.includes('Piscina / Zonas Húmedas') && !payload.zonas_comunes.includes('Ascensores')));

  let packageName = 'Gestión Integral y Acompañamiento Continuo';
  let monthlyPrice = 650000;

  if (isSmall) {
    packageName = 'Cumplimiento Básico PH';
    monthlyPrice = 380000;
  } else if (isHighRisk) {
    packageName = 'Blindaje Total y Reingeniería (Premium)';
    monthlyPrice = 980000;
  }

  const proposal = {
    id: 101,
    codigo: `PROP-PH-2026-0101`,
    copropiedad: payload.nombre || 'Copropiedad Registrada PH',
    nit: payload.nit || '901.000.000-0',
    tipo_ph: payload.tipo_ph || 'Residencial',
    unidades: units,
    torres: payload.torres || 1,
    paquete_sugerido: packageName,
    valor_mensual: monthlyPrice,
    valor_total_anual: monthlyPrice * 12,
    condiciones_pago: 'Mensualidades vencidas contra entrega de informe mensual de actividades.',
    fecha_emision: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  showProposalModal(proposal);
}

function closeProposalModal() {
  const modal = document.getElementById('proposalModal');
  if (modal) modal.classList.remove('active');
}

// ===================================================================
// MODALES DE POLÍTICAS CORPORATIVAS
// ===================================================================
function initPolicyModals() {
  const modal = document.getElementById('policyModal');
  if (!modal) return;

  const policyData = {
    sgsst: {
      title: 'Política Integral del SG-SST',
      subtitle: 'Conforme al Decreto 1072 de 2015 y Resolución 0312 de 2019',
      content: `
        <p>La Alta Dirección de la firma de Asesoría en SG-SST y Auditorías declara su compromiso indeclinable con la promoción de la salud y prevención de accidentes y enfermedades laborales en todos los trabajadores directos, personal por OPS y contratistas de las copropiedades clientes.</p>
        <h5 style="margin: 16px 0 8px; font-weight: 700; color: var(--dark);">Compromisos Fundamentales:</h5>
        <ul style="margin-left: 20px; line-height: 1.6;">
          <li>Identificar oportunamente los peligros y evaluar los riesgos en cuartos de bombas, subestaciones, tanques, fachadas y áreas de circulación.</li>
          <li>Cumplir la normatividad nacional vigente en riesgos laborales y propiedad horizontal (Ley 675 de 2001).</li>
          <li>Destinar los recursos técnicos y humanos requeridos para la mejora continua del SG-SST.</li>
        </ul>
      `
    },
    alcohol: {
      title: 'Política de Prevención de Alcohol, Tabaco y Sustancias Psicoactivas',
      subtitle: 'Espacios 100% Libres de Humo y Ambientes de Trabajo Seguros',
      content: `
        <p>Prohíbe terminantemente presentarse a laborar o permanecer en las instalaciones bajo los efectos del alcohol o sustancias psicoactivas ilícitas.</p>
        <p>Garantiza que en pasillos comunes, cuartos técnicos y garajes de las copropiedades impere la política de espacios libres de humo según la Ley 1335 de 2009.</p>
      `
    },
    habeas: {
      title: 'Política de Tratamiento de Datos Personales (Habeas Data)',
      subtitle: 'Cumplimiento estricto de la Ley Estatutaria 1581 de 2012 y Dec. 1377 de 2013',
      content: `
        <p>Los datos recolectados en este portal web y en la gestión de copropiedades serán utilizados exclusivamente para:</p>
        <ul style="margin-left: 20px; line-height: 1.6;">
          <li>Estructuración y cotización de servicios de asesoría y auditoría en SST.</li>
          <li>Elaboración de diagnósticos, matrices de riesgos y reportes ante ARL.</li>
          <li>Atención a requerimientos de autoridades judiciales y del Ministerio del Trabajo.</li>
        </ul>
        <p style="margin-top: 12px;">Los titulares tienen derecho a conocer, actualizar, rectificar y suprimir sus datos en cualquier momento.</p>
      `
    }
  };

  window.openPolicy = function(type) {
    const data = policyData[type];
    if (!data) return;

    document.getElementById('policyModalTitle').textContent = data.title;
    document.getElementById('policyModalSubtitle').textContent = data.subtitle;
    document.getElementById('policyModalBody').innerHTML = data.content;
    modal.classList.add('active');
  };

  window.closePolicyModal = function() {
    modal.classList.remove('active');
  };
}
