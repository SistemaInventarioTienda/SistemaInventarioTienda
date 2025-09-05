DELIMITER // 

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_searchShoppings` (IN `p_field` VARCHAR(50), IN `p_sortOrder` VARCHAR(4), IN `p_limit` INTEGER, IN `p_offset` INTEGER, IN `p_expectedMatch` VARCHAR(255))   BEGIN

    SELECT 
        c.ID_COMPRA, 
        c.FEC_ENTRADA, 
        c.FEC_COMPRA, 
        c.FEC_CREATED_AT, 
        c.ESTADO, 
        c.MON_TOTAL, 
        c.DSC_METODO_PAGO, 
        p.DSC_NOMBRE AS PROVEEDOR,

        -- Obtener un solo producto ordenado
        (
            SELECT JSON_OBJECT(
                'DSC_NOMBRE', prod.DSC_NOMBRE
            )
            FROM tsit_detalles_compras d
            JOIN tsim_producto prod ON d.DSC_CODIGO_BARRAS = prod.DSC_CODIGO_BARRAS
            WHERE d.ID_COMPRA = c.ID_COMPRA
            ORDER BY 
                CASE
                    WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'DESC' THEN prod.DSC_NOMBRE 
                END DESC,
                CASE 
                    WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'ASC' THEN prod.DSC_NOMBRE
                END ASC
            LIMIT 1
        ) AS DETALLE_PRODUCTO,

        -- Generar JSON con la lista de los productos
        CONCAT('[', 
            GROUP_CONCAT(
                JSON_OBJECT(
                    'DSC_NOMBRE', prod.DSC_NOMBRE,
                    'DSC_CODIGO_BARRAS', d.DSC_CODIGO_BARRAS,
                    'MON_CANTIDAD', d.MON_CANTIDAD,
                    'MON_PRECIO_COMPRA', d.MON_PRECIO_COMPRA
                )
            ), ']'
        ) AS PRODUCTS_LISTS

    FROM tsit_compras c
    JOIN tsit_detalles_compras d ON c.ID_COMPRA = d.ID_COMPRA
    JOIN tsit_proveedor p ON c.ID_PROVEEDOR = p.ID_PROVEEDOR
    JOIN tsim_producto prod ON d.DSC_CODIGO_BARRAS = prod.DSC_CODIGO_BARRAS

    WHERE 
    CAST(c.ESTADO AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%') COLLATE utf8mb4_unicode_ci
    OR CAST(c.MON_TOTAL AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%') COLLATE utf8mb4_unicode_ci
    OR CAST(c.FEC_ENTRADA AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%') COLLATE utf8mb4_unicode_ci
    OR CAST(c.FEC_COMPRA AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%') COLLATE utf8mb4_unicode_ci
    OR CAST(c.DSC_METODO_PAGO AS CHAR) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%') COLLATE utf8mb4_unicode_ci
    OR p.DSC_NOMBRE COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%') COLLATE utf8mb4_unicode_ci
    OR EXISTS (
        SELECT 1
        FROM tsit_detalles_compras d2
        JOIN tsim_producto prodD ON d2.DSC_CODIGO_BARRAS = prodD.DSC_CODIGO_BARRAS
        WHERE d2.ID_COMPRA = c.ID_COMPRA
        AND (
            d2.DSC_CODIGO_BARRAS COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%') COLLATE utf8mb4_unicode_ci
            OR prodD.DSC_NOMBRE COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_expectedMatch, '%') COLLATE utf8mb4_unicode_ci
        )
    )


    GROUP BY c.ID_COMPRA, c.FEC_ENTRADA, c.FEC_COMPRA, c.FEC_CREATED_AT, 
             c.ESTADO, c.MON_TOTAL, c.DSC_METODO_PAGO, p.DSC_NOMBRE

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
        CASE
            WHEN p_sortOrder = 'DESC' THEN c.FEC_CREATED_AT
        END DESC,
        CASE
            WHEN p_sortOrder = 'ASC' THEN c.FEC_CREATED_AT
        END ASC
    LIMIT p_limit OFFSET p_offset;
END //