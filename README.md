# Valero Aviation Tools (`vatools`)

Suite web gratuita de cálculo y planificación básica de vuelo: componente de viento,
Top of Climb (TOC), Top of Descent (TOD), tiempos de vuelo y combustible. Con gráficos,
explicación de fórmulas, validación de datos, advertencias operacionales y trazabilidad
de fuentes.

Aplicación **100% cliente** (React + Vite + TypeScript). Los cálculos principales se
ejecutan en el navegador, **sin backend, sin base de datos y sin registro**.

> ⚠️ **Aviso operacional.** Este proyecto es una **referencia educativa** y **no reemplaza**
> la planificación operacional, el POH/AFM, el FCOM, el manual de operaciones, el despacho
> de vuelo, la información meteorológica oficial, los NOTAM, el AIP, las instrucciones ATC
> ni los requisitos vigentes de Aerocivil. Verifica siempre los datos antes de un vuelo.

---

## Requisitos previos

- **Node.js LTS ≥ 20.x** y **npm** — https://nodejs.org
- Un navegador moderno (Chrome, Edge, Firefox o Safari)

Comprobar versión de Node:

```bash
node -v
npm -v
```

---

## Ejecución local (fase principal)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

Abrir en el navegador: **http://localhost:5173**

Detener la aplicación: `Ctrl + C` en la terminal.

> Los cálculos principales **no dependen de ningún backend**: funcionan sin conexión una vez
> cargada la página.

### Abrir desde otro dispositivo en la misma red (por ejemplo un teléfono)

```bash
npm run dev -- --host
# Luego abrir en el otro dispositivo:  http://IP_DEL_PC:5173
```

---

## Otros comandos

```bash
npm run build      # Genera la versión de producción en dist/ (fase de publicación)
npm run preview    # Sirve localmente la versión compilada
npm run test       # Ejecuta las pruebas unitarias (Vitest)
npm run lint       # Revisa el código (si ESLint está configurado)
```

---

## Reinstalación limpia (si algo falla)

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Errores frecuentes:

- **Puerto ocupado** → Vite ofrece otro puerto, o usar `npm run dev -- --port 3000`.
- **Node antiguo** → actualizar a la versión LTS.
- **Pantalla en blanco** → revisar la consola del navegador y las rutas.

---

## Estructura del proyecto (resumen)

```
vatools/
├── src/
│   ├── routes/        # páginas (Home, Wind, TOC, TOD, Time, Fuel, Sources, About)
│   ├── components/    # UI reutilizable + gráficos
│   ├── core/          # LÓGICA PURA (fórmulas, sin React) + pruebas *.test.ts
│   ├── models/        # tipos e interfaces
│   ├── data/          # fuentes y textos de advertencia
│   └── i18n/          # textos (español; inglés en fase futura)
├── docs/              # Documento maestro y documentación de fórmulas/fuentes
├── .github/workflows/ # deploy.yml (GitHub Pages)
└── README.md
```

La lógica matemática vive en `src/core/` y **no importa React**: cada fórmula es una
función pura con su archivo de pruebas.

---

## Módulos

| Módulo | Qué calcula |
|---|---|
| **Componente de viento** | Headwind / tailwind / crosswind, lado del viento, ráfagas, advertencia de límite |
| **TOC** | Altitud a ganar, tiempo y distancia de ascenso, punto de nivelación |
| **TOD** | Punto de inicio de descenso por tasa, ángulo, regla 3:1 (3°) o personalizado |
| **Tiempos** | Tiempo / distancia / velocidad, conversiones y cálculo con groundspeed |
| **Combustible** | Desglose por fase y tipo de operación, reservas y alerta de déficit |

> Los valores normativos colombianos (reservas de combustible del RAC 91/121/135) están
> marcados como **pendientes de validación oficial** hasta confirmarse contra el texto vigente
> de Aerocivil.

---

## Publicación en GitHub Pages (fase posterior)

**Solo después de validar la ejecución local.**

1. `vite.config.ts` debe tener `base: '/vatools/'` (el nombre del repositorio).
2. El router debe usar `HashRouter`.
3. El archivo `.github/workflows/deploy.yml` publica automáticamente en cada push a `main`.
4. En GitHub: `Settings → Pages → Source = GitHub Actions`.

URL pública resultante:

```
https://TU-USUARIO.github.io/vatools/
```

Cualquier persona (Windows, Mac o teléfono) abre ese enlace sin instalar nada.

> **GitHub Pages es público.** Mantén visible el aviso operacional y no subas datos
> personales ni secretos. `.gitignore` debe excluir `node_modules/`, `dist/` y `.env*`.

---

## Documentación

La especificación completa (investigación, fórmulas, casos de prueba, diseño UX/UI,
arquitectura y roadmap) está en `docs/Documento_Maestro_Valero_Aviation_Tools.md`.

---

## Estado

- [x] Documento maestro de especificación
- [x] Proyecto local ejecutable en `localhost:5173`
- [x] Módulos: viento · TOC · TOD · tiempos · combustible
- [x] Pruebas unitarias por fórmula
- [x] Validación responsive básica y aviso operacional
- [x] Publicación en GitHub Pages (workflow + `base: '/vatools/'` + HashRouter)

## Licencia

Uso educativo. Definir licencia antes de la publicación pública (por ejemplo MIT).
