-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-03-2025 a las 01:43:47
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

CREATE TABLE IF NOT EXISTS `tsim_categoria` (
  `ID_CATEGORIA` int(11) NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_CATEGORIA`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS `tsim_empresa` (
  `ID_EMPRESA` int(11) NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(50) DEFAULT NULL,
  `NUM_TELEFONO` varchar(8) DEFAULT NULL,
  `DSC_MENSAJE_VENTA` varchar(100) DEFAULT NULL,
  `FEC_CREACICON` datetime DEFAULT NULL,
  `FEC_MODIFICADO` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_EMPRESA`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_estado`
--

CREATE TABLE IF NOT EXISTS `tsim_estado` (
  `ID_ESTADO` int(11) NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) DEFAULT NULL COMMENT 'Activo, inactivo, suspendido',
  `DSC_PARA` varchar(100) DEFAULT NULL COMMENT 'Nombre de el modulo al que pertenece el estado',
  `FEC_CREADOEN` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_estado`
--

INSERT INTO `tsim_estado` (`ID_ESTADO`, `DSC_NOMBRE`, `DSC_PARA`, `FEC_CREADOEN`) VALUES
(1, 'Activo', 'Lo que sea', '2024-10-12 17:53:52'),
(2, 'Inactivo', 'Lo que sea x2', '2024-10-12 17:53:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_fechainiciosesion`
--

CREATE TABLE IF NOT EXISTS `tsim_fechainiciosesion` (
  `ID_FECHAINICIOSESION` int(11) NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `FEC_ULTIMOINGRESO` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_FECHAINICIOSESION`),
  KEY `ID_USUARIO` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_permiso`
--

CREATE TABLE IF NOT EXISTS `tsim_permiso` (
  `ID_PERMISO` int(11) NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) DEFAULT NULL,
  `DSC_DESCRIPCION` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_PERMISO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_producto`
--

CREATE TABLE IF NOT EXISTS `tsim_producto` (
  `ID_PRODUCT` int(11) NOT NULL AUTO_INCREMENT,
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
  `CREATED_BY_USER` int(11) NOT NULL,
  PRIMARY KEY (`ID_PRODUCT`),
  UNIQUE KEY `DSC_CODIGO_BARRAS` (`DSC_CODIGO_BARRAS`),
  KEY `logs_userCreated` (`CREATED_BY_USER`),
  KEY `logs_userUpdated` (`UPDATED_BY_USER`),
  KEY `ID_SUBCATEGORIA` (`ID_SUBCATEGORIA`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_producto`
--

INSERT INTO `tsim_producto` (`ID_PRODUCT`, `DSC_NOMBRE`, `DSC_DESCRIPTION`, `DSC_CODIGO_BARRAS`, `URL_IMAGEN`, `MON_VENTA`, `MON_COMPRA`, `CANTIDAD`, `FEC_CREATED_AT`, `FEC_UPDATE_AT`, `ESTADO`, `ID_SUBCATEGORIA`, `UPDATED_BY_USER`, `CREATED_BY_USER`) VALUES
(21, 'Coca cola', 'Esta es con un recipiente de 1.5L', 'PROD202502190056154', 'image_not_found.png', 2200, 1950, 92, '2025-02-19 00:56:15', NULL, 2, 1, NULL, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_rol`
--

CREATE TABLE IF NOT EXISTS `tsim_rol` (
  `ID_ROL` int(11) NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(50) DEFAULT NULL COMMENT 'SuperAdmin, Administrador, ventas, etc',
  `DSC_DESCRIPCION` varchar(255) DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_ROL`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_rol`
--

INSERT INTO `tsim_rol` (`ID_ROL`, `DSC_NOMBRE`, `DSC_DESCRIPCION`, `ESTADO`) VALUES
(1, 'Admin', 'Para usuarios administradores', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_subcategoria`
--

CREATE TABLE IF NOT EXISTS `tsim_subcategoria` (
  `ID_SUBCATEGORIA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_CATEGORIA` int(11) DEFAULT NULL,
  `DSC_NOMBRE` varchar(100) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `subcategoriamodificadoen` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_SUBCATEGORIA`),
  KEY `ID_CATEGORIA` (`ID_CATEGORIA`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_subcategoria`
--

INSERT INTO `tsim_subcategoria` (`ID_SUBCATEGORIA`, `ID_CATEGORIA`, `DSC_NOMBRE`, `FEC_CREADOEN`, `subcategoriamodificadoen`, `ESTADO`) VALUES
(1, 7, 'Gaseosa', '2024-10-12 17:53:52', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_tipoproveedor`
--

CREATE TABLE IF NOT EXISTS `tsim_tipoproveedor` (
  `ID_TIPOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_TIPOPROVEEDOR`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS `tsit_abono` (
  `ID_ABONO` int(11) NOT NULL,
  `ID_CREDITO` int(11) NOT NULL,
  `FEC_ABONO` datetime NOT NULL,
  `MON_ABONADO` double NOT NULL,
  PRIMARY KEY (`ID_ABONO`),
  KEY `ID_CREDITO` (`ID_CREDITO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_cliente`
--

CREATE TABLE IF NOT EXISTS `tsit_cliente` (
  `ID_CLIENTE` int(11) NOT NULL AUTO_INCREMENT,
  `DSC_CEDULA` varchar(15) NOT NULL,
  `DSC_NOMBRE` varchar(50) DEFAULT NULL,
  `DSC_APELLIDOUNO` varchar(50) DEFAULT NULL,
  `DSC_APELLIDODOS` varchar(50) DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `URL_FOTO` varchar(255) NOT NULL,
  `DSC_DIRECCION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID_CLIENTE`),
  UNIQUE KEY `DSC_CEDULA` (`DSC_CEDULA`),
  UNIQUE KEY `FOTOURL` (`URL_FOTO`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS `tsit_compras` (
  `ID_COMPRA` int(11) NOT NULL AUTO_INCREMENT,
  `FEC_COMPRA` date NOT NULL,
  `FEC_ENTRADA` date NOT NULL,
  `FEC_CREATED_AT` date NOT NULL,
  `FEC_UPDATE_AT` date DEFAULT NULL,
  `ESTADO` varchar(255) NOT NULL,
  `MON_TOTAL` double NOT NULL,
  `DSC_METODO_PAGO` varchar(100) NOT NULL,
  `ID_PROVEEDOR` int(11) NOT NULL,
  `UPDATED_BY_USER` int(11) DEFAULT NULL,
  `CREATED_BY_USER` int(11) NOT NULL,
  PRIMARY KEY (`ID_COMPRA`),
  KEY `fk_compras_proveedor` (`ID_PROVEEDOR`),
  KEY `fk_compras_usuario_created` (`CREATED_BY_USER`),
  KEY `fk_compras_usuario_updated` (`UPDATED_BY_USER`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_correoproveedor`
--

CREATE TABLE IF NOT EXISTS `tsit_correoproveedor` (
  `ID_CORREOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT,
  `ID_PROVEEDOR` int(11) DEFAULT NULL,
  `DSC_CORREO` varchar(100) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_CORREOPROVEEDOR`),
  KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_correoproveedor`
--

INSERT INTO `tsit_correoproveedor` (`ID_CORREOPROVEEDOR`, `ID_PROVEEDOR`, `DSC_CORREO`, `FEC_CREADOEN`, `ESTADO`) VALUES
(4, 31, 'contacto@proveedor.com', '2025-02-06 23:04:03', 1),
(5, 31, 'ventas@proveedor.com', '2025-02-06 23:04:03', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_credito`
--

CREATE TABLE IF NOT EXISTS `tsit_credito` (
  `ID_CREDITO` int(11) NOT NULL AUTO_INCREMENT,
  `ID_VENTA` int(11) NOT NULL,
  `FEC_ULTIMOPAGO` datetime NOT NULL,
  `FEC_VENCIMIENTO` datetime NOT NULL,
  `MON_PENDIENTE` double NOT NULL,
  `ESTADO_CREDITO` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID_CREDITO`),
  KEY `ID_VENTA` (`ID_VENTA`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_credito`
--

INSERT INTO `tsit_credito` (`ID_CREDITO`, `ID_VENTA`, `FEC_ULTIMOPAGO`, `FEC_VENCIMIENTO`, `MON_PENDIENTE`, `ESTADO_CREDITO`) VALUES
(1, 1, '2025-03-21 11:39:38', '2025-04-29 18:00:00', 250, 1),
(2, 2, '2025-03-23 13:26:47', '2025-04-29 18:00:00', 250, 1),
(3, 3, '2025-03-23 18:38:09', '2025-04-29 18:00:00', 250, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_detalles_compras`
--

CREATE TABLE IF NOT EXISTS `tsit_detalles_compras` (
  `ID_DETALLE_COMPRA` int(11) NOT NULL AUTO_INCREMENT,
  `FEC_UPDATE_AT` date DEFAULT NULL,
  `ESTADO` varchar(255) NOT NULL,
  `MON_PRECIO_COMPRA` double NOT NULL,
  `MON_CANTIDAD` int(11) NOT NULL,
  `ID_COMPRA` int(11) NOT NULL,
  `UPDATED_BY_USER` int(11) DEFAULT NULL,
  `DSC_CODIGO_BARRAS` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_DETALLE_COMPRA`),
  KEY `fk_detalles_compras_compra` (`ID_COMPRA`),
  KEY `fk_detalles_compras_usuario_updated` (`UPDATED_BY_USER`),
  KEY `id_producto` (`DSC_CODIGO_BARRAS`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_detalleventa`
--

CREATE TABLE IF NOT EXISTS `tsit_detalleventa` (
  `ID_DETALLEVENTA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_VENTA` int(11) NOT NULL,
  `ID_PRODUCTO` int(11) NOT NULL,
  `MONT_UNITARIO` double NOT NULL,
  `CANTIDAD` int(11) NOT NULL,
  PRIMARY KEY (`ID_DETALLEVENTA`),
  KEY `ID_VENTA` (`ID_VENTA`),
  KEY `ID_PRODUCTO` (`ID_PRODUCTO`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_detalleventa`
--

INSERT INTO `tsit_detalleventa` (`ID_DETALLEVENTA`, `ID_VENTA`, `ID_PRODUCTO`, `MONT_UNITARIO`, `CANTIDAD`) VALUES
(1, 1, 21, 150, 3),
(2, 2, 21, 75, 2),
(3, 3, 21, 50, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_permisousuario`
--

CREATE TABLE IF NOT EXISTS `tsit_permisousuario` (
  `ID_PERMISOUSUARIO` int(11) NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `ID_PERMISO` int(11) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_PERMISOUSUARIO`),
  KEY `ID_USUARIO` (`ID_USUARIO`),
  KEY `ID_PERMISO` (`ID_PERMISO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_proveedor`
--

CREATE TABLE IF NOT EXISTS `tsit_proveedor` (
  `ID_PROVEEDOR` int(11) NOT NULL AUTO_INCREMENT,
  `IDENTIFICADOR_PROVEEDOR` varchar(255) DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `ID_TIPOPROVEEDOR` int(11) DEFAULT NULL,
  `DSC_VENTA` varchar(500) NOT NULL,
  `CTA_BANCARIA` varchar(500) NOT NULL,
  `DSC_DIRECCIONEXACTA` varchar(255) DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_PROVEEDOR`),
  UNIQUE KEY `CTA_BANCARIA` (`CTA_BANCARIA`),
  UNIQUE KEY `IDENTIFICADOR_PROVEEDOR` (`IDENTIFICADOR_PROVEEDOR`),
  KEY `ID_TIPOPROVEEDOR` (`ID_TIPOPROVEEDOR`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_proveedor`
--

INSERT INTO `tsit_proveedor` (`ID_PROVEEDOR`, `IDENTIFICADOR_PROVEEDOR`, `DSC_NOMBRE`, `ID_TIPOPROVEEDOR`, `DSC_VENTA`, `CTA_BANCARIA`, `DSC_DIRECCIONEXACTA`, `ESTADO`, `FEC_CREADOEN`, `FEC_MODIFICADOEN`) VALUES
(31, 'SUP-20250206 23040-986ba2b3', 'Proveedor Ejemplo S.A.', 1, 'Venta  de construcción', 'cta-77', 'los lirios', 1, '2025-02-06 23:04:03', '2025-02-06 23:44:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_telefonocliente`
--

CREATE TABLE IF NOT EXISTS `tsit_telefonocliente` (
  `ID_TELEFONOCLIENTE` int(11) NOT NULL AUTO_INCREMENT,
  `ID_CLIENTE` int(11) DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_TELEFONOCLIENTE`),
  KEY `ID_CLIENTE` (`ID_CLIENTE`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS `tsit_telefonoproveedor` (
  `ID_TELEFONOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT,
  `ID_PROVEEDOR` int(11) DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_TELEFONOPROVEEDOR`),
  KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_telefonoproveedor`
--

INSERT INTO `tsit_telefonoproveedor` (`ID_TELEFONOPROVEEDOR`, `ID_PROVEEDOR`, `DSC_TELEFONO`, `FEC_CREADOEN`, `ESTADO`) VALUES
(4, 31, '12345678', '2025-02-06 23:04:03', 1),
(5, 31, '87654321', '2025-02-06 23:04:03', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_usuario`
--

CREATE TABLE IF NOT EXISTS `tsit_usuario` (
  `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT,
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
  `ESTADO` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  KEY `ID_ROL` (`ID_ROL`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_usuario`
--

INSERT INTO `tsit_usuario` (`ID_USUARIO`, `DSC_NOMBREUSUARIO`, `DSC_CONTRASENIA`, `DSC_CORREO`, `DSC_TELEFONO`, `ID_ROL`, `DSC_CEDULA`, `DSC_NOMBRE`, `DSC_APELLIDOUNO`, `DSC_APELLIDODOS`, `FEC_CREADOEN`, `ESTADO`) VALUES
(10, 'admin', '$2a$10$rD1Hd4SLCsWjJNS7aoWAw.Egg/N7YFbUh8LkXkExnz6KH7b37hb3G', 'admin@gmail.com', '11111111', 1, '1111111111', 'Admin', 'Admin', 'Admin', '2024-10-12 17:53:52', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_venta`
--

CREATE TABLE IF NOT EXISTS `tsit_venta` (
  `ID_VENTA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_CLIENTE` int(11) DEFAULT NULL,
  `FEC_VENTA` datetime NOT NULL,
  `PORCENT_IMPUESTO` double NOT NULL,
  `METODO_PAGO` varchar(100) NOT NULL,
  `DSC_VENTA` varchar(500) NOT NULL,
  `ESTADO_CREDITO` tinyint(1) NOT NULL,
  `MONT_SUBTOTAL` double NOT NULL,
  `PORCENT_DESCUENTO` double NOT NULL,
  `ESTADO` int(11) NOT NULL,
  PRIMARY KEY (`ID_VENTA`),
  KEY `ID_CLIENTE` (`ID_CLIENTE`),
  KEY `ESTADO` (`ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_venta`
--

INSERT INTO `tsit_venta` (`ID_VENTA`, `ID_CLIENTE`, `FEC_VENTA`, `PORCENT_IMPUESTO`, `METODO_PAGO`, `DSC_VENTA`, `ESTADO_CREDITO`, `MONT_SUBTOTAL`, `PORCENT_DESCUENTO`, `ESTADO`) VALUES
(1, 9, '2025-03-21 11:39:38', 13, 'Tarjeta', 'Descuento por temporada', 1, 250, 10, 1),
(2, 9, '2025-03-23 13:26:47', 13, 'Tarjeta', 'Descuento por temporada', 1, 250, 10, 1),
(3, 8, '2025-03-23 18:38:09', 13, 'Tarjeta', 'Hola', 1, 250, 10, 1);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tsim_categoria`
--
ALTER TABLE `tsim_categoria`
  ADD CONSTRAINT `tsim_categoria_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsim_fechainiciosesion`
--
ALTER TABLE `tsim_fechainiciosesion`
  ADD CONSTRAINT `tsim_fechainiciosesion_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `tsit_usuario` (`ID_USUARIO`);

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
