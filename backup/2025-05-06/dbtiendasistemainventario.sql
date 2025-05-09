-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-05-2025 a las 04:02:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dbtiendasistemainventario`
--
CREATE DATABASE IF NOT EXISTS `dbtiendasistemainventario` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dbtiendasistemainventario`;

DELIMITER $$
--
-- Procedimientos
--

CREATE DEFINER=`root`@`localhost` PROCEDURE `getSaleReport` (IN `MIN_FEC` DATE, IN `MAX_FEC` DATE)   BEGIN
	SELECT
		v.MONT_SUBTOTAL,
		v.METODO_PAGO,
		v.FEC_VENTA,
		v.PORCENT_IMPUESTO,
		v.PORCENT_DESCUENTO AS DESCUENTO,
		v.ESTADO,
		(SELECT CONCAT(cli.DSC_NOMBRE, ' ', cli.DSC_APELLIDOUNO, ' ', cli.DSC_APELLIDODOS)
		 FROM tsit_cliente cli
		 WHERE cli.ID_CLIENTE = v.ID_CLIENTE
		 LIMIT 1) AS CLIENTE,
		(SELECT telcli.DSC_TELEFONO
		 FROM tsit_telefonocliente telcli
		 WHERE telcli.ID_CLIENTE = v.ID_CLIENTE
		 LIMIT 1) AS TEL_CLIENTE,
		GROUP_CONCAT(prod.DSC_NOMBRE SEPARATOR ', ') AS PRODUCTOS,
		GROUP_CONCAT(detv.CANTIDAD SEPARATOR ', ') AS CANTIDADES,
        (
            SELECT
                SUM(ab.MON_ABONADO)
            FROM
                tsit_credito cred
            JOIN
                tsit_abono ab ON cred.ID_CREDITO = ab.ID_CREDITO
            WHERE 
                cred.ID_VENTA = v.ID_VENTA

        ) AS TOTAL_ABONOS
	FROM
		tsit_venta v
	JOIN
		tsit_detalleventa detv ON detv.ID_VENTA = v.ID_VENTA
	JOIN
		tsim_producto prod ON prod.ID_PRODUCT = detv.ID_PRODUCTO
	WHERE
		 DATE(v.FEC_VENTA) >= MIN_FEC AND DATE(v.FEC_VENTA) <= MAX_FEC
		AND (v.ESTADO = 1 OR v.ESTADO = 3)
	GROUP BY
		v.ID_VENTA
	ORDER BY
		v.FEC_VENTA ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getTransactionReport`(IN `MIN_FEC_TRANSACCION` DATETIME, IN `MAX_FEC_TRANSACCION` DATETIME, IN `TIPO_TRANSACCION` VARCHAR(50))
BEGIN
    SELECT 
        ID_TRANSACCION,
        FEC_TRANSACCION,
        METODO_PAGO,
        MONTO_PAGO,
        DSC_TRANSACCION,
        TIPO_TRANSACCION,
        ESTADO
    FROM 
        tsit_transacciones
    WHERE 
        FEC_TRANSACCION >= MIN_FEC_TRANSACCION
        AND FEC_TRANSACCION <= MAX_FEC_TRANSACCION
        AND TIPO_TRANSACCION = TIPO_TRANSACCION
    ORDER BY 
        FEC_TRANSACCION ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getShoppingsReport` (IN `MIN_FEC` DATE, IN `MAX_FEC` DATE)   BEGIN
	
    SELECT
		c.MON_TOTAL,
		c.DSC_METODO_PAGO,
		c.FEC_COMPRA,
		c.FEC_ENTRADA,
		c.ESTADO,
		(SELECT prov.DSC_NOMBRE FROM tsit_proveedor prov WHERE prov.ID_PROVEEDOR = c.ID_PROVEEDOR LIMIT 1) AS 'PROVEEDOR',
		(SELECT telprov.DSC_TELEFONO FROM tsit_telefonoproveedor telprov WHERE telprov.ID_PROVEEDOR = c.ID_PROVEEDOR LIMIT 1) AS 'TEL_PROVEEDOR',
		GROUP_CONCAT(prod.DSC_NOMBRE SEPARATOR ', ') AS 'PRODUCTOS',
		GROUP_CONCAT(detc.MON_CANTIDAD SEPARATOR ', ') AS 'CANTIDADES'
	FROM
		tsit_compras c
	JOIN
		tsit_detalles_compras detc ON detc.ID_COMPRA = c.ID_COMPRA
	JOIN
		tsim_producto prod ON prod.DSC_CODIGO_BARRAS = detc.DSC_CODIGO_BARRAS
	WHERE
		DATE(c.FEC_COMPRA) >= MIN_FEC AND DATE(c.FEC_COMPRA) <= MAX_FEC AND c.ESTADO = 1
	GROUP BY
		c.ID_COMPRA, c.MON_TOTAL, c.DSC_METODO_PAGO, c.FEC_COMPRA, c.FEC_ENTRADA, c.ESTADO
	ORDER BY
		c.FEC_COMPRA ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getAllDataFromGrpahics` (IN `MIN_FEC` DATE, IN `MAX_FEC` DATE, IN `LIMIT_PRODUCTS` INT, IN `CATEGORY` VARCHAR(255), IN `FEC_CURRENT` DATE)   BEGIN
    -- Consulta 1: Productos más vendidos
    SELECT
        p.DSC_NOMBRE,
        SUM(dv.CANTIDAD) AS TOTAL_VENDIDO
    FROM
        tsit_detalleventa dv
    JOIN
        tsim_producto p ON dv.ID_PRODUCTO = p.ID_PRODUCT
    JOIN
        tsit_venta v ON dv.ID_VENTA = v.ID_VENTA
    WHERE
		DATE(v.FEC_VENTA) >= MIN_FEC
		AND DATE(v.FEC_VENTA) <= MAX_FEC
        AND (v.ESTADO = 1 OR v.ESTADO = 3)
    GROUP BY
        p.DSC_NOMBRE
    ORDER BY
        TOTAL_VENDIDO DESC
    LIMIT
        LIMIT_PRODUCTS;

    -- Consulta 2: Productos con cantidad en inventario y total vendido
    SELECT 
        p.DSC_NOMBRE,
        p.CANTIDAD,
        SUM(dv.CANTIDAD) AS TOTAL_VENDIDO
    FROM
        tsit_detalleventa dv
    JOIN
        tsim_producto p ON dv.ID_PRODUCTO = p.ID_PRODUCT
    JOIN
        tsit_venta v ON dv.ID_VENTA = v.ID_VENTA
    JOIN
        tsim_subcategoria subc ON p.ID_SUBCATEGORIA = subc.ID_SUBCATEGORIA
    JOIN 
        tsim_categoria cat ON subc.ID_CATEGORIA = cat.ID_CATEGORIA
    WHERE
        DATE(v.FEC_VENTA) >= MIN_FEC
        AND DATE(v.FEC_VENTA) <= MAX_FEC
        AND (v.ESTADO = 1 OR v.ESTADO = 3)
        AND (subc.DSC_NOMBRE LIKE CONCAT("%", CATEGORY, "%") OR cat.DSC_NOMBRE LIKE CONCAT("%", CATEGORY, "%"))
    GROUP BY
        p.DSC_NOMBRE, p.CANTIDAD
    ORDER BY
        TOTAL_VENDIDO DESC;

    -- Consulta 3: Total de ventas por mes de los 12 meses a partir de la fecha que viene en parametro
	    WITH meses AS (
        SELECT 
            DATE_FORMAT(DATE_SUB(FEC_CURRENT, INTERVAL n MONTH), '%Y-%m') AS Mes
        FROM (
            SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL 
            SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL 
            SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
        ) AS numeros
    ),

    ventas_contado AS (
        SELECT 
            DATE_FORMAT(FEC_VENTA, '%Y-%m') AS Mes,
            SUM((MONT_SUBTOTAL - (MONT_SUBTOTAL * (PORCENT_DESCUENTO / 100))) * (1 + PORCENT_IMPUESTO / 100)) AS TotalContado
        FROM 
            tsit_venta
        WHERE 
            ESTADO = 1 AND ESTADO_CREDITO = 0
            AND FEC_VENTA BETWEEN DATE_SUB(FEC_CURRENT, INTERVAL 11 MONTH) AND FEC_CURRENT
        GROUP BY 
            DATE_FORMAT(FEC_VENTA, '%Y-%m')
    ),

    abonos_credito AS (
        SELECT 
            DATE_FORMAT(v.FEC_VENTA, '%Y-%m') AS Mes,
            SUM(ab.MON_ABONADO) AS TotalAbonos
        FROM 
            tsit_credito cred
        JOIN 
            tsit_abono ab ON cred.ID_CREDITO = ab.ID_CREDITO
        JOIN 
            tsit_venta v ON v.ID_VENTA = cred.ID_VENTA
        WHERE 
            v.ESTADO IN (1, 3) AND v.ESTADO_CREDITO = 1
            AND v.FEC_VENTA BETWEEN DATE_SUB(FEC_CURRENT, INTERVAL 11 MONTH) AND FEC_CURRENT
        GROUP BY 
            DATE_FORMAT(v.FEC_VENTA, '%Y-%m')
    )

    -- Resultado final
    SELECT 
        m.Mes,
        COALESCE(vc.TotalContado, 0) AS VentasContado,
        COALESCE(ac.TotalAbonos, 0) AS AbonosCredito,
        COALESCE(vc.TotalContado, 0) + COALESCE(ac.TotalAbonos, 0) AS TotalRecaudado
    FROM 
        meses m
    LEFT JOIN 
        ventas_contado vc ON vc.Mes = m.Mes
    LEFT JOIN 
        abonos_credito ac ON ac.Mes = m.Mes
    ORDER BY 
        m.Mes ASC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getAllShoppings` (IN `p_field` VARCHAR(50), IN `p_sortOrder` VARCHAR(4), IN `p_limit` INT, IN `p_offset` INT)   BEGIN


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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Sp_SearchCredits` (IN `termSearch` VARCHAR(255), IN `page` INT, IN `pageSize` INT)   BEGIN
    DECLARE offset INT;

    SET offset = (page - 1) * pageSize;

    SELECT 
        CONCAT(
            '[',
            GROUP_CONCAT(
                CONCAT(
                    '{',
                        '"ID_CREDITO":', cr.ID_CREDITO, ',',
                        '"ID_VENTA":', cr.ID_VENTA, ',',
                        '"FEC_ULTIMOPAGO":"', cr.FEC_ULTIMOPAGO, '",',
                        '"FEC_VENCIMIENTO":"', cr.FEC_VENCIMIENTO, '",',
                        '"MON_PENDIENTE":', cr.MON_PENDIENTE, ',',
                        '"ESTADO_CREDITO":', cr.ESTADO_CREDITO, ',',

                        '"sale":{',
                            '"ID_VENTA":', v.ID_VENTA, ',',
                            '"DSC_VENTA":"', v.DSC_VENTA, '",',
                            '"PORCENT_IMPUESTO":', v.PORCENT_IMPUESTO, ',',
                            '"MONT_SUBTOTAL":', v.MONT_SUBTOTAL, ',',
                            '"PORCENT_DESCUENTO":', v.PORCENT_DESCUENTO, ',',
                            '"Client":{',
                                '"ID_CLIENTE":', cl.ID_CLIENTE, ',',
                                '"DSC_NOMBRE":"', cl.DSC_NOMBRE, '",',
                                '"DSC_APELLIDOUNO":"', cl.DSC_APELLIDOUNO, '",',
                                '"DSC_APELLIDODOS":"', cl.DSC_APELLIDODOS, '",',
                                '"TelefonoClientes":', IFNULL((
                                    SELECT 
                                        CONCAT(
                                            '[',
                                            GROUP_CONCAT(
                                                CONCAT(
                                                    '{',
                                                        '"DSC_TELEFONO":"', t.DSC_TELEFONO, '"',
                                                    '}'
                                                )
                                            ),
                                            ']'
                                        )
                                    FROM tsit_telefonocliente t
                                    WHERE t.ID_CLIENTE = cl.ID_CLIENTE
                                ), '[]'), 
                            '}',
                        '},',

                        '"payments":', IFNULL((
                            SELECT 
                                CONCAT(
                                    '[',
                                    GROUP_CONCAT(
                                        CONCAT(
                                            '{',
                                                '"ID_ABONO":', ab.ID_ABONO, ',',
                                                '"FEC_ABONO":"', ab.FEC_ABONO, '",',
                                                '"MON_ABONADO":', ab.MON_ABONADO,
                                            '}'
                                        )
                                    ),
                                    ']'
                                )
                            FROM tsit_abono ab
                            WHERE ab.ID_CREDITO = cr.ID_CREDITO
                        ), '[]'),
                    '}'
                )
            ),
            ']'
        ) AS ResultadoJSON
    FROM 
        tsit_credito cr
    JOIN tsit_venta v ON cr.ID_VENTA = v.ID_VENTA
    JOIN tsit_cliente cl ON v.ID_CLIENTE = cl.ID_CLIENTE
    WHERE 
        (
            cl.DSC_NOMBRE LIKE CONCAT('%', termSearch, '%') OR 
            cl.DSC_APELLIDOUNO LIKE CONCAT('%', termSearch, '%') OR 
            cl.DSC_APELLIDODOS LIKE CONCAT('%', termSearch, '%') OR 
            DATE_FORMAT(cr.FEC_VENCIMIENTO, '%Y-%m-%d') LIKE CONCAT('%', termSearch, '%') 
          
        )
     LIMIT offset, pageSize;
        
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Sp_SearchSales` (IN `termSearch` VARCHAR(255), IN `page` INT, IN `pageSize` INT)   BEGIN
    -- Calcular el offset para la paginación
    DECLARE offset INT;
    SET offset = (page - 1) * pageSize;

    -- Consulta para obtener las ventas
    SELECT 
        CONCAT(
            '[',
            GROUP_CONCAT(
                JSON_OBJECT(
                    'ID_VENTA', v.ID_VENTA, 
                    'ID_CLIENTE', v.ID_CLIENTE,
                    'FEC_VENTA', v.FEC_VENTA,
                    'PORCENT_IMPUESTO', v.PORCENT_IMPUESTO,
                    'METODO_PAGO', v.METODO_PAGO,
                    'DSC_VENTA', v.DSC_VENTA,
                    'MONT_SUBTOTAL', v.MONT_SUBTOTAL,
                    'PORCENT_DESCUENTO', v.PORCENT_DESCUENTO,
                    'ESTADO', v.ESTADO,
                    'DSC_CLIENTE_NOMBRE', c.DSC_NOMBRE,
                    'DSC_CLIENTE_APELLIDO_UNO', c.DSC_APELLIDOUNO,
                    'DSC_CLIENTE_APELLIDO_DOS', c.DSC_APELLIDODOS,
                    'CANTIDAD', pd.CANTIDAD,
                    'MONT_UNITARIO', pd.MONT_UNITARIO,
                    'DSC_PRODUCTO_NOMBRE', p.DSC_NOMBRE,
                    'MON_PRODUCTO_VENTA', p.MON_VENTA,
                    'ID_PRODUCTO', p.ID_PRODUCT
                )
            ),
            ']'
        ) AS ResultadoJSON
    FROM 
        tsit_venta v
    JOIN 
        tsit_cliente c ON v.ID_CLIENTE = c.ID_CLIENTE
    LEFT JOIN 
        tsit_detalleventa pd ON v.ID_VENTA = pd.ID_VENTA
    LEFT JOIN 
        tsim_producto p ON pd.ID_PRODUCTO = p.ID_PRODUCT
    WHERE 
        (v.DSC_VENTA LIKE CONCAT('%', termSearch, '%') 
        OR c.DSC_NOMBRE LIKE CONCAT('%', termSearch, '%') 
        OR c.DSC_APELLIDOUNO LIKE CONCAT('%', termSearch, '%') 
        OR c.DSC_APELLIDODOS LIKE CONCAT('%', termSearch, '%') 
        OR p.DSC_NOMBRE LIKE CONCAT('%', termSearch, '%'))
    LIMIT offset, pageSize;
END$$


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
        CAST(c.ESTADO AS CHAR) LIKE CONCAT('%', p_expectedMatch, '%')
        OR CAST(c.MON_TOTAL AS CHAR) LIKE CONCAT('%', p_expectedMatch, '%')
        OR CAST(c.FEC_ENTRADA AS CHAR) LIKE CONCAT('%', p_expectedMatch, '%')
        OR CAST(c.FEC_COMPRA AS CHAR) LIKE CONCAT('%', p_expectedMatch, '%')
        OR CAST(c.DSC_METODO_PAGO AS CHAR) LIKE CONCAT('%', p_expectedMatch, '%') 
        OR p.DSC_NOMBRE LIKE CONCAT('%', p_expectedMatch, '%') 
        OR EXISTS (
            SELECT 1
            FROM tsit_detalles_compras d2
            JOIN tsim_producto prodD ON d2.DSC_CODIGO_BARRAS = prodD.DSC_CODIGO_BARRAS
            WHERE d2.ID_COMPRA = c.ID_COMPRA
            AND (d2.DSC_CODIGO_BARRAS LIKE CONCAT('%', p_expectedMatch, '%')
                 OR prodD.DSC_NOMBRE LIKE CONCAT('%', p_expectedMatch, '%'))
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
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_categoria`
--

CREATE TABLE `tsim_categoria` (
  `ID_CATEGORIA` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(100) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_categoria`
--

INSERT INTO `tsim_categoria` (`ID_CATEGORIA`, `DSC_NOMBRE`, `FEC_CREADOEN`, `FEC_MODIFICADOEN`, `ESTADO`) VALUES
(3, 'Electronica', '2024-10-14 18:15:14', '2024-10-14 18:49:36', 2),
(4, 'Ropa', '2024-10-14 18:15:23', NULL, 1),
(5, 'Hogar y oficina', '2024-10-14 18:17:02', '2024-10-14 18:17:22', 1),
(6, 'Juguetes y juegos', '2024-10-14 18:18:05', '2024-10-14 18:51:34', 1),
(7, 'Alimentos y bebidas', '2024-10-14 18:18:15', NULL, 1),
(8, 'Deportes y Aire libre', '2024-10-14 18:18:27', NULL, 1),
(9, 'Belleza y cuidado personal', '2024-10-14 18:18:54', '2025-01-17 14:24:55', 2),
(10, 'Libros y papelería', '2024-10-14 18:19:09', NULL, 1),
(11, 'Zapatos y accesorios', '2024-10-14 18:19:21', '2024-10-14 18:20:40', 1),
(12, 'Salud y bienestar', '2024-10-14 18:19:33', '2024-12-11 19:34:57', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_empresa`
--

CREATE TABLE `tsim_empresa` (
  `ID_EMPRESA` int(11) NOT NULL,
  `DSC_RANGO_STOCK` int(255) NOT NULL,
  `DSC_NOMBRE` varchar(50) DEFAULT NULL,
  `NUM_TELEFONO` varchar(8) DEFAULT NULL,
  `DSC_CORREO` varchar(100) DEFAULT NULL,
  `DSC_DIRECCION` varchar(100) DEFAULT NULL,
  `DSC_ESLOGAN` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_empresa`
--

INSERT INTO `tsim_empresa` (`ID_EMPRESA`, `DSC_RANGO_STOCK`, `DSC_NOMBRE`, `NUM_TELEFONO`, `DSC_CORREO`, `DSC_DIRECCION`, `DSC_ESLOGAN`) VALUES
(1, 32, 'Tienda Zaid & Snayder', '88888888', 'tienda@gmail.com', 'Cariari, centro', 'Aquí esta el eslogan');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_estado`
--

CREATE TABLE `tsim_estado` (
  `ID_ESTADO` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(100) DEFAULT NULL COMMENT 'Activo, inactivo, suspendido',
  `DSC_PARA` varchar(100) DEFAULT NULL COMMENT 'Nombre de el modulo al que pertenece el estado',
  `FEC_CREADOEN` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_estado`
--

INSERT INTO `tsim_estado` (`ID_ESTADO`, `DSC_NOMBRE`, `DSC_PARA`, `FEC_CREADOEN`) VALUES
(1, 'Activo', 'Lo que sea', '2024-10-12 17:53:52'),
(2, 'Inactivo', 'Lo que sea x2', '2024-10-12 17:53:52'),
(3, 'Pendiente', 'Estado \'Pendiente\' para las ventas a crédito', '2025-03-26 21:30:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_permiso`
--

CREATE TABLE `tsim_permiso` (
  `ID_PERMISO` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(100) DEFAULT NULL,
  `DSC_DESCRIPCION` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_permiso`
--

INSERT INTO `tsim_permiso` (`ID_PERMISO`, `DSC_NOMBRE`, `DSC_DESCRIPCION`) VALUES
(1, 'Usuarios', 'Se le permite el acceso a la página de usuarios. Puede realizar acciones como: ver todos los usuarios, eliminar, agregar, modificar y cambiar permisos.'),
(2, 'Categorias', 'Se le permite el acceso a la página de categorias. Puede realizar acciones como: ver todas las categorias y sus subcategorias, eliminar, agregar y modificar.'),
(3, 'Proveedores', 'Se le permite el acceso a la página de proveedores. Puede realizar acciones como: ver todos los proveedores e información detallada, eliminar, agregar y modificar.'),
(4, 'Clientes', 'Se le permite el acceso a la página de clientes. Puede realizar acciones como: ver todos los clientes e información detallada, eliminar, agregar y modificar.'),
(5, 'Compras', 'Se le permite el acceso a la página de compras. Puede realizar acciones como: ver todas las compras e información detallada, eliminar, agregar y modificar.'),
(6, 'Reportes', 'Se le permite el acceso a la página de reportes. Puede realizar acciones como: ver todos los reportes e información detallada, eliminar, agregar, modificar y descargar los reportes.'),
(7, 'Productos', 'Se le permite el acceso a la página de productos. Puede realizar acciones como: ver todos los productos, eliminar, agregar y modificar'),
(8, 'Ventas', 'Se le permite el acceso a la página de ventas. Puede realizar acciones como: ver realizar una venta, anular venta.'),
(9, 'Transacciones', 'El usuario tiene permitido acceder al modulo de transacciones');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_producto`
--

CREATE TABLE `tsim_producto` (
  `ID_PRODUCT` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(100) DEFAULT NULL,
  `DSC_DESCRIPTION` varchar(255) DEFAULT NULL,
  `DSC_CODIGO_BARRAS` varchar(255) DEFAULT NULL,
  `URL_IMAGEN` varchar(255) DEFAULT NULL,
  `MON_VENTA` double DEFAULT NULL,
  `MON_COMPRA` double DEFAULT NULL,
  `CANTIDAD` int(11) DEFAULT 0,
  `FEC_CREATED_AT` datetime DEFAULT NULL,
  `FEC_UPDATE_AT` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  `ID_SUBCATEGORIA` int(11) NOT NULL,
  `UPDATED_BY_USER` int(11) DEFAULT NULL,
  `CREATED_BY_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_producto`
--

INSERT INTO `tsim_producto` (`ID_PRODUCT`, `DSC_NOMBRE`, `DSC_DESCRIPTION`, `DSC_CODIGO_BARRAS`, `URL_IMAGEN`, `MON_VENTA`, `MON_COMPRA`, `CANTIDAD`, `FEC_CREATED_AT`, `FEC_UPDATE_AT`, `ESTADO`, `ID_SUBCATEGORIA`, `UPDATED_BY_USER`, `CREATED_BY_USER`) VALUES
(21, 'Coca cola', 'Esta es con un recipiente de 1.5L', 'PROD202502190056154', 'image_not_found.png', 2200, 1950, 92, '2025-02-19 00:56:15', '2025-05-04 19:42:45', 1, 1, 16, 10),
(22, 'Bola Nike', 'Deportes', '729857892', 'image_not_found.png', 2000, 1500, 100, '2025-05-04 19:15:27', NULL, 1, 6, NULL, 10),
(23, 'Camisa Adidas', 'Camisa normal', '479238479824', 'image_not_found.png', 5200, 4000, 50, '2025-05-04 19:16:17', NULL, 1, 6, NULL, 10),
(24, 'Papiola', 'comida tosty', '8257983534', 'image_not_found.png', 300, 200, 100, '2025-05-04 19:18:32', NULL, 1, 7, NULL, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_rol`
--

CREATE TABLE `tsim_rol` (
  `ID_ROL` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(50) DEFAULT NULL COMMENT 'SuperAdmin, Administrador, ventas, etc',
  `DSC_DESCRIPCION` varchar(255) DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_rol`
--

INSERT INTO `tsim_rol` (`ID_ROL`, `DSC_NOMBRE`, `DSC_DESCRIPCION`, `ESTADO`) VALUES
(1, 'Admin', 'Para usuarios administradores', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_subcategoria`
--

CREATE TABLE `tsim_subcategoria` (
  `ID_SUBCATEGORIA` int(11) NOT NULL,
  `ID_CATEGORIA` int(11) DEFAULT NULL,
  `DSC_NOMBRE` varchar(100) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `subcategoriamodificadoen` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_subcategoria`
--

INSERT INTO `tsim_subcategoria` (`ID_SUBCATEGORIA`, `ID_CATEGORIA`, `DSC_NOMBRE`, `FEC_CREADOEN`, `subcategoriamodificadoen`, `ESTADO`) VALUES
(1, 7, 'Gaseosa', '2024-10-12 17:53:52', NULL, 1),
(2, 8, 'Futbol', '2025-05-04 19:14:05', NULL, 1),
(3, 3, 'Cargadores', '2025-05-04 19:14:14', NULL, 1),
(4, 6, 'SuperHeroes', '2025-05-04 19:14:28', NULL, 1),
(5, 10, 'Matem', '2025-05-04 19:14:49', NULL, 1),
(6, 4, 'Camisa de vestir', '2025-05-04 19:15:00', NULL, 1),
(7, 7, 'Papas', '2025-05-04 19:18:07', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_tipoproveedor`
--

CREATE TABLE `tsim_tipoproveedor` (
  `ID_TIPOPROVEEDOR` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_tipoproveedor`
--

INSERT INTO `tsim_tipoproveedor` (`ID_TIPOPROVEEDOR`, `DSC_NOMBRE`, `FEC_CREADOEN`, `ESTADO`) VALUES
(1, 'Proveedor de Materia Prima', '2024-11-05 00:00:00', 1),
(2, 'Proveedor de Servicios', '2024-11-05 00:00:00', 1),
(3, 'Proveedor de Tecnología', '2024-11-05 00:00:00', 1),
(4, 'Proveedor de Transporte', '2024-11-05 00:00:00', 1),
(5, 'Proveedor de Mantenimiento', '2024-11-05 00:00:00', 1),
(6, 'Proveedor de Equipos', '2024-11-05 00:00:00', 1),
(7, 'Proveedor de Consultoría', '2024-11-05 00:00:00', 1),
(8, 'Proveedor de Limpieza', '2024-11-05 00:00:00', 1),
(9, 'Proveedor de Seguridad', '2024-11-05 00:00:00', 1),
(10, 'Proveedor de Marketing', '2024-11-05 00:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_abono`
--

CREATE TABLE `tsit_abono` (
  `ID_ABONO` int(11) NOT NULL,
  `ID_CREDITO` int(11) NOT NULL,
  `FEC_ABONO` datetime NOT NULL,
  `MON_ABONADO` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_cliente`
--

CREATE TABLE `tsit_cliente` (
  `ID_CLIENTE` int(11) NOT NULL,
  `DSC_CEDULA` varchar(15) NOT NULL,
  `DSC_NOMBRE` varchar(50) DEFAULT NULL,
  `DSC_APELLIDOUNO` varchar(50) DEFAULT NULL,
  `DSC_APELLIDODOS` varchar(50) DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `URL_FOTO` varchar(255) NOT NULL,
  `DSC_DIRECCION` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_cliente`
--

INSERT INTO `tsit_cliente` (`ID_CLIENTE`, `DSC_CEDULA`, `DSC_NOMBRE`, `DSC_APELLIDOUNO`, `DSC_APELLIDODOS`, `ESTADO`, `FEC_CREADOEN`, `FEC_MODIFICADOEN`, `URL_FOTO`, `DSC_DIRECCION`) VALUES
(6, '402640062', 'Josue Emanuel', 'Porras', 'Rojas', 1, '2025-02-24 11:48:19', NULL, 'public/Assets/image/clientes/402640062.png', 'abajo de la casa'),
(7, '701210527', 'Luis Enrique', 'Aguirre', 'Sosa', 2, '2025-02-24 11:51:18', '2025-02-24 12:25:52', 'public/Assets/image/clientes/701210527.png', 'dad'),
(8, '700620073', 'Yolanda', 'Gutierrez', 'Bonilla', 2, '2025-02-24 12:20:49', '2025-02-24 12:25:53', 'public/Assets/image/clientes/700620073.png', 'jhjshfjksd'),
(9, '701230284', 'Flor Jiseni', 'Gutierrez', 'Barrantes', 2, '2025-02-24 12:22:15', '2025-02-24 12:25:50', 'public/Assets/image/clientes/701230284.png', 'hfhfgh');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_compras`
--

CREATE TABLE `tsit_compras` (
  `ID_COMPRA` int(11) NOT NULL,
  `FEC_COMPRA` date NOT NULL,
  `FEC_ENTRADA` date NOT NULL,
  `FEC_CREATED_AT` date NOT NULL,
  `FEC_UPDATE_AT` date DEFAULT NULL,
  `ESTADO` varchar(255) NOT NULL,
  `MON_TOTAL` double NOT NULL,
  `DSC_METODO_PAGO` varchar(100) NOT NULL,
  `ID_PROVEEDOR` int(11) NOT NULL,
  `UPDATED_BY_USER` int(11) DEFAULT NULL,
  `CREATED_BY_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_compras`
--

INSERT INTO `tsit_compras` (`ID_COMPRA`, `FEC_COMPRA`, `FEC_ENTRADA`, `FEC_CREATED_AT`, `FEC_UPDATE_AT`, `ESTADO`, `MON_TOTAL`, `DSC_METODO_PAGO`, `ID_PROVEEDOR`, `UPDATED_BY_USER`, `CREATED_BY_USER`) VALUES
(24, '2025-05-04', '2025-05-01', '2025-05-04', NULL, '1', 150000, 'Efectivo', 33, NULL, 16),
(25, '2025-05-04', '2025-05-01', '2025-05-04', NULL, '1', 200000, 'Transferencia', 34, NULL, 16),
(26, '2025-05-04', '2025-05-01', '2025-05-04', NULL, '1', 20000, 'Transferencia', 32, NULL, 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_correoproveedor`
--

CREATE TABLE `tsit_correoproveedor` (
  `ID_CORREOPROVEEDOR` int(11) NOT NULL,
  `ID_PROVEEDOR` int(11) DEFAULT NULL,
  `DSC_CORREO` varchar(100) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_correoproveedor`
--

INSERT INTO `tsit_correoproveedor` (`ID_CORREOPROVEEDOR`, `ID_PROVEEDOR`, `DSC_CORREO`, `FEC_CREADOEN`, `ESTADO`) VALUES
(4, 31, 'contacto@proveedor.com', '2025-02-06 23:04:03', 1),
(5, 31, 'ventas@proveedor.com', '2025-02-06 23:04:03', 1),
(6, 32, 'Tosty.cr@ac.cr', '2025-05-04 19:19:44', 1),
(7, 33, 'Nike@ac.cr', '2025-05-04 19:20:55', 1),
(8, 34, 'Adidas@ac.cr', '2025-05-04 19:21:34', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_credito`
--

CREATE TABLE `tsit_credito` (
  `ID_CREDITO` int(11) NOT NULL,
  `ID_VENTA` int(11) NOT NULL,
  `FEC_ULTIMOPAGO` datetime NOT NULL,
  `FEC_VENCIMIENTO` datetime NOT NULL,
  `MON_PENDIENTE` double NOT NULL,
  `ESTADO_CREDITO` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_detalles_compras`
--

CREATE TABLE `tsit_detalles_compras` (
  `ID_DETALLE_COMPRA` int(11) NOT NULL,
  `FEC_UPDATE_AT` date DEFAULT NULL,
  `ESTADO` varchar(255) NOT NULL,
  `MON_PRECIO_COMPRA` double NOT NULL,
  `MON_CANTIDAD` int(11) NOT NULL,
  `ID_COMPRA` int(11) NOT NULL,
  `UPDATED_BY_USER` int(11) DEFAULT NULL,
  `DSC_CODIGO_BARRAS` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_detalles_compras`
--

INSERT INTO `tsit_detalles_compras` (`ID_DETALLE_COMPRA`, `FEC_UPDATE_AT`, `ESTADO`, `MON_PRECIO_COMPRA`, `MON_CANTIDAD`, `ID_COMPRA`, `UPDATED_BY_USER`, `DSC_CODIGO_BARRAS`) VALUES
(36, NULL, '1', 1500, 100, 24, NULL, '729857892'),
(37, NULL, '1', 4000, 50, 25, NULL, '479238479824'),
(38, NULL, '1', 200, 100, 26, NULL, '8257983534');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_detalleventa`
--

CREATE TABLE `tsit_detalleventa` (
  `ID_DETALLEVENTA` int(11) NOT NULL,
  `ID_VENTA` int(11) NOT NULL,
  `ID_PRODUCTO` int(11) NOT NULL,
  `MONT_UNITARIO` double NOT NULL,
  `CANTIDAD` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_permisousuario`
--

CREATE TABLE `tsit_permisousuario` (
  `ID_PERMISOUSUARIO` int(11) NOT NULL,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `ID_PERMISO` int(11) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_permisousuario`
--

INSERT INTO `tsit_permisousuario` (`ID_PERMISOUSUARIO`, `ID_USUARIO`, `ID_PERMISO`, `FEC_CREADOEN`, `ESTADO`) VALUES
(1, 10, 1, '2025-03-19 20:23:09', 1),
(2, 10, 2, '2025-03-19 20:23:09', 1),
(3, 10, 3, '2025-03-19 20:23:09', 1),
(4, 10, 4, '2025-03-19 20:23:09', 1),
(5, 10, 5, '2025-03-19 20:23:09', 1),
(6, 10, 6, '2025-03-19 20:23:09', 1),
(7, 10, 7, '2025-03-19 20:23:09', 1),
(8, 10, 8, '2025-03-19 20:23:09', 1),
(9, 10, 9, '2011-04-25 00:00:00', 1),
(74, 14, 1, '2025-05-04 19:34:38', 1),
(75, 14, 7, '2025-05-04 19:34:38', 1),
(76, 14, 2, '2025-05-04 19:34:38', 1),
(77, 14, 3, '2025-05-04 19:34:38', 1),
(78, 14, 4, '2025-05-04 19:34:38', 0),
(79, 14, 5, '2025-05-04 19:34:38', 0),
(80, 14, 8, '2025-05-04 19:34:38', 0),
(81, 14, 6, '2025-05-04 19:34:38', 1),
(82, 14, 9, '2025-05-04 19:34:38', 0),
(92, 15, 1, '2025-05-04 19:35:44', 0),
(93, 15, 7, '2025-05-04 19:35:44', 0),
(94, 15, 2, '2025-05-04 19:35:44', 0),
(95, 15, 3, '2025-05-04 19:35:44', 0),
(96, 15, 4, '2025-05-04 19:35:44', 0),
(97, 15, 5, '2025-05-04 19:35:44', 0),
(98, 15, 8, '2025-05-04 19:35:44', 1),
(99, 15, 6, '2025-05-04 19:35:44', 1),
(100, 15, 9, '2025-05-04 19:35:44', 1),
(110, 16, 1, '2025-05-04 19:36:26', 1),
(111, 16, 7, '2025-05-04 19:36:26', 1),
(112, 16, 2, '2025-05-04 19:36:26', 1),
(113, 16, 3, '2025-05-04 19:36:26', 1),
(114, 16, 4, '2025-05-04 19:36:26', 1),
(115, 16, 5, '2025-05-04 19:36:26', 1),
(116, 16, 8, '2025-05-04 19:36:26', 1),
(117, 16, 6, '2025-05-04 19:36:26', 1),
(118, 16, 9, '2025-05-04 19:36:26', 1),
(128, 17, 1, '2025-05-04 19:37:17', 0),
(129, 17, 7, '2025-05-04 19:37:17', 1),
(130, 17, 2, '2025-05-04 19:37:17', 0),
(131, 17, 3, '2025-05-04 19:37:17', 1),
(132, 17, 4, '2025-05-04 19:37:17', 1),
(133, 17, 5, '2025-05-04 19:37:17', 1),
(134, 17, 8, '2025-05-04 19:37:17', 1),
(135, 17, 6, '2025-05-04 19:37:17', 1),
(136, 17, 9, '2025-05-04 19:37:17', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_proveedor`
--

CREATE TABLE `tsit_proveedor` (
  `ID_PROVEEDOR` int(11) NOT NULL,
  `IDENTIFICADOR_PROVEEDOR` varchar(255) DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `ID_TIPOPROVEEDOR` int(11) DEFAULT NULL,
  `DSC_VENTA` varchar(500) NOT NULL,
  `CTA_BANCARIA` varchar(500) NOT NULL,
  `DSC_DIRECCIONEXACTA` varchar(255) DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_proveedor`
--

INSERT INTO `tsit_proveedor` (`ID_PROVEEDOR`, `IDENTIFICADOR_PROVEEDOR`, `DSC_NOMBRE`, `ID_TIPOPROVEEDOR`, `DSC_VENTA`, `CTA_BANCARIA`, `DSC_DIRECCIONEXACTA`, `ESTADO`, `FEC_CREADOEN`, `FEC_MODIFICADOEN`) VALUES
(31, 'SUP-20250206 23040-986ba2b3', 'Proveedor Ejemplo S.A.', 1, 'Venta  de construcción', 'CR230123453789011344555', 'los lirios', 1, '2025-02-06 23:04:03', '2025-05-04 19:19:58'),
(32, 'SUP-20250504 19194-0989849a', 'Tosty', 1, 'Proveedora', 'CR230123456789011344555', 'La merced, Costa Rica', 1, '2025-05-04 19:19:44', NULL),
(33, 'SUP-20250504 19205-b315de33', 'Nike', 10, 'Proveedor de suplementos deportivos', 'CR230123456789011344522', 'City Mall, Alajuela', 1, '2025-05-04 19:20:55', NULL),
(34, 'SUP-20250504 19213-19b445c9', 'Adidas', 1, 'Proveedor de camisas', 'CR230123456789011344521', 'CityMall, Alajuela', 1, '2025-05-04 19:21:34', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_telefonocliente`
--

CREATE TABLE `tsit_telefonocliente` (
  `ID_TELEFONOCLIENTE` int(11) NOT NULL,
  `ID_CLIENTE` int(11) DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_telefonocliente`
--

INSERT INTO `tsit_telefonocliente` (`ID_TELEFONOCLIENTE`, `ID_CLIENTE`, `DSC_TELEFONO`, `FEC_CREADOEN`, `FEC_MODIFICADOEN`, `ESTADO`) VALUES
(7, 6, '11223344', '2025-02-24 11:48:19', NULL, 1),
(8, 7, '11223344', '2025-02-24 11:51:18', NULL, 1),
(9, 8, '89204863', '2025-02-24 12:20:49', NULL, 1),
(10, 8, '84602655', '2025-02-24 12:20:49', NULL, 1),
(11, 9, '88776655', '2025-02-24 12:22:15', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_telefonoproveedor`
--

CREATE TABLE `tsit_telefonoproveedor` (
  `ID_TELEFONOPROVEEDOR` int(11) NOT NULL,
  `ID_PROVEEDOR` int(11) DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_telefonoproveedor`
--

INSERT INTO `tsit_telefonoproveedor` (`ID_TELEFONOPROVEEDOR`, `ID_PROVEEDOR`, `DSC_TELEFONO`, `FEC_CREADOEN`, `ESTADO`) VALUES
(4, 31, '12345678', '2025-02-06 23:04:03', 1),
(5, 31, '87654321', '2025-02-06 23:04:03', 1),
(6, 32, '77665544', '2025-05-04 19:19:44', 1),
(7, 33, '99488573', '2025-05-04 19:20:55', 1),
(8, 34, '84756633', '2025-05-04 19:21:34', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_transacciones`
--

CREATE TABLE `tsit_transacciones` (
  `ID_TRANSACCION` int(11) NOT NULL,
  `FEC_TRANSACCION` datetime NOT NULL,
  `METODO_PAGO` varchar(255) NOT NULL,
  `MONTO_PAGO` double NOT NULL,
  `DSC_TRANSACCION` varchar(500) NOT NULL,
  `TIPO_TRANSACCION` varchar(255) NOT NULL,
  `ESTADO` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_transacciones`
--

INSERT INTO `tsit_transacciones` (`ID_TRANSACCION`, `FEC_TRANSACCION`, `METODO_PAGO`, `MONTO_PAGO`, `DSC_TRANSACCION`, `TIPO_TRANSACCION`, `ESTADO`) VALUES
(1, '2025-05-04 19:23:58', 'Efectivo', 2000, 'ref: 33449', 'Sinpe', 1),
(2, '2025-05-04 19:24:13', 'Tarjeta', 12000, 'ref: 20394', 'Sinpe', 1),
(3, '2025-05-04 19:24:33', 'Tarjeta', 1100, 'sin ref', 'Sinpe', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_usuario`
--

CREATE TABLE `tsit_usuario` (
  `ID_USUARIO` int(11) NOT NULL,
  `DSC_NOMBREUSUARIO` varchar(255) DEFAULT NULL,
  `DSC_CONTRASENIA` varchar(255) DEFAULT NULL,
  `DSC_CORREO` varchar(100) DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) DEFAULT NULL,
  `ID_ROL` int(11) DEFAULT NULL,
  `DSC_CEDULA` varchar(15) DEFAULT NULL,
  `DSC_NOMBRE` varchar(50) DEFAULT NULL,
  `DSC_APELLIDOUNO` varchar(50) DEFAULT NULL,
  `DSC_APELLIDODOS` varchar(50) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_usuario`
--

INSERT INTO `tsit_usuario` (`ID_USUARIO`, `DSC_NOMBREUSUARIO`, `DSC_CONTRASENIA`, `DSC_CORREO`, `DSC_TELEFONO`, `ID_ROL`, `DSC_CEDULA`, `DSC_NOMBRE`, `DSC_APELLIDOUNO`, `DSC_APELLIDODOS`, `FEC_CREADOEN`, `ESTADO`) VALUES
(10, 'admin', '$2a$10$rD1Hd4SLCsWjJNS7aoWAw.Egg/N7YFbUh8LkXkExnz6KH7b37hb3G', 'admin@gmail.com', '11111111', 1, '1111111111', 'Admin', 'Admin', 'Admin', '2024-10-12 17:53:52', 1),
(14, 'daniel', '$2a$10$nybANNR81BVIDeG68XTsUOF4cwZigCjiA1W4myF45ZEI6ON5yuipS', 'daniel@gmail.com', '11223344', 1, '703050017', 'Anthony Daniel', 'Briones', 'Vargas', '2025-05-04 19:34:15', 1),
(15, 'josue', '$2a$10$xaalUQ5No9YE9UOju/j8qu9/TDt3RTYpTAyF9HBZAvOX6pvPXiE6u', 'josue@gmail.com', '84602655', 1, '402640062', 'Josue Emanuel', 'Porras', 'Rojas', '2025-05-04 19:35:10', 1),
(16, 'aaron', '$2a$10$.Wdo/EmjWDB5/kJl6hBB0edXlIPY45lnOxH1pORJmDbT4B9DxxbZa', 'aaron@gmail.com', '55443322', 1, '119160537', 'Aaron', 'Matarrita', 'Portuguez', '2025-05-04 19:36:18', 1),
(17, 'yeiler', '$2a$10$wDm/31JmuQatGuB6svwBqeybTP8qFVecIKH1vBS18TXKcJo10xv92', 'yeiler@gmail.com', '77446655', 1, '702590117', 'Yeiler', 'Montes', 'Rojas', '2025-05-04 19:37:07', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_venta`
--

CREATE TABLE `tsit_venta` (
  `ID_VENTA` int(11) NOT NULL,
  `ID_CLIENTE` int(11) DEFAULT NULL,
  `FEC_VENTA` datetime NOT NULL,
  `PORCENT_IMPUESTO` double NOT NULL,
  `METODO_PAGO` varchar(100) NOT NULL,
  `DSC_VENTA` varchar(500) NOT NULL,
  `ESTADO_CREDITO` tinyint(1) NOT NULL,
  `MONT_SUBTOTAL` double NOT NULL,
  `PORCENT_DESCUENTO` double NOT NULL,
  `ESTADO` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tsim_categoria`
--
ALTER TABLE `tsim_categoria`
  ADD PRIMARY KEY (`ID_CATEGORIA`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsim_estado`
--
ALTER TABLE `tsim_estado`
  ADD PRIMARY KEY (`ID_ESTADO`);

--
-- Indices de la tabla `tsim_permiso`
--
ALTER TABLE `tsim_permiso`
  ADD PRIMARY KEY (`ID_PERMISO`);

--
-- Indices de la tabla `tsim_producto`
--
ALTER TABLE `tsim_producto`
  ADD PRIMARY KEY (`ID_PRODUCT`),
  ADD UNIQUE KEY `DSC_CODIGO_BARRAS` (`DSC_CODIGO_BARRAS`),
  ADD KEY `logs_userCreated` (`CREATED_BY_USER`),
  ADD KEY `logs_userUpdated` (`UPDATED_BY_USER`),
  ADD KEY `ID_SUBCATEGORIA` (`ID_SUBCATEGORIA`);

--
-- Indices de la tabla `tsim_rol`
--
ALTER TABLE `tsim_rol`
  ADD PRIMARY KEY (`ID_ROL`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsim_subcategoria`
--
ALTER TABLE `tsim_subcategoria`
  ADD PRIMARY KEY (`ID_SUBCATEGORIA`),
  ADD KEY `ID_CATEGORIA` (`ID_CATEGORIA`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsim_tipoproveedor`
--
ALTER TABLE `tsim_tipoproveedor`
  ADD PRIMARY KEY (`ID_TIPOPROVEEDOR`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsit_abono`
--
ALTER TABLE `tsit_abono`
  ADD PRIMARY KEY (`ID_ABONO`),
  ADD KEY `ID_CREDITO` (`ID_CREDITO`);

--
-- Indices de la tabla `tsit_cliente`
--
ALTER TABLE `tsit_cliente`
  ADD PRIMARY KEY (`ID_CLIENTE`),
  ADD UNIQUE KEY `DSC_CEDULA` (`DSC_CEDULA`),
  ADD UNIQUE KEY `FOTOURL` (`URL_FOTO`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsit_compras`
--
ALTER TABLE `tsit_compras`
  ADD PRIMARY KEY (`ID_COMPRA`),
  ADD KEY `fk_compras_proveedor` (`ID_PROVEEDOR`),
  ADD KEY `fk_compras_usuario_created` (`CREATED_BY_USER`),
  ADD KEY `fk_compras_usuario_updated` (`UPDATED_BY_USER`);

--
-- Indices de la tabla `tsit_correoproveedor`
--
ALTER TABLE `tsit_correoproveedor`
  ADD PRIMARY KEY (`ID_CORREOPROVEEDOR`),
  ADD KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsit_credito`
--
ALTER TABLE `tsit_credito`
  ADD PRIMARY KEY (`ID_CREDITO`),
  ADD KEY `ID_VENTA` (`ID_VENTA`);

--
-- Indices de la tabla `tsit_detalles_compras`
--
ALTER TABLE `tsit_detalles_compras`
  ADD PRIMARY KEY (`ID_DETALLE_COMPRA`),
  ADD KEY `fk_detalles_compras_compra` (`ID_COMPRA`),
  ADD KEY `fk_detalles_compras_usuario_updated` (`UPDATED_BY_USER`),
  ADD KEY `id_producto` (`DSC_CODIGO_BARRAS`);

--
-- Indices de la tabla `tsit_detalleventa`
--
ALTER TABLE `tsit_detalleventa`
  ADD PRIMARY KEY (`ID_DETALLEVENTA`),
  ADD KEY `ID_VENTA` (`ID_VENTA`),
  ADD KEY `ID_PRODUCTO` (`ID_PRODUCTO`);

--
-- Indices de la tabla `tsit_permisousuario`
--
ALTER TABLE `tsit_permisousuario`
  ADD PRIMARY KEY (`ID_PERMISOUSUARIO`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`),
  ADD KEY `ID_PERMISO` (`ID_PERMISO`);

--
-- Indices de la tabla `tsit_proveedor`
--
ALTER TABLE `tsit_proveedor`
  ADD PRIMARY KEY (`ID_PROVEEDOR`),
  ADD UNIQUE KEY `CTA_BANCARIA` (`CTA_BANCARIA`),
  ADD UNIQUE KEY `IDENTIFICADOR_PROVEEDOR` (`IDENTIFICADOR_PROVEEDOR`),
  ADD KEY `ID_TIPOPROVEEDOR` (`ID_TIPOPROVEEDOR`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsit_telefonocliente`
--
ALTER TABLE `tsit_telefonocliente`
  ADD PRIMARY KEY (`ID_TELEFONOCLIENTE`),
  ADD KEY `ID_CLIENTE` (`ID_CLIENTE`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsit_telefonoproveedor`
--
ALTER TABLE `tsit_telefonoproveedor`
  ADD PRIMARY KEY (`ID_TELEFONOPROVEEDOR`),
  ADD KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsit_transacciones`
--
ALTER TABLE `tsit_transacciones`
  ADD PRIMARY KEY (`ID_TRANSACCION`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsit_usuario`
--
ALTER TABLE `tsit_usuario`
  ADD PRIMARY KEY (`ID_USUARIO`),
  ADD KEY `ID_ROL` (`ID_ROL`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsit_venta`
--
ALTER TABLE `tsit_venta`
  ADD PRIMARY KEY (`ID_VENTA`),
  ADD KEY `ID_CLIENTE` (`ID_CLIENTE`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tsim_categoria`
--
ALTER TABLE `tsim_categoria`
  MODIFY `ID_CATEGORIA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tsim_estado`
--
ALTER TABLE `tsim_estado`
  MODIFY `ID_ESTADO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tsim_permiso`
--
ALTER TABLE `tsim_permiso`
  MODIFY `ID_PERMISO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `tsim_producto`
--
ALTER TABLE `tsim_producto`
  MODIFY `ID_PRODUCT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `tsim_rol`
--
ALTER TABLE `tsim_rol`
  MODIFY `ID_ROL` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tsim_subcategoria`
--
ALTER TABLE `tsim_subcategoria`
  MODIFY `ID_SUBCATEGORIA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tsim_tipoproveedor`
--
ALTER TABLE `tsim_tipoproveedor`
  MODIFY `ID_TIPOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tsit_abono`
--
ALTER TABLE `tsit_abono`
  MODIFY `ID_ABONO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tsit_cliente`
--
ALTER TABLE `tsit_cliente`
  MODIFY `ID_CLIENTE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `tsit_compras`
--
ALTER TABLE `tsit_compras`
  MODIFY `ID_COMPRA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `tsit_correoproveedor`
--
ALTER TABLE `tsit_correoproveedor`
  MODIFY `ID_CORREOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tsit_credito`
--
ALTER TABLE `tsit_credito`
  MODIFY `ID_CREDITO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tsit_detalles_compras`
--
ALTER TABLE `tsit_detalles_compras`
  MODIFY `ID_DETALLE_COMPRA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `tsit_detalleventa`
--
ALTER TABLE `tsit_detalleventa`
  MODIFY `ID_DETALLEVENTA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tsit_permisousuario`
--
ALTER TABLE `tsit_permisousuario`
  MODIFY `ID_PERMISOUSUARIO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT de la tabla `tsit_proveedor`
--
ALTER TABLE `tsit_proveedor`
  MODIFY `ID_PROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `tsit_telefonocliente`
--
ALTER TABLE `tsit_telefonocliente`
  MODIFY `ID_TELEFONOCLIENTE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `tsit_telefonoproveedor`
--
ALTER TABLE `tsit_telefonoproveedor`
  MODIFY `ID_TELEFONOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tsit_transacciones`
--
ALTER TABLE `tsit_transacciones`
  MODIFY `ID_TRANSACCION` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tsit_usuario`
--
ALTER TABLE `tsit_usuario`
  MODIFY `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `tsit_venta`
--
ALTER TABLE `tsit_venta`
  MODIFY `ID_VENTA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tsim_categoria`
--
ALTER TABLE `tsim_categoria`
  ADD CONSTRAINT `tsim_categoria_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsim_producto`
--
ALTER TABLE `tsim_producto`
  ADD CONSTRAINT `logs_userCreated` FOREIGN KEY (`CREATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `logs_userUpdated` FOREIGN KEY (`UPDATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `subcategoria` FOREIGN KEY (`ID_SUBCATEGORIA`) REFERENCES `tsim_subcategoria` (`ID_SUBCATEGORIA`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tsim_rol`
--
ALTER TABLE `tsim_rol`
  ADD CONSTRAINT `tsim_rol_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsim_subcategoria`
--
ALTER TABLE `tsim_subcategoria`
  ADD CONSTRAINT `tsim_subcategoria_ibfk_1` FOREIGN KEY (`ID_CATEGORIA`) REFERENCES `tsim_categoria` (`ID_CATEGORIA`),
  ADD CONSTRAINT `tsim_subcategoria_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsim_tipoproveedor`
--
ALTER TABLE `tsim_tipoproveedor`
  ADD CONSTRAINT `tsim_tipoproveedor_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsit_abono`
--
ALTER TABLE `tsit_abono`
  ADD CONSTRAINT `tsit_abono_ibfk_1` FOREIGN KEY (`ID_CREDITO`) REFERENCES `tsit_credito` (`ID_CREDITO`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tsit_cliente`
--
ALTER TABLE `tsit_cliente`
  ADD CONSTRAINT `tsit_cliente_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsit_compras`
--
ALTER TABLE `tsit_compras`
  ADD CONSTRAINT `fk_compras_proveedor` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `tsit_proveedor` (`ID_PROVEEDOR`),
  ADD CONSTRAINT `fk_compras_usuario_created` FOREIGN KEY (`CREATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`),
  ADD CONSTRAINT `fk_compras_usuario_updated` FOREIGN KEY (`UPDATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`);

--
-- Filtros para la tabla `tsit_correoproveedor`
--
ALTER TABLE `tsit_correoproveedor`
  ADD CONSTRAINT `tsit_correoproveedor_ibfk_1` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `tsit_proveedor` (`ID_PROVEEDOR`),
  ADD CONSTRAINT `tsit_correoproveedor_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsit_credito`
--
ALTER TABLE `tsit_credito`
  ADD CONSTRAINT `tsit_credito_ibfk_1` FOREIGN KEY (`ID_VENTA`) REFERENCES `tsit_venta` (`ID_VENTA`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tsit_detalles_compras`
--
ALTER TABLE `tsit_detalles_compras`
  ADD CONSTRAINT `fk_detalles_compras_compra` FOREIGN KEY (`ID_COMPRA`) REFERENCES `tsit_compras` (`ID_COMPRA`),
  ADD CONSTRAINT `fk_detalles_compras_usuario_updated` FOREIGN KEY (`UPDATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`),
  ADD CONSTRAINT `id_producto` FOREIGN KEY (`DSC_CODIGO_BARRAS`) REFERENCES `tsim_producto` (`DSC_CODIGO_BARRAS`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tsit_detalleventa`
--
ALTER TABLE `tsit_detalleventa`
  ADD CONSTRAINT `tsit_detalleventa_ibfk_1` FOREIGN KEY (`ID_VENTA`) REFERENCES `tsit_venta` (`ID_VENTA`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tsit_detalleventa_ibfk_2` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `tsim_producto` (`ID_PRODUCT`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tsit_permisousuario`
--
ALTER TABLE `tsit_permisousuario`
  ADD CONSTRAINT `tsit_permisousuario_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `tsit_usuario` (`ID_USUARIO`),
  ADD CONSTRAINT `tsit_permisousuario_ibfk_2` FOREIGN KEY (`ID_PERMISO`) REFERENCES `tsim_permiso` (`ID_PERMISO`);

--
-- Filtros para la tabla `tsit_proveedor`
--
ALTER TABLE `tsit_proveedor`
  ADD CONSTRAINT `tsit_proveedor_ibfk_1` FOREIGN KEY (`ID_TIPOPROVEEDOR`) REFERENCES `tsim_tipoproveedor` (`ID_TIPOPROVEEDOR`),
  ADD CONSTRAINT `tsit_proveedor_ibfk_3` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsit_telefonocliente`
--
ALTER TABLE `tsit_telefonocliente`
  ADD CONSTRAINT `tsit_telefonocliente_ibfk_1` FOREIGN KEY (`ID_CLIENTE`) REFERENCES `tsit_cliente` (`ID_CLIENTE`),
  ADD CONSTRAINT `tsit_telefonocliente_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsit_telefonoproveedor`
--
ALTER TABLE `tsit_telefonoproveedor`
  ADD CONSTRAINT `tsit_telefonoproveedor_ibfk_1` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `tsit_proveedor` (`ID_PROVEEDOR`),
  ADD CONSTRAINT `tsit_telefonoproveedor_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsit_transacciones`
--
ALTER TABLE `tsit_transacciones`
  ADD CONSTRAINT `tsit_transacciones_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tsit_usuario`
--
ALTER TABLE `tsit_usuario`
  ADD CONSTRAINT `tsit_usuario_ibfk_1` FOREIGN KEY (`ID_ROL`) REFERENCES `tsim_rol` (`ID_ROL`),
  ADD CONSTRAINT `tsit_usuario_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsit_venta`
--
ALTER TABLE `tsit_venta`
  ADD CONSTRAINT `tsit_venta_ibfk_1` FOREIGN KEY (`ID_CLIENTE`) REFERENCES `tsit_cliente` (`ID_CLIENTE`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tsit_venta_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
