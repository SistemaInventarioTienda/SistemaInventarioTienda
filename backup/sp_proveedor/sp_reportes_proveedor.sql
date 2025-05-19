DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getSupplierReport`()
BEGIN

SELECT
    p.DSC_NOMBRE AS proveedor_nombre,
    p.DSC_DIRECCIONEXACTA,
    GROUP_CONCAT(DISTINCT pt.DSC_TELEFONO SEPARATOR ', ') AS telefonos,
    GROUP_CONCAT(DISTINCT pc.DSC_CORREO SEPARATOR ', ') AS correos,
    GROUP_CONCAT(DISTINCT comp.compras SEPARATOR ', ') AS compras
FROM tsit_proveedor p
LEFT JOIN tsit_telefonoproveedor pt ON pt.ID_PROVEEDOR = p.ID_PROVEEDOR
LEFT JOIN tsit_correoproveedor pc ON pc.ID_PROVEEDOR = p.ID_PROVEEDOR
LEFT JOIN (
    SELECT
        c.ID_PROVEEDOR,
        CONCAT(
            '{',
            '"fecha_compra": "', c.FEC_COMPRA, '", ',
            '"total_compra": ', SUM(dc.MON_CANTIDAD * dc.MON_PRECIO_COMPRA), ', ',
            '"productos": [',
                GROUP_CONCAT(
                    CONCAT(
                        '{',
                        '"producto_nombre": "', pr.DSC_NOMBRE, '", ',
                        '"producto_descripcion": "', pr.DSC_DESCRIPTION, '", ',
                        '"codigo_barras": "', pr.DSC_CODIGO_BARRAS, '", ',
                        '"cantidad": ', dc.MON_CANTIDAD, ', ',
                        '"precio_compra": ', dc.MON_PRECIO_COMPRA,
                        '}'
                    )
                    SEPARATOR ', '
                ),
            ']',
            '}'
        ) AS compras
    FROM tsit_compras c
    INNER JOIN tsit_detalles_compras dc ON dc.ID_COMPRA = c.ID_COMPRA
    INNER JOIN tsim_producto pr ON pr.DSC_CODIGO_BARRAS = dc.DSC_CODIGO_BARRAS
    GROUP BY c.ID_COMPRA
) comp ON comp.ID_PROVEEDOR = p.ID_PROVEEDOR
WHERE p.ESTADO = 1
GROUP BY p.ID_PROVEEDOR;

END$$
DELIMITER ;