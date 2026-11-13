"""
Servidor Backend REST y Servidor Web para la Plataforma de Asesoría SG-SST en Propiedad Horizontal.
Desarrollado en Python estándar (sin dependencias externas requeridas).
Incluye persistencia en SQLite y endpoints para captación de clientes, cotización,
diagnósticos (Res. 0312/2019), matriz IPVR (GTC 45), cronogramas e indicadores.
"""

import http.server
import socketserver
import sqlite3
import json
import os
import urllib.parse
from datetime import datetime

PORT = 8080
DB_PATH = os.path.join(os.path.dirname(__file__), "data", "sgsst_copropiedades.db")
WEB_DIR = os.path.join(os.path.dirname(__file__), "web")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Tabla de copropiedades registradas (Leads y Clientes)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS copropiedades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        nit TEXT NOT NULL,
        tipo_ph TEXT NOT NULL,
        direccion TEXT,
        ciudad TEXT,
        unidades INTEGER DEFAULT 0,
        torres INTEGER DEFAULT 1,
        zonas_comunes TEXT,
        personal_ops TEXT,
        personal_subcontratado TEXT,
        estado_sst TEXT,
        paquete_sugerido TEXT,
        valor_mensual REAL,
        valor_total_anual REAL,
        contacto_nombre TEXT,
        contacto_email TEXT,
        contacto_telefono TEXT,
        curso_50h_responsable TEXT DEFAULT 'Pendiente',
        fecha_registro TEXT
    )
    """)

    # Tabla de Diagnósticos de Estándares Mínimos (Res. 0312/2019)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS diagnosticos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        copropiedad_id INTEGER,
        items_evaluados TEXT,
        puntaje_total REAL,
        clasificacion TEXT,
        observaciones TEXT,
        fecha TEXT,
        FOREIGN KEY(copropiedad_id) REFERENCES copropiedades(id)
    )
    """)

    # Tabla de Planes de Acción y Planes de Mejora
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS planes_accion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        copropiedad_id INTEGER,
        estandar_asociado TEXT,
        hallazgo TEXT,
        accion_propuesta TEXT,
        responsable TEXT,
        recursos TEXT,
        fecha_limite TEXT,
        estado TEXT DEFAULT 'En Proceso',
        avance_pct INTEGER DEFAULT 0,
        FOREIGN KEY(copropiedad_id) REFERENCES copropiedades(id)
    )
    """)

    # Tabla de Matriz IPVR (GTC 45)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS matriz_peligros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        copropiedad_id INTEGER,
        zona_area TEXT,
        proceso_tarea TEXT,
        tipo_personal TEXT,
        peligro_descripcion TEXT,
        clasificacion_peligro TEXT,
        efectos_posibles TEXT,
        nd INTEGER,
        ne INTEGER,
        np INTEGER,
        nc INTEGER,
        nr INTEGER,
        nivel_riesgo TEXT,
        aceptabilidad TEXT,
        medidas_intervencion TEXT,
        FOREIGN KEY(copropiedad_id) REFERENCES copropiedades(id)
    )
    """)

    # Tabla de Cronogramas de Implementación
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cronogramas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        copropiedad_id INTEGER,
        tipo_cronograma TEXT,
        actividad TEXT,
        mes TEXT,
        responsable TEXT,
        estado TEXT DEFAULT 'Programado',
        porcentaje INTEGER DEFAULT 0,
        FOREIGN KEY(copropiedad_id) REFERENCES copropiedades(id)
    )
    """)

    # Tabla de Indicadores del SG-SST (Res. 0312 art. 30)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS indicadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        copropiedad_id INTEGER,
        periodo TEXT,
        frecuencia_at REAL,
        severidad_at REAL,
        mortalidad_at REAL,
        ausentismo_pct REAL,
        cumplimiento_plan_pct REAL,
        cobertura_capacitacion_pct REAL,
        fecha_calculo TEXT,
        FOREIGN KEY(copropiedad_id) REFERENCES copropiedades(id)
    )
    """)

    # Insertar datos semilla si la tabla está vacía para demostración inmediata
    cursor.execute("SELECT COUNT(*) FROM copropiedades")
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    ahora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
    INSERT INTO copropiedades (
        nombre, nit, tipo_ph, direccion, ciudad, unidades, torres,
        zonas_comunes, personal_ops, personal_subcontratado, estado_sst,
        paquete_sugerido, valor_mensual, valor_total_anual,
        contacto_nombre, contacto_email, contacto_telefono, curso_50h_responsable, fecha_registro
    ) VALUES (
        'Conjunto Residencial Alameda del Bosque PH',
        '901.452.889-3',
        'Residencial',
        'Calle 145 # 18-40',
        'Bogotá D.C.',
        140,
        4,
        'Ascensores, Cuarto de Bombas, Tanque Subterráneo, Subestación, Shut de Basuras, Parqueaderos Cubiertos',
        'Administrador (OPS), Contador (OPS), Revisor Fiscal (OPS)',
        'Empresa de Vigilancia Privada (8 guardas 24/7), Empresa de Aseo (3 operarias)',
        'Incipiente (Sin documentación formal)',
        'Integral (Acompañamiento Continuo)',
        650000.0,
        7800000.0,
        'Dra. Claudia Marcela Gómez',
        'administracion@alamedadelbosque.com',
        '3104567890',
        'En Curso (Finalización prevista en 15 días)',
        ?
    )
    """, (ahora,))
    cid = cursor.lastrowid

    # Diagnóstico inicial
    items_diag = [
        {"item": "1.1.1", "nombre": "Responsable del SG-SST con curso 50 horas", "cumple": False, "puntaje": 0.5, "obtenido": 0},
        {"item": "1.1.2", "nombre": "Asignación de responsabilidades en SST", "cumple": True, "puntaje": 0.5, "obtenido": 0.5},
        {"item": "1.1.3", "nombre": "Asignación de recursos financieros y técnicos", "cumple": True, "puntaje": 0.5, "obtenido": 0.5},
        {"item": "1.1.4", "nombre": "Afiliación a Seguridad Social de contratistas", "cumple": True, "puntaje": 0.5, "obtenido": 0.5},
        {"item": "1.1.6", "nombre": "Conformación del COPASST o Vigía de SST", "cumple": False, "puntaje": 1.0, "obtenido": 0},
        {"item": "1.2.1", "nombre": "Programa de Capacitación anual en SST", "cumple": False, "puntaje": 2.0, "obtenido": 0},
        {"item": "2.1.1", "nombre": "Política de SST documentada y firmada", "cumple": False, "puntaje": 1.0, "obtenido": 0},
        {"item": "2.2.1", "nombre": "Objetivos de SST definidos y medibles", "cumple": False, "puntaje": 1.0, "obtenido": 0},
        {"item": "2.4.1", "nombre": "Plan Anual de Trabajo con cronograma", "cumple": False, "puntaje": 2.0, "obtenido": 0},
        {"item": "4.1.1", "nombre": "Matriz IPVR según GTC 45 de áreas y tareas", "cumple": False, "puntaje": 4.0, "obtenido": 0},
        {"item": "4.1.3", "nombre": "Identificación de sustancias químicas en aseo", "cumple": True, "puntaje": 1.5, "obtenido": 1.5},
        {"item": "4.2.1", "nombre": "Plan de Prevención y Preparación ante Emergencias", "cumple": True, "puntaje": 5.0, "obtenido": 2.5},
        {"item": "5.1.1", "nombre": "Auditoría anual de cumplimiento del SG-SST", "cumple": False, "puntaje": 5.0, "obtenido": 0}
    ]
    cursor.execute("""
    INSERT INTO diagnosticos (copropiedad_id, items_evaluados, puntaje_total, clasificacion, observaciones, fecha)
    VALUES (?, ?, 38.5, 'Crítico (< 60%)', 'Se requiere formulación inmediata de plan de mejora y designación formal del responsable con curso de 50 horas.', ?)
    """, (cid, json.dumps(items_diag), ahora))

    # Matriz de Peligros GTC 45 para PH
    matriz_rows = [
        (cid, "Subestación y Tableros Eléctricos", "Inspección de acometidas y corte de breakers", "OPS / Toderos y Mantenimiento",
         "Contacto eléctrico directo e indirecto, arco eléctrico", "Condiciones de Seguridad - Eléctrico", "Quemaduras graves, fibrilación, choque eléctrico",
         6, 2, 12, 60, 720, "I - Crítico", "No Aceptable", "Bloqueo y etiquetado (LOTO), señalización RETIE, EPP dieléctrico certificado, uso de contratista certificado."),
        (cid, "Cuarto de Motobombas y Tanques de Presión", "Encendido, revisión de presiones y purga", "Personal Subcontratado (Mantenimiento)",
         "Ruido constante por operación de motores y piezas en rotación", "Físico y Mecánico", "Hipoacusia progresiva, atrapamiento de extremidades",
         2, 3, 6, 25, 150, "II - Alto", "Aceptable con Control", "Guardas de seguridad en poleas, mantenimiento preventivo de rodamientos, protector auditivo de copa."),
        (cid, "Tanques de Agua Potable (Subterráneo y Elevado)", "Lavado, desinfección y muestreo semestral", "Personal Subcontratado especializado",
         "Espacios confinados, atmósfera con deficiencia de oxígeno y vapores tóxicos de cloro", "Físico-Químico y Locativo", "Asfixia, pérdida de consciencia, caídas a distinto nivel",
         6, 2, 12, 100, 1200, "I - Crítico", "No Aceptable", "Protocolo estricto de espacios confinados, medición de gases, extractor de aire, arnés y trípode de rescate."),
        (cid, "Shut de Basuras y Cuarto de Acopio", "Recolección diaria, aseo de ductos y clasificación de residuos", "Personal Subcontratado (Aseo y Limpieza)",
         "Contacto con bacterias, virus, hongos, vectores y fluidos biológicos", "Biológico y Ergonómico", "Infecciones dérmicas, respiratorias, lesiones musculoesqueléticas",
         6, 3, 18, 25, 450, "II - Alto", "Aceptable con Control", "Uso obligatorio de guantes de nitrilo alto calibre, mascarilla con filtro, botas de caucho antideslizantes, vacunación hepatitis B y tétano."),
        (cid, "Fachadas, Cubiertas y Ventanales Comunes", "Limpieza de vidrios y reparación de canales a más de 2.0m", "Personal Subcontratado especializado",
         "Trabajo en alturas, caída libre de personas y herramientas", "Condiciones de Seguridad - Alturas (Res. 4272/2021)", "Politraumatismos severos, muerte, lesiones a transeúntes",
         10, 2, 20, 100, 2000, "I - Crítico", "No Aceptable", "Permiso de trabajo en alturas obligatorio, coordinador de alturas en sitio, líneas de vida certificadas, delimitación de perímetro peatonal inferior."),
        (cid, "Puntos de Control y Portería", "Control de accesos y vigilancia perimetral 12 horas", "Personal Subcontratado (Vigilancia Privada)",
         "Riesgo público (asaltos, agresiones verbales de residentes/visitantes), turnos rotativos", "Psicosocial y Público", "Estrés laboral agudo, ansiedad, alteraciones del sueño",
         2, 4, 8, 25, 200, "II - Alto", "Aceptable con Control", "Pulsador de pánico conectado a Policía Cuadrante, descansos programados, capacitaciones en manejo de conflictos.")
    ]
    cursor.executemany("""
    INSERT INTO matriz_peligros (
        copropiedad_id, zona_area, proceso_tarea, tipo_personal, peligro_descripcion,
        clasificacion_peligro, efectos_posibles, nd, ne, np, nc, nr, nivel_riesgo,
        aceptabilidad, medidas_intervencion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, matriz_rows)

    # Planes de Acción
    planes = [
        (cid, "1.1.1", "El administrador y responsable interno carecen de curso de 50h vigente", "Inscribir y culminar curso virtual obligatorio de 50 horas en SST (SENA/ARL)", "Administración / Asesor SST", "Certificación digital", "2026-12-15", "En Proceso", 40),
        (cid, "4.1.1", "Ausencia de Matriz IPVR aprobada y socializada", "Levantar matriz integral GTC 45 con recorrido a zonas comunes e inducción a vigilantes y operarias de aseo", "Consultor SST", "Horas técnicas consultoría", "2026-11-30", "En Proceso", 75),
        (cid, "4.2.1", "Extintores y señalización de rutas de evacuación vencidos", "Recargar 18 extintores multipropósito e instalar planos de evacuación fotoluminiscentes", "Administración / Consejo", "Presupuesto copropiedad ($1.800.000)", "2026-12-05", "Pendiente", 10),
        (cid, "1.1.6", "No se encuentra constituido el Vigía de SST ni el Comité de Convivencia", "Convocatoria y acta formal de elección de Vigía SST y Comité de Convivencia conforme a Ley 1010", "Administración / Copropietarios", "Actas y formatos modelo", "2026-12-20", "En Proceso", 50)
    ]
    cursor.executemany("""
    INSERT INTO planes_accion (
        copropiedad_id, estandar_asociado, hallazgo, accion_propuesta, responsable, recursos, fecha_limite, estado, avance_pct
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, planes)

    # Cronogramas
    cronos = [
        (cid, "Plan Anual de Trabajo", "Elaboración de Diagnóstico y Plan Maestro SST", "Enero", "Consultor SST", "Completado", 100),
        (cid, "Plan Anual de Trabajo", "Revisión documental de contratistas (PILA y ARL)", "Febrero", "Administración", "Completado", 100),
        (cid, "Capacitaciones", "Capacitación en Manejo Seguro de Productos Químicos para Aseo", "Marzo", "Consultor SST / ARL", "Completado", 100),
        (cid, "Inspecciones", "Inspección técnica a cuartos de bombas y subestación", "Abril", "Consultor SST", "Completado", 100),
        (cid, "Capacitaciones", "Taller de Primeros Auxilios y uso de Botiquines Tipo B", "Mayo", "Brigada / ARL", "Completado", 100),
        (cid, "Emergencias", "Mantenimiento y prueba de sistema de alarma y red contra incendios", "Junio", "Técnico Especializado", "Completado", 100),
        (cid, "Capacitaciones", "Inducción y Protocolo de Alturas Res. 4272/2021 a contratistas", "Julio", "Consultor SST", "Completado", 100),
        (cid, "Inspecciones", "Inspección a fosos y cuartos de máquinas de ascensores", "Agosto", "Empresa Mantenimiento Ascensores", "Completado", 100),
        (cid, "Emergencias", "Participación en Simulacro Nacional de Evacuación", "Octubre", "Toda la Copropiedad", "Completado", 100),
        (cid, "Auditoría", "Auditoría Interna de Cumplimiento de Estándares Res. 0312", "Noviembre", "Auditor Fiscalizador SST", "En Proceso", 60),
        (cid, "Reporte Oficial", "Cargue de Autoevaluación en plataforma MinTrabajo y ARL", "Diciembre", "Consultor SST (Previa evidencia)", "Programado", 0)
    ]
    cursor.executemany("""
    INSERT INTO cronogramas (
        copropiedad_id, tipo_cronograma, actividad, mes, responsable, estado, porcentaje
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, cronos)

    # Indicadores obligatorios
    cursor.execute("""
    INSERT INTO indicadores (
        copropiedad_id, periodo, frecuencia_at, severidad_at, mortalidad_at,
        ausentismo_pct, cumplimiento_plan_pct, cobertura_capacitacion_pct, fecha_calculo
    ) VALUES (
        ?, 'Año 2026 acumulado', 0.0, 0.0, 0.0, 1.2, 85.0, 92.0, ?
    )
    """, (cid, ahora))

class SSTRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def do_GET(self):
        url_parsed = urllib.parse.urlparse(self.path)
        path = url_parsed.path

        if path.startswith("/api/"):
            self.handle_api_get(path, urllib.parse.parse_qs(url_parsed.query))
        else:
            # Enrutar navegación web estática
            if path == "/" or path == "":
                self.path = "/index.html"
            elif path == "/entregables" or path == "/entregables.html":
                self.path = "/entregables.html"
            super().do_GET()

    def do_POST(self):
        url_parsed = urllib.parse.urlparse(self.path)
        path = url_parsed.path

        if path.startswith("/api/"):
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode("utf-8")) if post_data else {}
            except Exception as e:
                self.send_json_response({"error": "JSON inválido", "details": str(e)}, 400)
                return
            self.handle_api_post(path, payload)
        else:
            self.send_json_response({"error": "Endpoint no encontrado"}, 404)

    def send_json_response(self, data, status_code=200):
        response_bytes = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def handle_api_get(self, path, query_params):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        try:
            if path == "/api/copropiedades":
                cursor.execute("SELECT * FROM copropiedades ORDER BY id DESC")
                rows = [dict(r) for r in cursor.fetchall()]
                self.send_json_response({"status": "ok", "copropiedades": rows})

            elif path.startswith("/api/copropiedades/"):
                cid = path.split("/")[-1]
                cursor.execute("SELECT * FROM copropiedades WHERE id = ?", (cid,))
                row = cursor.fetchone()
                if row:
                    self.send_json_response({"status": "ok", "copropiedad": dict(row)})
                else:
                    self.send_json_response({"error": "Copropiedad no encontrada"}, 404)

            elif path == "/api/diagnostico":
                cid = query_params.get("copropiedad_id", [None])[0]
                if cid:
                    cursor.execute("SELECT * FROM diagnosticos WHERE copropiedad_id = ? ORDER BY id DESC LIMIT 1", (cid,))
                else:
                    cursor.execute("SELECT * FROM diagnosticos ORDER BY id DESC LIMIT 1")
                row = cursor.fetchone()
                if row:
                    res = dict(row)
                    if res.get("items_evaluados"):
                        res["items_evaluados"] = json.loads(res["items_evaluados"])
                    self.send_json_response({"status": "ok", "diagnostico": res})
                else:
                    self.send_json_response({"status": "ok", "diagnostico": None})

            elif path == "/api/matriz-peligros":
                cid = query_params.get("copropiedad_id", [None])[0]
                if cid:
                    cursor.execute("SELECT * FROM matriz_peligros WHERE copropiedad_id = ? ORDER BY nr DESC", (cid,))
                else:
                    cursor.execute("SELECT * FROM matriz_peligros ORDER BY nr DESC")
                rows = [dict(r) for r in cursor.fetchall()]
                self.send_json_response({"status": "ok", "matriz": rows})

            elif path == "/api/planes-accion":
                cid = query_params.get("copropiedad_id", [None])[0]
                if cid:
                    cursor.execute("SELECT * FROM planes_accion WHERE copropiedad_id = ? ORDER BY id ASC", (cid,))
                else:
                    cursor.execute("SELECT * FROM planes_accion ORDER BY id ASC")
                rows = [dict(r) for r in cursor.fetchall()]
                self.send_json_response({"status": "ok", "planes": rows})

            elif path == "/api/cronogramas":
                cid = query_params.get("copropiedad_id", [None])[0]
                if cid:
                    cursor.execute("SELECT * FROM cronogramas WHERE copropiedad_id = ? ORDER BY id ASC", (cid,))
                else:
                    cursor.execute("SELECT * FROM cronogramas ORDER BY id ASC")
                rows = [dict(r) for r in cursor.fetchall()]
                self.send_json_response({"status": "ok", "cronogramas": rows})

            elif path == "/api/indicadores":
                cid = query_params.get("copropiedad_id", [None])[0]
                if cid:
                    cursor.execute("SELECT * FROM indicadores WHERE copropiedad_id = ? ORDER BY id DESC LIMIT 1", (cid,))
                else:
                    cursor.execute("SELECT * FROM indicadores ORDER BY id DESC LIMIT 1")
                row = cursor.fetchone()
                if row:
                    self.send_json_response({"status": "ok", "indicadores": dict(row)})
                else:
                    self.send_json_response({"status": "ok", "indicadores": None})

            elif path == "/api/agentes-info":
                # Información del ecosistema de agentes generados para el proyecto
                agentes = [
                    {
                        "id": "fiscalizador-sst",
                        "nombre": "Agente Fiscalizador de Calidad y Cumplimiento Normativo SG-SST",
                        "rol": "Auditor y Fiscalizador Supremo de Procesos y Entregables",
                        "descripcion": "Verifica minuciosamente que cada entregable cumpla con el Decreto 1072/2015, Resolución 0312/2019, GTC 45 y Ley 675/2001 sin errores. Valida que el responsable tenga el curso de 50h y que los reportes a ARL/MinTrabajo se hagan estrictamente con evidencias verificables.",
                        "estado": "Activo"
                    },
                    {
                        "id": "lead-dev-marketing",
                        "nombre": "Agente Diseñador Web, Arquitecto de Software y Gerencia de Marketing & Ventas",
                        "rol": "Director Digital y Estratega Comercial",
                        "descripcion": "Diseña interfaces humanas y cálidas, sin tono robótico, optimizadas para generar confianza en administradores de PH y convertir leads en clientes mediante propuestas instantáneas.",
                        "estado": "Activo"
                    },
                    {
                        "id": "especialista-sgsst-ph",
                        "nombre": "Agente Consultor Senior Especialista en SG-SST para Propiedad Horizontal",
                        "rol": "Líder Técnico de Seguridad y Salud en el Trabajo",
                        "descripcion": "Estructura diagnósticos de estándares mínimos, evalúa riesgos de cuartos de bombas, subestaciones, tanques y piscinas, y coordina personal OPS vs personal subcontratado (vigilancia y aseo).",
                        "estado": "Activo"
                    },
                    {
                        "id": "cotizador-propuestas-sst",
                        "nombre": "Agente Experto en Cotización, Modelado Económico y Estructuración de Ofertas",
                        "rol": "Analista Financiero de Servicios SST",
                        "descripcion": "Calcula el esfuerzo técnico según el tamaño y áreas de la copropiedad, estructurando los paquetes Básico, Integral y Blindaje Total con precios claros y ROI de protección patrimonial.",
                        "estado": "Activo"
                    },
                    {
                        "id": "abogado-laboral-contractual",
                        "nombre": "Agente Asesor Jurídico Laboral y Contractual",
                        "rol": "Especialista en Derecho Laboral, Riesgos y Contratación",
                        "descripcion": "Redacta el contrato de prestación de servicios, políticas corporativas y de Habeas Data (Ley 1581/2012) e impone las cláusulas obligatorias de responsabilidad y reporte condicionado a evidencias.",
                        "estado": "Activo"
                    }
                ]
                self.send_json_response({"status": "ok", "agentes": agentes})

            else:
                self.send_json_response({"error": "Recurso no encontrado"}, 404)
        finally:
            conn.close()

    def handle_api_post(self, path, payload):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        try:
            if path == "/api/cotizar-copropiedad":
                # Algoritmo de cálculo económico y recomendación técnica según características de la copropiedad
                nombre = payload.get("nombre", "").strip()
                nit = payload.get("nit", "").strip()
                tipo_ph = payload.get("tipo_ph", "Residencial")
                direccion = payload.get("direccion", "").strip()
                ciudad = payload.get("ciudad", "Bogotá D.C.")
                unidades = int(payload.get("unidades", 0))
                torres = int(payload.get("torres", 1))
                zonas = payload.get("zonas_comunes", [])
                if isinstance(zonas, list):
                    zonas_str = ", ".join(zonas)
                else:
                    zonas_str = str(zonas)

                personal_ops = payload.get("personal_ops", "Administrador (OPS)")
                personal_sub = payload.get("personal_subcontratado", "Vigilancia y Aseo")
                estado_sst = payload.get("estado_sst", "Inexistente o desactualizado")
                contacto_nombre = payload.get("contacto_nombre", "")
                contacto_email = payload.get("contacto_email", "")
                contacto_telefono = payload.get("contacto_telefono", "")

                # Determinación del paquete sugerido y valor económico de asesoría
                # Base de cálculo según complejidad locativa y unidades
                precio_base_mensual = 450000.0  # COP mensual

                if unidades > 200:
                    precio_base_mensual += 300000.0
                elif unidades > 80:
                    precio_base_mensual += 150000.0

                if torres > 3:
                    precio_base_mensual += 100000.0

                tiene_piscina = "piscina" in zonas_str.lower()
                tiene_ascensor = "ascensor" in zonas_str.lower()
                tiene_bombas = "bomba" in zonas_str.lower()

                if tiene_piscina:
                    precio_base_mensual += 100000.0
                if tiene_ascensor:
                    precio_base_mensual += 80000.0
                if tiene_bombas:
                    precio_base_mensual += 50000.0

                if tipo_ph in ["Comercial", "Mixta"]:
                    precio_base_mensual *= 1.25

                # Selección del paquete óptimo
                if unidades > 120 or tipo_ph in ["Comercial", "Mixta"] or tiene_piscina:
                    paquete_sugerido = "Blindaje Total y Reingeniería (Premium)"
                    factor_paquete = 1.35
                elif unidades >= 40 or tiene_ascensor:
                    paquete_sugerido = "Gestión Integral y Acompañamiento Continuo (Recomendado)"
                    factor_paquete = 1.0
                else:
                    paquete_sugerido = "Cumplimiento Básico (Diagnóstico + Estándares Esenciales)"
                    factor_paquete = 0.75

                valor_mensual = round(precio_base_mensual * factor_paquete, -3)
                valor_anual = valor_mensual * 12

                fecha_reg = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                cursor.execute("""
                INSERT INTO copropiedades (
                    nombre, nit, tipo_ph, direccion, ciudad, unidades, torres,
                    zonas_comunes, personal_ops, personal_subcontratado, estado_sst,
                    paquete_sugerido, valor_mensual, valor_total_anual,
                    contacto_nombre, contacto_email, contacto_telefono, fecha_registro
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    nombre, nit, tipo_ph, direccion, ciudad, unidades, torres,
                    zonas_str, personal_ops, personal_sub, estado_sst,
                    paquete_sugerido, valor_mensual, valor_anual,
                    contacto_nombre, contacto_email, contacto_telefono, fecha_reg
                ))
                new_id = cursor.lastrowid
                conn.commit()

                propuesta = {
                    "id": new_id,
                    "copropiedad": nombre,
                    "nit": nit,
                    "tipo_ph": tipo_ph,
                    "unidades": unidades,
                    "torres": torres,
                    "paquete_sugerido": paquete_sugerido,
                    "valor_mensual": valor_mensual,
                    "valor_total_anual": valor_anual,
                    "condiciones_pago": "Mensualidades vencidas o 2 pagos con 5% de descuento por pago semestral anticipado.",
                    "incluye_reporte_oficial": "Sí, condicionado a entrega de evidencias fidedignas según Cláusula 9 del Contrato.",
                    "requisito_legal_responsable": "Obligatorio contar con enlace interno o administrador con curso de 50 horas en SST.",
                    "fecha_emision": fecha_reg
                }

                self.send_json_response({"status": "ok", "mensaje": "Copropiedad registrada y propuesta generada exitosamente", "propuesta": propuesta})

            elif path == "/api/actualizar-plan-accion":
                plan_id = payload.get("id")
                nuevo_estado = payload.get("estado")
                nuevo_avance = int(payload.get("avance_pct", 0))

                cursor.execute("""
                UPDATE planes_accion SET estado = ?, avance_pct = ? WHERE id = ?
                """, (nuevo_estado, nuevo_avance, plan_id))
                conn.commit()
                self.send_json_response({"status": "ok", "mensaje": "Plan de acción actualizado"})

            elif path == "/api/evaluar-diagnostico":
                # Recibe respuestas de autoevaluación y calcula el puntaje legal Res. 0312
                cid = payload.get("copropiedad_id", 1)
                items = payload.get("items", [])
                puntaje_total = sum(float(i.get("obtenido", 0)) for i in items)
                
                if puntaje_total < 60:
                    clasificacion = "Crítico (< 60%)"
                elif puntaje_total <= 85:
                    clasificacion = "Moderadamente Aceptable (60% - 85%)"
                else:
                    clasificacion = "Aceptable (> 85%)"

                ahora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                cursor.execute("""
                INSERT INTO diagnosticos (copropiedad_id, items_evaluados, puntaje_total, clasificacion, observaciones, fecha)
                VALUES (?, ?, ?, ?, ?, ?)
                """, (cid, json.dumps(items), puntaje_total, clasificacion, payload.get("observaciones", "Evaluación generada"), ahora))
                conn.commit()

                self.send_json_response({
                    "status": "ok",
                    "puntaje_total": puntaje_total,
                    "clasificacion": clasificacion,
                    "mensaje": "Diagnóstico calculado y almacenado con éxito."
                })

            else:
                self.send_json_response({"error": "Endpoint POST no encontrado"}, 404)

        finally:
            conn.close()

def run_server():
    init_db()
    with socketserver.TCPServer(("", PORT), SSTRequestHandler) as httpd:
        print(f"Servidor SG-SST iniciado en http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido por el usuario.")

if __name__ == "__main__":
    run_server()

