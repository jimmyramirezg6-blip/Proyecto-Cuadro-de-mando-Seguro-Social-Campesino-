# Cuadro de mando SSC

Proyecto para diseñar un cuadro de mando interactivo del Seguro Social Campesino (SSC) orientado a la toma de decisiones directivas.

## Objetivo

Monitorear:
- distribución territorial a nivel nacional, zonal, provincial y cantonal,
- recaudación / aportación mensual estimada,
- demografía de los asegurados.

## Métricas principales

- `Volumen Total de Afiliados`
- `Aportación Mensual Estimada`
- `Ratio de Dependencia`
- `Composición Demográfica`

## Estructura

- `data/ssc_ase_2021_julio1.csv`: fuente cruda.
- `dashboard/`: interfaz estática del cuadro de mando.
- `analysis/`: notas de apoyo y hallazgos iniciales.
- `.opencode/agents/`: agentes especializados para el trabajo con OpenCode.

## Cómo construir el dashboard

1. Ejecuta `& ".venv\Scripts\python.exe" dashboard/build_dashboard.py`.
2. Abre `dashboard/index.html` en el navegador.

En este repositorio, el intérprete local está en `.venv\Scripts\python.exe`.

Si prefieres servirlo localmente:

```powershell
& ".venv\Scripts\python.exe" -m http.server 8000 --directory dashboard
```

Luego abre `http://localhost:8000`.

## Definición de métricas

- `Volumen Total de Afiliados`: suma de afiliados del filtro y del mes seleccionado.
- `Aportación Mensual Estimada`: suma de `VALOR APORTE JEFE COTIZANTE` multiplicado por el volumen de filas `JEFE` del mes seleccionado.
- `Ratio de Dependencia`: dependientes divididos por `JEFE` en el contexto filtrado.
- `Composición Demográfica`: participación porcentual por `GÉNERO` y por `ESTADO (TIPO DE RELACIÓN DEL SUJETO)`.
