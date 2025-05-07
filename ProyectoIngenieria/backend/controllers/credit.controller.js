import { credit, payment, sale } from "../models/sale.model.js";
import Client from "../models/client.model.js";
import phoneClient from "../models/phoneClient.model.js";
import { getDateCR } from "../libs/date.js";
import db from "../db.js";

export const addPayment = async (req, res) => {
  try {
    const { MON_ABONADO } = req.body;
    const date = await getDateCR();
    const creditId = await credit.findOne({
      where: {
        ID_CREDITO: req.params.id,
        ESTADO_CREDITO: 1,
      },
      include: [
        {
          model: sale,
        },
      ],
    });
    console.log("ID del credito por parametro [Controller]", req.params.id);

    if (!creditId) {
      return res.status(204).json({
        message: "Credito no disponible para abonar.",
      });
    }

    if (MON_ABONADO > creditId.MON_PENDIENTE) {
      return res
        .status(400)
        .json({
          message: "El monto a rebajar es mayor que el saldo pendiente",
        });
    }

    if (MON_ABONADO <= 0) {
      return res.status(400).json({ message: "Monto no permitido" });
    }

    const payRegist = new payment({
      ID_CREDITO: creditId.ID_CREDITO,
      FEC_ABONO: date,
      MON_ABONADO,
    });

    const addPay = payRegist.save();

    if (addPay) {
      creditId.MON_PENDIENTE -= MON_ABONADO;
      if(creditId.MON_PENDIENTE === 0){
        creditId.ESTADO_CREDITO = 0;
        // Actualizar el estado de la venta a 1
        const saleToUpdate = await sale.findByPk(creditId.ID_VENTA);
        if(saleToUpdate){
            saleToUpdate.ESTADO = 1;
            await saleToUpdate.save();
        }
      }
      creditId.FEC_ULTIMOPAGO = date;
      await creditId.save();
      res.status(201).json({ message: "Abono registrado Correctamente" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al realizar el abono del credito", error });
  }
};

export const modifyPayment = async (req, res) => {
  try {
    const { MON_ABONADO } = req.body;
    const date = await getDateCR();
    const paymentObj = await payment.findOne({
      where: {
        ID_ABONO: req.params.id,
      },
    });
    if (!paymentObj) {
      return res.status(204).json({
        message: "El Abono seleccionado no se encuentra en el sistema.",
      });
    }

    const fechaAbono = new Date(paymentObj.FEC_ABONO);
    const fechaActual = new Date(await getDateCR());

    const diferenciaMs = Math.abs(fechaActual - fechaAbono);
    const diferenciaMinutos = diferenciaMs / (1000 * 60);

    if (diferenciaMinutos > 30) {
      return res.status(400).json({
        message: "No se puede procesar el abono, tiempo limite excedido.",
      });
    }

    const creditId = await credit.findOne({
      where: {
        ID_CREDITO: paymentObj.ID_CREDITO,
        ESTADO_CREDITO: 1,
      },
    });
    if (!creditId) {
      return res.status(204).json({
        message: "Credito no disponible para abonar.",
      });
    }

    creditId.MON_PENDIENTE += paymentObj.MON_ABONADO;

    if (MON_ABONADO > creditId.MON_PENDIENTE) {
      return res
        .status(400)
        .json({
          message: "El monto a rebajar es mayor que el saldo pendiente",
        });
    }

    if (MON_ABONADO <= 0) {
      return res.status(400).json({ message: "Monto no permitido" });
    }

    paymentObj.FEC_ABONO = date;
    paymentObj.MON_ABONADO = MON_ABONADO;

    const addPay = paymentObj.save();

    if (addPay) {
      creditId.MON_PENDIENTE -= MON_ABONADO;
      if (creditId.MON_PENDIENTE === 0) {
        creditId.ESTADO_CREDITO = 0;
      }
      creditId.FEC_ULTIMOPAGO = date;
      await creditId.save();
      res.status(201).json({ message: "Abono actualizado correctamente" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al realizar el abono del credito", error });
  }
};

export const getCreditById = async (req, res) => {
  try {
    // Validar que el ID sea un número
    const creditID = req.params.id;
    if (!creditID || isNaN(creditID)) {
      return res.status(400).json({ message: "ID de crédito inválido" });
    }

    // Obtener el crédito con sus relaciones
    const response = await credit.findOne({
      where: { ID_CREDITO: creditID },
      include: [
        {
          model: sale,
          attributes: [
            "ID_VENTA",
            "DSC_VENTA",
            "PORCENT_IMPUESTO",
            "MONT_SUBTOTAL",
            "PORCENT_DESCUENTO",
          ],
          include: [
            {
              model: Client,
              attributes: [
                "ID_CLIENTE",
                "DSC_NOMBRE",
                "DSC_APELLIDOUNO",
                "DSC_APELLIDODOS",
              ],
              include: [
                {
                  model: phoneClient,
                  attributes: ["DSC_TELEFONO"],
                },
              ],
            },
          ],
        },
        {
          model: payment,
          attributes: ["ID_ABONO", "FEC_ABONO", "MON_ABONADO"],
        },
      ],
    });

    // Verificar si el crédito existe
    if (!response) {
      return res.status(204).json({ message: "Crédito no encontrado" });
    }

    // Devolver el crédito con sus relaciones
    res.status(200).json(response);
  } catch (error) {
    console.error("Error al obtener el crédito:", error.message);
    res
      .status(500)
      .json({ message: "Error al obtener el crédito", error: error.message });
  }
};

export const getAllPaymentByCredit = async (req, res) => {
    try {
        const { page = 1, pageSize = 5, orderByField = 'FEC_VENCIMIENTO', order = 'desc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = ['FEC_VENCIMIENTO', 'ESTADO_CREDITO', 'MON_PENDIENTE', 'FEC_ULTIMOPAGO'].includes(orderByField) ? orderByField : 'FEC_VENTA';
        //const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
        const sortOrder = typeof order === 'string' && (order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc') ? order : 'asc';

        const { count, rows } = await credit.findAndCountAll({
            attributes: { exclude: [] },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [
                {
                    model: sale,
                    attributes: ['ID_VENTA', 'DSC_VENTA', 'PORCENT_IMPUESTO', 'MONT_SUBTOTAL', 'PORCENT_DESCUENTO'],
                    include: [
                        {
                            model: Client,
                            attributes: ['ID_CLIENTE', 'DSC_NOMBRE', 'DSC_APELLIDOUNO', 'DSC_APELLIDODOS'],
                            include: [
                                {
                                    model: phoneClient,
                                    attributes: ['DSC_TELEFONO']
                                },
                            ]
                        },
                    ]
                },
                {
                    model: payment,
                    attributes: ['ID_ABONO', 'FEC_ABONO', 'MON_ABONADO'],
                }
            ],
            distinct: true
        });

        const updatedRows = await Promise.all(rows.map(async (row) => {
            const creditStatus = await getStatusCredi(row.MON_PENDIENTE, new Date(row.FEC_VENCIMIENTO));
            const updatedPayments = await Promise.all(row.payments.map(async (payment) => {
                const paymentDate = new Date(payment.FEC_ABONO);
                const disableCancelButton = await ThirtyMinutesHavePassed(paymentDate);

                return {
                    ...payment.toJSON(),
                    BTN_CANCEL: disableCancelButton,
                };
            }));

            return {
                ...row.toJSON(),
                ESTADO_CREDITO: creditStatus,
                payments: updatedPayments
            };
        }));

        if (updatedRows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron abonos realizados.",
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            credit: updatedRows,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

async function ThirtyMinutesHavePassed(dateSale) {
  const currentDate = await getDateCR();

  const thirtyMinutesAgo = new Date(currentDate);
  thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

  return dateSale <= thirtyMinutesAgo;
}

async function getStatusCredi(MON_PENDIENTE, FEC_VENCIMIENTO) {
  const fechaActual = new Date(await getDateCR());

  if (MON_PENDIENTE <= 0) return 2;
  if (fechaActual < FEC_VENCIMIENTO) return 0;
  return 1;
}

export const getAllPaymentByCreditByFilter = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, termSearch = "" } = req.query;

    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const [results] = await db.query(
      `CALL Sp_SearchCredits(:termSearch, :page, :pageSize)`,
      {
        replacements: {
          termSearch: `%${termSearch}%`,
          page: parseInt(page),
          pageSize: limit,
        },
      }
    );

    console.log(results.ResultadoJSON);

    if (!results.ResultadoJSON) {
      return res.status(204).json({
        message: "No se encontraron resultados.",
      });
    }

    const toJson = JSON.parse(results.ResultadoJSON);

    const rows = toJson.map((item) => ({
      ...item,
      payments:
        typeof item.payments === "string"
          ? JSON.parse(item.payments)
          : item.payments,
    }));

    const updatedRows = await Promise.all(
      rows.map(async (row) => {
        const creditStatus = await getStatusCredi(
          row.MON_PENDIENTE,
          new Date(row.FEC_VENCIMIENTO)
        );
        const updatedPayments = await Promise.all(
          row.payments.map(async (payment) => {
            const paymentDate = new Date(payment.FEC_ABONO);
            const disableCancelButton = await ThirtyMinutesHavePassed(
              paymentDate
            );

            return {
              ...payment,
              BTN_CANCEL: disableCancelButton,
            };
          })
        );

        return {
          ...row,
          ESTADO_CREDITO: creditStatus,
          payments: updatedPayments,
        };
      })
    );

    if (updatedRows.length === 0) {
      return res.status(204).json({
        message: "No se encontraron abonos realizados.",
      });
    }

    res.json({
      total: updatedRows.length,
      totalPages: Math.ceil(updatedRows.length / limit),
      currentPage: parseInt(page),
      pageSize: limit,
      credit: updatedRows,
    });
  } catch (error) {
    console.error("Error al obtener créditos con abonos:", error);
    return res.status(500).json({ message: error.message });
  }
};
