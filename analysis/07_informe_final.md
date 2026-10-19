# Informe de soporte para el dashboard

## Resumen ejecutivo

El CSV `data/ssc_ase_2021_julio1.csv` tiene una estructura limpia y completa para análisis: `7,704` filas, `14` columnas, `0` duplicados exactos y `428` combinaciones geográficas y de género totalmente cubiertas con `18` estados cada una.

El total general cae levemente entre enero y julio (`-18,589`, equivalente a `-1.7%`). La caída se concentra sobre todo en `HIJO (A)`, `ESPOSO(A)` y `CONVIVIENTE`. Solo `LOS RIOS` y `PICHINCHA` crecen en el periodo.

## Qué contiene el archivo

- Variables geográficas: `ZONAS`, `PROVINCIA`, `CANTÓN`.
- Variables de segmentación: `GÉNERO`, `TIPO DE SEGURO`, `ESTADO (TIPO DE RELACIÓN DEL SUJETO)`.
- Un campo especial: `VALOR APORTE JEFE COTIZANTE`.
- Siete columnas mensuales: `2021-01-01` a `2021-07-01`.

## Calidad de datos

- No hay duplicados exactos.
- No hay vacíos en las columnas mensuales ni en las variables principales.
- `VALOR APORTE JEFE COTIZANTE` está vacío en `7,276` filas y solo aparece en `JEFE`.
- `TIPO DE SEGURO` es constante (`SSC`).
- `ZONAS` funciona mejor como categoría codificada que como variable numérica.

## Hallazgos principales

- `MANABI` concentra `29.1%` del volumen total.
- `GUAYAS` concentra `12.1%`.
- `FEMENINO` concentra `53.3%` del total.
- `JEFE` representa `41.2%` y `HIJO (A)` `36.1%`.
- La mayor parte de la caída temporal se explica por `HIJO (A)` (`-12,462` entre enero y julio).
- `JEFE` se mantiene casi plano y ayuda a sostener el total.

## Lectura territorial

- La concentración más fuerte está en `MANABI`, con máximos visibles en `CHONE` y `PORTOVIEJO`.
- La caída general no es uniforme: algunas provincias grandes bajan, pero `LOS RIOS` y `PICHINCHA` suben.
- Por zonas, `4` es la de mayor volumen y también la que más pesa en la evolución general.

## Conclusión

El archivo está listo para un análisis más profundo sin necesidad de limpieza pesada. La historia principal no es un problema de calidad, sino de concentración y evolución: unos pocos territorios y estados explican casi todo el volumen, y la baja leve del periodo se debe sobre todo a `HIJO (A)`.

## Recomendación siguiente

Seguir con cruces más finos por `provincia x cantón x género x estado` y revisar si la caída de `HIJO (A)` es homogénea o si se concentra en territorios concretos.
