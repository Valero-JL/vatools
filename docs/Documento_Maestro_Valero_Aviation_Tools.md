# DOCUMENTO MAESTRO DE PRODUCTO, INVESTIGACIÓN, DISEÑO Y ARQUITECTURA

## Valero Aviation Tools — Suite web de cálculo y planificación básica de vuelo

| Campo | Valor |
|---|---|
| **Nombre del proyecto** | Valero Aviation Tools (nombre alternativo recomendado: **VATools — Flight Planning Toolkit**) |
| **Versión del documento** | 1.0 |
| **Fecha** | 9 de agosto de 2026 |
| **Estado del documento** | Borrador maestro para desarrollo (listo para entregar a Cursor AI) |
| **Autor / responsable** | Juan Luis Valero |
| **Destinatario técnico** | Cursor AI (herramienta de desarrollo) |
| **Idioma del producto** | Español (Colombia). Inglés en fase futura |
| **Clasificación** | Herramienta educativa y de referencia. NO operacional |

> **DECLARACIÓN OBLIGATORIA DEL PROYECTO**
>
> *"La aplicación debe desarrollarse, ejecutarse y validarse inicialmente en local mediante un navegador web. La publicación en GitHub o cualquier servicio de hosting será una fase posterior."*

> **AVISO OPERACIONAL PRINCIPAL (debe aparecer en toda la aplicación)**
>
> *"Este cálculo es una referencia educativa y no reemplaza la planificación operacional, el POH/AFM, el FCOM, el manual de operaciones, el despacho de vuelo, la información meteorológica oficial, los NOTAM, el AIP, las instrucciones ATC ni los requisitos vigentes de Aerocivil."*

---

## TABLA DE CONTENIDO

1. Resumen ejecutivo
2. Concepto y nombre del proyecto
3. Requisito prioritario: ejecución local
4. Reglas de investigación y trazabilidad
5. Investigación aeronáutica — Componente de viento
6. Investigación aeronáutica — Top of Climb (TOC)
7. Investigación aeronáutica — Top of Descent (TOD)
8. Investigación aeronáutica — Cálculo de tiempos
9. Investigación aeronáutica — Combustible
10. Investigación normativa — RAC de Colombia
11. Matriz de fuentes
12. Definición del producto
13. Requisitos funcionales y no funcionales
14. Módulo de componente de viento
15. Módulo de TOC
16. Módulo de TOD
17. Módulo de tiempos
18. Módulo de combustible
19. Fórmulas y metodología (consolidado)
20. Arquitectura técnica
21. Diseño UX/UI
22. Mapa de pantallas
23. Modelo de datos
24. Seguridad operacional y limitaciones
25. Pruebas y criterios de aceptación
26. Plan obligatorio de ejecución local
27. Plan de publicación futura
28. Funciones futuras
29. Roadmap del proyecto
30. Entregable final y preguntas pendientes
31. Instrucciones para Cursor
32. Regla final

---

## 1. RESUMEN EJECUTIVO

Valero Aviation Tools es una aplicación web gratuita, pública y sin registro, orientada a pilotos, pilotos en formación, estudiantes de aviación, instructores, despachadores y entusiastas de la planificación de vuelo. Reúne en una sola interfaz un conjunto de calculadoras aeronáuticas de uso frecuente —componente de viento, Top of Climb, Top of Descent, tiempos de vuelo y combustible— acompañadas de gráficos, explicación de fórmulas, validación de datos, advertencias operacionales y trazabilidad de fuentes.

El principio rector del producto es doble: **rigor** (ninguna fórmula, reserva o requisito normativo se inventa; lo no verificado se marca como *"Pendiente de validación"*) y **ejecución local primero** (la primera versión debe correr por completo en el navegador del usuario, sin backend, sin base de datos y sin servicios externos, arrancable con `npm install` + `npm run dev` y accesible en `http://localhost:5173`). La publicación pública (GitHub, GitHub Pages, Netlify, Vercel, dominio propio) es una fase posterior y separada.

La arquitectura recomendada es **React + Vite + TypeScript**, con lógica matemática pura separada de la interfaz, pruebas unitarias por fórmula, diseño mobile-first y almacenamiento local opcional. El presente documento contiene toda la investigación, especificación funcional, fórmulas verificadas, casos de prueba, diseño UX/UI, modelo de datos, plan de ejecución y las instrucciones para que Cursor AI desarrolle la aplicación desde cero.

> **Nota metodológica importante:** Las fórmulas matemáticas (trigonometría del viento, cinemática de tiempo/distancia/velocidad, geometría de ascenso y descenso) son universales y se presentan como **verificadas**. En contraste, los **valores normativos colombianos** (porcentajes y minutos de reserva de combustible por tipo de operación) deben confirmarse contra el texto oficial vigente del RAC antes de cualquier uso operacional; en este documento se marcan explícitamente y se citan los documentos primarios de Aerocivil donde deben validarse.

---

## 2. CONCEPTO Y NOMBRE DEL PROYECTO

**Propósito.** Ofrecer una suite ligera, clara y confiable de cálculos aeronáuticos básicos que funcione en cualquier dispositivo y sin conexión para los cálculos principales, con foco educativo y de referencia rápida.

**Nombre.** El nombre de trabajo es *Valero Aviation Tools*. Se recomienda conservar la marca personal pero considerar un nombre de producto más neutro y escalable de cara a un público internacional futuro:

| Opción | Ventaja |
|---|---|
| **Valero Aviation Tools** (actual) | Marca personal, memorable |
| **VATools — Flight Planning Toolkit** (recomendado) | Sigla corta, internacionalizable, escalable a más herramientas |
| AeroCalc CO | Enfatiza el contexto colombiano |
| FlightMath | Neutro, enfatiza lo educativo |

Recomendación: mantener *Valero Aviation Tools* como marca visible y usar `vatools` como identificador técnico (repositorio, paquete, dominio) para facilitar futuras extensiones.

**Público objetivo.** Pilotos (PPL/CPL/ATPL), pilotos en formación, estudiantes de aviación, instructores, despachadores de vuelo y personas interesadas en planificación básica.

**Herramientas del MVP:** (1) componente de viento, (2) TOC, (3) TOD, (4) tiempos de vuelo, (5) combustible, (6) gráficos y visualizaciones, (7) validación de datos, (8) advertencias operacionales, (9) página de fuentes, metodología y limitaciones.

**Modelo de acceso.** Pública, gratuita, sin registro ni inicio de sesión.

---

## 3. REQUISITO PRIORITARIO: EJECUCIÓN LOCAL

Este es un **requisito obligatorio y bloqueante**. La primera versión debe ejecutarse por completo en local y abrirse en un navegador.

**La aplicación NO debe depender inicialmente de:** dominio público, servidor remoto, backend, base de datos, sistema de registro, inicio de sesión, API externa, servicios de pago, servicios de terceros obligatorios ni configuraciones complejas de producción.

**Todos los cálculos principales se ejecutan en el navegador (client-side).** Todos los módulos iniciales deben poder usarse localmente: viento, TOC, TOD, tiempos, combustible, gráficos, validaciones, mensajes de error, advertencias operacionales e historial local (si se incluye).

**Comandos objetivo:**

```bash
npm install
npm run dev
# Abrir en el navegador: http://localhost:5173
```

**Checklist de validación local (los 15 puntos deben cumplirse):**

1. El proyecto se instala correctamente (`npm install` sin errores).
2. La aplicación se inicia desde la terminal (`npm run dev`).
3. La aplicación abre correctamente en el navegador (`localhost`).
4. Las rutas funcionan (navegación entre módulos).
5. Los módulos cargan correctamente.
6. Los cálculos funcionan sin servicios externos.
7. Los gráficos se muestran correctamente.
8. Los formularios validan los datos.
9. Los errores se muestran correctamente.
10. Los resultados coinciden con los casos de prueba documentados.
11. La interfaz funciona en computador, tablet y teléfono.
12. La aplicación puede detenerse y reiniciarse correctamente.
13. La aplicación funciona correctamente en `localhost`.
14. La documentación de instalación es clara (README).
15. La versión local está validada antes de cualquier publicación pública.

> **CRITERIO DE ACEPTACIÓN DE LA FASE LOCAL:** La primera versión no se considera terminada hasta ejecutarse y validarse satisfactoriamente en un navegador local. La publicación pública es una fase posterior. **Cursor no debe configurar despliegue público hasta completar esta validación local.**

---

## 4. REGLAS DE INVESTIGACIÓN Y TRAZABILIDAD

Se priorizaron fuentes oficiales y técnicas: Aerocivil Colombia, Reglamentos Aeronáuticos de Colombia (RAC), AIP Colombia, OACI/ICAO, y como material técnico complementario FAA y EASA, además de POH/AFM/FCOM y manuales de performance. No se usan blogs, foros ni videos como fuente principal de requisitos legales o de seguridad.

**Convención de marcado usada en este documento:**

- **[VERIFICADO]** — Fórmula matemática universal o hecho técnico confirmado por fuente reconocida.
- **[REF. INTERNACIONAL]** — Valor de referencia OACI/FAA/EASA, útil como estándar pero **no** necesariamente idéntico al RAC colombiano.
- **[PENDIENTE DE VALIDACIÓN]** — Fórmula o parámetro que requiere confirmación antes de uso.
- **[PENDIENTE DE VALIDACIÓN NORMATIVA OFICIAL]** — Requisito regulatorio colombiano que debe confirmarse en el texto vigente del RAC/AIP antes de utilizarse operacionalmente.

Ningún valor de reserva, porcentaje, tiempo normativo, límite de aeronave o requisito legal se inventa. Donde el número exacto colombiano no pudo confirmarse contra el PDF oficial en esta fase de investigación, se cita el documento primario a consultar y se marca como pendiente.

---

## 5. INVESTIGACIÓN AERONÁUTICA — COMPONENTE DE VIENTO

### 5.1 Conceptos

- **Dirección del viento:** por convención meteorológica se expresa como la dirección **desde la cual sopla** el viento (un viento "270" viene del oeste y se desplaza hacia el este). Este punto debe explicarse siempre en la interfaz.
- **Viento de frente (headwind):** componente del viento opuesto a la dirección de la pista; reduce la velocidad respecto al suelo en despegue/aterrizaje y ayuda a la performance.
- **Viento de cola (tailwind):** componente en el mismo sentido de la pista; suele estar limitado por la aeronave (a menudo ~10 kt demostrados) [REF. INTERNACIONAL].
- **Viento cruzado (crosswind):** componente perpendicular al eje de la pista; se compara contra el **límite de viento cruzado demostrado** de la aeronave (POH/AFM).
- **Pista activa / opuesta:** una pista física tiene dos designadores opuestos que difieren 180° (p. ej., 09/27). El número de pista × 10 ≈ rumbo magnético.
- **Viento sostenido vs. ráfaga:** el sostenido es el promedio; la ráfaga es el pico. Se calculan componentes para ambos.
- **Magnético vs. verdadero:** el viento del ATIS/torre suele darse en referencia **magnética**; el viento de pronósticos (METAR/TAF y viento en altura) suele ser **verdadero**. Debe permitirse seleccionar la referencia y advertir sobre la diferencia (variación magnética).
- **Diferencia circular entre rumbos:** los ángulos son módulo 360°; la diferencia debe normalizarse al rango −180°…+180°.

### 5.2 Fórmulas [VERIFICADO]

Sea `RH` el rumbo de la pista (grados), `WD` la dirección del viento (grados, de dónde viene) y `WS` la velocidad del viento.

```
# 1. Ángulo relativo (normalizado a -180..+180)
θ = ((WD - RH + 180) mod 360) - 180

# 2. Componente de viento de frente/cola (con signo)
HW = WS * cos(θ)      # HW > 0 → viento de frente ; HW < 0 → viento de cola

# 3. Componente de viento cruzado (con signo)
XW = WS * sin(θ)      # XW > 0 → cruzado desde la DERECHA ; XW < 0 → desde la IZQUIERDA

# 4. Magnitudes reportadas
Headwind  = HW  (si HW>0)   |   Tailwind = -HW (si HW<0)
Crosswind = |XW|            |   Lado = derecha si XW>0, izquierda si XW<0
```

Conversión número de pista → rumbo: `RH = numeroPista * 10`. Pista opuesta: `(numeroPista + 18 - 1) mod 36 + 1`, o de forma equivalente sobre el rumbo `RH_opuesto = (RH + 180) mod 360`.

Conversión de unidades: `1 kt = 1.852 km/h = 0.514444 m/s`; grados→radianes: `rad = grados * π/180`.

Para ráfaga se repite el cálculo usando `WS = velocidad_de_ráfaga`.

### 5.3 Signos y convención (resumen)

| Resultado | HW | XW |
|---|---|---|
| Viento de frente | + | — |
| Viento de cola | − | — |
| Cruzado por la derecha | — | + |
| Cruzado por la izquierda | — | − |

Fuentes: fórmula estándar de componentes (coseno/seno del ángulo relativo), consistente con calculadoras aeronáuticas reconocidas (AeroToolbox, PilotWorkshop) y con material FAA. Límite de tailwind demostrado ~10 kt es referencia típica FAA Parte 91 [REF. INTERNACIONAL] — el valor real depende del POH/AFM de cada aeronave.

---

## 6. INVESTIGACIÓN AERONÁUTICA — TOP OF CLIMB (TOC)

### 6.1 Definición y propósito

El **Top of Climb (TOC)** es el punto en el que la aeronave alcanza la altitud/nivel objetivo tras un ascenso. Sirve para estimar cuándo y a qué distancia del origen se nivelará el vuelo, y para planificar tiempos y combustible de la fase de ascenso.

### 6.2 Variables

Entrada: altitud inicial, altitud objetivo, tasa de ascenso (fpm), velocidad (IAS/TAS/groundspeed), componente de viento, unidades. Opcional: distancia desde el punto de salida, TAS o GS explícitos.

### 6.3 Fórmulas [VERIFICADO — modelo simplificado]

```
ΔAlt = AltObjetivo - AltInicial            # altitud a ganar (ft)
t_climb = ΔAlt / ROC                        # tiempo de ascenso (min), ROC en fpm
GS = f(TAS, viento)                         # groundspeed (kt)
d_climb = GS * (t_climb / 60)               # distancia horizontal (NM)
Punto_TOC = distancia_origen + d_climb      # posición del TOC (NM)
```

Si solo se dispone de IAS, se aproxima TAS (regla ~+2%/1000 ft) o se pide TAS/GS al usuario. Con viento: `GS ≈ TAS − headwind` (o `+ tailwind`).

### 6.4 Limitaciones y supuestos

El modelo simplificado asume **tasa de ascenso y velocidad constantes**. El **TOC real** depende de peso, temperatura (ISA/desviación), presión/altitud densidad, configuración y de la performance real (el ROC disminuye con la altitud). Debe distinguirse siempre en la interfaz entre **TOC teórico** (esta calculadora) y **TOC basado en performance real** (tablas del POH/AFM/FCOM). [PENDIENTE DE VALIDACIÓN para cualquier modelo que pretenda performance real por aeronave.]

**Ejemplo verificado:** ascenso de 2 000 ft a 8 000 ft (ΔAlt = 6 000 ft), ROC = 500 fpm → t = 12 min; con GS = 100 kt → d = 20 NM.

---

## 7. INVESTIGACIÓN AERONÁUTICA — TOP OF DESCENT (TOD)

### 7.1 Definición y propósito

El **Top of Descent (TOD)** es el punto donde debe iniciarse el descenso para llegar a una altitud/restricción objetivo con un perfil deseado. Es clave para descensos estabilizados y para cumplir restricciones de altitud/ATC y procedimientos instrumentales.

### 7.2 Métodos de cálculo

**Método 1 — Regla 3:1 (aproximación) [VERIFICADO]**
3 NM por cada 1 000 ft a perder. `Distancia_TOD (NM) = (ΔAlt en ft / 1000) * 3`.
Ejemplo: FL350 → nivel del mar: 35 000/1000 × 3 = **105 NM**.

**Método 2 — Ángulo de descenso de 3° [VERIFICADO]**
Un sendero de 3° desciende ≈ **318 ft/NM** (`6076 * tan(3°) ≈ 318.4`). Equivale a ≈ 3.14 NM/1000 ft. Régimen de descenso para 3°: `ROD (fpm) ≈ GS (kt) × 5`.
Ejemplo: GS 120 kt → 600 fpm.

**Método 3 — Por tasa de descenso fija [VERIFICADO]**
```
t_desc = ΔAlt / ROD              # min (ROD en fpm)
d_desc = GS * (t_desc / 60)      # NM
```

**Método 4 — Ángulo personalizado [VERIFICADO]**
`ft/NM = 6076 * tan(ángulo°)`; `Distancia_TOD = ΔAlt / (ft/NM)`; `ROD = GS × 101.3 × tan(ángulo°)` (aprox. `GS × ángulo × 100/60`).

### 7.3 Ajustes y márgenes

Sumar distancia adicional por **desaceleración** y por **configuración** (flaps/tren) y aplicar **margen de seguridad** configurable. El viento afecta el perfil: **viento de cola** aumenta la distancia necesaria (adelantar el TOD); **viento de frente** la reduce. Deben mostrarse advertencias sobre **restricciones ATC** y **procedimientos instrumentales** (el TOD calculado es orientativo).

Ventajas/limitaciones: 3:1 y 3° son rápidos y estándar pero ignoran viento/desaceleración; el método por tasa fija y el personalizado son más flexibles pero requieren más datos. Ninguno reemplaza el perfil VNAV/FMS ni la carta del procedimiento.

Fuentes: regla del tres y sendero de 3° (Wikipedia "Rule of three (aeronautics)", Boldmethod, Pilot Institute, IVAO). Valores 318 ft/NM y GS×5 verificados numéricamente.

---

## 8. INVESTIGACIÓN AERONÁUTICA — CÁLCULO DE TIEMPOS

### 8.1 Fórmulas base [VERIFICADO]

```
Tiempo    = Distancia / Velocidad
Distancia = Velocidad * Tiempo
Velocidad = Distancia / Tiempo
```

Todo con **groundspeed (GS)** para tiempos reales sobre el terreno. `GS ≈ TAS − headwind` o `TAS + tailwind`.

### 8.2 Conversiones [VERIFICADO]

- Distancia: `1 NM = 1.852 km`.
- Velocidad: `1 kt = 1.852 km/h = 0.514444 m/s`.
- Tiempo: horas decimales → h:m:s. `min = horas_decimales × 60`; `h = ⌊min/60⌋`, `m = min mod 60`.
- Ejemplo: 100 NM a GS 120 kt → `100/120 h = 0.8333 h = 50 min` [VERIFICADO].

### 8.3 Velocidades

- **IAS** (indicada), **CAS** (calibrada, IAS corregida por error de instrumento/posición), **TAS** (verdadera, CAS corregida por altitud densidad y temperatura), **GS** (respecto al suelo, TAS ± viento). Para tiempos de navegación se usa **GS**. La calculadora debe dejar claro qué velocidad se usó.

Tiempos por fase: `t_total = t_ascenso + t_crucero + t_descenso`. Cada fase usa su propia GS. Validar división por cero (velocidad o tiempo = 0).

---

## 9. INVESTIGACIÓN AERONÁUTICA — COMBUSTIBLE

> **Advertencia de terminología:** "diversion fuel", "alternate fuel" y "fuel to alternate" suelen referirse a lo mismo (combustible desde el destino hasta el aeródromo alterno), pero el uso varía según marco normativo (OACI, EASA, FAA, RAC). "Extra fuel" y "additional fuel" **no** son sinónimos exactos en el marco OACI/EASA. La aplicación debe usar la terminología correcta y no asumir equivalencias.

### 9.1 Componentes del combustible (marco OACI / EASA) [REF. INTERNACIONAL]

Fuentes: OACI Doc 9976 (Flight Planning and Fuel Management), OACI Anexo 6, SKYbrary, EASA. Valores de referencia internacional — **no** sustituyen el RAC colombiano.

| # | Concepto | Definición | Método de referencia |
|---|---|---|---|
| 1 | **Taxi fuel** | Arranque y rodaje antes del despegue | Consumo de APU/rodaje × tiempo de taxi |
| 2 | **Trip fuel** | Del despegue (o repunto) al aterrizaje en destino | Climb + Cruise + Descent + Approach del destino |
| 3 | **Climb fuel** | Parte del trip: fase de ascenso | Flujo de ascenso × tiempo de ascenso |
| 4 | **Cruise fuel** | Parte del trip: crucero | Flujo de crucero × tiempo de crucero |
| 5 | **Descent fuel** | Parte del trip: descenso | Flujo de descenso × tiempo de descenso |
| 6 | **Approach fuel** | Parte del trip: aproximación/aterrizaje | Flujo de aproximación × tiempo |
| 7 | **Contingency fuel** | Imprevistos (clima, ATC, ruta) | ≥ 5% del trip fuel, o 5 min de espera a 1500 ft, el mayor [REF. INTERNACIONAL] |
| 8 | **Alternate / diversion fuel** | Del punto de aproximación frustrada en destino hasta el alterno | Climb+Cruise+Descent+Approach hacia el alterno |
| 9 | **Final reserve fuel** | Reserva protegida intocable | Jet: 30 min de espera a 1500 ft sobre el alterno; hélice: valor equivalente [REF. INTERNACIONAL] |
| 10 | **Additional fuel** | Requerido por escenarios específicos (p. ej. fallo de motor/despresurización en el punto más crítico) | Según análisis operacional |
| 11 | **Extra fuel** | A discreción del comandante/operador | Decisión operacional |
| 12 | **Minimum required fuel (block)** | Suma mínima legal | Taxi + Trip + Contingency + Alternate + Final reserve + Additional |
| 13 | **Fuel on board (FOB)** | Combustible embarcado | Dato de entrada |
| 14 | **Fuel remaining** | Remanente estimado tras aterrizaje | FOB − consumo hasta el punto |

`Block fuel = Taxi + Trip + Contingency + Alternate + Final Reserve + Additional + Extra`.

Para VFR sin alterno, muchos marcos eliminan alternate fuel y usan una reserva de tiempo fija (ver §10).

### 9.2 Estructura del cálculo (por concepto)

Para cada concepto la app debe indicar: definición, fórmula/método, datos de entrada, unidad, ejemplo, supuestos, limitaciones, dependencia de tipo de aeronave, dependencia de tipo de operación, dependencia de POH/AFM, dependencia del RAC de Colombia y si es una decisión operacional. La app debe **separar visualmente**: (1) cálculo matemático, (2) requisito regulatorio, (3) dato de performance de la aeronave, (4) decisión operacional, (5) margen introducido por el usuario.

### 9.3 Densidad y unidades

Volumen ↔ masa mediante densidad. Referencia Jet A-1 ≈ 0.80 kg/L (varía con temperatura) [REF. INTERNACIONAL, verificar]. Avgas 100LL ≈ 0.72 kg/L. Unidades: L, galón US (3.78541 L), galón imperial (4.54609 L), kg. La densidad debe ser configurable por el usuario.

---

## 10. INVESTIGACIÓN NORMATIVA — RAC DE COLOMBIA

> **Todos los valores de esta sección deben confirmarse contra el texto oficial vigente antes de uso operacional.** Los documentos primarios son los RAC publicados por Aerocivil (aerocivil.gov.co → Normatividad → Reglamentos Aeronáuticos de Colombia).

### 10.1 Hallazgos de la investigación

- El **RAC 91** (Reglas Generales de Vuelo y Operación) contiene los requisitos de combustible y aceite. Las secciones relevantes son **91.610** (combustible y aceite, aviones VFR/IFR) y **91.620** (helicópteros). El RAC se armoniza con los Anexos 2 y 6 de OACI y con los LAR (Reglamentos Aeronáuticos Latinoamericanos). *(Confirmar numeración y contenido exacto en el PDF oficial.)*
- Referencia recurrente en formación: para **VFR diurno**, llevar combustible para volar al aeródromo de aterrizaje previsto **y después al menos 45 minutos** a velocidad de crucero normal. *(Esta redacción aparece en material de instrucción basado en la sección equivalente; el valor "45 minutos" debe confirmarse en el RAC 91 colombiano vigente.)* [PENDIENTE DE VALIDACIÓN NORMATIVA OFICIAL]
- **RAC 121** (operaciones domésticas/internacionales, regulares y no regulares) y **RAC 135** (según aplique) contienen requisitos de combustible más exigentes para operaciones comerciales, incluyendo contingencia, alterno y reserva final. *(Confirmar en PDF oficial de Aerocivil.)* [PENDIENTE DE VALIDACIÓN NORMATIVA OFICIAL]
- Diferencias por tipo de operación (aviación general vs. comercial), reglas de vuelo (VFR vs. IFR) y naturaleza (privado, comercial, taxi aéreo) implican **distintas fórmulas de combustible**. **No existe una única fórmula** para todos.

### 10.2 Tabla normativa (plantilla a completar y verificar)

| Concepto | Tipo de operación | RAC aplicable | Requisito | Fórmula/método | Fuente oficial | Documento | Capítulo/sección/párrafo | Fecha consulta | Nivel de certeza | Observaciones | Limitaciones | Actualización futura |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Reserva VFR diurno | Aviación general | RAC 91 | Destino + 45 min crucero *(verificar)* | Tiempo × flujo crucero | Aerocivil | RAC 91 | §91.610 *(verificar)* | 2026-08-09 | **Bajo/medio** | Redacción tomada de material de instrucción | Debe confirmarse el valor exacto | Alta: RAC se actualiza |
| Reserva VFR nocturno | Aviación general | RAC 91 | *(verificar; suele ser mayor)* | — | Aerocivil | RAC 91 | §91.610 *(verificar)* | 2026-08-09 | **Pendiente** | — | — | Alta |
| Reserva IFR + alterno | Aviación general | RAC 91 | Destino + alterno + reserva *(verificar)* | — | Aerocivil | RAC 91 | §91.610 *(verificar)* | 2026-08-09 | **Pendiente** | — | — | Alta |
| Contingencia | Comercial | RAC 121 | *(verificar; OACI ≥5% trip)* | ≥5% trip o 5 min espera | Aerocivil | RAC 121 | *(verificar)* | 2026-08-09 | **Pendiente** | Referencia OACI Doc 9976 | Confirmar % colombiano | Alta |
| Reserva final | Comercial | RAC 121 | *(verificar; OACI 30 min)* | 30 min espera 1500 ft | Aerocivil | RAC 121 | *(verificar)* | 2026-08-09 | **Pendiente** | Referencia OACI | Confirmar valor | Alta |

> Todas las filas marcadas *(verificar)* / **Pendiente** requieren confirmación en el texto oficial. La aplicación debe mostrar estos valores como configurables y etiquetados como "referencia — pendiente de validación normativa oficial" hasta su confirmación.

### 10.3 Regla de diseño del módulo

El módulo de combustible **debe permitir seleccionar el tipo de operación antes de calcular** (aviación general VFR, aviación general IFR, comercial/RAC 121, taxi aéreo/RAC 135, otro). Según la selección se muestran los conceptos aplicables. **No se definen porcentajes/tiempos/reservas sin verificar el RAC correspondiente.**

---

## 11. MATRIZ DE FUENTES

| Tema | Fuente | Tipo | Documento | Enlace | Sección | Fecha consulta | Uso en la app | Confiabilidad | Actualización |
|---|---|---|---|---|---|---|---|---|---|
| Combustible RAC | Aerocivil Colombia | Normativa | RAC 91 | aerocivil.gov.co / aviacion.edu.co (RAC 91) | §91.610/91.620 | 2026-08-09 | Reglas de reserva | **Alta (primaria)** | Revisar periódicamente |
| Combustible comercial | Aerocivil Colombia | Normativa | RAC 121 | aerocivil.gov.co (RAC 121 PDF) | Combustible | 2026-08-09 | Reglas comerciales | **Alta (primaria)** | Revisar periódicamente |
| Planificación de combustible | OACI/ICAO | Técnica/normativa | Doc 9976; Anexo 6 | unitingaviation.com/ICAO_Doc_9976-1_EN.pdf | Fuel policy | 2026-08-09 | Referencia internacional | **Alta** | Media |
| Definiciones de combustible | SKYbrary | Técnica | Fuel – Flight Planning Definitions | skybrary.aero | — | Definiciones | **Alta** | Media |
| Componente de viento | AeroToolbox | Técnica | Crosswind Calculator | aerotoolbox.com/crosswind | — | Fórmula viento | **Media-alta** | Baja |
| Componente de viento | PilotWorkshop | Educativa | Quick Crosswind Calculation | pilotworkshop.com | — | Fórmula viento | **Media** | Baja |
| TOD / regla del tres | Wikipedia | Complementaria | Rule of three (aeronautics) | en.wikipedia.org | — | Regla 3:1 y 3° | **Media** | Baja |
| TOD / 3° glideslope | Boldmethod | Educativa | 3-degree descent formulas | boldmethod.com | — | ROD y ft/NM | **Media** | Baja |
| TOD | Pilot Institute / IVAO | Educativa | Descent calculation | pilotinstitute.com / wiki.ivao.aero | — | Métodos TOD | **Media** | Baja |

Clasificación: normativa (RAC, OACI Anexo), técnica (Doc 9976, SKYbrary, AeroToolbox), educativa (PilotWorkshop, Boldmethod, Pilot Institute, IVAO), performance (POH/AFM/FCOM — a incorporar por aeronave), complementaria (Wikipedia). **Deben revisarse periódicamente** las fuentes normativas (RAC/OACI/AIP) porque se actualizan.

---

## 12. DEFINICIÓN DEL PRODUCTO

**1. Nombre recomendado:** Valero Aviation Tools (identificador técnico `vatools`).
**2. Propósito:** cálculos aeronáuticos básicos, claros y confiables, ejecutables localmente y sin conexión.
**3. Público:** pilotos, alumnos, instructores, despachadores, entusiastas.
**4. Problema que resuelve:** dispersión de calculadoras, falta de trazabilidad de fórmulas/fuentes, herramientas que no explican supuestos ni advierten limitaciones.
**5. Propuesta de valor:** rigor + transparencia (fórmula, supuestos, fuente y advertencia siempre visibles) + funcionamiento local/offline + diseño mobile-first.
**6. Diferenciadores:** separación explícita entre cálculo, norma, performance y decisión operacional; marcado honesto de lo "pendiente de validación"; gratis y sin registro.
**7. Alcance MVP:** los 9 módulos de §2.
**8. V2:** conversión avanzada de unidades, perfiles de aeronave, exportación a PDF, PWA/offline avanzado.
**9. V3:** METAR/TAF, mapas, planificación de rutas, traducción al inglés, base de datos de aeronaves.
**10. Fuera del MVP:** cuentas de usuario, backend, integraciones externas obligatorias.
**11. Riesgos operacionales:** uso indebido como herramienta operacional. **12. Riesgos legales:** interpretación errónea de normativa. **13. Riesgos técnicos:** errores de fórmula/unidades. **14. Riesgos de interpretación normativa:** RAC desactualizado o mal citado. **15. Mensaje de advertencia principal:** el aviso operacional obligatorio (portada del documento).

**La aplicación debe ser:** clara, profesional, educativa, rápida, mobile-first, usable en teléfono/tablet/computador, accesible, sin registro, funcional en local y offline para cálculos básicos, modular, fácil de actualizar y preparada para publicación futura.

---

## 13. REQUISITOS FUNCIONALES Y NO FUNCIONALES

### 13.1 Requisitos no funcionales (RNF)

| ID | Requisito | Criterio |
|---|---|---|
| RNF-01 | Ejecución 100% local en el MVP | Corre con `npm run dev` sin servicios externos |
| RNF-02 | Cálculos offline | Los 5 módulos calculan sin red |
| RNF-03 | Responsive mobile-first | Usable de 320px a escritorio |
| RNF-04 | Accesibilidad | Navegación por teclado, contraste AA, ARIA, lectores de pantalla |
| RNF-05 | Rendimiento | Cálculo < 50 ms; carga inicial < 3 s en 3G simulada |
| RNF-06 | Mantenibilidad | Lógica pura separada de UI; TypeScript tipado |
| RNF-07 | Testabilidad | Cobertura de fórmulas por pruebas unitarias |
| RNF-08 | Trazabilidad | Cada resultado muestra fórmula, supuestos, fuente y advertencia |
| RNF-09 | Internacionalización | Textos externalizados para traducción futura |
| RNF-10 | Versionado de fórmulas | Cada fórmula tiene versión y fuente |

### 13.2 Formato de requisito funcional

Cada RF: identificador, nombre, descripción, prioridad, datos de entrada, resultado esperado, validaciones, mensajes de error, dependencias y criterio de aceptación. Los RF se detallan por módulo en §§14–18. Prioridades: **P0** (bloqueante MVP), **P1** (importante), **P2** (deseable).

---

## 14. MÓDULO DE COMPONENTE DE VIENTO

**RF-WIND-01 (P0) — Cálculo de componentes de viento.**
*Entrada:* número de pista (01–36) o rumbo magnético de pista; dirección del viento (0–360); velocidad del viento; ráfaga (opcional); unidad (kt/km·h⁻¹/m·s⁻¹); referencia (magnética/verdadera); límite de crosswind de la aeronave (opcional); opción pista opuesta; opción guardar local.
*Resultado:* ángulo viento-pista; headwind/tailwind; crosswind y lado (izq/der); componentes con sostenido y con ráfaga; diferencia frente/cola; advertencia si se supera el límite de crosswind.
*Visualización:* dibujo de pista con su número, flecha/vector de viento, vectores de crosswind y de headwind/tailwind, rosa de vientos/gráfico polar, resultados numéricos, fórmulas usadas, explicación sencilla; botones invertir pista, limpiar, copiar y (opcional) descargar.
*Validaciones:* 0–360°; velocidad ≥ 0; pista 01–36; conversión pista→rumbo; diferencia circular; campos obligatorios; ráfaga ≥ sostenido; unidades; casos límite.
*Mensajes de error:* "La dirección debe estar entre 0 y 360°", "La velocidad no puede ser negativa", "Número de pista inválido (01–36)", "La ráfaga no puede ser menor que el viento sostenido".
*Criterio de aceptación:* los 12 casos de prueba de §14.1 pasan.

### 14.1 Casos de prueba (verificados numéricamente)

| Caso | Pista | Viento | HW/TW | XW | Lado |
|---|---|---|---|---|---|
| 1 | 09 (090) | 090/10 | 10 kt frente | 0 | ninguno |
| 2 | 09 (090) | 270/10 | 10 kt cola | 0 | ninguno |
| 3 | 18 (180) | 090/20 | 0 | 20 kt | izquierda |
| 4 | 27 (270) | 360/15 | 0 | 15 kt | derecha |
| 5 | con ráfaga | 120/10G20 | calcular ambos | — | — |
| 6 | pista opuesta | invertir 09→27 | signo HW invierte | — | — |
| 7 | perpendicular | 180/15 en RWY09 | 0 | 15 | derecha |
| 8 | paralelo | 090/15 en RWY09 | 15 frente | 0 | — |
| 9 | velocidad cero | 090/0 | 0 | 0 | — |
| 10 | dirección inválida | 400/10 | error | — | — |
| 11 | decimales | 093/12.5 | calcular | — | — |
| 12 | cambio de unidad | 10 kt ↔ 18.52 km/h | equivalente | — | — |

---

## 15. MÓDULO DE TOC

**RF-TOC-01 (P0).** *Entrada:* altitud inicial, altitud objetivo, tasa de ascenso (fpm), IAS y/o TAS y/o GS, componente de viento, unidades de altitud y velocidad, distancia desde salida (opcional).
*Resultado:* altitud a ganar, tiempo de ascenso, distancia horizontal, punto aproximado de TOC, resultado con GS y resultado alternativo con velocidad seleccionada, método usado, supuestos, advertencias.
*Explica:* diferencia entre tiempo de ascenso, distancia de ascenso, TOC teórico y TOC real (peso, temperatura, presión, viento, configuración, performance).
*Validaciones:* altitud objetivo > inicial; ROC > 0; velocidad > 0; unidades. *Errores:* "La altitud objetivo debe ser mayor que la inicial", "La tasa de ascenso debe ser mayor que 0".
*Caso de prueba:* 2 000→8 000 ft, 500 fpm, GS 100 kt → 12 min, 20 NM.

---

## 16. MÓDULO DE TOD

**RF-TOD-01 (P0).** *Entrada:* altitud actual, altitud objetivo/cruce, tasa de descenso, velocidad de descenso/GS, ángulo de descenso deseado, distancia adicional por desaceleración, distancia adicional por configuración, viento (frente/cola), margen de seguridad, método.
*Resultado:* altitud a perder, tiempo estimado de descenso, distancia para iniciar descenso, TOD por tasa, TOD por ángulo, TOD por regla 3° (3:1), distancia adicional, comparación entre métodos, advertencias ATC/procedimientos instrumentales.
*Visualización:* altitud inicial, trayectoria de descenso, punto TOD, altitud final, ángulo, distancia horizontal.
*Métodos seleccionables:* tasa de descenso, ángulo, aproximación 3° (3:1), personalizado.
*Validaciones:* altitud actual > objetivo; ROD > 0; ángulo 0–10°; GS > 0. *Errores:* "La altitud actual debe ser mayor que la objetivo", "Ángulo fuera de rango razonable".
*Casos de prueba:* FL350→0 con 3:1 = 105 NM; GS 120 kt a 3° → 600 fpm; ΔAlt 10 000 ft a ROD 1 000 fpm, GS 300 → 10 min, 50 NM.

---

## 17. MÓDULO DE TIEMPOS

**RF-TIME-01 (P0).** Modos: `t = d/v`, `d = v·t`, `v = d/t`; tiempo de ascenso/crucero/descenso; tiempo total; conversión horas decimales ↔ h:m; minutos ↔ h:m; cálculo con GS y con viento; distancia en NM/km; velocidad en kt/km·h⁻¹/m·s⁻¹.
*Resultado:* resultado exacto y redondeado, explicación de unidades, validación anti división por cero, mensajes de error, historial local opcional, botones limpiar/copiar.
*Validaciones:* denominador ≠ 0; valores ≥ 0. *Errores:* "No es posible dividir por cero", "Introduce una velocidad mayor que 0".
*Caso de prueba:* 100 NM / 120 kt = 50 min; 0.8333 h → 00:50.

---

## 18. MÓDULO DE COMBUSTIBLE

**RF-FUEL-01 (P0) — Cálculo modular por fases y tipo de operación.**
*Entrada:* consumo por hora y/o por fase; tiempos de taxi, ascenso, crucero, descenso, aproximación, vuelo al alterno, reserva final; combustible adicional; extra; disponible (FOB); unidad (L / galón US / galón imperial / kg); densidad; **tipo de operación** (AG-VFR, AG-IFR, comercial RAC 121, taxi aéreo RAC 135, otro); VFR/IFR; aeropuertos salida/destino/alterno; tiempo o distancia al alterno; consumo diferenciado por fase; margen operacional.
*Cálculo y desglose (mostrados por separado):* taxi, trip, climb, cruise, descent, approach, alternate/diversion, contingency, final reserve, additional, extra, total requerido, FOB, remanente tras aterrizaje, diferencia requerido−disponible, y **alerta si el disponible es inferior al mínimo calculado**.
*Visualización:* tabla de desglose, barra de combustible, barra apilada, gráfico circular, gráfico de barras, indicadores de estado, mensajes de advertencia, fuente normativa, fórmula usada, supuestos, limitaciones.
*Regla de separación visual:* (1) cálculo, (2) norma, (3) performance, (4) decisión operacional, (5) margen del usuario — con color/etiqueta distintos.
*Aviso obligatorio (siempre visible en el resultado):* el aviso operacional de la portada.
*Validaciones:* flujos y tiempos ≥ 0; densidad > 0; tipo de operación seleccionado; unidades coherentes; **los valores normativos por defecto se muestran como "referencia — pendiente de validación normativa oficial"**.
*Criterio de aceptación:* si FOB < total requerido → alerta roja bloqueante del "resultado seguro" (muestra déficit); nunca se oculta el supuesto normativo.

---

## 19. FÓRMULAS Y METODOLOGÍA (CONSOLIDADO)

Para cada módulo se entrega: fórmula, variables, unidad de entrada/salida, conversión, pseudocódigo, ejemplo numérico, casos límite, errores frecuentes, casos de prueba, resultado esperado, supuestos, limitaciones, fuente y naturaleza (educativa/aproximada/operacional).

### 19.1 Viento (naturaleza: aproximada-operacional)
Fórmulas en §5.2. Unidades: grados, kt/km·h⁻¹/m·s⁻¹. Caso límite: viento 0; ángulo 90°/180°; dirección 360=000. Error frecuente: confundir "de dónde viene" con "hacia dónde va"; mezclar magnético y verdadero. Fuente: AeroToolbox/FAA.

### 19.2 TOC (naturaleza: educativa-aproximada)
`ΔAlt/ROC` y `GS·t/60` (§6.3). Caso límite: ROC muy bajo → tiempo enorme; objetivo ≤ inicial → error. Limitación: no modela performance real. Fuente: cinemática estándar.

### 19.3 TOD (naturaleza: aproximada)
Métodos en §7.2. Caso límite: ángulo 0 → distancia infinita; viento fuerte. Error frecuente: ignorar desaceleración/configuración. Fuente: regla del tres / 3° glideslope.

### 19.4 Tiempos (naturaleza: operacional-exacta para la matemática)
`t=d/v` etc. (§8). Caso límite: v=0 o t=0 → error. Fuente: cinemática.

### 19.5 Combustible (naturaleza: educativa; los mínimos normativos son referenciales)
Sumas por fase y reservas (§9, §18). Caso límite: FOB < mínimo → alerta. Limitación: reservas colombianas pendientes de validación. Fuente: OACI Doc 9976 / RAC (a validar).

> **No se ocultan supuestos.** Cuando una fórmula dependa de datos específicos del avión (flujo por fase, límite de crosswind, ROC real), se indica explícitamente.

---

## 20. ARQUITECTURA TÉCNICA

### 20.1 Evaluación y decisión

| Opción | Local | Mantenim. | GitHub Pages | Sin backend | Responsive | Modular | Tests | Offline | Costo | Facilidad Cursor |
|---|---|---|---|---|---|---|---|---|---|---|
| **React + Vite + TS** ✅ | Excelente | Alta | Sí | Sí | Sí | Alta | Vitest | PWA fácil | 0 | Excelente |
| Next.js | Bueno | Alta | Requiere export estático | Sí (estático) | Sí | Alta | Sí | Sí | 0 | Bueno (más complejo) |
| Vue + Vite | Excelente | Alta | Sí | Sí | Sí | Alta | Vitest | Sí | 0 | Bueno |
| HTML/CSS/JS modular | Excelente | Media | Sí | Sí | Manual | Media | Manual | Manual | 0 | Medio |

**Decisión: React + Vite + TypeScript.** Justificación: arranque local inmediato (`npm run dev` → `localhost:5173`), sin backend, TypeScript aporta seguridad de tipos ideal para fórmulas y unidades, ecosistema de gráficos (Recharts) y testing (Vitest) maduro, salida estática trivial para GitHub Pages/Netlify/Vercel, PWA sencilla en fase futura, y es el stack con el que Cursor trabaja con mayor fiabilidad.

**Stack complementario:** React Router (rutas), Recharts o SVG propio (gráficos y rosa de vientos), Zod (validación), Vitest + Testing Library (pruebas), CSS Modules o Tailwind (estilos), i18n con archivos de recursos (traducción futura).

### 20.2 Estructura de carpetas recomendada

```
vatools/
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/                 # páginas: Home, Wind, TOC, TOD, Time, Fuel, Sources, About...
│   ├── components/             # UI reutilizable (Card, Field, ResultBox, WarningBanner, charts)
│   │   └── charts/             # RunwayDiagram, WindRose, DescentProfile, FuelBars
│   ├── core/                   # LÓGICA PURA (sin React)
│   │   ├── wind/               # wind.ts + wind.test.ts
│   │   ├── toc/                # toc.ts + toc.test.ts
│   │   ├── tod/                # tod.ts + tod.test.ts
│   │   ├── time/               # time.ts + time.test.ts
│   │   ├── fuel/               # fuel.ts + fuel.test.ts
│   │   ├── units/              # conversiones (kt, km/h, m/s, NM, km, L, gal, kg)
│   │   ├── validation/         # esquemas Zod y validadores
│   │   └── formulas/           # metadatos: versión, fuente, naturaleza de cada fórmula
│   ├── data/
│   │   ├── sources.ts          # matriz de fuentes
│   │   └── warnings.ts         # textos de advertencia y niveles
│   ├── models/                 # tipos/interfaces (WindData, FuelResult, etc.)
│   ├── hooks/                  # useLocalStorage, useHistory
│   ├── i18n/                   # es.json (en.json futuro)
│   ├── theme/                  # claro/oscuro, tokens de color
│   └── styles/
├── tests/                      # pruebas de integración/e2e opcionales
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md                   # instalación y ejecución local
└── docs/                       # este documento maestro, fórmulas, fuentes
```

**Principio arquitectónico clave:** la carpeta `core/` no importa React. Cada fórmula es una función pura testeable con su archivo `*.test.ts`. La UI consume `core/` y solo se encarga de presentación, estado y validación de formularios.

### 20.3 Sistemas transversales

Sistema de advertencias (`data/warnings.ts` + `WarningBanner`), sistema de fuentes (`data/sources.ts` + página Fuentes), almacenamiento local (`useLocalStorage`), temas claro/oscuro (`theme/`), traducción futura (`i18n/`), versionado de fórmulas (`core/formulas/` con `{ id, version, source, nature }`). Estrategia de pruebas: unitarias por fórmula (obligatorio), de componentes (formularios/validación), snapshot de gráficos (opcional). Estrategia de despliegue: build estático (`npm run build` → `dist/`) para fase futura.

---

## 21. DISEÑO UX/UI

**Inspiración:** aviación profesional, cabinas modernas, instrumentos de vuelo, claridad operacional, lectura rápida, confianza, baja distracción. Interfaz **no saturada**: el usuario comprende de inmediato qué introducir, qué fórmula se usó, cuál fue el resultado, qué supuestos y qué advertencias existen.

**Nombre visual:** "Valero Aviation Tools" con logotipo tipo instrumento (rosa de vientos estilizada).

**Paleta (modo oscuro primario, estilo cabina):**

| Uso | Color | HEX |
|---|---|---|
| Fondo oscuro | Azul carbón | `#0B1220` |
| Superficie/tarjeta | Gris azulado | `#151E2E` |
| Texto primario | Blanco hueso | `#E8EDF4` |
| Texto secundario | Gris | `#9AA7B8` |
| Acento primario | Cian instrumento | `#22D3EE` |
| Estado seguro / OK | Verde | `#22C55E` |
| Advertencia (caution) | Ámbar | `#F59E0B` |
| Peligro (warning) | Rojo | `#EF4444` |
| Información | Azul | `#3B82F6` |

**Modo claro:** fondo `#F5F7FA`, superficie `#FFFFFF`, texto `#0B1220`, acentos equivalentes con contraste AA.

**Tipografía:** Inter/IBM Plex Sans para UI; fuente monoespaciada (JetBrains Mono) para valores numéricos y resultados copiables. Jerarquía clara: título de módulo, subtítulo, etiqueta de campo, valor de resultado grande.

**Componentes:** tarjetas por módulo, formularios de una columna en móvil / dos en escritorio, botones primarios (acento cian) y secundarios (contorno), campos con unidad embebida y validación inline, tablas de desglose, gráficos (rosa de vientos, diagrama de pista, perfil de descenso, barras de combustible), banners de advertencia por nivel (info/caution/warning).

**Estados:** vacío (instrucción breve + ejemplo), carga (skeleton), éxito (resultado + fórmula + fuente), error (mensaje específico junto al campo). Espaciado generoso (grid de 8px), jerarquía visual con tamaño y color, no con exceso de negritas.

**Accesibilidad:** contraste AA, foco visible, navegación por teclado, roles ARIA, textos alternativos en gráficos, tamaños táctiles ≥ 44px.

---

## 22. MAPA DE PANTALLAS

Para cada pantalla: objetivo, componentes, campos, botones, resultados, errores, validaciones, advertencias, comportamiento móvil/escritorio y navegación.

1. **Inicio:** presentación, acceso a módulos, aviso principal. Móvil: tarjetas apiladas; escritorio: grid. 
2. **Panel principal (dashboard):** accesos a los 5 cálculos + fuentes + advertencias.
3. **Componente de viento:** formulario + rosa de vientos + diagrama de pista + resultados.
4. **TOC:** formulario + resultado + nota TOC teórico vs real.
5. **TOD:** formulario + selector de método + perfil de descenso + comparación.
6. **Tiempos:** selector de modo + resultado exacto/redondeado + historial.
7. **Combustible:** selector de tipo de operación + desglose por fase + gráficos + alerta.
8. **Resultados:** vista de resultado con fórmula, supuestos, fuente, copiar/descargar.
9. **Historial local:** lista de cálculos guardados (opcional).
10. **Fuentes y metodología:** matriz de fuentes y explicación de fórmulas.
11. **Advertencias y limitaciones:** todos los avisos y su alcance.
12. **Acerca de:** propósito, autor, versión, alcance educativo.
13. **Contacto / reporte de error:** formulario simple (mailto o formulario local; sin backend en MVP).
14. **Configuración (futura):** unidades por defecto, tema, idioma, densidad de combustible.

**Navegación:** barra superior/lateral con los módulos; en móvil, menú hamburguesa o barra inferior. Cada resultado enlaza a Fuentes y a Advertencias.

---

## 23. MODELO DE DATOS (TypeScript)

```ts
type SpeedUnit = 'kt' | 'kmh' | 'ms';
type DistanceUnit = 'NM' | 'km';
type AltitudeUnit = 'ft' | 'm';
type VolumeUnit = 'L' | 'usgal' | 'impgal' | 'kg';
type WindReference = 'magnetic' | 'true';
type OperationType = 'AG_VFR' | 'AG_IFR' | 'COMMERCIAL_RAC121' | 'AIRTAXI_RAC135' | 'OTHER';
type CertaintyLevel = 'verified' | 'reference_intl' | 'pending' | 'pending_regulatory';

interface RunwayData { number: number; heading: number; }           // 01..36 ; 0..360
interface WindData {
  runway: RunwayData; windDir: number; windSpeed: number;
  gust?: number; unit: SpeedUnit; reference: WindReference;
  aircraftCrosswindLimit?: number;
}
interface WindResult {
  angle: number; headwind: number; tailwind: number;
  crosswind: number; crosswindSide: 'left' | 'right' | 'none';
  gustCrosswind?: number; exceedsLimit: boolean;
}

interface TocData { altStart: number; altTarget: number; roc: number;
  tas?: number; gs?: number; windComp?: number; altUnit: AltitudeUnit; speedUnit: SpeedUnit; }
interface TocResult { altToGain: number; timeMin: number; distanceNM: number; tocPointNM?: number; method: string; }

interface TodData { altNow: number; altTarget: number; rod?: number; gs?: number;
  angleDeg?: number; decelDist?: number; configDist?: number; windComp?: number;
  safetyMargin?: number; method: 'rate' | 'angle' | 'threeToOne' | 'custom'; }
interface TodResult { altToLose: number; timeMin: number; distanceNM: number;
  byRate?: number; byAngle?: number; byThreeToOne?: number; extraDist: number; }

interface TimeData { mode: 't' | 'd' | 'v'; distance?: number; speed?: number; timeMin?: number;
  distUnit: DistanceUnit; speedUnit: SpeedUnit; }
interface TimeResult { value: number; formatted: string; }

interface FuelPhase { name: string; timeMin?: number; flowPerHour?: number; fuel?: number; }
interface FuelData {
  operation: OperationType; rules: 'VFR' | 'IFR';
  phases: FuelPhase[]; density: number; unit: VolumeUnit;
  alternate?: { timeMin?: number; distanceNM?: number; flow?: number };
  contingency?: number; finalReserve?: number; additional?: number; extra?: number;
  fuelOnBoard?: number; margin?: number;
}
interface FuelResult {
  breakdown: Record<string, number>; totalRequired: number;
  fuelOnBoard?: number; remaining?: number; deficit?: number; alert: boolean;
}

interface AircraftConfig { model: string; crosswindLimit?: number; tailwindLimit?: number;
  climbRate?: number; fuelFlow?: Record<string, number>; }
interface HistoryEntry { id: string; module: string; timestamp: string; input: unknown; result: unknown; }
interface Source { topic: string; name: string; type: 'regulatory'|'technical'|'educational'|'performance'|'complementary';
  doc: string; url: string; section?: string; consultedAt: string; reliability: string; }
interface WarningMessage { id: string; text: string; level: 'info'|'caution'|'warning'; location: string; blocking: boolean; }
interface FormulaMeta { id: string; version: string; source: string;
  nature: 'educational'|'approximate'|'operational'; certainty: CertaintyLevel; }
```

Ejemplo de objeto:
```ts
const windExample: WindData = {
  runway: { number: 18, heading: 180 }, windDir: 90, windSpeed: 20,
  unit: 'kt', reference: 'magnetic', aircraftCrosswindLimit: 15
}; // → crosswind 20 kt izquierda, excede límite 15 → advertencia
```

---

## 24. SEGURIDAD OPERACIONAL Y LIMITACIONES

**Advertencia principal (banner permanente y en cada resultado):** el aviso operacional obligatorio de la portada.

La app debe advertir que: es una herramienta de referencia/educación; no reemplaza documentos oficiales, POH/AFM, FCOM, manual de operaciones, despacho operacional, información meteorológica oficial, NOTAM, AIP, procedimientos ATC ni instrucciones del piloto al mando; los cálculos pueden ser aproximados; la performance real depende de la aeronave; los datos deben verificarse antes del vuelo; deben revisarse las unidades y la referencia magnética/verdadera; los requisitos de combustible dependen del tipo de operación; las normas pueden actualizarse; y las condiciones reales pueden cambiar en vuelo.

**Niveles, color, icono, ubicación y comportamiento:**

| Nivel | Color | Icono | Ubicación | Comportamiento |
|---|---|---|---|---|
| Info | Azul `#3B82F6` | ℹ️ | Pie de resultado | Solo informa |
| Caution (ámbar) | `#F59E0B` | ⚠️ | Junto al resultado afectado | Muestra advertencia, no bloquea |
| Warning (peligro) | `#EF4444` | ⛔ | Encabezado del resultado | Bloquea el "resultado seguro" y exige revisión |

**Cuándo bloquear vs. solo advertir:**
- **Bloquear (warning rojo):** combustible disponible < mínimo calculado; crosswind > límite introducido; datos que producen resultado sin sentido físico (p. ej. ángulo 0 en TOD).
- **Solo advertir (caution ámbar):** uso de valores normativos "pendientes de validación"; TOC/TOD sin considerar performance real; mezcla posible de referencia magnética/verdadera; tailwind presente.

Cada advertencia tiene texto exacto en `data/warnings.ts` con `{ id, text, level, location, blocking }`.

---

## 25. PRUEBAS Y CRITERIOS DE ACEPTACIÓN

**Cobertura de casos:** datos válidos, incompletos, negativos, fuera de rango, cero, decimales, conversión de unidades, pista opuesta, viento de frente/cola/cruzado, ráfagas, errores matemáticos (división por cero), campos obligatorios, errores de normativa (valor pendiente marcado), pantallas pequeñas, modo oscuro, navegación por teclado, lectores de pantalla, copiado de resultados, reinicio de formularios, historial local, funcionamiento sin conexión.

**Criterios de aceptación por módulo (resumen):**
- **Viento:** los 12 casos de §14.1 pasan; el diagrama y la rosa se dibujan; advertencia de límite funciona.
- **TOC:** caso 2 000→8 000/500 fpm/GS 100 → 12 min, 20 NM.
- **TOD:** FL350→0 (3:1)=105 NM; GS 120 a 3°=600 fpm; comparación de métodos coherente.
- **Tiempos:** 100 NM/120 kt=50 min; sin división por cero.
- **Combustible:** desglose por fase suma el total; alerta si FOB<mínimo; valores normativos etiquetados como pendientes.

**Criterio general:** un módulo **no** se considera terminado si no tiene validaciones y casos de prueba. La **primera versión** no está terminada hasta funcionar correctamente en `localhost`.

---

## 26. PLAN OBLIGATORIO DE EJECUCIÓN LOCAL

### 26.1 Requisitos previos
- Node.js LTS (recomendado **≥ 20.x**) y npm.
- Navegador moderno (Chrome/Edge/Firefox/Safari).
- Editor (Cursor / VS Code).

### 26.2 Creación e instalación
```bash
# Crear proyecto (si parte de cero)
npm create vite@latest vatools -- --template react-ts
cd vatools
npm install
# Dependencias sugeridas
npm install react-router-dom recharts zod
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 26.3 Ejecución en desarrollo
```bash
npm run dev
# Abrir en el navegador:
#   http://localhost:5173
```
Detener: `Ctrl + C` en la terminal.

### 26.4 Build, pruebas y linting
```bash
npm run build      # genera dist/ (versión de producción, fase futura)
npm run preview    # sirve la build localmente
npm run test       # ejecuta Vitest
npm run lint       # revisa el código (si ESLint está configurado)
```

### 26.5 Acceso desde otro dispositivo en la misma red
```bash
npm run dev -- --host
# Abrir en el otro dispositivo: http://IP_DEL_PC:5173
```

### 26.6 Variables de entorno
No se requieren en el MVP (sin backend/API). Si se añaden en el futuro, usar `.env` y **no** subir secretos al repositorio.

### 26.7 Errores frecuentes y solución
- **Puerto ocupado:** Vite ofrece otro puerto o usar `--port 3000`.
- **Node antiguo:** actualizar a LTS.
- **Dependencias corruptas:** `rm -rf node_modules package-lock.json && npm install`.
- **Pantalla en blanco:** revisar consola del navegador y rutas.

### 26.8 Reinstalación limpia
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 26.9 Flujo de validación (10 pasos)
1. Abrir el proyecto. 2. Abrir terminal en la carpeta. 3. `npm install`. 4. `npm run dev`. 5. Abrir `http://localhost:5173`. 6. Probar cada módulo. 7. `npm run test`. 8. Corregir errores. 9. Verificar responsive (móvil/tablet/escritorio). 10. Confirmar que la app local funciona.

**Contenido mínimo de la versión local:** inicio, menú de navegación, calculadoras de viento/TOC/TOD/tiempos/combustible, gráficos, representaciones visuales, validación de campos, mensajes de error, advertencias operacionales, página de metodología y página de fuentes.

> **CRITERIO DE ACEPTACIÓN:** la fase local se completa solo cuando el proyecto se ejecuta con los comandos documentados y la app abre correctamente en `http://localhost:5173` (o `:3000`). **Cursor no debe configurar despliegue público hasta completar esta validación.**

---

## 27. PLAN DE PUBLICACIÓN FUTURA (FASE POSTERIOR)

Solo después de validar la fase local:

- **GitHub:** crear repositorio, subir el código (sin `node_modules`, con `.gitignore`), README actualizado. No exponer secretos ni datos personales.
- **GitHub Pages / Netlify / Vercel:** desplegar la build estática (`dist/`). Para GitHub Pages configurar `base` en `vite.config.ts`. Netlify/Vercel detectan Vite automáticamente (build `npm run build`, publish `dist`).
- **Automatización:** GitHub Actions para build+deploy en cada push a `main`.
- **Dominio:** configurar DNS (CNAME) del proveedor elegido.
- **Actualizaciones:** versionar fórmulas y fuentes; changelog; revisar RAC/AIP periódicamente y actualizar la matriz de fuentes.
- **Analítica respetuosa:** opción de analítica sin cookies/PII (p. ej. Plausible) en fase futura, informando al usuario.
- **Backend futuro (opcional):** solo si se añaden cuentas, sincronización o METAR/TAF; mantener los cálculos client-side.

### 27.1 Despliegue en GitHub Pages (configuración obligatoria)

GitHub Pages sirve la app compilada como web pública en una URL del tipo
`https://USUARIO.github.io/vatools/`. Para que funcione correctamente en una SPA
(single-page application) bajo un subdirectorio, Cursor **debe** aplicar estos tres ajustes:

**a) `vite.config.ts` — definir `base` con el nombre del repositorio:**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // El nombre debe coincidir EXACTAMENTE con el nombre del repositorio en GitHub.
  // Si el repo se llama "vatools", la base es "/vatools/".
  base: '/vatools/',
});
```

**b) Router en modo hash** (GitHub Pages no reescribe rutas del lado servidor, así que
las rutas normales dan 404 al recargar; `HashRouter` lo evita):

```tsx
import { HashRouter } from 'react-router-dom';
// Envolver la app:  <HashRouter> ... </HashRouter>
// Las URLs quedarán como  .../vatools/#/wind , .../vatools/#/fuel
```

**c) GitHub Action de despliegue automático.** Crear el archivo
`.github/workflows/deploy.yml` con este contenido (compila y publica en cada push a `main`):

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**d) Activación en GitHub (una sola vez):** en el repositorio →
`Settings` → `Pages` → *Build and deployment* → *Source* = **GitHub Actions**.
Tras el primer push a `main`, la Action compila y publica; la URL final aparece en
`Settings → Pages` y en el resumen de la Action.

**e) `.gitignore` (imprescindible):** debe incluir al menos `node_modules/`, `dist/`,
`.env*`, `.DS_Store`. Nunca se sube `node_modules` ni secretos.

> **Advertencia de privacidad:** GitHub Pages es **público**; cualquiera con el enlace
> accede a la app. El banner de advertencia operacional (§24) debe estar visible por defecto.
> No incluir datos personales ni información sensible en el repositorio.

---

## 28. FUNCIONES FUTURAS (SEPARADAS DEL MVP)

| Función | Beneficio | Complejidad | Riesgos | Dependencias | Prioridad |
|---|---|---|---|---|---|
| Conversión avanzada de unidades | Comodidad | Baja | Bajo | — | Alta |
| Perfiles/base de datos de aeronaves | Cálculos por avión | Media | Datos de performance | POH/AFM | Alta |
| Exportación a PDF | Reportes | Media | Formato | Lib PDF | Alta |
| PWA / offline avanzado | Uso sin red | Media | Cache/versionado | Service worker | Alta |
| METAR/TAF | Datos reales | Alta | API, disponibilidad | API meteo | Media |
| NOTAM | Info operacional | Alta | Fuentes/licencias | API | Media |
| Mapas / planificación de rutas | Navegación | Alta | Datos geo | Mapas | Media |
| Viento en ruta | Precisión | Media | Datos viento altura | API | Media |
| Registro de vuelos (logbook) | Utilidad piloto | Media | Persistencia | Storage/backend | Media |
| Traducción al inglés | Alcance global | Baja-media | Mantenimiento textos | i18n | Alta |
| Sistema de usuarios / panel admin | Personalización | Alta | Seguridad/privacidad | Backend | Baja |
| Actualización de fuentes normativas | Confiabilidad | Media | Curaduría | Proceso editorial | Alta |

---

## 29. ROADMAP DEL PROYECTO

Cada fase: objetivo, tareas, resultado esperado, dependencias, riesgos, criterios de finalización, entregables para Cursor.

- **Fase 1 — Investigación y diseño.** Objetivo: validar fórmulas y normativa. Resultado: este documento. Criterio: fórmulas verificadas y fuentes citadas. Entregable: documento maestro.
- **Fase 2 — Configuración local.** Objetivo: proyecto Vite+React+TS ejecutable. Resultado: `npm run dev` funciona en `localhost:5173`. Riesgo: entorno Node. Criterio: checklist §3. Entregable: esqueleto + README.
- **Fase 3 — Interfaz principal.** Objetivo: layout, rutas, tema, componentes base y banner de advertencia. Criterio: navegación entre módulos vacía funciona.
- **Fase 4 — Componente de viento.** Objetivo: cálculo + rosa de vientos + diagrama de pista + tests. Criterio: 12 casos §14.1.
- **Fase 5 — TOC, TOD y tiempos.** Objetivo: tres módulos con tests. Criterio: casos §§15–17.
- **Fase 6 — Combustible.** Objetivo: módulo modular por tipo de operación + gráficos + alertas. Criterio: desglose suma total y alerta de déficit.
- **Fase 7 — Gráficos y visualizaciones.** Objetivo: pulir todas las visualizaciones. Criterio: se dibujan en móvil y escritorio.
- **Fase 8 — Pruebas y validación.** Objetivo: cobertura de fórmulas, responsive, accesibilidad. Criterio: §25.
- **Fase 9 — Documentación.** Objetivo: README, fórmulas, fuentes, metodología. Criterio: instalación reproducible.
- **Fase 10 — Publicación pública.** Objetivo: GitHub + hosting. Criterio: build estático desplegado (solo tras fase local).
- **Fase 11 — Funciones futuras.** Según §28.

Dependencias: cada fase depende de la anterior; la publicación (10) depende de la validación local (2–9).

---

## 30. ENTREGABLE FINAL Y PREGUNTAS PENDIENTES

Este documento constituye el entregable maestro: título, nombre, versión, fecha, estado, tabla de contenido, resumen ejecutivo, descripción del producto, público, investigación aeronáutica y normativa, matriz de fuentes, requisitos funcionales y no funcionales, fórmulas y metodología, diseño UX/UI, arquitectura, estructura de carpetas, mapa de pantallas, flujos, modelo de datos, validaciones, casos de prueba, sistema de advertencias, plan de ejecución local, plan de publicación, roadmap, limitaciones, riesgos, criterios de aceptación e instrucciones para Cursor.

**Preguntas pendientes (a resolver con fuente oficial):**
1. Valores exactos de reserva de combustible del **RAC 91** colombiano (VFR diurno/nocturno, IFR) — confirmar en §91.610/91.620.
2. Requisitos de combustible de **RAC 121** y **RAC 135** (contingencia, alterno, reserva final) — confirmar en los PDF oficiales.
3. Densidades de combustible por tipo (Jet A-1, Avgas) para valores por defecto.
4. ¿Se incluye historial local en el MVP o se difiere a V2?
5. ¿Límites de tailwind/crosswind por aeronave se cargan manualmente o desde una base de datos futura?

---

## 31. INSTRUCCIONES PARA CURSOR

Cursor debe usar este documento como especificación principal y seguir estas reglas:

1. Leer todo el documento antes de comenzar.
2. Crear primero el proyecto **local** (Vite + React + TypeScript).
3. Confirmar y justificar la arquitectura técnica propuesta (§20) antes de codificar; **pedir confirmación antes de cambiarla**.
4. Crear inicialmente el **esqueleto visual** (layout, rutas, tema, banner de advertencia).
5. Ejecutar la aplicación en un **navegador local** (`http://localhost:5173`) y confirmarlo.
6. Implementar **un módulo a la vez** (orden del roadmap: viento → TOC → TOD → tiempos → combustible).
7. Mantener **separada la lógica matemática** (`src/core/`) de la interfaz (sin React en `core/`).
8. Escribir **pruebas unitarias para cada fórmula** con los datos de este documento.
9. Usar los **casos de prueba documentados** (§§14–17, 25).
10. Mostrar siempre **fórmula, supuestos, fuente y advertencias** en cada resultado.
11. **No inventar requisitos normativos**; usar los valores del RAC solo tras verificarlos.
12. Marcar como **pendientes** los elementos no verificados ("Pendiente de validación" / "…normativa oficial").
13. **Validar todas las unidades** y conversiones.
14. Comprobar la app en **computador, tablet y teléfono**.
15. Ejecutar la app **localmente antes de cualquier publicación**.
16. **No publicar en GitHub** hasta completar las pruebas locales.
17. Pedir confirmación antes de cambiar la arquitectura.
18. Pedir confirmación antes de modificar supuestos aeronáuticos.
19–22. Mantener actualizados **README, documentación de instalación, de fórmulas y de fuentes**.
23. Corregir primero los **errores críticos**.
24. No considerar terminado un módulo sin **validaciones y casos de prueba**.
25. No considerar terminada la primera versión hasta que **funcione en `localhost`**.
26. Confirmar en el **README** cómo ejecutar la app desde el navegador local.
27. Confirmar en el README **qué comando inicia** la app (`npm run dev`).
28. Confirmar en el README **la dirección localhost** utilizada (`http://localhost:5173`).
29. Confirmar en el README que los **cálculos principales no dependen de un backend**.
30. **Separar claramente la fase local de la fase de publicación pública**.

---

## 32. REGLA FINAL

No se debe escribir el código completo de la aplicación como parte de este documento. Este entregable es exclusivamente de investigación, definición de producto, especificación funcional, fórmulas, diseño UX/UI, arquitectura técnica, modelo de datos, casos de prueba, seguridad operacional, plan de ejecución local, plan de publicación futura, roadmap e instrucciones para Cursor. Es suficientemente completo para que Cursor desarrolle la aplicación desde cero.

La aplicación debe iniciar obligatoriamente con una versión funcional ejecutable en local mediante un navegador web.

> *"La aplicación debe desarrollarse, ejecutarse y validarse inicialmente en local mediante un navegador web. La publicación en GitHub o cualquier servicio de hosting será una fase posterior."*

---

### FUENTES CONSULTADAS

- Aerocivil Colombia — Reglamentos Aeronáuticos de Colombia (RAC): https://www.aerocivil.gov.co/autoridad_aeronautica/normatividad/13-reglamentos-aeronauticos-de-colombia-rac
- RAC 91 (Reglas Generales de Vuelo y Operación): https://aviacion.edu.co/wp-content/uploads/2025/11/RAC-91-Reglas-Generales-de-Vuelo-y-Operacion.pdf
- RAC 121 (Requisitos de Operación — Operaciones Domésticas e Internacionales): https://www.aerocivil.gov.co/normatividad/RAC/RAC%20%20121%20-%20Requisitos%20de%20Operaci%C3%B3n%20-%20Operaciones%20Dom%C3%A9sticas%20-%20Internales-Regulares%20y%20no%20Regulares.pdf
- OACI/ICAO Doc 9976 — Flight Planning and Fuel Management: https://www.unitingaviation.com/livecycle/Documents/ICAO_Doc_9976-1_EN.pdf
- SKYbrary — Fuel/Flight Planning Definitions: https://skybrary.aero/articles/fuel-flight-planning-definitions
- AeroToolbox — Crosswind Calculator: https://aerotoolbox.com/crosswind/
- PilotWorkshop — Quick Crosswind Calculation: https://pilotworkshop.com/tips/quick-crosswind-calculation/
- Wikipedia — Rule of three (aeronautics): https://en.wikipedia.org/wiki/Rule_of_three_(aeronautics)
- Boldmethod — 3-degree descent formulas: https://www.boldmethod.com/learn-to-fly/performance/use-these-formulas-to-calculate-a-three-degree-descent-rate-from-cruise-through-touchdown-approach/
- Pilot Institute — How to Calculate Your Descent: https://pilotinstitute.com/how-to-calculate-descent/
- IVAO — Top of Descent Calculation: https://wiki.ivao.aero/en/home/training/documentation/TOD-Calculation

*Nota: los valores normativos colombianos citados deben confirmarse contra el texto oficial vigente del RAC/AIP antes de cualquier uso operacional.*
