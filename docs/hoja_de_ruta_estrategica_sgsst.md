# HOJA DE RUTA ESTRATÉGICA Y OPERACIONAL (ROADMAP)
## Consultoría y Asesoría Integral en SG-SST, Auditorías y Reingeniería para Propiedad Horizontal (Colombia)

**Versión:** 1.0  
**Enfoque:** Cumplimiento Decreto 1072 de 2015, Resolución 0312 de 2019, Ley 675 de 2001, GTC 45 y Resolución 4272 de 2021.  
**Coordinación:** Agente Principal y Ecosistema de Agentes Especializados.

---

## 🧭 Visión General de la Hoja de Ruta

La hoja de ruta está diseñada para estructurar, operar y escalar la empresa de asesoría en SG-SST para copropiedades residenciales, comerciales y mixtas, asegurando un flujo de trabajo continuo entre los agentes especializados, la captación comercial y la entrega impecable de servicios sin fricción jurídica.

```
[FASE 1: Cimientos y Blindaje] ──> [FASE 2: Captación & Marketing] ──> [FASE 3: Entregables Técnicos]
           │                                      │                                  │
           ▼                                      ▼                                  ▼
[FASE 4: Seguimiento & Reingeniería] ──> [FASE 5: Auditoría & Reporte Oficial ARL/MinTrabajo]
```

---

## 📌 FASE 1: Cimientos Institucionales y Blindaje Legal (Mes 1)
**Objetivo:** Consolidar la base jurídica, tecnológica y operativa de la consultora antes de salir masivamente al mercado.

### Hitos y Entregables Clave:
1. **Despliegue de la Plataforma Web y Base de Datos:**
   - Servidor local/nube activo con persistencia en SQLite (`data/sgsst_copropiedades.db`).
   - Web comercial cálida y empática operativa con el cotizador interactivo.
   - Portal de entregables privado asegurado para clientes.
   - *Agentes participantes:* `disenador-web-sgsst`, `fiscalizador-resolutor-sst`.
2. **Adopción de Documentos Legales y Políticas Corporativas:**
   - Formalización del Contrato Modelo de Asesoría en SG-SST ([`docs/legal_y_politicas/contrato_prestacion_servicios_asesoria_sgsst.md`](file:///c:/Users/USER/Desktop/Asesoria%20SST-Antigravity/docs/legal_y_politicas/contrato_prestacion_servicios_asesoria_sgsst.md)).
   - Implementación de las Políticas Institucionales: SG-SST, No Alcohol/Drogas y Tratamiento de Datos Personales - Habeas Data (Ley 1581 de 2012).
   - *Agentes participantes:* `abogado-laboral-contractual`, `fiscalizador-resolutor-sst`.
3. **Parametrización del Protocolo de Control de Calidad:**
   - Activación del agente `fiscalizador-resolutor-sst` para auditar cualquier cotización, contrato o diagnóstico antes de su presentación.

---

## 📌 FASE 2: Captación, Marketing de Confianza y Onboarding Inteligente (Meses 2 a 3)
**Objetivo:** Atraer a Administradores y Consejos de Administración, convirtiéndolos en clientes mediante un diagnóstico rápido y propuestas comerciales a la medida.

### Hitos y Estrategias:
1. **Campaña de Marketing Educativo y Empático:**
   - Posicionamiento del mensaje central: *"Cuidamos a las personas que cuidan tu comunidad y blindamos legalmente al Administrador y al Consejo"*.
   - Difusión de los riesgos patrimoniales bajo el Artículo 50 de la Ley 675 de 2001 (responsabilidad civil y penal del Administrador).
   - *Agentes participantes:* `lead-dev-marketing`, `disenador-web-sgsst`.
2. **Uso del Formulario Onboarding y Cotizador en Tiempo Real:**
   - Administradores ingresan los datos de su copropiedad en la web pública ([`web/index.html`](file:///c:/Users/USER/Desktop/Asesoria%20SST-Antigravity/web/index.html)).
   - El sistema almacena automáticamente el prospecto en la base de datos y calcula la tarifa adecuada para:
     - **Paquete Básico:** Copropiedades pequeñas (1 a 2 torres).
     - **Paquete Integral:** Conjuntos residenciales y edificios medianos (con vigilancia, aseo y áreas técnicas).
     - **Paquete Blindaje Total:** Grandes condominios, centros comerciales y copropiedades con piscinas y fachadas altas.
   - Generación y descarga instantánea de la **Propuesta Económica y Técnica Oficial en PDF**.
   - *Agentes participantes:* `cotizador-propuestas-sst`, `disenador-web-sgsst`.
3. **Cierre Contractual y Requisito de Inicio:**
   - Firma del contrato de prestación de servicios.
   - Verificación de la **Cláusula Octava:** Designación del responsable interno de la copropiedad y verificación de su certificado del curso virtual de 50 horas (o acompañamiento para su obtención en 30 días).

---

## 📌 FASE 3: Ejecución Operativa de Entregables Técnicos (Meses 3 a 5)
**Objetivo:** Desarrollar los entregables contratados y cargarlos en el espacio privado del cliente sin contaminar la web pública.

### Hitos y Entregables Clave:
1. **Entregable 1: Diagnóstico Inicial de Estándares Mínimos (Res. 0312 de 2019):**
   - Autoevaluación completa en el portal de entregables ([`web/entregables.html`](file:///c:/Users/USER/Desktop/Asesoria%20SST-Antigravity/web/entregables.html)).
   - Cálculo del porcentaje de cumplimiento y asignación del semáforo legal (Crítico <60%, Moderado 60-85%, Aceptable >85%).
2. **Entregable 2: Matriz IPVR (GTC 45) Específica para Propiedad Horizontal:**
   - Levantamiento de peligros en áreas críticas: cuarto de bombas, subestación eléctrica, cuarto de acopio/shut de basuras, tanques de agua potable (espacios confinados), foso y cuartos de máquinas de ascensores, piscinas (Ley 1209 de 2008) y fachadas/cubiertas (Res. 4272 de 2021).
   - Clasificación estricta: Personal por OPS (administrador, contador, toderos) vs Personal Subcontratado (seguridad privada 24/7 y servicios de limpieza).
3. **Entregable 3: Planes de Acción y Cronogramas Oficiales:**
   - Plan Anual de Trabajo del SG-SST (Decreto 1072 art. 2.2.4.6.8).
   - Cronograma de Capacitaciones y Talleres (primeros auxilios, alturas, emergencias).
   - Cronograma de Inspecciones Locativas a cuartos técnicos.
   - *Agentes participantes:* `especialista-sgsst-ph`, `fiscalizador-resolutor-sst`.

---

## 📌 FASE 4: Seguimiento Continuo, Reingeniería y Auditorías Operativas (Meses 6 a 10)
**Objetivo:** Garantizar la operatividad del sistema, acompañar a los comités y optimizar procesos internos.

### Hitos y Actividades:
1. **Acompañamiento a Comités y Personal:**
   - Asesoría y actas para el COPASST o Vigía de Seguridad y Salud.
   - Asesoría y mediación para el Comité de Convivencia Laboral (Ley 1010 de 2006).
2. **Reingeniería de Procesos Operacionales:**
   - Rediseño del procedimiento de control y acceso de contratistas de vigilancia, aseo y obras locativas.
   - Estandarización de protocolos seguros para trabajos en alturas en fachadas y cubiertas.
   - Protocolo de bloqueo y etiquetado (LOTO) en cuartos de bombas y tableros eléctricos.
   - *Agentes participantes:* `auditor-reingenieria-procesos`.
3. **Medición Trimestral de los 6 Indicadores Obligatorios (Res. 0312 art. 30):**
   - Frecuencia de accidentalidad (IF) y Severidad (IS).
   - Proporción de accidentes de trabajo mortales.
   - Ausentismo laboral por causa médica.
   - Cumplimiento del Plan Anual de Trabajo y Cobertura de Capacitaciones.
   - *Agentes participantes:* `especialista-sgsst-ph`, `fiscalizador-resolutor-sst`.

---

## 📌 FASE 5: Auditoría Integral y Reporte Oficial ante ARL y MinTrabajo (Meses 11 a 12)
**Objetivo:** Realizar la auditoría de cierre de año y efectuar el cargue oficial conforme a la legislación nacional.

### Hitos y Validación Final:
1. **Auditoría Pre-Reporte del Agente Fiscalizador:**
   - Ejecución del agente `fiscalizador-resolutor-sst` para verificar:
     - [x] Que la copropiedad aportó el certificado vigente del curso de 50 horas de su responsable interno.
     - [x] Que existen evidencias documentales fidedignas (actas, fotos, listas de asistencia, planillas PILA, certificados de mantenimiento).
   - Si se detectan inconsistencias, el fiscalizador las subsana o genera la alerta correspondiente.
2. **Cargue y Radicación Oficial ante la ARL y el Ministerio del Trabajo:**
   - Cumplimiento de la **Cláusula Novena del Contrato:** Asistencia y radicación de la autoevaluación anual y el plan de mejora en la plataforma electrónica oficial del Fondo de Riesgos Laborales.
   - Expedición del Certificado de Cumplimiento Anual para presentación ante la Asamblea General de Copropietarios.
   - *Agentes participantes:* `abogado-laboral-contractual`, `fiscalizador-resolutor-sst`.

---

## 🛠️ Matriz de Gobernanza de Agentes

| Agente | Responsabilidad Principal en la Hoja de Ruta | Frecuencia de Actuación |
| :--- | :--- | :--- |
| **Agente Principal (Coordinador)** | Supervisa el cumplimiento de los hitos y la comunicación ejecutiva con el usuario. | Permanente |
| `disenador-web-sgsst` | Mantiene optimizada la web pública, el cotizador y la experiencia en el portal privado. | Fases 1, 2 y mejoras continuas |
| `cotizador-propuestas-sst` | Modela las ofertas comerciales y calcula presupuestos para nuevas copropiedades. | Fase 2 (Onboarding continuo) |
| `especialista-sgsst-ph` | Elabora el diagnóstico, matrices IPVR y cronogramas de trabajo para cada cliente. | Fases 3 y 4 |
| `auditor-reingenieria-procesos` | Audita cuellos de botella y rediseña procedimientos operacionales de la copropiedad. | Fase 4 |
| `abogado-laboral-contractual` | Asegura la validez de los contratos de asesoría y el blindaje frente a entes de control. | Fases 1, 2 y 5 |
| `fiscalizador-resolutor-sst` | Fiscaliza cada producto, corrige errores y valida evidencias antes del reporte oficial. | Pre-entrega en Fases 1, 3, 4 y 5 |

