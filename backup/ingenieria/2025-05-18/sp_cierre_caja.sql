CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cash_closing`(
	IN `MIN_FEC` DATE, 
    IN `MAX_FEC` DATE
)
BEGIN
	
    -- Ventas
	SELECT 
		IFNULL(SUM(
			(v.MONT_SUBTOTAL - (v.MONT_SUBTOTAL * v.PORCENT_DESCUENTO / 100.0)) 
			* (1 + v.PORCENT_IMPUESTO / 100.0)
		), 0) AS TOTAL_VENTAS
	FROM 
		tsit_venta v
	WHERE
		DATE(v.FEC_VENTA) >= MIN_FEC AND DATE(v.FEC_VENTA) <= MAX_FEC AND v.ESTADO = 1;
		
		
	-- Compras 
	SELECT 
		IFNULL(SUM(c.MON_TOTAL), 0) AS TOTAL_COMPRAS
	FROM
		tsit_compras c
	WHERE
		DATE(c.FEC_COMPRA) >= MIN_FEC AND DATE(c.FEC_COMPRA) <= MAX_FEC AND c.ESTADO = 1;
    
    -- Abonos
    SELECT
		IFNULL(SUM(a.MON_ABONADO), 0) AS TOTAL_ABONO
	FROM 
		tsit_abono a
	JOIN
		tsit_credito c ON c.ID_CREDITO = a.ID_CREDITO
	WHERE
		c.ESTADO_CREDITO = 1
        AND DATE(a.FEC_ABONO) >= MIN_FEC AND DATE(a.FEC_ABONO) <= MAX_FEC;
        
	-- Transacciones
    SELECT
		IFNULL(SUM(t.MONTO_PAGO), 0) AS TOTAL_TRANSACCION
	FROM 
		tsit_transacciones t
	WHERE
		t.ESTADO = 1
		AND DATE(t.FEC_TRANSACCION) >= MIN_FEC AND DATE(t.FEC_TRANSACCION) <= MAX_FEC;
        
	-- Ventas
    	SELECT 
			'Venta' AS TIPO,
            v.FEC_VENTA AS FECHA,
            (v.MONT_SUBTOTAL - (v.MONT_SUBTOTAL * v.PORCENT_DESCUENTO / 100.0)) * (1 + v.PORCENT_IMPUESTO / 100.0) AS MONTO,
            v.METODO_PAGO AS METODOPAGO,
            v.DSC_VENTA AS DESCRIPCION
		FROM 
			tsit_venta v
		WHERE
			DATE(v.FEC_VENTA) >= MIN_FEC AND DATE(v.FEC_VENTA) <= MAX_FEC AND v.ESTADO = 1;
            
            
    -- Compras
		SELECT
			'Compra' AS TIPO,
            c.FEC_COMPRA AS FECHA,
            c.MON_TOTAL AS MONTO,
            c.DSC_METODO_PAGO AS DESCRIPCION
		FROM
			tsit_compras c
		WHERE
			DATE(c.FEC_COMPRA) >= MIN_FEC AND DATE(c.FEC_COMPRA) <= MAX_FEC AND c.ESTADO = 1;
            
            
    -- Abonos
		SELECT
			'Abono' AS TIPO,
            a.FEC_ABONO AS FECHA,
            a.MON_ABONADO AS MONTO,
            'N/A' AS DESCRIPCION
		FROM 
			tsit_abono a
		JOIN
			tsit_credito c ON c.ID_CREDITO = a.ID_CREDITO
		WHERE
			c.ESTADO_CREDITO = 1
			AND DATE(a.FEC_ABONO) >= MIN_FEC AND DATE(a.FEC_ABONO) <= MAX_FEC;
            
            
    -- Transaccion
    SELECT
		'Transacciones' AS TIPO,
        t.FEC_TRANSACCION AS FECHA,
        t.MONTO_PAGO AS MONTO,
        t.DSC_TRANSACCION AS DESCRIPCION
	FROM 
		tsit_transacciones t
	WHERE
		t.ESTADO = 1
		AND DATE(t.FEC_TRANSACCION) >= MIN_FEC AND DATE(t.FEC_TRANSACCION) <= MAX_FEC;
END