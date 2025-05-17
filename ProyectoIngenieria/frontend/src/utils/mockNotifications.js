export const mockNotifications = [
  {
    id: "1",
    message: "Venta realizada: Camiseta Roja - $25.00",
    timestamp: new Date(Date.now() - 1 * 60 * 1000), // Hace 1 minuto
    link: "/ventas/1",
    type: "venta",
    read: false,
  },
  {
    id: "2",
    message: "Compra realizada: Lote de 50 pantalones negros",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
    link: "/compras/2",
    type: "compra",
    read: false,
  },
  {
    id: "3",
    message: "Stock bajo: Zapatos talla 42 - solo quedan 3 unidades",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Hace 3 días
    link: "/productos/zapatos-t42",
    type: "stock-bajo",
    read: true,
  },
]