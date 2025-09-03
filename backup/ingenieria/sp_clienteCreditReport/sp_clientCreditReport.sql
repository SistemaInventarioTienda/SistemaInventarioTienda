DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getClientCreditReport`(IN `MIN_FEC` DATE, IN `MAX_FEC` DATE)
SELECT
    cl.DSC_CEDULA,
    CONCAT(cl.DSC_NOMBRE, ' ', cl.DSC_APELLIDOUNO, ' ', cl.DSC_APELLIDODOS) AS cliente_nombre,
    cl.DSC_DIRECCION,
     tel.telefono,
    CASE 
        WHEN COUNT(cr.ID_CREDITO) = 0 THEN NULL
        ELSE GROUP_CONCAT(
            CONCAT(
                '{"fec_ultimo_pago":"', IFNULL(cr.FEC_ULTIMOPAGO, ''), '",',
                '"fec_vencimiento":"', cr.FEC_VENCIMIENTO, '",',
                '"saldo_restante":', cr.MON_PENDIENTE, ',',
                '"total_abonado":', IFNULL(ab.total_abonado, 0), ',',
                '"monto_subtotal":', v.MONT_SUBTOTAL, '}'
            )
            SEPARATOR ', '
        )
    END AS creditos_json,
    COUNT(cr.ID_CREDITO) AS cantidad_creditos,
    SUM(IFNULL(cr.MON_PENDIENTE, 0)) AS saldo_total_Pendiente,
    SUM(IFNULL(ab.total_abonado, 0)) AS abonos_total_Pagado
FROM
    tsit_cliente cl
INNER JOIN (
    SELECT
        ID_CLIENTE,
        GROUP_CONCAT(DSC_TELEFONO SEPARATOR ', ') AS telefono
    FROM
        tsit_telefonocliente
    WHERE ESTADO = 1
    GROUP BY ID_CLIENTE
) tel ON cl.ID_CLIENTE = tel.ID_CLIENTE
LEFT JOIN
    tsit_venta v ON cl.ID_CLIENTE = v.ID_CLIENTE
LEFT JOIN
    tsit_credito cr ON v.ID_VENTA = cr.ID_VENTA AND (cr.ESTADO_CREDITO IN (0, 1) OR cr.ESTADO_CREDITO IS NULL)
     AND (
        (MIN_FEC IS NULL AND MAX_FEC IS NULL OR MIN_FEC = '' AND MAX_FEC = '') 
        OR 
        (v.FEC_VENTA >= MIN_FEC AND v.FEC_VENTA < DATE_ADD(MAX_FEC, INTERVAL 1 DAY))
    )
LEFT JOIN (
    SELECT
        ID_CREDITO,
        SUM(MON_ABONADO) AS total_abonado
    FROM
        tsit_abono
    GROUP BY
        ID_CREDITO
) ab ON cr.ID_CREDITO = ab.ID_CREDITO
GROUP BY
    cl.ID_CLIENTE, cl.DSC_CEDULA, cliente_nombre, cl.DSC_DIRECCION
ORDER BY
    cl.DSC_CEDULA$$
DELIMITER ;