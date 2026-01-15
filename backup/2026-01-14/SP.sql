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

CREATE PROCEDURE `getShoppingsReport`(IN MIN_FEC DATE, IN MAX_FEC DATE)
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

CREATE PROCEDURE `sp_getAllShoppings`(
    IN p_field VARCHAR(50),
    IN p_sortOrder VARCHAR(4),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN

    SELECT 
        c.ID_COMPRA, 
        c.FEC_ENTRADA, 
        c.FEC_COMPRA, 
        c.FEC_CREATED_AT, 
        c.ESTADO, 
        c.MON_TOTAL, 
        c.DSC_METODO_PAGO, 
        p.DSC_NOMBRE AS PROVEEDOR,

        /* Producto usado solo para ordenamiento */
        (
            SELECT prod.DSC_NOMBRE
            FROM tsit_detalles_compras d2
            JOIN tsim_producto prod 
                ON d2.DSC_CODIGO_BARRAS = prod.DSC_CODIGO_BARRAS
            WHERE d2.ID_COMPRA = c.ID_COMPRA
            ORDER BY
                CASE 
                    WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'DESC' 
                        THEN prod.DSC_NOMBRE 
                END DESC,
                CASE 
                    WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'ASC' 
                        THEN prod.DSC_NOMBRE 
                END ASC
            LIMIT 1
        ) AS DETALLE_PRODUCTO,

        /* Lista de productos como JSON real */
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'DSC_NOMBRE', prod.DSC_NOMBRE,
                'DSC_CODIGO_BARRAS', d.DSC_CODIGO_BARRAS,
                'MON_CANTIDAD', d.MON_CANTIDAD,
                'MON_PRECIO_COMPRA', d.MON_PRECIO_COMPRA
            )
        ) AS PRODUCTS_LISTS

    FROM tsit_compras c
    JOIN tsit_detalles_compras d 
        ON c.ID_COMPRA = d.ID_COMPRA
    JOIN tsit_proveedor p 
        ON c.ID_PROVEEDOR = p.ID_PROVEEDOR
    JOIN tsim_producto prod 
        ON d.DSC_CODIGO_BARRAS = prod.DSC_CODIGO_BARRAS

    GROUP BY 
        c.ID_COMPRA, 
        c.FEC_ENTRADA, 
        c.FEC_COMPRA, 
        c.FEC_CREATED_AT, 
        c.ESTADO, 
        c.MON_TOTAL, 
        c.DSC_METODO_PAGO, 
        p.DSC_NOMBRE

    ORDER BY 
        CASE 
            WHEN p_field = 'FEC_ENTRADA' AND p_sortOrder = 'DESC' THEN c.FEC_ENTRADA
            WHEN p_field = 'FEC_COMPRA' AND p_sortOrder = 'DESC' THEN c.FEC_COMPRA
            WHEN p_field = 'FEC_CREATED_AT' AND p_sortOrder = 'DESC' THEN c.FEC_CREATED_AT
            WHEN p_field = 'ESTADO' AND p_sortOrder = 'DESC' THEN c.ESTADO
            WHEN p_field = 'MON_TOTAL' AND p_sortOrder = 'DESC' THEN c.MON_TOTAL
            WHEN p_field = 'DSC_METODO_PAGO' AND p_sortOrder = 'DESC' THEN c.DSC_METODO_PAGO
            WHEN p_field = 'PROVEEDOR' AND p_sortOrder = 'DESC' THEN p.DSC_NOMBRE
            WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'DESC' THEN DETALLE_PRODUCTO
        END DESC,
        CASE
            WHEN p_field = 'FEC_ENTRADA' AND p_sortOrder = 'ASC' THEN c.FEC_ENTRADA
            WHEN p_field = 'FEC_COMPRA' AND p_sortOrder = 'ASC' THEN c.FEC_COMPRA
            WHEN p_field = 'FEC_CREATED_AT' AND p_sortOrder = 'ASC' THEN c.FEC_CREATED_AT
            WHEN p_field = 'ESTADO' AND p_sortOrder = 'ASC' THEN c.ESTADO
            WHEN p_field = 'MON_TOTAL' AND p_sortOrder = 'ASC' THEN c.MON_TOTAL
            WHEN p_field = 'DSC_METODO_PAGO' AND p_sortOrder = 'ASC' THEN c.DSC_METODO_PAGO
            WHEN p_field = 'PROVEEDOR' AND p_sortOrder = 'ASC' THEN p.DSC_NOMBRE
            WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'ASC' THEN DETALLE_PRODUCTO
        END ASC,
        CASE WHEN p_sortOrder = 'DESC' THEN c.FEC_CREATED_AT END DESC,
        CASE WHEN p_sortOrder = 'ASC' THEN c.FEC_CREATED_AT END ASC

    LIMIT p_limit OFFSET p_offset;

END

CREATE PROCEDURE `sp_getClientCreditReport`(
    IN MIN_FEC DATE,
    IN MAX_FEC DATE
)
BEGIN

    SELECT
        cl.DSC_CEDULA,

        /* Nombre estructurado */
        JSON_OBJECT(
            'nombre', cl.DSC_NOMBRE,
            'apellido_uno', cl.DSC_APELLIDOUNO,
            'apellido_dos', cl.DSC_APELLIDODOS
        ) AS cliente_nombre,

        cl.DSC_DIRECCION,

        /* Teléfonos como arreglo JSON */
        tel.telefonos,

        /* Créditos como JSON real */
        CASE
            WHEN COUNT(cr.ID_CREDITO) = 0 THEN NULL
            ELSE JSON_ARRAYAGG(
                JSON_OBJECT(
                    'fec_ultimo_pago', cr.FEC_ULTIMOPAGO,
                    'fec_vencimiento', cr.FEC_VENCIMIENTO,
                    'saldo_restante', cr.MON_PENDIENTE,
                    'total_abonado', IFNULL(ab.total_abonado, 0),
                    'monto_subtotal', v.MONT_SUBTOTAL
                )
            )
        END AS creditos_json,

        COUNT(cr.ID_CREDITO) AS cantidad_creditos,
        SUM(IFNULL(cr.MON_PENDIENTE, 0)) AS saldo_total_pendiente,
        SUM(IFNULL(ab.total_abonado, 0)) AS abonos_total_pagado

    FROM tsit_cliente cl

    /* Teléfonos sin GROUP_CONCAT */
    INNER JOIN (
        SELECT
            ID_CLIENTE,
            JSON_ARRAYAGG(DSC_TELEFONO) AS telefonos
        FROM tsit_telefonocliente
        WHERE ESTADO = 1
        GROUP BY ID_CLIENTE
    ) tel ON cl.ID_CLIENTE = tel.ID_CLIENTE

    LEFT JOIN tsit_venta v 
        ON cl.ID_CLIENTE = v.ID_CLIENTE

    LEFT JOIN tsit_credito cr 
        ON v.ID_VENTA = cr.ID_VENTA
        AND (cr.ESTADO_CREDITO IN (0, 1) OR cr.ESTADO_CREDITO IS NULL)
        AND (
            (MIN_FEC IS NULL AND MAX_FEC IS NULL)
            OR
            (v.FEC_VENTA >= MIN_FEC 
             AND v.FEC_VENTA < DATE_ADD(MAX_FEC, INTERVAL 1 DAY))
        )

    LEFT JOIN (
        SELECT
            ID_CREDITO,
            SUM(MON_ABONADO) AS total_abonado
        FROM tsit_abono
        GROUP BY ID_CREDITO
    ) ab ON cr.ID_CREDITO = ab.ID_CREDITO

    GROUP BY
        cl.ID_CLIENTE,
        cl.DSC_CEDULA,
        cl.DSC_NOMBRE,
        cl.DSC_APELLIDOUNO,
        cl.DSC_APELLIDODOS,
        cl.DSC_DIRECCION,
        tel.telefonos

    ORDER BY cl.DSC_CEDULA;

END

DROP PROCEDURE IF EXISTS sp_getSupplierReport;

DELIMITER /
/

CREATE PROCEDURE sp_getSupplierReport()
BEGIN
    SELECT
        p.DSC_NOMBRE AS proveedor_nombre,
        p.DSC_DIRECCIONEXACTA,

        /* Teléfonos: Usamos una subconsulta con DISTINCT antes del AGG */
        (
            SELECT JSON_ARRAYAGG(t_telefonos.tel)
            FROM (
                SELECT DISTINCT pt.DSC_TELEFONO AS tel
                FROM tsit_telefonoproveedor pt
                WHERE pt.ID_PROVEEDOR = p.ID_PROVEEDOR
            ) AS t_telefonos
        ) AS telefonos,

        /* Correos: Usamos una subconsulta con DISTINCT antes del AGG */
        (
            SELECT JSON_ARRAYAGG(t_correos.mail)
            FROM (
                SELECT DISTINCT pc.DSC_CORREO AS mail
                FROM tsit_correoproveedor pc
                WHERE pc.ID_PROVEEDOR = p.ID_PROVEEDOR
            ) AS t_correos
        ) AS correos,

        /* Compras */
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'fecha_compra', c.FEC_COMPRA,
                    'total_compra', (
                        SELECT SUM(dc_t.MON_CANTIDAD * dc_t.MON_PRECIO_COMPRA)
                        FROM tsit_detalles_compras dc_t
                        WHERE dc_t.ID_COMPRA = c.ID_COMPRA
                    ),
                    'productos', (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'producto_nombre', pr.DSC_NOMBRE,
                                'producto_descripcion', pr.DSC_DESCRIPTION,
                                'codigo_barras', pr.DSC_CODIGO_BARRAS,
                                'cantidad', dc_p.MON_CANTIDAD,
                                'precio_compra', dc_p.MON_PRECIO_COMPRA
                            )
                        )
                        FROM tsit_detalles_compras dc_p
                        INNER JOIN tsim_producto pr ON pr.DSC_CODIGO_BARRAS = dc_p.DSC_CODIGO_BARRAS
                        WHERE dc_p.ID_COMPRA = c.ID_COMPRA
                    )
                )
            )
            FROM tsit_compras c
            WHERE c.ID_PROVEEDOR = p.ID_PROVEEDOR
        ) AS compras

    FROM tsit_proveedor p
    WHERE p.ESTADO = 1;
END
/
/

DELIMITER;

CREATE PROCEDURE `Sp_SearchCredits`(
    IN termSearch VARCHAR(255),
    IN page INT,
    IN pageSize INT
)
BEGIN
    DECLARE offset INT;
    SET offset = (page - 1) * pageSize;

    SELECT
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'ID_CREDITO', cr.ID_CREDITO,
                'ID_VENTA', cr.ID_VENTA,
                'FEC_ULTIMOPAGO', cr.FEC_ULTIMOPAGO,
                'FEC_VENCIMIENTO', cr.FEC_VENCIMIENTO,
                'MON_PENDIENTE', cr.MON_PENDIENTE,
                'ESTADO_CREDITO', cr.ESTADO_CREDITO,

                'sale', JSON_OBJECT(
                    'ID_VENTA', v.ID_VENTA,
                    'DSC_VENTA', v.DSC_VENTA,
                    'PORCENT_IMPUESTO', v.PORCENT_IMPUESTO,
                    'MONT_SUBTOTAL', v.MONT_SUBTOTAL,
                    'PORCENT_DESCUENTO', v.PORCENT_DESCUENTO,

                    'Client', JSON_OBJECT(
                        'ID_CLIENTE', cl.ID_CLIENTE,
                        'DSC_NOMBRE', cl.DSC_NOMBRE,
                        'DSC_APELLIDOUNO', cl.DSC_APELLIDOUNO,
                        'DSC_APELLIDODOS', cl.DSC_APELLIDODOS,

                        'TelefonoClientes',
                        IFNULL(
                            (
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'DSC_TELEFONO', t.DSC_TELEFONO
                                    )
                                )
                                FROM tsit_telefonocliente t
                                WHERE t.ID_CLIENTE = cl.ID_CLIENTE
                            ),
                            JSON_ARRAY()
                        )
                    )
                ),

                'payments',
                IFNULL(
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'ID_ABONO', ab.ID_ABONO,
                                'FEC_ABONO', ab.FEC_ABONO,
                                'MON_ABONADO', ab.MON_ABONADO
                            )
                        )
                        FROM tsit_abono ab
                        WHERE ab.ID_CREDITO = cr.ID_CREDITO
                    ),
                    JSON_ARRAY()
                )
            )
        ) AS ResultadoJSON
    FROM tsit_credito cr
    JOIN tsit_venta v ON cr.ID_VENTA = v.ID_VENTA
    JOIN tsit_cliente cl ON v.ID_CLIENTE = cl.ID_CLIENTE
    WHERE
        cl.DSC_NOMBRE LIKE CONCAT('%', termSearch, '%')
        OR cl.DSC_APELLIDOUNO LIKE CONCAT('%', termSearch, '%')
        OR cl.DSC_APELLIDODOS LIKE CONCAT('%', termSearch, '%')
        OR DATE_FORMAT(cr.FEC_VENCIMIENTO, '%Y-%m-%d') LIKE CONCAT('%', termSearch, '%')
    LIMIT offset, pageSize;
END;

CREATE PROCEDURE `sp_searchProformas`(
    IN p_field VARCHAR(50),
    IN p_sortOrder VARCHAR(4),
    IN p_limit INT,
    IN p_offset INT,
    IN p_expectedMatch VARCHAR(255)
)
BEGIN

    SELECT 
        p.ID_PROFORMA,
        p.DSC_CODIGO_BARRAS,
        p.FEC_CREACION,
        p.FEC_LIMITE,
        p.MON_TOTAL,
        p.ESTADO,

        e.ID_EMPRESA,
        e.DSC_NOMBRE,
        e.NUM_TELEFONO,
        e.DSC_CORREO,
        e.DSC_DIRECCION,
        e.DSC_ESLOGAN,

        -- Producto de referencia para ordenamiento
        (
            SELECT JSON_OBJECT(
                'DSC_NOMBRE', prod.DSC_NOMBRE,
                'DSC_DESCRIPTION', prod.DSC_DESCRIPTION
            )
            FROM tsit_productos_proforma pp2
            JOIN tsim_producto prod ON pp2.ID_PRODUCTO = prod.ID_PRODUCT
            WHERE pp2.ID_PROFORMA = p.ID_PROFORMA
            ORDER BY 
                CASE
                    WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'DESC' THEN prod.DSC_NOMBRE
                END DESC,
                CASE
                    WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'ASC' THEN prod.DSC_NOMBRE
                END ASC
            LIMIT 1
        ) AS DETALLE_PRODUCTO,

        -- Lista completa de productos (JSON real)
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'DSC_NOMBRE', prod.DSC_NOMBRE,
                    'PRECIO_UNITARIO', pp.PRECIO_UNITARIO,
                    'IMPUESTO', pp.IMPUESTO,
                    'DESCUENTO', pp.DESCUENTO,
                    'CANTIDAD', pp.CANTIDAD
                )
            )
            FROM tsit_productos_proforma pp
            JOIN tsim_producto prod ON pp.ID_PRODUCTO = prod.ID_PRODUCT
            WHERE pp.ID_PROFORMA = p.ID_PROFORMA
        ) AS PRODUCTS_LISTS

    FROM tsit_proforma p
    JOIN tsim_empresa e ON p.ID_EMPRESA = e.ID_EMPRESA

    WHERE
        CAST(p.ESTADO AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%')
        OR CAST(p.MON_TOTAL AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%')
        OR CAST(p.FEC_LIMITE AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%')
        OR CAST(p.FEC_CREACION AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%')
        OR CAST(p.DSC_CODIGO_BARRAS AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%')
        OR EXISTS (
            SELECT 1
            FROM tsit_productos_proforma pp3
            JOIN tsim_producto prodD ON pp3.ID_PRODUCTO = prodD.ID_PRODUCT
            WHERE pp3.ID_PROFORMA = p.ID_PROFORMA
              AND prodD.DSC_NOMBRE COLLATE utf8mb4_unicode_ci
                  LIKE CONCAT('%', p_expectedMatch, '%')
        )

    ORDER BY
        CASE
            WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'DESC' THEN
                JSON_UNQUOTE(JSON_EXTRACT(DETALLE_PRODUCTO, '$.DSC_NOMBRE'))
            WHEN p_field = 'ESTADO' AND p_sortOrder = 'DESC' THEN p.ESTADO
            WHEN p_field = 'FEC_CREACION' AND p_sortOrder = 'DESC' THEN p.FEC_CREACION
            WHEN p_field = 'FEC_LIMITE' AND p_sortOrder = 'DESC' THEN p.FEC_LIMITE
            WHEN p_field = 'MON_TOTAL' AND p_sortOrder = 'DESC' THEN p.MON_TOTAL
            WHEN p_field = 'DSC_CODIGO_BARRAS' AND p_sortOrder = 'DESC' THEN p.DSC_CODIGO_BARRAS
        END DESC,
        CASE
            WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'ASC' THEN
                JSON_UNQUOTE(JSON_EXTRACT(DETALLE_PRODUCTO, '$.DSC_NOMBRE'))
            WHEN p_field = 'ESTADO' AND p_sortOrder = 'ASC' THEN p.ESTADO
            WHEN p_field = 'FEC_CREACION' AND p_sortOrder = 'ASC' THEN p.FEC_CREACION
            WHEN p_field = 'FEC_LIMITE' AND p_sortOrder = 'ASC' THEN p.FEC_LIMITE
            WHEN p_field = 'MON_TOTAL' AND p_sortOrder = 'ASC' THEN p.MON_TOTAL
            WHEN p_field = 'DSC_CODIGO_BARRAS' AND p_sortOrder = 'ASC' THEN p.DSC_CODIGO_BARRAS
        END ASC,
        CASE
            WHEN p_sortOrder = 'DESC' THEN p.FEC_CREACION
        END DESC,
        CASE
            WHEN p_sortOrder = 'ASC' THEN p.FEC_CREACION
        END ASC

    LIMIT p_limit OFFSET p_offset;

END

CREATE PROCEDURE `Sp_SearchSales`(
    IN termSearch VARCHAR(255),
    IN page INT,
    IN pageSize INT
)
BEGIN
    DECLARE offset INT;
    SET offset = (page - 1) * pageSize;

    SELECT 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'ID_VENTA', v.ID_VENTA, 
                'ID_CLIENTE', v.ID_CLIENTE,
                'FEC_VENTA', v.FEC_VENTA,
                'METODO_PAGO', v.METODO_PAGO,
                'DSC_VENTA', v.DSC_VENTA,
                'MONT_SUBTOTAL', v.MONT_SUBTOTAL,
                'ESTADO', v.ESTADO,

                'CLIENTE', JSON_OBJECT(
                    'DSC_NOMBRE', c.DSC_NOMBRE,
                    'DSC_APELLIDOUNO', c.DSC_APELLIDOUNO,
                    'DSC_APELLIDODOS', c.DSC_APELLIDODOS
                ),

                'PRODUCTO', JSON_OBJECT(
                    'ID_PRODUCTO', p.ID_PRODUCT,
                    'DSC_PRODUCTO_NOMBRE', p.DSC_NOMBRE,
                    'MON_PRODUCTO_VENTA', p.MON_VENTA
                ),

                'DETALLE', JSON_OBJECT(
                    'CANTIDAD', pd.CANTIDAD,
                    'MONT_UNITARIO', pd.MONT_UNITARIO,
                    'PORCENT_DESCUENTO', pd.PORCENT_DESCUENTO,
                    'PORCENT_IMPUESTO', pd.PORCENT_IMPUESTO
                )
            )
        ) AS ResultadoJSON
    FROM tsit_venta v
    JOIN tsit_cliente c 
        ON v.ID_CLIENTE = c.ID_CLIENTE
    LEFT JOIN tsit_detalleventa pd 
        ON v.ID_VENTA = pd.ID_VENTA
    LEFT JOIN tsim_producto p 
        ON pd.ID_PRODUCTO = p.ID_PRODUCT
    WHERE 
        v.DSC_VENTA LIKE CONCAT('%', termSearch, '%')
        OR c.DSC_NOMBRE LIKE CONCAT('%', termSearch, '%')
        OR c.DSC_APELLIDOUNO LIKE CONCAT('%', termSearch, '%')
        OR c.DSC_APELLIDODOS LIKE CONCAT('%', termSearch, '%')
        OR p.DSC_NOMBRE LIKE CONCAT('%', termSearch, '%')
    LIMIT offset, pageSize;
END;