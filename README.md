# Plataforma de Asesoría Integral en SG-SST, Auditorías y Reingeniería para Propiedad Horizontal (Colombia)

Este proyecto implementa una solución integral para la prestación de servicios profesionales de Seguridad y Salud en el Trabajo (SG-SST) dirigida a copropiedades (Edificios, Conjuntos Residenciales, Centros Comerciales y Parques Empresariales), en estricto cumplimiento de la legislación colombiana (**Decreto 1072 de 2015**, **Resolución 0312 de 2019**, **Ley 675 de 2001**, **GTC 45** y **Resolución 4272 de 2021**).

---

## 🚀 Inicio Rápido

Para iniciar el servidor local y abrir la plataforma web en tu navegador:

1. **Doble clic en:** `iniciar_servidor.bat`  
   *O desde la terminal en esta carpeta:*
   ```powershell
   python server.py
   ```
2. **Navega a:**  
   - **Web Pública Institucional y Cotizador:** [http://localhost:8080](http://localhost:8080)
   - **Espacio Privado de Entregables de Clientes:** [http://localhost:8080/entregables.html](http://localhost:8080/entregables.html)

---

## 🏛️ Estructura del Proyecto

```text
├── .agents/                                # Configuración del ecosistema de Agentes y Habilidades
│   ├── agents/
│   │   ├── fiscalizador-sst.md             # Agente Auditor y Fiscalizador de Calidad y Cumplimiento
│   │   ├── lead-dev-marketing.md           # Agente Diseñador Web, Software y Estrategia Comercial
│   │   ├── especialista-sgsst-ph.md        # Agente Consultor Técnico SG-SST para Copropiedades
│   │   ├── cotizador-propuestas-sst.md     # Agente de Modelado Económico y Propuestas
│   │   └── abogado-laboral-contractual.md  # Agente Jurídico Laboral y Contractual
│   └── skills/
│       ├── sgsst-propiedad-horizontal/     # Habilidad técnica y normativa colombiana de SST en PH
│       └── auditoria-fiscalizacion-sst/    # Protocolo de fiscalización y auditoría pre-entrega
├── docs/
│   └── legal_y_politicas/
│       ├── marco_normativo_ph_colombia.md  # Compilación de normas vigentes aplicables a PH
│       ├── politicas_corporativas_y_sgsst.md # Políticas de SST, Alcohol/Drogas y Habeas Data
│       └── contrato_prestacion_servicios_asesoria_sgsst.md # Contrato formal con cláusulas clave
├── data/
│   └── sgsst_copropiedades.db              # Base de datos SQLite (Leads, diagnósticos, matriz, etc.)
├── web/
│   ├── css/
│   │   └── styles.css                      # Diseño cálido, empático, responsive y print-friendly
│   ├── js/
│   │   ├── app.js                          # Lógica del cotizador, modales y web institucional
│   │   └── entregables.js                  # Lógica del portal privado de entregables
│   ├── index.html                          # Landing pública comercial (sin pestañas técnicas internas)
│   └── entregables.html                    # Espacio de entregables según paquete contratado
├── server.py                               # Servidor HTTP REST y base de datos en Python estándar
├── iniciar_servidor.bat                    # Script ejecutable de un clic para Windows
└── README.md                               # Documentación general del proyecto
```

---

## ⚖️ Aspectos Legales y Contractuales Destacados

1. **Responsable Interno con Curso de 50 Horas (Cláusula 8):**
   La copropiedad está obligada a designar a un enlace o administrador con el curso virtual de 50 horas de SST (Res. 0312/2019). La firma asesora realiza acompañamiento, auditorías y planes, pero la copropiedad mantiene la titularidad patronal y ejecución de recursos.
2. **Servicio de Reporte ante ARL y Ministerio del Trabajo (Cláusula 9):**
   El reporte anual de autoevaluación se efectúa única y exclusivamente con base en la revisión previa y soporte de evidencias fidedignas y verificables entregadas por la copropiedad.
3. **Privacidad de Entregables Operativos:**
   La web pública mantiene un tono humano y accesible para captación de clientes. Los entregables técnicos (Matriz IPVR GTC 45, Planes de Acción, Cronogramas e Indicadores) se gestionan desde el portal privado según el paquete contratado.

