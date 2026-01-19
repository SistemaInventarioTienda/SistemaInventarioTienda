import { Server } from "socket.io";
import { FRONTEND_URL } from "../config.js";
import Config from "../models/config.model.js";
import Notification from "../models/notification.model.js";
import Product from "../models/product.model.js";
import { Op } from "sequelize";

let io;

const getUmbral = async () => {
  const cfg = await Config.findOne();
  return cfg?.DSC_RANGO_STOCK ?? 32;
};

export const registrarNotificacionesStockBajo = async (productos) => {
  for (const producto of productos) {
    try {
      await Notification.create({
        ID_PRODUCTO: producto.ID_PRODUCT,
        TIPO: "STOCK_BAJO",
        CANTIDAD: producto.CANTIDAD,
      });
    } catch (error) {
      if (error.original?.errno !== 1062) {
        console.error("Error creando notificación:", error);
      }
    }
  }
};

export const getProductosBajoStock = async (umbral) => {
  return await Product.findAll({
    where: {
      CANTIDAD: {
        [Op.lt]: umbral,
      },
    },
    attributes: ["ID_PRODUCT", "DSC_NOMBRE", "CANTIDAD"],
  });
};

const limpiarNotificacionesRecuperadas = async (productosBajoStock) => {
  const idsConStockBajo = productosBajoStock.map((p) => p.ID_PRODUCT);

  await Notification.destroy({
    where: {
      TIPO: "STOCK_BAJO",
      ID_PRODUCTO: {
        [Op.notIn]: idsConStockBajo,
      },
    },
  });
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado");

    const interval = setInterval(async () => {
      try {
        const umbral = await getUmbral();
        const productos = await getProductosBajoStock(umbral);

        if (productos.length === 0) return;

        // Emitir en tiempo real
        for (const producto of productos) {
          socket.emit("receive-notification", {
            tipo: "STOCK_BAJO",
            producto: producto.DSC_NOMBRE,
            cantidad: producto.CANTIDAD,
          });
        }

        // Guardar en BD
        await registrarNotificacionesStockBajo(productos);
        await limpiarNotificacionesRecuperadas(productos);
      } catch (error) {
        console.error("Error en ciclo de notificaciones:", error);
      }
    }, 18000); // 5 minutos

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("Cliente desconectado");
    });
  });
};

export const getIO = () => io;
