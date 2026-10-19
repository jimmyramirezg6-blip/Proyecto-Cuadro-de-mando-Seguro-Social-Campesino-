# Calidad de datos

## Lo que está bien

- No hay filas duplicadas exactas.
- Las 428 combinaciones geográficas y de género están completas: cada una tiene los 18 estados esperados.
- Las columnas mensuales no tienen vacíos ni valores no numéricos.
- No hay valores negativos en los campos numéricos revisados.

## Hallazgo principal

- `VALOR APORTE JEFE COTIZANTE` está vacío en 7,276 de 7,704 filas.
- Las 428 filas con valor no vacío corresponden exactamente a `JEFE`.
- El valor observado es siempre `2,34`, así que parece un atributo derivado o de contexto muy específico.

## Observaciones de formato

- El archivo viene con codificación `cp1252`.
- Los encabezados con tildes se dañan si se leen con una codificación incorrecta.
- `ZONAS` es un código numérico, pero conviene tratarlo como categórico.
- `TIPO DE SEGURO` no aporta variación en este archivo: siempre es `SSC`.

## Riesgos de interpretación

- Si se usa `VALOR APORTE JEFE COTIZANTE` como una variable general, se va a introducir mucho vacío.
- Si se interpreta `ZONAS` como variable continua, se pierde su sentido real.
- Los totales por mes bajan, pero no todas las provincias siguen la misma dirección.
