# Perfil inicial del CSV

Archivo analizado: `data/ssc_ase_2021_julio1.csv`

## Hallazgos clave

- 7,704 filas y 14 columnas.
- No hay filas duplicadas exactas.
- El dataset forma 428 combinaciones geográficas y de género, y cada una trae los 18 estados completos.
- `TIPO DE SEGURO` es constante (`SSC`) en todo el archivo.
- `VALOR APORTE JEFE COTIZANTE` solo está poblado en 428 filas y todas corresponden a `JEFE`; el valor observado es siempre `2,34`.
- Las columnas mensuales (`2021-01-01` a `2021-07-01`) son numéricas y concentran el análisis principal.

## Calidad de datos

- Único campo con vacíos: `VALOR APORTE JEFE COTIZANTE` con 7,276 nulos.
- No se detectaron valores vacíos en las demás columnas.
- `ZONAS` parece numérica, pero en la práctica funciona como variable categórica codificada.
- Los encabezados con tildes llegaron con codificación dañada en la lectura del archivo, pero los valores del dataset se leen correctamente con `cp1252`.

## Tendencias iniciales

- El total mensual cae de `1,080,151` en enero a `1,061,562` en julio.
- La mayor parte del volumen está en `MANABI` (`29.1%`), seguido por `GUAYAS` (`12.1%`), `LOS RIOS` (`8.4%`), `LOJA` (`7.3%`) y `AZUAY` (`4.9%`).
- `FEMENINO` concentra `53.3%` del total y `MASCULINO` `46.7%`.
- Los estados con más peso son `JEFE` (`41.2%`) e `HIJO (A)` (`36.1%`).
- La caída entre enero y julio se explica sobre todo por `HIJO (A)` y `ESPOSO(A)`; `LOS RIOS` y `PICHINCHA` son las dos provincias grandes que sí crecen en el periodo.

## Outliers visibles

- Los valores máximos aparecen en combinaciones de `MANABI`, sobre todo `CHONE` y `PORTOVIEJO`.
- El mayor valor puntual observado es `12,872` en `JEFE` para `CHONE` (mujeres/varones según la fila correspondiente).

## Siguientes pasos

1. Cruzar provincia, cantón y género para ver concentración territorial.
2. Revisar evolución mensual por estado de relación.
3. Preparar tablas y gráficos de tendencia para el informe final.
