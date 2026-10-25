# Mr. Tacos

Aplicación para meseros que coordina el servicio en el local de un restaurante de tres tiempos (entrada, plato fuerte y postre). Cada mesero lleva hasta 5 mesas y controla cada platillo por separado en un tablero tipo Kanban.

## Tecnologías

- React + Vite (plantilla de JavaScript con ESLint)
- React Router para las rutas
- Context API para el estado global de las órdenes
- styled-components para los estilos
- json-server como API local, consumida con `fetch`
- Vitest + React Testing Library para las pruebas

## Instalación

```bash
npm install
```

La app necesita dos terminales:

```bash
npm run api   # API en http://localhost:3000
npm run dev   # App en http://localhost:5173
```

## Pruebas y lint

```bash
npm test
npm run lint
```

Las pruebas no necesitan la API: usan una versión falsa en memoria (`src/tests/apiFalsa.js`).

## Uso

- **Mesas (`/mesa/:numero`)**: pestañas de las mesas 1 a 5. Un punto tinto indica que la mesa tiene una alerta. Debajo está el tablero con tres columnas: Ordenado, Entregado y Terminado. Los platillos se ordenan por tiempo de comida (entrada, plato fuerte, postre y bebidas) y después por hora de ingreso.
- **Cambiar de etapa**: cada tarjeta tiene un selector de etapa. Mientras está en Ordenado se puede quitar de la orden.
- **Temporizador**: arranca al pasar a Entregado. Dura 10 minutos para la entrada, 20 para el plato fuerte y 10 para el postre. Las bebidas no llevan temporizador. Se guarda la hora de entrega, así que si se recarga la página sigue donde iba.
- **Alerta**: cuando se cumple el tiempo, la tarjeta se pinta en tinto con el aviso "¡Revisa la mesa!". Se quita con el botón "Quitar alerta" o al pasar el platillo a Terminado.
- **Agregar platillos (`/mesa/:numero/agregar`)**: menú por tiempo con botones + y − para la cantidad.
- **Cobrar**: aparece cuando todos los platillos de la mesa están en Terminado. Genera el ticket y deja la mesa libre.
- **Log (`/log`)**: tickets del día, con selector de fecha para consultar días anteriores. Cada ticket (`/log/:id`) muestra mesa, hora de apertura y de cobro, platillos, subtotal, IVA y total. Los precios ya incluyen IVA.

## Menú

| Tiempo | Platillos | Precio |
| --- | --- | --- |
| Entradas | Marlin en escabeche, Frijoles puercos, Guacamole | $120 |
| Platos fuertes | Chorreada de carne asada, Orden de 3 tacos de carne asada, Quesadilla de carne asada | $150 |
| Postres | Flan, Brownie con helado de vainilla, Sundae con papas fritas | $100 |
| Bebidas | Agua de jamaica (1 L), Agua de cebada (1 L), Coca-Cola (600 ml) | $40 |

El menú vive en `db.json`, así que se puede cambiar sin tocar el código.

## API (json-server)

| Recurso | Uso |
| --- | --- |
| `GET /menu` | Platillos y precios |
| `GET /ordenes` | Platillos abiertos de todas las mesas |
| `POST /ordenes` | Agregar un platillo a una mesa |
| `PATCH /ordenes/:id` | Cambiar etapa, hora de entrega o quitar alerta |
| `DELETE /ordenes/:id` | Quitar un platillo o liberar la mesa al cobrar |
| `GET /tickets?fecha=AAAA-MM-DD` | Tickets de un día para el log |
| `GET /tickets/:id` | Detalle de un ticket |
| `POST /tickets` | Guardar el ticket al cobrar |

## Estructura

```
db.json         Datos de la API (menú, órdenes y tickets)
src/
  components/   Encabezado, MarcaDeAgua, IconoFilete, PestanasMesas, ColumnaEtapa, TarjetaPlatillo, Botones
  context/      OrdenesContext y OrdenesProvider con el estado y las acciones
  data/         Mesas, etapas, tiempos de comida e IVA
  hooks/        useOrdenes y useAhora (reloj que se actualiza cada segundo)
  pages/        Tablero, AgregarPlatillos, Log y Ticket
  services/     Llamadas a la API con fetch
  tests/        Pruebas con Vitest + React Testing Library
  utils/        Fechas, temporizador, orden y totales de platillos
```
