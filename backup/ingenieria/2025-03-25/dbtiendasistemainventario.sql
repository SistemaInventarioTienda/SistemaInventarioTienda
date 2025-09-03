-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-03-2025 a las 02:35:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `dbtiendasistemainventario`
--

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
(3, 'Bolsos', '2024-10-14 18:15:14', '2025-02-24 09:21:37', 1),
(4, 'Ropa', '2024-10-14 18:15:23', NULL, 1),
(5, 'Relojes', '2024-10-14 18:17:02', '2025-02-24 09:21:56', 1),
(6, 'Gafas de sol', '2024-10-14 18:18:05', '2025-02-24 09:22:17', 1),
(7, 'Accesorios', '2024-10-14 18:18:15', '2025-02-24 09:21:51', 1),
(8, 'Perfumes', '2024-10-14 18:18:27', '2025-02-24 09:21:43', 1),
(9, 'Maquillaje', '2024-10-14 18:18:54', '2025-02-24 09:21:27', 1),
(10, 'Joyería', '2024-10-14 18:19:09', '2025-02-24 09:22:27', 1),
(11, 'Zapatos', '2024-10-14 18:19:21', '2025-02-24 09:21:14', 1),
(12, 'Cuidado de la piel', '2024-10-14 18:19:33', '2025-02-24 09:22:39', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_empresa`
--

DROP TABLE IF EXISTS `tsim_empresa`;
CREATE TABLE `tsim_empresa` (
  `ID_EMPRESA` int(11) NOT NULL,
  `DSC_RANGO_STOCK` int(11) NOT NULL,
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
(1, 100, 'Empresa Actualizada', '12345678', 'contacto@empresa.com', 'Nueva dirección', 'Esto es un eslogan');

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
(2, 'Inactivo', 'Lo que sea x2', '2024-10-12 17:53:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_fechainiciosesion`
--

CREATE TABLE `tsim_fechainiciosesion` (
  `ID_FECHAINICIOSESION` int(11) NOT NULL,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `FEC_ULTIMOINGRESO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(7, 'Productos', 'Se le permite el acceso a la página de productos. Puede realizar acciones como: ver todos los productos, eliminar, agregar y modificar.'),
(8, 'Ventas', 'Se le permite el acceso a la página de ventas. Puede realizar acciones como: ver todos las ventas, anularlas y agregar.');

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

INSERT INTO `tsim_producto` (`ID_PRODUCT`, `DSC_NOMBRE`, `DSC_DESCRIPTION`, `DSC_CODIGO_BARRAS`, `URL_IMAGEN`, `MON_VENTA`, `MON_COMPRA`, `FEC_CREATED_AT`, `FEC_UPDATE_AT`, `ESTADO`, `ID_SUBCATEGORIA`, `UPDATED_BY_USER`, `CREATED_BY_USER`) VALUES
(21, 'Camisa Casual', 'Camisa de algodón para uso diario', 'PROD202502190056154', 'PROD-1740411941118-787330255.jpg', 12800, 6400, '2025-02-19 00:56:15', '2025-02-24 12:48:57', 1, 2, 10, 10),
(22, 'Pantalón de Mezclilla', 'Jeans azul clásico', 'PROD202502190056152', 'PROD-1740414546871-40700107.jpg', 25000, 15000, '2025-02-21 08:47:40', '2025-02-24 12:50:51', 1, 3, 10, 10),
(23, 'Tenis Deportivos', 'Zapatillas ligeras para correr', 'PROD202502210853346', 'PROD-1740414622622-556700655.jpg', 45000, 20000, '2025-02-21 08:53:34', '2025-02-24 10:30:22', 1, 24, 10, 10),
(24, 'Zapatos de Vestir', 'Calzado elegante de cuero', 'PROD202502210916427', 'PROD-1740414668324-918975405.jpg', 55000, 23000, '2025-02-21 09:16:42', '2025-02-24 10:31:08', 1, 6, 10, 10),
(25, 'Camisa Adidas', 'Camiseta Deportiva Color Negro', '9071300470009', 'PROD-1740193234893-765770361.jpeg', 25000, 5000, '2025-02-21 21:00:34', '2025-03-12 21:58:42', 1, 2, 10, 10),
(26, 'Labial Mate', 'Labial de larga duración sin brillo', 'PROD202502241031509', 'PROD-1740414710765-371437577.jpg', 10500, 5250, '2025-02-24 10:31:50', NULL, 1, 8, NULL, 10);

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
(1, 7, 'Aretes', '2024-10-12 17:53:52', '2025-02-24 09:35:19', 1),
(2, 4, 'Camisas', '2025-02-21 08:42:54', '2025-02-24 09:22:59', 1),
(3, 4, 'Pantalones', '2025-02-24 09:23:13', NULL, 1),
(4, 4, 'Chaquetas', '2025-02-24 09:23:23', NULL, 1),
(5, 11, 'Deportivos', '2025-02-24 09:23:40', NULL, 1),
(6, 11, 'Formales', '2025-02-24 09:23:48', NULL, 1),
(7, 11, 'Zandalias', '2025-02-24 09:23:55', NULL, 1),
(8, 9, 'Labiales', '2025-02-24 09:24:15', NULL, 1),
(9, 9, 'Sombras', '2025-02-24 09:24:22', NULL, 1),
(10, 9, 'Bases', '2025-02-24 09:24:31', NULL, 1),
(11, 3, 'Mochilas', '2025-02-24 09:24:53', NULL, 1),
(12, 3, 'Carteras', '2025-02-24 09:25:01', NULL, 1),
(13, 3, 'Bolsos de mano', '2025-02-24 09:25:10', '2025-03-17 14:55:54', 1),
(14, 8, 'Perfumes de mujer', '2025-02-24 09:25:27', NULL, 1),
(15, 8, 'Perfumes de hombre', '2025-02-24 09:25:35', NULL, 1),
(16, 8, 'Perfumes unisex', '2025-02-24 09:25:42', NULL, 1),
(17, 10, 'Anillos', '2025-02-24 09:26:00', '2025-02-24 09:34:56', 1),
(18, 10, 'Dijes', '2025-02-24 09:26:07', '2025-02-24 09:35:00', 1),
(19, 10, 'Broches', '2025-02-24 09:26:14', '2025-02-24 09:35:08', 1),
(20, 5, 'Digitales', '2025-02-24 09:33:38', NULL, 1),
(21, 5, 'Análogos', '2025-02-24 09:33:46', NULL, 1),
(22, 5, 'Intelligentes', '2025-02-24 09:33:55', NULL, 1),
(23, 6, 'Clásicas', '2025-02-24 09:34:15', NULL, 1),
(24, 6, 'Deportivas', '2025-02-24 09:34:27', NULL, 1),
(25, 6, 'Modernas', '2025-02-24 09:34:31', NULL, 1),
(26, 7, 'Collares', '2025-02-24 09:35:31', NULL, 1),
(27, 7, 'Pulseras', '2025-02-24 09:35:41', NULL, 1),
(28, 12, 'Cremas', '2025-02-24 09:35:58', NULL, 1),
(29, 12, 'Mascarrillas', '2025-02-24 09:36:06', NULL, 1),
(30, 12, 'Serums', '2025-02-24 09:36:14', NULL, 1),
(31, 7, 'asdas', '2025-03-10 19:23:18', NULL, 1),
(32, 7, 'test', '2025-03-12 09:07:07', '2025-03-18 21:21:31', 2),
(33, 7, 'SASD', '2025-03-12 16:59:21', '2025-03-18 21:19:44', 2);

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
(1, 'Proveedor de Ropa Nacional', '2025-02-17 08:35:07', 1),
(2, 'Proveedor de Ropa Internacional', '2025-02-17 08:35:07', 1),
(3, 'Proveedor de Calzado', '2025-02-17 08:35:07', 1),
(4, 'Proveedor de Bolsos y Accesorios', '2025-02-17 08:35:07', 1),
(5, 'Proveedor de Joyería y Bisutería', '2025-02-17 08:35:07', 1),
(6, 'Proveedor de Maquillaje y Cosméticos', '2025-02-17 08:35:07', 1),
(7, 'Proveedor de Insumos Textiles', '2025-02-17 08:35:07', 1),
(8, 'Proveedor de Embalaje y Etiquetas', '2025-02-17 08:35:07', 1),
(9, 'Proveedor de Exhibidores y Maniquíes', '2025-02-17 08:35:07', 1),
(10, 'Proveedor de Transporte y Logística', '2025-02-17 08:35:07', 1);

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
(6, '119160537', 'Aaron', 'Matarrita', 'Portuguez', 1, '2025-02-24 09:01:08', '2025-02-24 11:22:18', 'public/Assets/image/clientes/119160537.png', 'Heredia, Sarapiquí'),
(7, '402640062', 'Josue Emanuel', 'Porras', 'Rojas', 1, '2025-02-24 11:21:21', '2025-03-01 20:12:44', 'public/Assets/image/clientes/402640062.png', 'Heredia, Sarapiquí, Rio Frío'),
(8, '702590117', 'Yeiler', 'Montes', 'Rojas', 1, '2025-02-24 11:22:06', '2025-03-01 20:12:34', 'public/Assets/image/clientes/702590117.png', 'Heredia, Sarapiquí, Horquetas'),
(9, '703050017', 'Anthony Daniel', 'Briones', 'Vargas', 1, '2025-02-24 11:23:03', '2025-03-18 21:24:05', 'public/Assets/image/clientes/703050017.png', 'Guapiles');

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
(1, 1, 'ventas@textilesvalle.com', '2025-02-17 08:36:07', 1),
(2, 1, 'info@textilesvalle.com', '2025-02-17 08:36:07', 1),
(3, 3, 'ventas@modaglobalcr.com', '2025-02-17 08:43:34', 1),
(4, 3, 'info@modaglobalcr.com', '2025-02-17 08:43:34', 1),
(5, 4, 'contacto@zapatoselite.com', '2025-02-17 08:45:16', 1),
(6, 4, 'soporte@zapatoselite.com', '2025-02-17 08:45:16', 1),
(7, 5, 'ventas@bolsostrendy.com', '2025-02-17 08:46:37', 1),
(8, 5, 'info@bolsostrendy.com', '2025-02-17 08:46:37', 1),
(9, 6, 'ventas@joyeriabrillante.com', '2025-02-17 08:48:07', 1),
(10, 6, 'info@beautycostarica.com', '2025-02-17 08:48:07', 1),
(11, 7, 'contacto@beautycostarica.com', '2025-02-17 08:49:40', 1),
(12, 8, 'soporte@etiquetascr.com', '2025-02-17 08:51:27', 1),
(13, 8, 'info@etiquetascr.com', '2025-02-17 08:51:27', 1),
(14, 9, 'ventas@exhibidorespremium.com', '2025-02-17 08:53:46', 1),
(15, 9, 'info@exhibidorespremium.com', '2025-02-17 08:53:46', 1),
(16, 10, 'logistica@expresscr.com', '2025-02-17 08:55:16', 1),
(17, 10, 'envios@expresscr.com', '2025-02-17 08:55:16', 1),
(18, 32, 'provtest@gmail.com', '2025-02-24 09:13:47', 1),
(19, 33, 'test-mail@hotmail.com', '2025-03-03 14:23:30', 1);

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

--
-- Volcado de datos para la tabla `tsit_detalleventa`
--

INSERT INTO `tsit_detalleventa` (`ID_DETALLEVENTA`, `ID_VENTA`, `ID_PRODUCTO`, `MONT_UNITARIO`, `CANTIDAD`) VALUES
(1, 2, 25, 25000, 1),
(2, 3, 25, 25000, 1),
(3, 4, 26, 10500, 1),
(4, 4, 22, 25000, 1),
(5, 4, 23, 45000, 1),
(6, 5, 21, 12800, 1),
(7, 6, 21, 12800, 12),
(8, 6, 22, 25000, 1),
(9, 7, 22, 25000, 1),
(10, 8, 22, 25000, 1),
(11, 9, 24, 55000, 4),
(12, 10, 24, 55000, 4),
(13, 11, 24, 55000, 4);

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
(1, 10, 1, '2025-03-12 22:00:00', 1),
(2, 10, 2, '2025-03-12 22:00:00', 1),
(3, 10, 3, '2025-03-12 22:00:00', 1),
(4, 10, 4, '2025-03-12 22:00:00', 1),
(5, 10, 5, '2025-03-12 22:00:00', 1),
(6, 10, 6, '2025-03-12 22:00:00', 1),
(7, 10, 7, '2025-03-12 22:00:00', 1),
(8, 10, 8, '2025-03-18 20:25:39', 1);

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
(1, 'SUP-20250217 08360-8940ca5f', 'Textiles del Valle', 1, 'Venta de gran variedad de textiles', 'CR050123456789012345678', 'Avenida Central, Calle 5, San José', 1, '2025-02-17 08:36:07', NULL),
(3, 'SUP-20250217 08433-55671a6e', 'Modal Global S.A', 1, 'Ropa al por mayor', 'CR050123456890123456787', 'San José, Avenida Central, Edificio Moda Plaza', 1, '2025-02-17 08:43:34', NULL),
(4, 'SUP-20250217 08451-5aebeb9d', 'Zapatos Elite', 3, 'Calzado de lujo y casual', 'CR120198765432109876542', 'Heredia, 300m norte del Mall Oxígeno', 1, '2025-02-17 08:45:16', NULL),
(5, 'SUP-20250217 08463-3b035232', 'Bolsos & Accesorios Trendy', 4, 'Bolsos, carteras y mochilas', 'CR090145678901234567892', 'Alajuela, diagonal al Parque Juan Santamaría', 1, '2025-02-17 08:46:37', NULL),
(6, 'SUP-20250217 08480-24a427bf', 'Joyería Brillante', 5, 'Joyería de oro, plata y bisutería', 'CR070132345678901234562', 'Escazú, Multiplaza, local #999', 1, '2025-02-17 08:48:07', '2025-03-03 17:13:33'),
(7, 'SUP-20250217 08494-91bca7c1', 'Beauty Costa Rica', 6, 'Maquillaje y productos de belleza', 'CR110165432109876543212', 'Cartago, 60m este de la Basílica de los Ángeles', 1, '2025-02-17 08:49:40', '2025-02-24 11:31:33'),
(8, 'SUP-20250217 08512-a67e139c', 'Empaques & Etiquetas CR', 8, 'Embalaje y etiquetas personalizadas', 'CR060154321098765432101', 'Curridabat, Plaza del Sol, local #999', 1, '2025-02-17 08:51:27', NULL),
(9, 'SUP-20250217 08534-032fa076', 'Exhibidores Premium', 9, 'Maniquíes y vitrinas para tiendas', 'CR130123456789012345672', 'Puntarenas, Paseo de los Turistas, local #999', 1, '2025-02-17 08:53:46', '2025-02-19 09:47:18'),
(10, 'SUP-20250217 08551-a63b840e', 'Logística Express', 10, 'Limón, 100m oeste del Parque Vargas', 'CR040187654321098765432', 'Transporte y distribución de mercancía', 1, '2025-02-17 08:55:16', NULL),
(32, 'SUP-20250224 09134-49d07a33', 'Prov Test', 1, 'Prueba', 'CR030187654321098765432', 'Heredia', 1, '2025-02-24 09:13:47', NULL),
(33, 'SUP-20250303 14233-e00e4818', 'test', 10, 'test-sell', 'CR050404040404040404041', 'test-direction', 1, '2025-03-03 14:23:30', NULL);

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
(7, 6, '60900809', '2025-02-24 09:01:08', NULL, 1),
(8, 7, '12345678', '2025-02-24 11:21:21', NULL, 1),
(9, 8, '87654321', '2025-02-24 11:22:06', NULL, 1),
(10, 9, '12345679', '2025-02-24 11:23:03', NULL, 1);

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
(1, 1, '22224444', '2025-02-17 08:36:07', 1),
(2, 3, '88881111', '2025-02-17 08:43:34', 1),
(3, 3, '88882222', '2025-02-17 08:43:34', 1),
(4, 4, '87773333', '2025-02-17 08:45:16', 1),
(5, 4, '87774444', '2025-02-17 08:45:16', 1),
(6, 5, '86665555', '2025-02-17 08:46:37', 1),
(7, 5, '86666666', '2025-02-17 08:46:37', 1),
(8, 6, '85558888', '2025-02-17 08:48:07', 1),
(9, 6, '85559999', '2025-02-17 08:48:07', 1),
(10, 7, '84449999', '2025-02-17 08:49:40', 1),
(11, 7, '84440000', '2025-02-17 08:49:40', 1),
(12, 8, '82223333', '2025-02-17 08:51:27', 1),
(13, 8, '82224444', '2025-02-17 08:51:27', 1),
(14, 9, '81115555', '2025-02-17 08:53:46', 1),
(15, 9, '81116666', '2025-02-17 08:53:46', 1),
(16, 10, '80007777', '2025-02-17 08:55:16', 1),
(17, 10, '80008888', '2025-02-17 08:55:16', 1),
(18, 32, '12345678', '2025-02-24 09:13:47', 1),
(19, 33, '12349999', '2025-03-03 14:23:30', 1);

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
(10, 'admin', '$2a$10$rD1Hd4SLCsWjJNS7aoWAw.Egg/N7YFbUh8LkXkExnz6KH7b37hb3G', 'admin@gmail.com', '11111111', 1, '1111111111', 'Admin', 'Admin', 'Admin', '2024-10-12 17:53:52', 1);

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
  `PORCENT_DESCUENTO` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_venta`
--

INSERT INTO `tsit_venta` (`ID_VENTA`, `ID_CLIENTE`, `FEC_VENTA`, `PORCENT_IMPUESTO`, `METODO_PAGO`, `DSC_VENTA`, `ESTADO_CREDITO`, `MONT_SUBTOTAL`, `PORCENT_DESCUENTO`) VALUES
(2, 6, '2025-03-17 15:35:04', 13, 'sinpe', 'PRUEBA', 0, 25000, 0),
(3, NULL, '2025-03-17 15:41:55', 13, 'sinpe', 'PRUEBA', 0, 25000, 0),
(4, NULL, '2025-03-17 15:42:58', 13, 'sinpe', 'Gracias por la visita, vuelva pronto', 0, 80500, 4025),
(5, NULL, '2025-03-17 16:03:02', 13, 'sinpe', 's', 0, 12800, 0),
(6, NULL, '2025-03-17 16:04:26', 13, 'sinpe', 'Gracias por la visita, vuelva pronto', 0, 178600, 0),
(7, NULL, '2025-03-17 16:06:38', 13, 'sinpe', 'Gracias por la visita, vuelva pronto', 0, 25000, 250),
(8, NULL, '2025-03-17 16:06:48', 13, 'sinpe', 'Gracias por la visita, vuelva pronto', 0, 25000, 250),
(9, NULL, '2025-03-17 16:12:02', 13, 'efectivo', 'sss', 0, 220000, 46200),
(10, NULL, '2025-03-17 16:12:25', 13, 'efectivo', 'sss', 0, 220000, 46200),
(11, NULL, '2025-03-17 16:15:30', 13, 'efectivo', 'Gracias por la visita, vuelva pronto', 0, 220000, 8800);

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
-- Indices de la tabla `tsim_empresa`
--
ALTER TABLE `tsim_empresa`
  ADD PRIMARY KEY (`ID_EMPRESA`);

--
-- Indices de la tabla `tsim_estado`
--
ALTER TABLE `tsim_estado`
  ADD PRIMARY KEY (`ID_ESTADO`);

--
-- Indices de la tabla `tsim_fechainiciosesion`
--
ALTER TABLE `tsim_fechainiciosesion`
  ADD PRIMARY KEY (`ID_FECHAINICIOSESION`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`);

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
  ADD KEY `ID_CLIENTE` (`ID_CLIENTE`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tsim_categoria`
--
ALTER TABLE `tsim_categoria`
  MODIFY `ID_CATEGORIA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tsim_empresa`
--
ALTER TABLE `tsim_empresa`
  MODIFY `ID_EMPRESA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tsim_estado`
--
ALTER TABLE `tsim_estado`
  MODIFY `ID_ESTADO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tsim_fechainiciosesion`
--
ALTER TABLE `tsim_fechainiciosesion`
  MODIFY `ID_FECHAINICIOSESION` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsim_permiso`
--
ALTER TABLE `tsim_permiso`
  MODIFY `ID_PERMISO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tsim_producto`
--
ALTER TABLE `tsim_producto`
  MODIFY `ID_PRODUCT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `tsim_rol`
--
ALTER TABLE `tsim_rol`
  MODIFY `ID_ROL` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tsim_subcategoria`
--
ALTER TABLE `tsim_subcategoria`
  MODIFY `ID_SUBCATEGORIA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `tsim_tipoproveedor`
--
ALTER TABLE `tsim_tipoproveedor`
  MODIFY `ID_TIPOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tsit_cliente`
--
ALTER TABLE `tsit_cliente`
  MODIFY `ID_CLIENTE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `tsit_compras`
--
ALTER TABLE `tsit_compras`
  MODIFY `ID_COMPRA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `tsit_correoproveedor`
--
ALTER TABLE `tsit_correoproveedor`
  MODIFY `ID_CORREOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `tsit_credito`
--
ALTER TABLE `tsit_credito`
  MODIFY `ID_CREDITO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsit_detalles_compras`
--
ALTER TABLE `tsit_detalles_compras`
  MODIFY `ID_DETALLE_COMPRA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `tsit_detalleventa`
--
ALTER TABLE `tsit_detalleventa`
  MODIFY `ID_DETALLEVENTA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tsit_permisousuario`
--
ALTER TABLE `tsit_permisousuario`
  MODIFY `ID_PERMISOUSUARIO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tsit_proveedor`
--
ALTER TABLE `tsit_proveedor`
  MODIFY `ID_PROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `tsit_telefonocliente`
--
ALTER TABLE `tsit_telefonocliente`
  MODIFY `ID_TELEFONOCLIENTE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tsit_telefonoproveedor`
--
ALTER TABLE `tsit_telefonoproveedor`
  MODIFY `ID_TELEFONOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `tsit_usuario`
--
ALTER TABLE `tsit_usuario`
  MODIFY `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tsit_venta`
--
ALTER TABLE `tsit_venta`
  MODIFY `ID_VENTA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
  ADD CONSTRAINT `tsit_venta_ibfk_1` FOREIGN KEY (`ID_CLIENTE`) REFERENCES `tsit_cliente` (`ID_CLIENTE`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
