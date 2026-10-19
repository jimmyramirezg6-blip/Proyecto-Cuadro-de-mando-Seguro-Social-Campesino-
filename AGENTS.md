# AGENTS.md

## Estructura de agentes para el cuadro de mando SSC

- `coordinador_analisis`: define el alcance del dashboard, reparte tareas y valida que las métricas del tablero estén alineadas.
- `agente_perfilado_datos`: lee `data/ssc_ase_2021_julio1.csv` y resume esquema, separador `;`, tipos, nulos, duplicados y cardinalidad.
- `agente_calidad_datos`: detecta errores de formato, valores inconsistentes, campos vacíos y riesgos que afecten las métricas del tablero.
- `agente_eda`: hace exploración, cruces, segmentación y búsqueda de patrones para orientar el diseño del dashboard.
- `agente_metricas_negocio`: define y calcula `Volumen Total de Afiliados`, `Aportación Mensual Estimada`, `Ratio de Dependencia` y composición demográfica.
- `agente_visualizacion`: diseña la interfaz del cuadro de mando, los filtros territoriales y la jerarquía de lectura.
- `agente_qa_documentacion`: verifica consistencia, deja supuestos y valida la narrativa final del dashboard.

## Flujo recomendado

1. Perfilado de datos.
2. Revisión de calidad.
3. Análisis exploratorio.
4. Definición y cálculo de métricas.
5. Diseño del dashboard.
6. QA y documentación.
7. Implementación y validación final.

## Reglas del repositorio

- `data/ssc_ase_2021_julio1.csv` es entrada cruda; no lo reescribas ni lo normalices sin pedirlo primero.
- Mantén el formato CSV delimitado por punto y coma al leer o procesar los datos.
- `01_initial_exploration.ipynb` es el artefacto de trabajo actual; úsalo como punto de partida si hace falta explorar.
- Los agentes reales viven en `.opencode/agents/`.
- El entregable principal ya no es un informe estático: es un cuadro de mando interactivo para toma de decisiones directivas.
