---
name: resolucion-errores-sst
description: Protocolo integral para auditar entregables, matrices, propuestas, contratos y bases de datos del SG-SST, detectar inconsistencias normativas o aritméticas y resolverlas directamente mediante corrección de datos o archivos.
---

# Habilidad: Detección y Resolución Activa de Errores en SG-SST

Esta habilidad no se limita al diagnóstico pasivo: define el procedimiento exacto para **detectar y resolver** de forma inmediata cualquier falla encontrada en la documentación o datos del sistema.

## 1. Puntos Críticos de Inspección y Subsanación Inmediata

### A. Cláusula del Responsable con Curso de 50 Horas
* **Detección:** Si una propuesta, contrato o acta no menciona de forma imperativa que la copropiedad debe contar con un enlace interno o administrador con el curso virtual de 50 horas en SST (Res. 0312/2019 art. 4, 9 o 17).
* **Resolución Automática:** Insertar la cláusula obligatoria estipulando el deber legal de la copropiedad de aportar el certificado y delimitando que la consultora brinda acompañamiento y asesoría, pero no asume la representación patronal.

### B. Cláusula de Reporte a ARL y Ministerio del Trabajo
* **Detección:** Si se promete realizar el reporte a la ARL o al Ministerio sin condicionarlo a soportes reales o si se insinúa transmitir datos no verificados.
* **Resolución Automática:** Corregir el texto para consagrar que el cargue y reporte se efectuará **única y exclusivamente con base en la revisión previa y soporte de evidencias fidedignas y verificables** entregadas por la copropiedad.

### C. Cobertura de la Matriz de Peligros (GTC 45)
* **Detección:** Si la matriz omite zonas comunes de alta criticidad (subestación eléctrica, cuarto de bombas, shut de basuras, tanques de agua subterráneos o elevados, ascensores, piscinas o fachadas/alturas) o no diferencia entre personal de OPS (administrador, contador, todero) y personal subcontratado (vigilancia privada, aseo, técnicos de mantenimiento).
* **Resolución Automática:** Agregar las filas correspondientes en la base de datos SQLite y actualizar la matriz con su evaluación cuantitativa ($NP = ND \times NE$, $NR = NP \times NC$) y jerarquía de controles.

### D. Fórmulas de Indicadores (Resolución 0312 de 2019 art. 30)
* **Detección:** Errores en la constante de proporcionalidad o denominadores incorrectos en índices de frecuencia, severidad o ausentismo.
* **Resolución Automática:** Recalcular con la fórmula legal estándar:
  $$\text{IF} = \left(\frac{\text{N° de AT en el mes}}{\text{N° de Trabajadores}}\right) \times 100$$
  $$\text{IS} = \left(\frac{\text{Días de incapacidad + días cargados}}{\text{N° de Trabajadores}}\right) \times 100$$
  $$\text{Ausentismo} = \left(\frac{\text{Días de ausencia médica}}{\text{Días de trabajo programados}}\right) \times 100$$

## 2. Emisión del Dictamen de Subsanación
Cada vez que el agente ejecute una resolución, debe generar un reporte conciso:
- Hallazgo detectado
- Archivo o registro afectado
- Corrección aplicada
- Estado resultante: **CONFORME / SUBSANADO**

