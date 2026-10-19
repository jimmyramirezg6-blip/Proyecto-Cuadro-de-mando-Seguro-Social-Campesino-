# QA y documentación

## Consistencia revisada

- El archivo tiene 7,704 filas y 14 columnas.
- No hay duplicados exactos.
- Todas las combinaciones geográficas y de género tienen los 18 estados completos.
- El campo `VALOR APORTE JEFE COTIZANTE` solo aparece en filas `JEFE`.

## Supuestos

- `ZONAS` se interpreta como categoría codificada, no como variable continua.
- `TIPO DE SEGURO` se toma como constante en este archivo.
- Los campos mensuales representan conteos comparables entre sí.

## Puntos a vigilar

- Los encabezados con tildes requieren leer el archivo con `cp1252`.
- La caída total no implica caída en todas las provincias.
- Antes de publicar conclusiones, conviene validar el significado de `VALOR APORTE JEFE COTIZANTE`.
