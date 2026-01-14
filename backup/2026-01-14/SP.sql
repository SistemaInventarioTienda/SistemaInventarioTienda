CREATE PROCEDURE `getSaleReport`(
    IN MIN_FEC DATE,
    IN MAX_FEC DATE
)
BEGIN
    SELECT
        v.ID_VENTA,
        v.FEC_VENTA,
        v.MONT_SUBTOTAL,
        v.METODO_PAGO,
        v.ESTADO,

        cli.ID_CLIENTE,
        CONCAT(
            cli.DSC_NOMBRE, ' ',
            cli.DSC_APELLIDOUNO, ' ',
            cli.DSC_APELLIDODOS
        ) AS CLIENTE,
        tel.DSC_TELEFONO AS TEL_CLIENTE,

        prod.ID_PRODUCT,
        prod.DSC_NOMBRE AS PRODUCTO,

        detv.CANTIDAD,
        detv.PORCENT_IMPUESTO,
        detv.PORCENT_DESCUENTO,
        detv.MONT_UNITARIO,

        ab.TOTAL_ABONOS

    FROM tsit_venta v

    JOIN tsit_detalleventa detv
        ON detv.ID_VENTA = v.ID_VENTA

    JOIN tsim_producto prod
        ON prod.ID_PRODUCT = detv.ID_PRODUCTO

    LEFT JOIN tsit_cliente cli
        ON cli.ID_CLIENTE = v.ID_CLIENTE

    LEFT JOIN tsit_telefonocliente tel
        ON tel.ID_CLIENTE = cli.ID_CLIENTE

    LEFT JOIN (
        SELECT
            cred.ID_VENTA,
            SUM(ab.MON_ABONADO) AS TOTAL_ABONOS
        FROM tsit_credito cred
        JOIN tsit_abono ab
            ON ab.ID_CREDITO = cred.ID_CREDITO
        GROUP BY cred.ID_VENTA
    ) ab
        ON ab.ID_VENTA = v.ID_VENTA

    WHERE
        v.FEC_VENTA >= MIN_FEC
        AND v.FEC_VENTA < DATE_ADD(MAX_FEC, INTERVAL 1 DAY)
        AND v.ESTADO IN (1, 3)

    ORDER BY
        v.FEC_VENTA ASC,
        v.ID_VENTA ASC;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `getShoppingsReport`(IN MIN_FEC DATE, IN MAX_FEC DATE)
BEGIN
    SELECT
        c.ID_COMPRA,
        c.MON_TOTAL,
        c.DSC_METODO_PAGO,
        c.FEC_COMPRA,
        c.FEC_ENTRADA,
        c.ESTADO,

        prov.ID_PROVEEDOR,
        prov.DSC_NOMBRE AS PROVEEDOR,
        telprov.DSC_TELEFONO AS TEL_PROVEEDOR,

        prod.ID_PRODUCT,
        prod.DSC_NOMBRE AS PRODUCTO,
        detc.MON_CANTIDAD AS CANTIDAD

    FROM tsit_compras c
    JOIN tsit_detalles_compras detc 
        ON detc.ID_COMPRA = c.ID_COMPRA
    JOIN tsim_producto prod 
        ON prod.DSC_CODIGO_BARRAS = detc.DSC_CODIGO_BARRAS
    LEFT JOIN tsit_proveedor prov 
        ON prov.ID_PROVEEDOR = c.ID_PROVEEDOR
    LEFT JOIN tsit_telefonoproveedor telprov 
        ON telprov.ID_PROVEEDOR = c.ID_PROVEEDOR

    WHERE
        c.FEC_COMPRA >= MIN_FEC
        AND c.FEC_COMPRA < DATE_ADD(MAX_FEC, INTERVAL 1 DAY)
        AND c.ESTADO = 1

    ORDER BY
        c.FEC_COMPRA ASC,
        c.ID_COMPRA ASC;
END