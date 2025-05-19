import { getDateCR } from "../libs/date.js";
import Config from "../models/config.model.js";
import db from "../db.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { QueryTypes } from "sequelize";
import XLSX from "xlsx";
import { rejects } from "assert";
import { object } from "zod";

// See page sizes
// https://pdfkit.org/docs/paper_sizes.html

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const downloadLink = 'http://localhost:4000/api/reports/download_report?file='
const pdfDir = path.join(__dirname, "../uploads/pdf");
const excelDir = path.join(__dirname, "../uploads/excel");
// Create routes if they do not exist
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

export const createReport = async (req, res) => {
  const { EXTENSION = "", TYPE = "", MIN_FEC = "", MAX_FEC = "" } = req.body;

  // validate extension {PDF / EXCEL}
  if (EXTENSION === "" || (EXTENSION !== "pdf" && EXTENSION !== "xlsx"))
    return res
      .status(400)
      .json({
        message: "El formato a generar no es valido. Debe ser pdf o excel",
      });

  // validate dates
  const min_f = validateDate(MIN_FEC);
  const max_f = validateDate(MAX_FEC);
  if (!min_f.isValid || !max_f.isValid) {
    const message =
      "La fecha de inicio " +
      min_f.message +
      " y la fecha de corte " +
      max_f.message;
    return res.status(400).json({ message: message });
  }

  const currentDate = await getDateCR();
  const store = await Config.findAll();
  if (EXTENSION === "pdf") {
    try {
      const outputPDF = await switchPDF(
        store,
        currentDate,
        TYPE,
        MIN_FEC,
        MAX_FEC
      );
      return res.status(outputPDF.status).json(outputPDF.data);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      return res
        .status(500)
        .json({ message: "Error interno al generar el PDF." });
    }
  } else if (EXTENSION === "xlsx") {
    try {
      const outputExcel = await switchEXCEL(
        store,
        currentDate,
        TYPE,
        MIN_FEC,
        MAX_FEC
      );
      return res.status(outputExcel.status).json(outputExcel.data);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      return res
        .status(500)
        .json({ message: "Error interno al generar el PDF." });
    }
  }

  return res
    .status(400)
    .json({
      message: "El formato a generar no es valido. Debe ser pdf o excel",
    });
};

export const downloadReport = async (req, res) => {
  const fileName = req.query.file;
  if (!fileName) {
    return res.status(400).json({ error: "Nombre del archivo es requerido" });
  }

  let filePath;
  if (fileName.endsWith(".pdf")) {
    filePath = path.join(pdfDir, fileName);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="' + fileName + '"');
  } else if (fileName.endsWith(".xlsx")) {
    filePath = path.join(excelDir, fileName);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'inline; filename="' + fileName + '"'); // Intentando visualización inline
  } else {
    return res.status(400).json({ error: "Formato de archivo no soportado." });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Archivo no encontrado." });
  }

  try {
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (err) => {
      console.error("Error al leer el archivo:", err);
      res.status(500).json({ error: "Error al leer el archivo." });
    });
  } catch (error) {
    console.error("Error inesperado al descargar el archivo:", error);
    res
      .status(500)
      .json({ error: "Error inesperado al descargar el archivo." });
  }
};

function validateDate(dateString) {
  const validFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  if (!validFormat) {
    return {
      isValid: false,
      message: "tiene un formato inválido. Debe ser AAAA-MM-DD.",
    };
  }

  const dateObject = new Date(dateString);
  if (isNaN(dateObject.getTime())) {
    return { isValid: false, message: "proporcionada no es válida." };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  dateObject.setHours(0, 0, 0, 0);

  if (dateObject > today) {
    return { isValid: false, message: "no puede ser futura." };
  }

  return { isValid: true, message: "es válida." };
}

// Function to create a PDF SALE
export async function createReceiptPDF(currentDate, storeData, saleData) {
  return new Promise((resolve, reject) => {
    const title = "***Recibo***";

    const pageWidthPoints = 227;
    const pageHeightPoints = 623;
    const margin = 10;
    let currentY = margin;

    const doc = new PDFDocument({
      size: [pageWidthPoints, pageHeightPoints]
    });
    const fileName = `Recibo-${formatDateTime(currentDate)}.pdf`;
    const filePath = path.join(pdfDir, 'Recibos', fileName);
    if (!fs.existsSync(path.join(pdfDir, 'Recibos'))) {
      fs.mkdirSync(path.join(pdfDir, 'Recibos'), { recursive: true });
    }
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Store Information (Header)
    doc
      .fontSize(10)
      .text(storeData.DSC_NOMBRE, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 12; // Space after name

    doc
      .fontSize(8)
      .text(`Teléfono: ${storeData.NUM_TELEFONO}`, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 10; // Space after phone

    doc
      .fontSize(8)
      .text(storeData.DSC_CORREO, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 10; // Space after email

    doc
      .fontSize(8)
      .text(storeData.DSC_DIRECCION, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 10; // Space after direction

    doc
      .fontSize(9)
      .text(storeData.DSC_ESLOGAN, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
        italic: true,
      });
    currentY += 20; // Space after slogan

    // Title
    doc
      .fontSize(12)
      .text(title, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15; // Space after title

    // Sale Details Table Header
    currentY += 5;
    doc.fontSize(7).text("Producto", margin, currentY, { width: 80 });
    doc.text("Cant.", margin + 85, currentY, { width: 30, align: "right" });
    doc.text("Precio U.", margin + 120, currentY, {
      width: 45,
      align: "right",
    });
    doc.text("Total", pageWidthPoints - margin - 40, currentY, {
      width: 40,
      align: "right",
    });
    currentY += 8;
    doc
      .strokeColor("#000")
      .lineWidth(0.5)
      .moveTo(margin, currentY)
      .lineTo(pageWidthPoints - margin, currentY)
      .stroke();
    currentY += 3;

    // Sale Details Table Rows
    let subtotalProducts = 0;
    saleData.details.forEach(item => {
      const totalItem = item.CANTIDAD * item.MONT_UNITARIO;
      doc.fontSize(7).text(item.Product.DSC_NOMBRE, margin, currentY, { width: 80 });
      doc.text(item.CANTIDAD.toString(), margin + 85, currentY, { width: 30, align: 'right' });
      doc.text(item.MONT_UNITARIO.toFixed(2), margin + 120, currentY, { width: 45, align: 'right' });
      doc.text(totalItem.toFixed(2), pageWidthPoints - margin - 40, currentY, { width: 40, align: 'right' });
      currentY += 8;
      if (currentY > pageHeightPoints - 50) {
        doc.addPage({ size: [pageWidthPoints, pageHeightPoints] });
        currentY = margin + 10;
        // Optionally add header again on new page
      }
      subtotalProducts += totalItem;
    });

    // Separator before totals
    currentY += 5;
    doc
      .strokeColor("#000")
      .lineWidth(0.5)
      .moveTo(margin, currentY)
      .lineTo(pageWidthPoints - margin, currentY)
      .stroke();
    currentY += 5;

    // Totals
    const subTotal = subtotalProducts;
    const discount = subTotal * (saleData.PORCENT_DESCUENTO / 100);
    const tax = (subTotal - discount) * (saleData.PORCENT_IMPUESTO / 100);
    console.log(subTotal, discount, tax);

    doc
      .fontSize(8)
      .text("Subtotal:", margin, currentY, {
        align: "right",
        width: pageWidthPoints - margin - 50,
      });
    doc.text(subTotal.toFixed(2), pageWidthPoints - margin - 40, currentY, {
      align: "right",
      width: 40,
    });
    currentY += 8;

    doc
      .fontSize(8)
      .text(`Impuesto (${saleData.PORCENT_IMPUESTO}%):`, margin, currentY, {
        align: "right",
        width: pageWidthPoints - margin - 50,
      });
    doc.text(tax.toFixed(2), pageWidthPoints - margin - 40, currentY, {
      align: "right",
      width: 40,
    });
    currentY += 8;

    doc.fontSize(8).text(`Descuento (${saleData.PORCENT_DESCUENTO}%):`, margin, currentY, { align: 'right', width: pageWidthPoints - margin - 50 });
    doc.text(`-${discount.toFixed(2)}`, pageWidthPoints - margin - 40, currentY, { align: 'right', width: 40 });
    currentY += 8;

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("Total: ", margin, currentY, {
        align: "right",
        width: pageWidthPoints - margin - 50,
      });
    doc.text(
      (subTotal - discount + tax).toFixed(2),
      pageWidthPoints - margin - 40,
      currentY,
      { align: "right", width: 40 }
    );
    doc.font("Helvetica");
    currentY += 12;

    // Customer and Payment Information
    doc.fontSize(8).text(`Cliente: ${saleData.client?.DSC_NOMBRE || "Anónimo"}`, margin, currentY, { width: pageWidthPoints - 2 * margin });
    currentY += 8;
    doc.fontSize(8).text(`Fecha: ${new Date(saleData.FEC_VENTA).toLocaleDateString()} ${new Date(saleData.FEC_VENTA).toLocaleTimeString()}`, margin, currentY, { width: pageWidthPoints - 2 * margin });
    currentY += 8;
    doc.fontSize(8).text(`Método de Pago: ${saleData.METODO_PAGO}`, margin, currentY, { width: pageWidthPoints - 2 * margin });
    currentY += 8;
    if (saleData.DSC_VENTA) {
      doc.fontSize(8).text(`Nota: ${saleData.DSC_VENTA}`, margin, currentY, { width: pageWidthPoints - 2 * margin });
      currentY += 8;
    }
    if (saleData.ESTADO_CREDITO === 0) {
      doc.fontSize(8).text('Estado: Cancelado', margin, currentY, { width: pageWidthPoints - 2 * margin });
      currentY += 8;
    } else {
      doc.fontSize(8).text('Estado: Pendiente', margin, currentY, { width: pageWidthPoints - 2 * margin });
      currentY += 8;
    }

    // Footer (Optional)
    currentY += 15;
    doc
      .fontSize(6)
      .text("Gracias por su compra!", margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });

    doc.end();

    writeStream.on("finish", () => {
      resolve({
        status: 200,
        data: {
          message: "PDF generado exitosamente",
          downloadLink: `${downloadLink}Recibos/${fileName}`,
          filename: fileName
        }
      });
    });

    writeStream.on("error", (error) => {
      console.error("Error en writeStream:", error);
      reject({ status: 500, data: { error: "Error al generar el PDF." } });
    });
  });
}

function formatDateTime(fechaHora) {
  return fechaHora.replace(/[:\s]/g, "-");
}

async function switchPDF(store, currentDate, type, MIN_FEC, MAX_FEC) {
  switch (type) {
    case "ComprasXProveedor":
      const [shoppingBySupplier] = await db.query(
        "CALL getShoppingsReport(:MIN_FEC, :MAX_FEC)",
        {
          replacements: {
            MIN_FEC: MIN_FEC,
            MAX_FEC: MAX_FEC,
          },
          type: QueryTypes.SELECT,
        }
      );
      return await createShoppingPDF(
        currentDate,
        store[0],
        shoppingBySupplier,
        MIN_FEC,
        MAX_FEC
      );
    case "VentasXCliente":
      const [salesByClient] = await db.query(
        "CALL getSaleReport(:MIN_FEC, :MAX_FEC)",
        {
          replacements: {
            MIN_FEC: MIN_FEC,
            MAX_FEC: MAX_FEC,
          },
          type: QueryTypes.SELECT,
        }
      );
      return await createSalePDF(
        currentDate,
        store[0],
        salesByClient,
        MIN_FEC,
        MAX_FEC
      );

    case "ReporteTransaccion":
      const [TransactionReport] = await db.query(
        "CALL getTransactionReport(:MIN_FEC_TRANSACCION, :MAX_FEC_TRANSACCION)",
        {
          replacements: {
            MIN_FEC_TRANSACCION: MIN_FEC,
            MAX_FEC_TRANSACCION: MAX_FEC,
          },
          type: QueryTypes.SELECT,
        }
      );
      return await createTransactionPDF(
        currentDate,
        store[0],
        TransactionReport,
        MIN_FEC,
        MAX_FEC
      );
    case 'ReporteProductos':
      const [products] = await db.query(
        "CALL sp_products_report(:MIN_FEC, :MAX_FEC)",
        {
          replacements: {
            MIN_FEC: MIN_FEC,
            MAX_FEC: MAX_FEC,
          },
          type: QueryTypes.SELECT
        }
      )
      return await createProductPDF(
        currentDate, store[0], products
      );
    case "ProveedoresActivos":
      const [supplierReport] = await db.query(
        'CALL sp_getSupplierReport()',
        {
          type: QueryTypes.SELECT
        });


      const rawData = Object.values(supplierReport);

      const parsedResults = rawData.map((supplier) => {
        let compras = [];

        try {
          if (supplier.compras != null) {
            let fixedComprasStr = `[${supplier.compras}]`.replace(/},\s*{/g, '},{');
            compras = JSON.parse(fixedComprasStr);
          }
        } catch (err) {
          console.error("Error al parsear compras para proveedor:", supplier.proveedor_nombre, err);
        }

        return {
          proveedor_nombre: supplier.proveedor_nombre,
          direccion: supplier.DSC_DIRECCIONEXACTA,
          telefonos: supplier.telefonos,
          correos: supplier.correos,
          compras: compras
        };
      });
      return await createSupplierPDF(currentDate, store[0], parsedResults);
    case "ClientesCreditoActivo":

      const [credit_Client] = await db.query(`CALL sp_getClientCreditReport(:MIN_FEC, :MAX_FEC);`, {
        replacements: { MIN_FEC: MIN_FEC, MAX_FEC: MAX_FEC },
        type: db.QueryTypes.SELECT,
      });
      if (!credit_Client || !credit_Client[0] || Object.keys(credit_Client[0]).length === 0) {
        return res.status(204).json({ message: "No se encontraron clientes con créditos." });
      }

      const data_client = Object.values(credit_Client);

      const client_Parsed = data_client.map((client) => {
        let creditos = [];

        try {
          if (client.creditos_json != null) {
            let fixedCreditosStr = `[${client.creditos_json}]`.replace(/},\s*{/g, '},{');
            creditos = JSON.parse(fixedCreditosStr);
          }
        } catch (err) {
          console.error("Error al parsear créditos para cliente:", client.cliente_nombre, err);
        }

        return {
          cedula: client.DSC_CEDULA,
          nombre: client.cliente_nombre,
          direccion: client.DSC_DIRECCION,
          telefono: client.telefono,
          creditos: creditos,
          cantidad_creditos: client.cantidad_creditos,
          saldo_total_Pendiente: client.saldo_total_Pendiente,
          abonos_total_Pagado: client.abonos_total_Pagado
        };
      });

      return await createClientCreditPDF(currentDate, store[0], client_Parsed, MIN_FEC, MAX_FEC);
    default:
      return {
        status: 400,
        data: { error: "Informe no valido para generar." },
      };
  }
}

async function createShoppingPDF(
  currentDate,
  storeData,
  shoppingData,
  MIN_FEC,
  MAX_FEC
) {
  return new Promise((resolve, reject) => {
    const title = "Informe de Compras por Proveedor";
    const pageWidthPoints = 595.28;
    const pageHeightPoints = 841.89;
    const margin = 20;
    let currentY = margin + 20;
    let totalGastadoPeriodo = 0;

    const doc = new PDFDocument({
      size: "A4",
    });
    const fileName = `Compras-${formatDateTime(currentDate)}.pdf`;
    const filePath = path.join(pdfDir, "Compras", fileName);
    if (!fs.existsSync(path.join(pdfDir, "Compras"))) {
      fs.mkdirSync(path.join(pdfDir, "Compras"), { recursive: true });
    }
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Encabezado del informe
    doc
      .fontSize(12)
      .text(storeData.DSC_NOMBRE, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15;
    doc
      .fontSize(10)
      .text(title, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15;
    doc
      .fontSize(8)
      .text(`Periodo del informe: ${MIN_FEC} al ${MAX_FEC}`, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 12;
    doc
      .fontSize(8)
      .text(`Reporte generado: ${currentDate}`, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15; // Espacio después de la fecha del reporte

    // Convertir el objeto shoppingData a un array
    const comprasArray = Object.values(shoppingData);

    // Agrupar compras por proveedor
    const comprasPorProveedor = comprasArray.reduce((acc, compra) => {
      const proveedor = compra.PROVEEDOR;
      if (!acc[proveedor]) {
        acc[proveedor] = {
          nombre: proveedor,
          telefono: compra.TEL_PROVEEDOR,
          compras: [],
        };
      }
      acc[proveedor].compras.push({
        fecha: compra.FEC_COMPRA,
        total: compra.MON_TOTAL,
        productos: compra.PRODUCTOS.split(",").map((p) => p.trim()),
        cantidades: compra.CANTIDADES.split(",").map((c) => c.trim()),
      });
      return acc;
    }, {});

    // Tabla de compras por proveedor
    const tableTop = currentY;
    let rowY = tableTop;
    const proveedorX = margin;
    const telefonoX = proveedorX + 150;
    const fechaX = telefonoX + 150;
    const productoX = margin + 10;
    const cantidadX = productoX + 150;
    const montoX = pageWidthPoints - margin - 170;

    // Cabecera de la tabla
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("Proveedor", proveedorX, rowY)
      .text("Teléfono", telefonoX, rowY)
      .text("Fecha Compra", fechaX, rowY)
      .text("Monto Total", montoX - 100, rowY, { align: "right" });
    rowY += 12;
    doc
      .strokeColor("#000")
      .lineWidth(0.5)
      .moveTo(margin, rowY)
      .lineTo(pageWidthPoints - margin, rowY)
      .stroke();
    rowY += 5;
    doc.font("Helvetica");

    // Filas de la tabla
    for (const proveedor in comprasPorProveedor) {
      const proveedorData = comprasPorProveedor[proveedor];
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(proveedorData.nombre, proveedorX, rowY);
      doc.text(proveedorData.telefono, telefonoX, rowY);
      rowY += 10;
      doc.font("Helvetica");

      proveedorData.compras.forEach((compra) => {
        doc.fontSize(8).text(compra.fecha, fechaX, rowY);

        const compraStartY = rowY;
        let lastProductY = rowY;

        compra.productos.forEach((producto, index) => {
          doc.fontSize(8).text(`- ${producto}`, productoX, rowY);
          if (compra.cantidades[index]) {
            doc.text(`(${compra.cantidades[index]})`, cantidadX, rowY);
          }
          lastProductY = rowY;
          rowY += 8;
        });

        // Dibujar el monto total después del último producto
        doc
          .fontSize(8)
          .text(compra.total.toFixed(2), montoX, lastProductY, {
            align: "right",
          });
        totalGastadoPeriodo += compra.total;

        const lineY = rowY + 2;
        doc
          .strokeColor("#ccc")
          .lineWidth(0.5)
          .lineJoin("miter")
          .dash(5, { space: 5 })
          .moveTo(margin, lineY)
          .lineTo(pageWidthPoints - margin, lineY)
          .stroke();
        doc.undash();
        rowY += 8;
      });
      doc.moveDown();
    }

    // Mostrar el monto total gastado en el periodo
    currentY = rowY + 15;
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(
        `Monto total del periodo: ${totalGastadoPeriodo.toFixed(2)}`,
        margin,
        currentY,
        { align: "right" }
      );
    doc.font("Helvetica");

    // Línea final del documento
    currentY += 15;
    doc
      .fontSize(8)
      .text("***Ultima linea***", margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });

    doc.end();

    writeStream.on("finish", () => {
      resolve({
        status: 200,
        data: {
          message: "Informe de compras generado exitosamente",
          downloadLink: `${downloadLink}Compras/${fileName}`,
        },
      });
    });

    writeStream.on("error", (error) => {
      console.error("Error al generar el informe de compras:", error);
      reject({
        status: 500,
        data: { error: "Error al generar el informe de compras." },
      });
    });
  });
}

async function createSalePDF(
  currentDate,
  storeData,
  salesData,
  MIN_FEC,
  MAX_FEC
) {
  return new Promise((resolve, reject) => {
    const title = "Informe de Ventas por Cliente";
    const pageWidthPoints = 595.28;
    const pageHeightPoints = 841.89;
    const margin = 20;
    let currentY = margin + 20;
    let totalVentasPeriodo = 0;

    const doc = new PDFDocument({
      size: "A4",
    });
    const fileName = `Ventas-${formatDateTime(currentDate)}.pdf`;
    const filePath = path.join(pdfDir, "Ventas", fileName);
    if (!fs.existsSync(path.join(pdfDir, "Ventas"))) {
      fs.mkdirSync(path.join(pdfDir, "Ventas"), { recursive: true });
    }
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Encabezado del informe
    doc
      .fontSize(12)
      .text(storeData.DSC_NOMBRE, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15;
    doc
      .fontSize(10)
      .text(title, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15;
    doc
      .fontSize(8)
      .text(`Periodo del informe: ${MIN_FEC} al ${MAX_FEC}`, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 12;
    doc
      .fontSize(8)
      .text(`Fecha del Reporte: ${currentDate}`, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 25;

    // Convertir el objeto salesData a un array
    const ventasArray = Object.values(salesData);

    // Agrupar ventas por cliente
    const ventasPorCliente = ventasArray.reduce((acc, venta) => {
      const cliente = venta.CLIENTE || 'Cliente Anónimo';
      if (!acc[cliente]) {
        acc[cliente] = {
          nombre: cliente,
          telefono: venta.TEL_CLIENTE || 'N/A',
          ventas: []
        };
      }
      const subtotal = venta.MONT_SUBTOTAL;
      const descuento = (subtotal * (venta.DESCUENTO / 100));
      const impuesto = (subtotal - descuento) * (venta.PORCENT_IMPUESTO / 100);
      acc[cliente].ventas.push({
        fecha: new Date(venta.FEC_VENTA).toLocaleDateString(),
        total: (venta.ESTADO === 1 && venta.ESTADO_CREDITO === 0) ? subtotal - descuento + impuesto : subtotal,
        productos: venta.PRODUCTOS ? venta.PRODUCTOS.split(',').map(p => p.trim()) : [],
        cantidades: venta.CANTIDADES ? venta.CANTIDADES.split(',').map(c => c.trim()) : [],
        total_abono: venta.TOTAL_ABONOS || 0
      });
      return acc;
    }, {});

    // Tabla de ventas por cliente
    const tableTop = currentY;
    let rowY = tableTop;
    const clienteX = margin;
    const telefonoX = clienteX + 180;
    const fechaX = telefonoX + 120;
    const productoX = margin + 10;
    const cantidadX = productoX + 150;
    const montoX = pageWidthPoints - margin - 70;

    // Cabecera de la tabla
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("Cliente", clienteX, rowY)
      .text("Teléfono", telefonoX, rowY)
      .text("Fecha Venta", fechaX, rowY)
      .text("Monto Total", montoX - 100, rowY, { align: "right" });
    rowY += 12;
    doc
      .strokeColor("#000")
      .lineWidth(0.5)
      .moveTo(margin, rowY)
      .lineTo(pageWidthPoints - margin, rowY)
      .stroke();
    rowY += 5;
    doc.font("Helvetica");

    // Filas de la tabla
    for (const cliente in ventasPorCliente) {
      const clienteData = ventasPorCliente[cliente];
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(clienteData.nombre, clienteX, rowY);
      doc.text(clienteData.telefono, telefonoX, rowY);
      rowY += 10;
      doc.font("Helvetica");

      clienteData.ventas.forEach((venta) => {
        doc.fontSize(8).text(venta.fecha, fechaX, rowY);

        const ventaStartY = rowY;
        let lastProductY = rowY;

        venta.productos.forEach((producto, index) => {
          doc.fontSize(8).text(`- ${producto}`, productoX, rowY);
          if (venta.cantidades[index]) {
            doc.text(`(${venta.cantidades[index]})`, cantidadX, rowY);
          }
          lastProductY = rowY;
          rowY += 8;
        });

        if (venta.total_abono === 0) {
          doc.fontSize(8).text(venta.total.toFixed(2), montoX - 175, lastProductY, { align: 'right' });
          totalVentasPeriodo += venta.total;
        } else {
          doc.fontSize(8).text(venta.total_abono.toFixed(2) + " / " + venta.total.toFixed(2), montoX - 175, lastProductY, { align: 'right' });
          totalVentasPeriodo += venta.total_abono;
        }


        const lineY = rowY + 2;
        doc
          .strokeColor("#ccc")
          .lineWidth(0.5)
          .lineJoin("miter")
          .dash(5, { space: 5 })
          .moveTo(margin, lineY)
          .lineTo(pageWidthPoints - margin, lineY)
          .stroke();
        doc.undash();
        rowY += 8;
      });
      doc.moveDown();
    }

    // Mostrar el monto total de ventas en el periodo
    currentY = rowY + 15;
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(
        `Monto total del periodo: ${totalVentasPeriodo.toFixed(2)}`,
        margin,
        currentY,
        { align: "right" }
      );
    doc.font("Helvetica");

    // Línea final del documento
    currentY += 15;
    doc
      .fontSize(8)
      .text("***Ultima linea***", margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });

    doc.end();

    writeStream.on("finish", () => {
      resolve({
        status: 200,
        data: {
          message: "Informe de ventas por cliente generado exitosamente",
          downloadLink: `${downloadLink}Ventas/${fileName}`,
        },
      });
    });

    writeStream.on("error", (error) => {
      console.error("Error al generar el informe de ventas:", error);
      reject({
        status: 500,
        data: { error: "Error al generar el informe de ventas." },
      });
    });
  });
}

async function createTransactionPDF(currentDate, storeData, transactionsData, MIN_FEC, MAX_FEC) {
  return new Promise((resolve, reject) => {
    const title = "Informe de Transacciones SINPE";
    const pageWidthPoints = 595.28; // A4 width in points
    const pageHeightPoints = 841.89; // A4 height in points
    const margin = 20;
    let currentY = margin + 20;
    let totalEgresos = 0;

    const doc = new PDFDocument({ size: 'A4' });
    const fileName = `Transacciones-${formatDateTime(currentDate)}.pdf`;
    const filePath = path.join(pdfDir, 'Transacciones', fileName);

    if (!fs.existsSync(path.join(pdfDir, 'Transacciones'))) {
      fs.mkdirSync(path.join(pdfDir, 'Transacciones'), { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Encabezado del informe
    doc.fontSize(12).text(storeData.DSC_NOMBRE, margin, currentY, {
      align: 'center',
      width: pageWidthPoints - 2 * margin
    });
    currentY += 15;
    doc.fontSize(10).text(title, margin, currentY, {
      align: 'center',
      width: pageWidthPoints - 2 * margin
    });
    currentY += 15;
    doc.fontSize(8).text(`Periodo del informe: ${MIN_FEC} al ${MAX_FEC}`, margin, currentY, {
      align: 'center',
      width: pageWidthPoints - 2 * margin
    });
    currentY += 12;
    doc.fontSize(8).text(`Reporte generado: ${currentDate}`, margin, currentY, {
      align: 'center',
      width: pageWidthPoints - 2 * margin
    });
    currentY += 15;

    // Tabla de transacciones
    const tableTop = currentY;
    let rowY = tableTop;

    const fechaX = margin;
    const descripcionX = fechaX + 120;
    const metodoX = descripcionX + 130;
    const montoX = pageWidthPoints - margin - 100;

    // Cabecera de tabla
    doc.fontSize(9).font('Helvetica-Bold')
      .text('Fecha', fechaX, rowY)
      .text('Descripción', descripcionX, rowY)
      .text('Método Entrada', metodoX, rowY)
      .text('Monto', montoX, rowY, { align: 'right' });

    rowY += 12;
    doc.strokeColor('#000').lineWidth(0.5)
      .moveTo(margin, rowY)
      .lineTo(pageWidthPoints - margin, rowY)
      .stroke();
    rowY += 5;
    doc.font('Helvetica');

    // Convertir objeto a array si es necesario
    const transactionsArray = toArrayList(transactionsData);

    // Validar que transactionsData sea un array
    if (!Array.isArray(transactionsArray)) {
      console.error("transactionsData no es un array:", transactionsArray);
      return reject({
        status: 500,
        data: { error: "Datos de transacciones inválidos." }
      });
    }

    // Dibujar filas
    transactionsArray.forEach(transaccion => {
      // Si se acaba el espacio, agregar nueva página
      if (rowY > pageHeightPoints - 40) {
        doc.addPage();
        rowY = margin + 20;

        // Redibujar encabezado en nueva página
        doc.fontSize(9).font('Helvetica-Bold')
          .text('Fecha', fechaX, rowY)
          .text('Descripción', descripcionX, rowY)
          .text('Método Entrada', metodoX, rowY)
          .text('Monto', montoX, rowY, { align: 'right' });
        rowY += 12;

        doc.strokeColor('#000').lineWidth(0.5)
          .moveTo(margin, rowY)
          .lineTo(pageWidthPoints - margin, rowY)
          .stroke();
        rowY += 5;
        doc.font('Helvetica');
      }

      // Formatear fecha
      const formattedDate = formatDate(transaccion.FEC_TRANSACCION);

      // Establecer color según método de pago
      if (transaccion.METODO_PAGO === 'Efectivo') {
        doc.fillColor('green'); // Efectivo en verde
      } else if (transaccion.METODO_PAGO === 'Tarjeta') {
        doc.fillColor('blue'); // Tarjeta en azul
      } else {
        doc.fillColor('black'); // Otros en negro
      }

      // Mostrar datos de la transacción
      doc.fontSize(8)
        .text(formattedDate || '--', fechaX, rowY)
        .text(transaccion.DSC_TRANSACCION || '--', descripcionX, rowY)
        .text(transaccion.METODO_PAGO || '--', metodoX, rowY)
        .text(parseFloat(transaccion.MONTO_PAGO || 0).toFixed(2), montoX, rowY, { align: 'right' });

      // Restaurar color predeterminado
      doc.fillColor('black');

      // Acumular totales (todas son salidas)
      totalEgresos += parseFloat(transaccion.MONTO_PAGO || 0);

      rowY += 15;
    });

    // Totales
    currentY = rowY + 15;
    doc.fontSize(10).font('Helvetica-Bold')
      .text(`Total Transferencias: ${transactionsArray.length}`, margin, currentY)
      .text(`Monto Total Enviado: ${totalEgresos.toFixed(2)}`, margin + 200, currentY)
      .text(
        `Promedio por Envío: ${(totalEgresos / transactionsArray.length || 0).toFixed(2)}`,
        margin + 400,
        currentY,
        { align: 'right' }
      );
    doc.font('Helvetica');

    // Pie de página
    currentY += 20;
    doc.fontSize(8).text('*** Última línea ***', margin, currentY, {
      align: 'center',
      width: pageWidthPoints - 2 * margin
    });

    doc.end();

    writeStream.on("finish", () => {
      resolve({
        status: 200,
        data: {
          message: `${title} generado exitosamente`,
          downloadLink: `${downloadLink}Transacciones/${fileName}`
        }
      });
    });

    writeStream.on("error", (error) => {
      console.error("Error al generar el informe de transacciones:", error);
      reject({ status: 500, data: { error: "Error al generar el informe de transacciones." } });
    });
  });
}

async function createShoppingEXCEL(
  currentDate,
  storeData,
  shoppingData,
  MIN_FEC,
  MAX_FEC
) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `Compras-${formatDateTime(currentDate)}.xlsx`;
      const filePath = path.join(excelDir, "Compras", fileName);
      if (!fs.existsSync(path.join(excelDir, "Compras"))) {
        fs.mkdirSync(path.join(excelDir, "Compras"), { recursive: true });
      }

      const comprasArray = Object.values(shoppingData).reduce((acc, compra) => {
        const productos = compra.PRODUCTOS.split(",").map((p) => p.trim());
        const cantidades = compra.CANTIDADES.split(",").map((c) => c.trim());

        productos.forEach((producto, index) => {
          acc.push({
            Proveedor: compra.PROVEEDOR,
            "Teléfono Proveedor": compra.TEL_PROVEEDOR,
            "Fecha Compra": compra.FEC_COMPRA,
            Producto: producto,
            Cantidad: cantidades[index] || "",
            "Monto Total Compra": compra.MON_TOTAL,
          });
        });
        return acc;
      }, []);

      const worksheet = XLSX.utils.json_to_sheet(comprasArray);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Compras");
      XLSX.writeFile(workbook, filePath);

      resolve({
        status: 200,
        data: {
          message: "Informe de compras generado exitosamente en Excel",
          downloadLink: `${downloadLink}Compras/${fileName}`,
        },
      });
    } catch (error) {
      console.error("Error al generar el informe de compras en Excel:", error);
      reject({
        status: 500,
        data: { error: "Error al generar el informe de compras en Excel." },
      });
    }
  });
}

async function createSaleEXCEL(
  currentDate,
  storeData,
  salesData,
  MIN_FEC,
  MAX_FEC
) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `Ventas-${formatDateTime(currentDate)}.xlsx`;
      const filePath = path.join(excelDir, "Ventas", fileName);
      if (!fs.existsSync(path.join(excelDir, "Ventas"))) {
        fs.mkdirSync(path.join(excelDir, "Ventas"), { recursive: true });
      }

      const ventasArray = Object.values(salesData).reduce((acc, venta) => {
        const productos = venta.PRODUCTOS
          ? venta.PRODUCTOS.split(",").map((p) => p.trim())
          : [];
        const cantidades = venta.CANTIDADES
          ? venta.CANTIDADES.split(",").map((c) => c.trim())
          : [];

        productos.forEach((producto, index) => {
          acc.push({
            Cliente: venta.CLIENTE || "Cliente Anónimo",
            "Teléfono Cliente": venta.TEL_CLIENTE || "N/A",
            "Fecha Venta": new Date(venta.FEC_VENTA).toLocaleDateString(),
            Producto: producto,
            Cantidad: cantidades[index] || "",
            "Monto Subtotal": venta.MONT_SUBTOTAL,
            Descuento: venta.DESCUENTO || 0,
            "Impuesto (%)": venta.PORCENT_IMPUESTO,
            "Método de Pago": venta.METODO_PAGO,
          });
        });
        return acc;
      }, []);

      const worksheet = XLSX.utils.json_to_sheet(ventasArray);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
      XLSX.writeFile(workbook, filePath);

      resolve({
        status: 200,
        data: {
          message: "Informe de ventas generado exitosamente en Excel",
          downloadLink: `${downloadLink}Ventas/${fileName}`,
        },
      });
    } catch (error) {
      console.error("Error al generar el informe de ventas en Excel:", error);
      reject({
        status: 500,
        data: { error: "Error al generar el informe de ventas en Excel." },
      });
    }
  });
}

async function createTransactionEXCEL(currentDate, storeData, transactionsData, MIN_FEC, MAX_FEC) {
  return new Promise((resolve, reject) => {
    try {
      const title = "Informe de Transacciones SINPE";
      const fileName = `Transacciones-${formatDateTime(currentDate)}.xlsx`;
      const filePath = path.join(excelDir, 'Transacciones', fileName);

      if (!fs.existsSync(path.join(excelDir, 'Transacciones'))) {
        fs.mkdirSync(path.join(excelDir, 'Transacciones'), { recursive: true });
      }

      // Convertir objeto a array si es necesario
      const transactionsArray = toArrayList(transactionsData);

      if (!Array.isArray(transactionsArray)) {
        console.error("transactionsData no es un array:", transactionsData);
        return reject({
          status: 500,
          data: { error: "Datos de transacciones inválidos." }
        });
      }

      let totalEgresos = 0;

      // Preparar datos para la hoja de cálculo
      const excelRows = [];

      // Encabezado del informe (como filas)
      excelRows.push([storeData.DSC_NOMBRE]);
      excelRows.push([title]);
      excelRows.push([`Periodo del informe: ${MIN_FEC} al ${MAX_FEC}`]);
      excelRows.push([`Reporte generado: ${currentDate}`]);
      excelRows.push([]); // Espacio

      // Encabezado de tabla
      excelRows.push(['Fecha', 'Descripción', 'Método Entrada', 'Monto']);

      // Datos de cada transacción
      transactionsArray.forEach(transaccion => {
        const formattedDate = formatDate(transaccion.FEC_TRANSACCION);
        const monto = parseFloat(transaccion.MONTO_PAGO || 0);

        excelRows.push([
          formattedDate,
          transaccion.DSC_TRANSACCION || '--',
          transaccion.METODO_PAGO || '--',
          monto.toFixed(2)
        ]);

        totalEgresos += monto;
      });

      // Estadísticas finales
      excelRows.push([]);
      excelRows.push([
        `Total Transferencias: ${transactionsArray.length}`,
        `Monto Total Enviado: ${totalEgresos.toFixed(2)}`,
        `Promedio por Envío: ${(totalEgresos / transactionsArray.length || 0).toFixed(2)}`
      ]);
      excelRows.push(['*** Última línea ***']);

      // Crear libro y hoja
      const worksheet = XLSX.utils.aoa_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transacciones');

      // Guardar archivo
      XLSX.writeFile(workbook, filePath);

      resolve({
        status: 200,
        data: {
          message: `${title} generado exitosamente en Excel`,
          downloadLink: `${downloadLink}Transacciones/${fileName}`
        }
      });

    } catch (error) {
      console.error("Error al generar el informe de transacciones en Excel:", error);
      reject({
        status: 500,
        data: { error: "Error al generar el informe de transacciones en Excel." }
      });
    }
  });
}

async function switchEXCEL(store, currentDate, type, MIN_FEC, MAX_FEC) {
  switch (type) {
    case "ComprasXProveedor":
      const [shoppingBySupplier] = await db.query(
        "CALL getShoppingsReport(:MIN_FEC, :MAX_FEC)",
        {
          replacements: {
            MIN_FEC: MIN_FEC,
            MAX_FEC: MAX_FEC,
          },
          type: QueryTypes.SELECT,
        }
      );
      return await createShoppingEXCEL(
        currentDate,
        store[0],
        shoppingBySupplier,
        MIN_FEC,
        MAX_FEC
      );
    case "VentasXCliente":
      const [salesByClient] = await db.query(
        "CALL getSaleReport(:MIN_FEC, :MAX_FEC)",
        {
          replacements: {
            MIN_FEC: MIN_FEC,
            MAX_FEC: MAX_FEC,
          },
          type: QueryTypes.SELECT,
        }
      );
      return await createSaleEXCEL(
        currentDate,
        store[0],
        salesByClient,
        MIN_FEC,
        MAX_FEC
      );
    case "ReporteTransaccion":
      const [TransactionReport] = await db.query(
        "CALL getTransactionReport(:MIN_FEC_TRANSACCION, :MAX_FEC_TRANSACCION)",
        {
          replacements: {
            MIN_FEC_TRANSACCION: MIN_FEC,
            MAX_FEC_TRANSACCION: MAX_FEC,
          },
          type: QueryTypes.SELECT,
        }
      );
      return await createTransactionEXCEL(
        currentDate,
        store[0],
        TransactionReport,
        MIN_FEC,
        MAX_FEC
      );
    case 'ReporteProductos':
      const [products] = await db.query(
        "CALL sp_products_report(:MIN_FEC, :MAX_FEC)",
        {
          replacements: {
            MIN_FEC: MIN_FEC,
            MAX_FEC: MAX_FEC,
          },
          type: QueryTypes.SELECT
        }
      )
      return await createProductEXCEL(
        currentDate, products
      );
    case "ProveedoresActivos":
      const [supplierReport] = await db.query(
        'CALL sp_getSupplierReport()',
        {
          type: QueryTypes.SELECT
        });


      const rawData = Object.values(supplierReport);

      const parsedResults = rawData.map((supplier) => {
        let compras = [];

        try {
          if (supplier.compras != null) {
            let fixedComprasStr = `[${supplier.compras}]`.replace(/},\s*{/g, '},{');
            compras = JSON.parse(fixedComprasStr);
          }
        } catch (err) {
          console.error("Error al parsear compras para proveedor:", supplier.proveedor_nombre, err);
        }

        return {
          proveedor_nombre: supplier.proveedor_nombre,
          direccion: supplier.DSC_DIRECCIONEXACTA,
          telefonos: supplier.telefonos,
          correos: supplier.correos,
          compras: compras
        };
      });
      return await createSupplierEXCEL(currentDate, store[0], parsedResults);
    case "ClientesCreditoActivo":

      const [credit_Client] = await db.query(`CALL sp_getClientCreditReport(:MIN_FEC, :MAX_FEC);`, {
        replacements: { MIN_FEC: MIN_FEC, MAX_FEC: MAX_FEC },
        type: db.QueryTypes.SELECT,
      });
      if (!credit_Client || !credit_Client[0] || Object.keys(credit_Client[0]).length === 0) {
        return res.status(204).json({ message: "No se encontraron clientes con créditos." });
      }

      const data_client = Object.values(credit_Client);

      const client_Parsed = data_client.map((client) => {
        let creditos = [];

        try {
          if (client.creditos_json != null) {
            let fixedCreditosStr = `[${client.creditos_json}]`.replace(/},\s*{/g, '},{');
            creditos = JSON.parse(fixedCreditosStr);
          }
        } catch (err) {
          console.error("Error al parsear créditos para cliente:", client.cliente_nombre, err);
        }

        return {
          cedula: client.DSC_CEDULA,
          nombre: client.cliente_nombre,
          direccion: client.DSC_DIRECCION,
          telefono: client.telefono,
          creditos: creditos,
          cantidad_creditos: client.cantidad_creditos,
          saldo_total_Pendiente: client.saldo_total_Pendiente,
          abonos_total_Pagado: client.abonos_total_Pagado
        };
      });

      return await createClientCreditEXCEL(currentDate, store[0], client_Parsed, MIN_FEC, MAX_FEC);
    default:
      return {
        status: 400,
        data: { error: "Informe no valido para generar en Excel." },
      };
  }
}

function toArrayList(data) {
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && data !== null) return Object.values(data);
  return [];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }) + ' ' + date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function createProductPDF(currentDate, storeData, productData) {
  return new Promise((resolve, reject) => {
    const title = "Informe de Productos";
    const pageWidthPoints = 595.28;
    const margin = 20;
    let currentY = margin + 20;

    const doc = new PDFDocument({ size: "A4" });
    const fileName = `Productos-${formatDateTime(currentDate)}.pdf`;
    const filePath = path.join(pdfDir, "Productos", fileName);

    if (!fs.existsSync(path.join(pdfDir, "Productos"))) {
      fs.mkdirSync(path.join(pdfDir, "Productos"), { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Encabezado
    doc
      .fontSize(12)
      .text(storeData.DSC_NOMBRE, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15;

    doc
      .fontSize(10)
      .text(title, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15;

    doc
      .fontSize(8)
      .text(`Fecha del Reporte: ${currentDate}`, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 25;

    // Cabecera de tabla
    const colX = {
      nombre: margin,
      descripcion: margin + 110,
      codigo: margin + 230,
      venta: margin + 340,
      compra: margin + 400,
      unidades: margin + 460,
      estado: margin + 520,
    };

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Nombre", colX.nombre, currentY);
    doc.text("Descripción", colX.descripcion, currentY);
    doc.text("Código", colX.codigo, currentY);
    doc.text("Venta", colX.venta, currentY);
    doc.text("Compra", colX.compra, currentY);
    doc.text("Unidades", colX.unidades, currentY);
    doc.text("Estado", colX.estado, currentY);

    currentY += 12;

    doc
      .strokeColor("#000")
      .lineWidth(0.5)
      .moveTo(margin, currentY)
      .lineTo(pageWidthPoints - margin, currentY)
      .stroke();

    currentY += 5;
    doc.font("Helvetica");

    // Contenido
    const productosArray = Object.values(productData);
    productosArray.forEach((p) => {
      doc.fontSize(8);
      doc.text(p.NOMBRE, colX.nombre, currentY, { width: 100 });
      doc.text(p.DESCRIPCION, colX.descripcion, currentY, { width: 100 });
      doc.text(p.COD_BARRAS, colX.codigo, currentY);
      doc.text(p.MON_VENTA.toFixed(2), colX.venta, currentY, {
        width: 50,
        align: "right"
      });
      doc.text(p.MON_COMPRA.toFixed(2), colX.compra, currentY, {
        width: 50,
        align: "right"
      });
      doc.text(p.UNID_DISPONIBLE.toString(), colX.unidades, currentY, {
        width: 40,
        align: "right"
      });
      doc.text(p.ESTADO, colX.estado, currentY);
      currentY += 12;

      if (currentY > 800) {
        doc.addPage();
        currentY = margin;
      }
    });

    // Línea final
    currentY += 20;
    doc
      .fontSize(8)
      .text("***Ultima linea***", margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });

    doc.end();

    writeStream.on("finish", () => {
      resolve({
        status: 200,
        data: {
          message: "Informe de productos generado exitosamente",
          downloadLink: `${downloadLink}Productos/${fileName}`,
        },
      });
    });

    writeStream.on("error", (error) => {
      console.error("Error al generar el informe de productos:", error);
      reject({
        status: 500,
        data: { error: "Error al generar el informe de productos." },
      });
    });
  });
}

async function createProductEXCEL(currentDate, productData) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileName = `Productos-${formatDateTime(currentDate)}.xlsx`;
      const filePath = path.join(excelDir, "Productos", fileName);
      if (!fs.existsSync(path.join(excelDir, "Productos"))) {
        fs.mkdirSync(path.join(excelDir, "Productos"), { recursive: true });
      }

      const productosArray = Object.values(productData).map((p) => ({
        Nombre: p.NOMBRE,
        Descripción: p.DESCRIPCION,
        Código: p.COD_BARRAS,
        Venta: p.MON_VENTA.toFixed(2),
        Compra: p.MON_COMPRA.toFixed(2),
        Unidades: p.UNID_DISPONIBLE,
        Estado: p.ESTADO,
      }));

      const worksheet = XLSX.utils.json_to_sheet(productosArray);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
      XLSX.writeFile(workbook, filePath);

      resolve({
        status: 200,
        data: {
          message: "Informe de productos generado exitosamente en Excel",
          downloadLink: `${downloadLink}Productos/${fileName}`,
        },
      });
    } catch (error) {
      console.error("Error al generar el informe de productos en Excel:", error);
      reject({
        status: 500,
        data: { error: "Error al generar el informe de productos en Excel." },
      });
    }
  });
}


//generar reporte pdf de proveedor

async function createSupplierPDF(currentDate, storeData, suppliersData) {
  return new Promise((resolve, reject) => {
    const title = "Informe de proveedores y compras asociadas";
    const pageWidthPoints = 595.28;
    const pageHeightPoints = 841.89;
    const margin = 20;
    let currentY = margin + 20;
    let totalComprasPeriodo = 0;

    const doc = new PDFDocument({
      size: 'A4'
    });
    const fileName = `Compras-Proveedores-${formatDateTime(currentDate)}.pdf`;
    const filePath = path.join(pdfDir, 'Proveedor', fileName);
    if (!fs.existsSync(path.join(pdfDir, 'Proveedor'))) {
      fs.mkdirSync(path.join(pdfDir, 'Proveedor'), { recursive: true });
    }
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Encabezado del informe
    doc.fontSize(12).text(storeData.DSC_NOMBRE, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
    currentY += 15;
    doc.fontSize(10).text(title, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
    currentY += 15;
    doc.fontSize(8).text(`Fecha del Reporte: ${currentDate}`, margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });
    currentY += 25;

    // Tabla de compras por proveedor
    const tableTop = currentY;
    let rowY = tableTop;
    const proveedorX = margin;
    const contactoX = proveedorX + 150;
    const fechaX = contactoX + 120;
    const productoX = margin + 10;
    const codigoX = productoX + 150;
    const cantidadX = codigoX + 80;
    const totalX = pageWidthPoints - margin - 70;

    // Cabecera de la tabla
    doc.fontSize(9).font('Helvetica-Bold')
      .text('Proveedor', proveedorX, rowY)
      .text('Contacto', contactoX, rowY)
      .text('Fecha Compra', fechaX, rowY)
      .text('Total Compra', totalX - 100, rowY, { align: 'right' });
    rowY += 12;
    doc.strokeColor('#000').lineWidth(0.5).moveTo(margin, rowY).lineTo(pageWidthPoints - margin, rowY).stroke();
    rowY += 5;
    doc.font('Helvetica');

    // Filas de la tabla
    suppliersData.forEach(proveedor => {


      doc.fontSize(9).font('Helvetica-Bold')
        .text(proveedor.proveedor_nombre || 'Proveedor sin nombre', proveedorX, rowY)
        .text(`${(proveedor.telefonos || 'N/A').split(',')[0].trim()} / ${(proveedor.correos || 'N/A').split(',')[0].trim()}`, contactoX, rowY);

      rowY += 10;
      doc.font('Helvetica');

      if (proveedor.compras.length === 0) {
        doc.fontSize(8).text(
          'No existen compras asignadas',
          fechaX,
          rowY
        );

        doc.fontSize(8).text(
          'No existen compras asignadas',
          totalX - 100,
          rowY,
          { align: 'right' }
        );

        rowY += 15;
      } else {

        proveedor.compras.forEach(compra => {
          if (!compra.fecha_compra) {
            return;
          }

          doc.fontSize(8).text(
            new Date(compra.fecha_compra).toLocaleDateString(),
            fechaX,
            rowY
          );

          const totalCompra = compra.total_compra || 0;
          doc.fontSize(8).text(
            totalCompra.toFixed(2),
            totalX - 100, rowY, { align: 'right' }
          );

          totalComprasPeriodo += totalCompra;

          // Línea separadora
          const lineY = rowY + 10;
          doc.strokeColor('#ccc')
            .lineWidth(0.5)
            .lineJoin('miter')
            .dash(5, { space: 5 })
            .moveTo(margin, lineY)
            .lineTo(pageWidthPoints - margin, lineY)
            .stroke();
          doc.undash();

          rowY = lineY + 8;
        });
      }

      if (proveedor.direccion) {
        doc.fontSize(8).text(`Dirección: ${proveedor.direccion}`, proveedorX, rowY);
        rowY += 12;
      }

      doc.moveDown();
    });

    currentY = rowY + 15;
    doc.fontSize(10).font('Helvetica-Bold')
      .text(`Monto total en compras: ${totalComprasPeriodo.toFixed(2)}`, margin, currentY, { align: 'right' });
    doc.font('Helvetica');

    // Línea final del documento
    currentY += 15;
    doc.fontSize(8).text('***Ultima linea***', margin, currentY, { align: 'center', width: pageWidthPoints - 2 * margin });

    doc.end();

    writeStream.on("finish", () => {
      resolve({
        status: 200,
        data: {
          message: "Informe de proveedores generado exitosamente",
          downloadLink: `${downloadLink}Proveedor/${fileName}`
        }
      });
    });

    writeStream.on("error", (error) => {
      console.error("Error al generar el informe de proveedores:", error);
      reject({ status: 500, data: { error: "Error al generar el informe de proveedores." } });
    });
  });
  function toArrayList(data) {
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && data !== null) return Object.values(data);
    return [];
  }
}

async function createSupplierEXCEL(currentDate, storeData, suppliersData) {
  return new Promise(async (resolve, reject) => {
    try {
      const title = "Informe de proveedores y compras asociadas";
      const fileName = `Compras-Proveedores-${formatDateTime(currentDate)}.xlsx`;
      const dirPath = path.join(excelDir, "Proveedor");
      const filePath = path.join(dirPath, fileName);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }


      const excelData = [];
      let totalComprasPeriodo = 0;


      excelData.push([storeData.DSC_NOMBRE]);
      excelData.push([title]);
      excelData.push([`Fecha del Reporte: ${currentDate}`]);
      excelData.push([]);

      suppliersData.forEach(proveedor => {

        excelData.push([
          proveedor.proveedor_nombre || 'Proveedor sin nombre',
          `Tel: ${(proveedor.telefonos || 'N/A').split(',')[0].trim()}`,
          `Email: ${(proveedor.correos || 'N/A').split(',')[0].trim()}`,
          proveedor.direccion ? `Dir: ${proveedor.direccion}` : ''
        ]);

        // Cabecera de compras
        excelData.push(["", "", "Fecha Compra", "Total Compra"]);

        // Procesar compras
        if (proveedor.compras.length > 0) {
          proveedor.compras.forEach(compra => {
            if (!compra.fecha_compra) return;

            const total = compra.total_compra || 0;
            excelData.push([
              "", "", // Espacios para alinear con el proveedor
              new Date(compra.fecha_compra).toLocaleDateString(),
              total.toFixed(2)
            ]);

            totalComprasPeriodo += total;
          });
        } else {
          excelData.push(["", "", "No hay compras registradas", "0.00"]);
        }

        excelData.push([]);
      });


      excelData.push(["", "", "TOTAL GENERAL:", totalComprasPeriodo.toFixed(2)]);


      const worksheet = XLSX.utils.aoa_to_sheet(excelData);


      worksheet['!cols'] = [
        { wch: 30 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 }
      ];

      // Crear workbook y guardar
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Compras-Proveedores");
      XLSX.writeFile(workbook, filePath);

      resolve({
        status: 200,
        data: {
          message: "Informe de proveedores generado exitosamente en Excel",
          downloadLink: `${downloadLink}Proveedor/${fileName}`
        }
      });
    } catch (error) {
      console.error("Error al generar el Excel:", error);
      reject({
        status: 500,
        data: {
          error: "Error al generar el informe de proveedores en Excel."
        }
      });
    }
  });
}

// Función para formatear montos monetarios
function formatMoney(amount) {
  return (amount || 0).toLocaleString('es-CR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export async function createClientCreditPDF(currentDate, storeData, clientsData, MIN_FEC, MAX_FEC) {
  return new Promise((resolve, reject) => {
    try {
      // Configuración del documento
      const title = "Reporte de Clientes con Créditos Asociados";
      const pageWidthPoints = 595.28; // Ancho de A4 en puntos
      const margin = 20;
      let currentY = margin;

      // Totales para el reporte
      let totalSaldoPendiente = 0;
      let totalAbonado = 0;
      let totalCreditos = 0;

      // Crear documento PDF
      const doc = new PDFDocument({
        size: 'A4',
        margin: margin,
        bufferPages: true
      });

      // Configurar nombre de archivo y ruta
      const fileName = `Reporte-Creditos-Clientes-${formatDateTime(currentDate)}.pdf`;
      const folderPath = path.join(pdfDir, 'Cliente_Credito');

      // Crear directorio si no existe
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const filePath = path.join(folderPath, fileName);
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // ============= ENCABEZADO DEL DOCUMENTO =============
      doc.fontSize(14).font('Helvetica-Bold')
        .text(storeData.DSC_NOMBRE || 'Tienda Zaid & Shayder', margin, currentY, { align: 'center' });
      currentY += 20;

      doc.fontSize(12).text(title, margin, currentY, { align: 'center' });
      currentY += 20;

      // Información de fechas
      doc.fontSize(9)
        .text(`Fecha del reporte: ${formatDate(currentDate)}`, margin, currentY);

      if (MIN_FEC && MAX_FEC) {
        doc.text(`Periodo analizado: ${formatDate(MIN_FEC)} al ${formatDate(MAX_FEC)}`, margin, currentY + 12);
        currentY += 24;
      } else {
        currentY += 15;
      }


      const columns = [
        { header: 'Cliente', key: 'nombre', width: 150, align: 'left' },
        { header: 'Cédula', key: 'cedula', width: 100, align: 'left' },
        { header: 'Créditos', key: 'cantidad', width: 70, align: 'center' },
        { header: 'Abonado', key: 'abonado', width: 90, align: 'right' },
        { header: 'Saldo', key: 'saldo', width: 100, align: 'right' }
      ];

      doc.font('Helvetica-Bold').fontSize(9);
      let x = margin;
      columns.forEach(col => {
        doc.text(col.header, x, currentY, { width: col.width, align: col.align });
        x += col.width;
      });
      currentY += 15;

      // Línea divisoria
      doc.moveTo(margin, currentY).lineTo(pageWidthPoints - margin, currentY).stroke();
      currentY += 10;

      doc.font('Helvetica').fontSize(8);

      clientsData.forEach(cliente => {
        // Calcular totales
        totalSaldoPendiente += cliente.saldo_total_Pendiente || 0;
        totalAbonado += cliente.abonos_total_Pagado || 0;
        totalCreditos += cliente.cantidad_creditos || 0;

        x = margin;
        columns.forEach(col => {
          const value = col.key === 'nombre' ? cliente.nombre :
            col.key === 'cedula' ? cliente.cedula || 'N/A' :
              col.key === 'cantidad' ? (cliente.cantidad_creditos || 0).toString() :
                col.key === 'abonado' ? `${formatMoney(cliente.abonos_total_Pagado)}` :
                  `${formatMoney(cliente.saldo_total_Pendiente)}`;

          doc.text(value, x, currentY, { width: col.width, align: col.align });
          x += col.width;
        });
        currentY += 15;

        // ============= DETALLE DE CRÉDITOS =============
        if (cliente.creditos && cliente.creditos.length > 0) {
          // Subtítulo
          doc.font('Helvetica-Bold').text('Detalle de créditos:', margin + 10, currentY);
          currentY += 12;

          // Configuración de columnas de detalle
          const detailCols = [
            { header: 'Último Pago', width: 120 },
            { header: 'Vencimiento', width: 120 },
            { header: 'Monto Inicial', width: 90, align: 'right' },
            { header: 'Abonado', width: 90, align: 'right' },
            { header: 'Saldo pendiete', width: 90, align: 'right' }
          ];

          // Cabecera de detalle
          x = margin + 20;
          detailCols.forEach(col => {
            doc.text(col.header, x, currentY, { width: col.width, align: col.align || 'left' });
            x += col.width;
          });
          currentY += 12;

          // Contenido de detalle
          doc.font('Helvetica');
          cliente.creditos.forEach(credito => {
            x = margin + 20;

            // Último pago
            doc.text(formatDate(credito.fec_ultimo_pago), x, currentY, { width: detailCols[0].width });
            x += detailCols[0].width;

            // Vencimiento
            doc.text(formatDate(credito.fec_vencimiento), x, currentY, { width: detailCols[1].width });
            x += detailCols[1].width;

            // Monto inicial
            doc.text(`${formatMoney(credito.monto_subtotal)}`, x, currentY, {
              width: detailCols[2].width,
              align: 'right'
            });
            x += detailCols[2].width;

            // Abonado
            doc.text(`${formatMoney(credito.total_abonado)}`, x, currentY, {
              width: detailCols[3].width,
              align: 'right'
            });
            x += detailCols[3].width;

            // Saldo
            doc.text(`${formatMoney(credito.saldo_restante)}`, x, currentY, {
              width: detailCols[4].width,
              align: 'right'
            });

            currentY += 12;
          });
        } else {
          doc.font('Helvetica-Oblique').text('No tiene créditos registrados.', margin + 20, currentY);
          currentY += 15;
        }

        // Dirección del cliente
        if (cliente.direccion) {
          doc.font('Helvetica').text(`Dirección: ${cliente.direccion}`, margin + 10, currentY);
          currentY += 15;
        }

        if (cliente.telefono) {
          doc.font('Helvetica').text(`Telefono: ${(cliente.telefono || 'N/A')}`, margin + 10, currentY);
          currentY += 15;
        }

        // Línea separadora entre clientes
        doc.moveTo(margin, currentY)
          .lineTo(pageWidthPoints - margin, currentY)
          .stroke();
        currentY += 15;
      });

      // ============= TOTALES DEL REPORTE =============
      doc.font('Helvetica-Bold').fontSize(10);

      // Total de créditos
      doc.text(`Total de créditos: ${totalCreditos}`, margin, currentY, { align: 'right' });
      currentY += 15;

      // Total abonado
      doc.text(`Total abonado: ${formatMoney(totalAbonado)}`, margin, currentY, { align: 'right' });
      currentY += 15;

      // Saldo pendiente total
      doc.text(`Saldo pendiente total: ${formatMoney(totalSaldoPendiente)}`, margin, currentY, { align: 'right' });
      currentY += 20;

      // ============= PIE DE PÁGINA =============
      doc.font('Helvetica').fontSize(8)
        .text('*** Fin del reporte ***', margin, currentY, { align: 'center' });

      // Finalizar documento
      doc.end();

      // Manejar eventos del stream
      writeStream.on('finish', () => {
        resolve({
          status: 200,
          data: {
            message: "Informe de créditos generado exitosamente",
            downloadLink: `${downloadLink}Cliente_Credito/${fileName}`,
            filePath: filePath
          }
        });
      });

      writeStream.on('error', (error) => {
        console.error("Error al generar el PDF:", error);
        reject({
          status: 500,
          error: "Error al generar el PDF: " + error.message
        });
      });

    } catch (error) {
      console.error("Error en la generación del PDF:", error);
      reject({
        status: 500,
        error: "Error interno al generar el PDF: " + error.message
      });
    }
  });
}


async function createClientCreditEXCEL(currentDate, storeData, clientsData, MIN_FEC, MAX_FEC) {
  return new Promise(async (resolve, reject) => {
    try {
      const title = "Reporte de Clientes con Créditos Asociados";
      const fileName = `Creditos-Clientes-${formatDateTime(currentDate)}.xlsx`;
      const dirPath = path.join(excelDir, "Cliente_Credito");
      const filePath = path.join(dirPath, fileName);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet([]);


      let rowIndex = 0;
      let totalSaldoPendiente = 0;
      let totalAbonado = 0;
      let totalCreditos = 0;

      const styles = {
        header: {
          fill: { fgColor: { rgb: "4472C4" } },
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center" }
        },
        subHeader: {
          fill: { fgColor: { rgb: "8EA9DB" } },
          font: { bold: true },
          alignment: { horizontal: "center" }
        },
        tableHeader: {
          fill: { fgColor: { rgb: "5B9BD5" } },
          font: { bold: true, color: { rgb: "FFFFFF" } }
        },
        totalRow: {
          fill: { fgColor: { rgb: "70AD47" } },
          font: { bold: true, color: { rgb: "FFFFFF" } }
        },
        currencyFormat: '#,##0.00'
      };

      XLSX.utils.sheet_add_aoa(worksheet, [[storeData.DSC_NOMBRE || 'Tienda Zaid & Shayder']], { origin: { r: rowIndex, c: 0 } });
      worksheet["A" + (rowIndex + 1)].s = styles.header;
      rowIndex++;

      XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: { r: rowIndex, c: 0 } });
      worksheet["A" + (rowIndex + 1)].s = styles.subHeader;
      rowIndex++;

      XLSX.utils.sheet_add_aoa(worksheet, [[`Fecha del Reporte: ${formatDate(currentDate)}`]], { origin: { r: rowIndex, c: 0 } });
      rowIndex++;

      if (MIN_FEC && MAX_FEC) {
        XLSX.utils.sheet_add_aoa(worksheet, [[`Periodo analizado: ${formatDate(MIN_FEC)} al ${formatDate(MAX_FEC)}`]], { origin: { r: rowIndex, c: 0 } });
        rowIndex++;
      }

      rowIndex++;

      const mainHeaders = ['Cliente', 'Cédula', 'Créditos', 'Total Abonado', 'Saldo Pendiente', 'Dirección'];
      XLSX.utils.sheet_add_aoa(worksheet, [mainHeaders], { origin: { r: rowIndex, c: 0 } });

      for (let col = 0; col < mainHeaders.length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: col });
        worksheet[cellRef].s = styles.tableHeader;
      }
      rowIndex++;

      clientsData.forEach(cliente => {
        const saldo = cliente.saldo_total_Pendiente || 0;
        const abonado = cliente.abonos_total_Pagado || 0;
        const creditos = cliente.cantidad_creditos || 0;

        totalSaldoPendiente += saldo;
        totalAbonado += abonado;
        totalCreditos += creditos;

        // Datos principales
        XLSX.utils.sheet_add_aoa(worksheet, [
          [
            cliente.nombre || 'Cliente sin nombre',
            cliente.cedula || 'N/A',
            creditos,
            abonado,
            saldo,
            cliente.direccion || 'N/A'
          ]
        ], { origin: { r: rowIndex, c: 0 } });

        ['D', 'E'].forEach(col => {
          const cellRef = col + (rowIndex + 1);
          if (worksheet[cellRef]) {
            worksheet[cellRef].z = styles.currencyFormat;
          }
        });

        rowIndex++;

        if (cliente.creditos && cliente.creditos.length > 0) {
          const detailHeaders = ['', 'Detalle de créditos:', 'Último Pago', 'Vencimiento', 'Monto Inicial', 'Abonado', 'Saldo'];
          XLSX.utils.sheet_add_aoa(worksheet, [detailHeaders], { origin: { r: rowIndex, c: 0 } });

          for (let col = 0; col < detailHeaders.length; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: col });
            worksheet[cellRef].s = {
              fill: { fgColor: { rgb: "D9E1F2" } }, // Azul muy claro
              font: { italic: true }
            };
          }
          rowIndex++;

          // Datos de cada crédito
          cliente.creditos.forEach(credito => {
            XLSX.utils.sheet_add_aoa(worksheet, [
              [
                '',
                '',
                formatDate(credito.fec_ultimo_pago),
                formatDate(credito.fec_vencimiento),
                credito.monto_subtotal || 0,
                credito.total_abonado || 0,
                credito.saldo_restante || 0
              ]
            ], { origin: { r: rowIndex, c: 0 } });

            ['E', 'F', 'G'].forEach(col => {
              const cellRef = col + (rowIndex + 1);
              if (worksheet[cellRef]) {
                worksheet[cellRef].z = styles.currencyFormat;
              }
            });

            rowIndex++;
          });
        } else {
          XLSX.utils.sheet_add_aoa(worksheet, [['', 'No tiene créditos registrados']], { origin: { r: rowIndex, c: 0 } });
          rowIndex++;
        }

        rowIndex++;
      });

      rowIndex++;

      XLSX.utils.sheet_add_aoa(worksheet, [['', '', 'TOTALES:']], { origin: { r: rowIndex, c: 0 } });
      worksheet["C" + (rowIndex + 1)].s = { font: { bold: true } };
      rowIndex++;

      const totals = [
        ['', '', 'Total Créditos:', totalCreditos],
        ['', '', 'Total Abonado:', totalAbonado],
        ['', '', 'Total Saldo Pendiente:', totalSaldoPendiente]
      ];

      totals.forEach((totalRow, i) => {
        XLSX.utils.sheet_add_aoa(worksheet, [totalRow], { origin: { r: rowIndex + i, c: 0 } });

        // Aplicar estilo a la fila de total
        ['C', 'D'].forEach(col => {
          const cellRef = col + (rowIndex + i + 1);
          if (worksheet[cellRef]) {
            worksheet[cellRef].s = i === totals.length - 1 ? styles.totalRow : { font: { bold: true } };

            if (col === 'D') {
              worksheet[cellRef].z = styles.currencyFormat;
            }
          }
        });
      });
      rowIndex += totals.length;

      worksheet['!cols'] = [
        { wch: 30 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
        { wch: 20 }
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, "Creditos-Clientes");
      XLSX.writeFile(workbook, filePath);

      resolve({
        status: 200,
        data: {
          message: "Informe de créditos generado exitosamente en Excel",
          downloadLink: `${downloadLink}Cliente_Credito/${fileName}`,
          filePath: filePath
        }
      });

    } catch (error) {
      console.error("Error al generar el Excel:", error);
      reject({
        status: 500,
        error: "Error al generar el informe de créditos en Excel: " + error.message
      });
    }
  });
}

export const createCashClosing = async (req, res) => {
  const currentDay = await getDateCR();
  const results = await db.query(
    'CALL sp_cash_closing(:MIN_FEC, :MAX_FEC)',
    {
      replacements: {
        MIN_FEC: currentDay,
        MAX_FEC: currentDay
      },
      type: QueryTypes.SELECT
    }
  );


  const TOTAL_VENTAS = results[0]?.[0]?.TOTAL_VENTAS || 0;
  const TOTAL_COMPRAS = results[1]?.[0]?.TOTAL_COMPRAS || 0;
  const TOTAL_ABONO = results[2]?.[0]?.TOTAL_ABONO || 0;
  const TOTAL_TRANSACCIONES = results[3]?.[0]?.TOTAL_TRANSACCION || 0;
  const cashData = results.slice(4)
    .filter(r => Object.values(r).every(value => typeof value === 'object' && value !== null))
    .flatMap(r => Object.values(r));

  const store = await Config.findAll();
  const resultPDF = await createResumenPDF(currentDay, store[0], {
    totals: {
      TOTAL_VENTAS,
      TOTAL_COMPRAS,
      TOTAL_ABONO,
      TOTAL_TRANSACCIONES,
      TOTAL: TOTAL_VENTAS + TOTAL_ABONO - TOTAL_COMPRAS
    },
    cashData
  });

  const resultExcel = await createResumenEXCEL(currentDay, store[0], {
    totals: {
      TOTAL_VENTAS,
      TOTAL_COMPRAS,
      TOTAL_ABONO,
      TOTAL_TRANSACCIONES,
      TOTAL: TOTAL_VENTAS + TOTAL_ABONO - TOTAL_COMPRAS
    },
    cashData
  });

  return res.status(200).json({ PDF: resultPDF.data, EXCEL: resultExcel.data });
};

async function createResumenPDF(currentDate, storeData, resumenData) {
  return new Promise((resolve, reject) => {
    const { TOTAL_VENTAS, TOTAL_COMPRAS, TOTAL_ABONO, TOTAL_TRANSACCIONES, TOTAL } = resumenData.totals;
    const movimientos = resumenData.cashData.filter(item => typeof item === 'object');

    const title = "Informe General de Transacciones";
    const pageWidthPoints = 595.28;
    const pageHeightPoints = 841.89;
    const margin = 20;
    let currentY = margin + 20;

    const doc = new PDFDocument({ size: "A4" });
    const fileName = `Resumen-${formatDateTime(currentDate)}.pdf`;
    const filePath = path.join(pdfDir, "Resumen", fileName);

    if (!fs.existsSync(path.join(pdfDir, "Resumen"))) {
      fs.mkdirSync(path.join(pdfDir, "Resumen"), { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Encabezado
    doc
      .fontSize(12)
      .text(storeData.DSC_NOMBRE, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15;

    doc
      .fontSize(10)
      .text(title, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 15;

    doc
      .fontSize(8)
      .text(`Fecha del Reporte: ${currentDate}`, margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });
    currentY += 25;

    // Totales
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(`Total Ventas: ${TOTAL_VENTAS.toFixed(2)}`, margin, currentY);
    currentY += 12;
    doc.text(`Total Compras: ${TOTAL_COMPRAS.toFixed(2)}`, margin, currentY);
    currentY += 12;
    doc.text(`Total Abonos: ${TOTAL_ABONO.toFixed(2)}`, margin, currentY);
    currentY += 12;
    doc.text(`Total Transacciones: ${TOTAL_TRANSACCIONES.toFixed(2)}`, margin, currentY);
    currentY += 12;
    doc.text(`Total final: ${TOTAL.toFixed(2)}`, margin, currentY);
    currentY += 20;

    // Cabecera de la tabla
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("Tipo", margin, currentY)
      .text("Fecha", margin + 100, currentY)
      .text("Monto", margin + 250, currentY)
      .text("Descripción", margin + 350, currentY);
    currentY += 12;
    doc
      .strokeColor("#000")
      .lineWidth(0.5)
      .moveTo(margin, currentY)
      .lineTo(pageWidthPoints - margin, currentY)
      .stroke();
    currentY += 5;

    // Filas de la tabla
    doc.font("Helvetica").fontSize(8);

    movimientos.forEach((mov) => {
      if (currentY >= pageHeightPoints - 50) {
        doc.addPage();
        currentY = margin;
      }

      const fechaFormateada = new Date(mov.FECHA).toLocaleString("es-CR");

      doc.text(mov.TIPO, margin, currentY);
      doc.text(fechaFormateada, margin + 100, currentY);
      doc.text(mov.MONTO.toFixed(2), margin + 250, currentY);
      doc.text(mov.DESCRIPCION || "-", margin + 350, currentY, { width: 200 });
      currentY += 12;
    });

    // Línea final
    currentY += 15;
    doc
      .fontSize(8)
      .text("***Fin del informe***", margin, currentY, {
        align: "center",
        width: pageWidthPoints - 2 * margin,
      });

    doc.end();

    writeStream.on("finish", () => {
      resolve({
        status: 200,
        data: {
          message: "Informe de resumen generado exitosamente",
          downloadLink: `${downloadLink}Resumen/${fileName}`,
        },
      });
    });

    writeStream.on("error", (error) => {
      console.error("Error al generar el informe resumen:", error);
      reject({
        status: 500,
        data: { error: "Error al generar el informe resumen." },
      });
    });
  });
}

async function createResumenEXCEL(currentDate, storeData, resumenData) {
  return new Promise((resolve, reject) => {
    try {
      const { TOTAL_VENTAS, TOTAL_COMPRAS, TOTAL_ABONO, TOTAL_TRANSACCIONES, TOTAL } = resumenData.totals;
      const movimientos = resumenData.cashData.filter(item => typeof item === 'object');

      const fileName = `Resumen-${formatDateTime(currentDate)}.xlsx`;
      const outputPath = path.join(excelDir, 'Resumen');

      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      const filePath = path.join(outputPath, fileName);

      const rows = [];

      // Encabezado
      rows.push([storeData.DSC_NOMBRE || '']);
      rows.push(['Informe General de Transacciones']);
      rows.push([`Fecha del Reporte: ${formatDateTime(currentDate)}`]);
      rows.push([]); // Espacio

      // Totales
      rows.push([`Total Ventas: ${TOTAL_VENTAS.toFixed(2)}`]);
      rows.push([`Total Compras: ${TOTAL_COMPRAS.toFixed(2)}`]);
      rows.push([`Total Abonos: ${TOTAL_ABONO.toFixed(2)}`]);
      rows.push([`Total Transacciones: ${TOTAL_TRANSACCIONES.toFixed(2)}`]);
      rows.push([`TOTAL FINAL: ${TOTAL.toFixed(2)}`]);
      rows.push([]); // Espacio

      // Cabecera de la tabla
      rows.push(['Tipo', 'Fecha', 'Monto', 'Descripción']);

      // Filas de movimientos
      movimientos.forEach((mov) => {
        const fecha = new Date(mov.FECHA).toLocaleString('es-CR');
        rows.push([
          mov.TIPO,
          fecha,
          mov.MONTO.toFixed(2),
          mov.DESCRIPCION || '-',
        ]);
      });

      rows.push([]);
      rows.push(['***Fin del informe***']);

      // Crear hoja
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumen');

      XLSX.writeFile(workbook, filePath);

      resolve({
        status: 200,
        data: {
          message: "Informe de resumen generado exitosamente",
          downloadLink: `${downloadLink}Resumen/${fileName}`,
        },
      });

    } catch (error) {
      console.error("Error al generar el Excel de resumen:", error);
      reject({
        status: 500,
        data: { error: "Error al generar el Excel de resumen." },
      });
    }
  });
}