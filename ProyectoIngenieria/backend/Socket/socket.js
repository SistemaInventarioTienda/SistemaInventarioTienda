import { Server } from "socket.io";
import { FRONTEND_URL } from "../config.js";
import { getDateCR } from "../libs/date.js";
import { differenceInDays } from "date-fns";
import Product from "../models/product.model.js";
import subcategory from "../models/subcategory.model.js";
import notification from "../models/notification.model.js";
let io;

const UMBRAL_ESTABLECIDO=30;


export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado:", socket.id);

    const interval = setInterval(async () => {
      const status = await getProductStatus();

      const notificaciones = await notification.findAll({
        order: [["IDENTIFICADOR_NOTIFICACION", "DESC"]],
      });
      

      if (status.alerta) {
        const message=JSON.stringify({
            tipo: "Alerta: Stock bajo",
            mensaje: status.mensaje,
            productos: status.productos,
            fecha: status.fecha,
          })

            socket.emit("receive-notification", message);
  
            const esRepetido = mensajeEsRepetidoPeroReciente(message, notificaciones);
  
            if (!esRepetido) {
              await notification.create({
                MENSAJE: message,
                VISTO: 0
              });
            }
          
      }
    }, 1800000);

    socket.on("disconnect", () => {
      console.log("❌ Cliente desconectado:", socket.id);
      clearInterval(interval);
    });
  });
};


//REVISION DE PRODUCTOS

 const getProductStatus = async () => {
    try {
 
        const { rows } = await Product.findAndCountAll({
            attributes: {
                exclude: ['UPDATED_BY_USER', 'CREATED_BY_USER', 'FEC_UPDATE_AT', 'FEC_CREATED_AT', 'ID_SUBCATEGORIA']
            },
            include: [
                {
                    model: subcategory,
                    as: 'subcategory',
                    attributes: ['DSC_NOMBRE', 'ID_SUBCATEGORIA']
                }
            ],
        });

        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron productos.",
            });
        }

        const productosBajoStock = rows.filter(producto => producto.CANTIDAD < UMBRAL_ESTABLECIDO);

        if (productosBajoStock.length > 0) {
            return {
              alerta: true,
              mensaje: `Hay ${productosBajoStock.length} productos con stock bajo.`,
              productos: productosBajoStock.map(p => ({
                nombre: p.DSC_NOMBRE,
                stock: p.CANTIDAD,
              })),
              fecha: (await getDateCR()).toString(),
            };
          }
      
          return { alerta: false };
  
    } catch (error) {
        return { message: error.message };
    }
}




function mensajeEsRepetidoPeroReciente(mensajeNuevo, notificaciones) {
  const nuevo = JSON.parse(mensajeNuevo);

  if (notificaciones.length === 0) {
    return false;
  }

  for (const noti of notificaciones) {
    const msg = JSON.parse(noti.MENSAJE);

    const igualContenido =
      msg.tipo === nuevo.tipo &&
      msg.mensaje === nuevo.mensaje &&
      JSON.stringify(msg.productos) === JSON.stringify(nuevo.productos);

    if (igualContenido) {
      const dias = differenceInDays(
        new Date(),
        new Date(msg.fecha)
      );
      if (dias < 1) return true; 
    }
  }

  return false; 
}


export const getIO = () => io;
