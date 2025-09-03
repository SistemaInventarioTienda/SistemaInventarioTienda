-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-02-2025 a las 19:36:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Base de datos: `dbtiendasistemainventario`
--
DROP DATABASE IF EXISTS `dbtiendasistemainventario`;
CREATE DATABASE IF NOT EXISTS `dbtiendasistemainventario` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `dbtiendasistemainventario`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_categoria`
--

DROP TABLE IF EXISTS `tsim_categoria`;

CREATE TABLE `tsim_categoria` (
    `ID_CATEGORIA` int(11) NOT NULL,
    `DSC_NOMBRE` varchar(100) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `FEC_MODIFICADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_categoria`
--

INSERT INTO
    `tsim_categoria` (
        `ID_CATEGORIA`,
        `DSC_NOMBRE`,
        `FEC_CREADOEN`,
        `FEC_MODIFICADOEN`,
        `ESTADO`
    )
VALUES (
        3,
        'Electronica',
        '2024-10-14 18:15:14',
        '2024-10-14 18:49:36',
        2
    ),
    (
        4,
        'Ropa',
        '2024-10-14 18:15:23',
        NULL,
        1
    ),
    (
        5,
        'Hogar y oficina',
        '2024-10-14 18:17:02',
        '2024-10-14 18:17:22',
        1
    ),
    (
        6,
        'Juguetes y juegos',
        '2024-10-14 18:18:05',
        '2024-10-14 18:51:34',
        1
    ),
    (
        7,
        'Alimentos y bebidas',
        '2024-10-14 18:18:15',
        NULL,
        1
    ),
    (
        8,
        'Deportes y Aire libre',
        '2024-10-14 18:18:27',
        NULL,
        1
    ),
    (
        9,
        'Belleza y cuidado personal',
        '2024-10-14 18:18:54',
        '2025-01-17 14:24:55',
        2
    ),
    (
        10,
        'Libros y papelería',
        '2024-10-14 18:19:09',
        NULL,
        1
    ),
    (
        11,
        'Zapatos y accesorios',
        '2024-10-14 18:19:21',
        '2024-10-14 18:20:40',
        1
    ),
    (
        12,
        'Salud y bienestar',
        '2024-10-14 18:19:33',
        '2024-12-11 19:34:57',
        1
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_empresa`
--

DROP TABLE IF EXISTS `tsim_empresa`;

CREATE TABLE `tsim_empresa` (
    `ID_EMPRESA` int(11) NOT NULL,
    `DSC_NOMBRE` varchar(50) DEFAULT NULL,
    `NUM_TELEFONO` varchar(8) DEFAULT NULL,
    `DSC_MENSAJE_VENTA` varchar(100) DEFAULT NULL,
    `FEC_CREACICON` datetime DEFAULT NULL,
    `FEC_MODIFICADO` datetime DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_estado`
--

DROP TABLE IF EXISTS `tsim_estado`;

CREATE TABLE `tsim_estado` (
    `ID_ESTADO` int(11) NOT NULL,
    `DSC_NOMBRE` varchar(100) DEFAULT NULL COMMENT 'Activo, inactivo, suspendido',
    `DSC_PARA` varchar(100) DEFAULT NULL COMMENT 'Nombre de el modulo al que pertenece el estado',
    `FEC_CREADOEN` datetime DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_estado`
--

INSERT INTO
    `tsim_estado` (
        `ID_ESTADO`,
        `DSC_NOMBRE`,
        `DSC_PARA`,
        `FEC_CREADOEN`
    )
VALUES (
        1,
        'Activo',
        'Lo que sea',
        '2024-10-12 17:53:52'
    ),
    (
        2,
        'Inactivo',
        'Lo que sea x2',
        '2024-10-12 17:53:52'
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_fechainiciosesion`
--

DROP TABLE IF EXISTS `tsim_fechainiciosesion`;

CREATE TABLE `tsim_fechainiciosesion` (
    `ID_FECHAINICIOSESION` int(11) NOT NULL,
    `ID_USUARIO` int(11) DEFAULT NULL,
    `FEC_ULTIMOINGRESO` datetime DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_permiso`
--

DROP TABLE IF EXISTS `tsim_permiso`;

CREATE TABLE `tsim_permiso` (
    `ID_PERMISO` int(11) NOT NULL,
    `DSC_NOMBRE` varchar(100) DEFAULT NULL,
    `DSC_DESCRIPCION` varchar(255) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_producto`
--

DROP TABLE IF EXISTS `tsim_producto`;


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
(21, 'Coca cola', 'Esta es con un recipiente de 1.5L', 'PROD202502190056154', 'image_not_found.png', 2200, 1950, '2025-02-19 00:56:15', NULL, 2, 1, NULL, 10);
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_rol`
--

DROP TABLE IF EXISTS `tsim_rol`;

CREATE TABLE `tsim_rol` (
    `ID_ROL` int(11) NOT NULL,
    `DSC_NOMBRE` varchar(50) DEFAULT NULL COMMENT 'SuperAdmin, Administrador, ventas, etc',
    `DSC_DESCRIPCION` varchar(255) DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_rol`
--

INSERT INTO
    `tsim_rol` (
        `ID_ROL`,
        `DSC_NOMBRE`,
        `DSC_DESCRIPCION`,
        `ESTADO`
    )
VALUES (
        1,
        'Admin',
        'Para usuarios administradores',
        1
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_subcategoria`
--

DROP TABLE IF EXISTS `tsim_subcategoria`;

CREATE TABLE `tsim_subcategoria` (
    `ID_SUBCATEGORIA` int(11) NOT NULL,
    `ID_CATEGORIA` int(11) DEFAULT NULL,
    `DSC_NOMBRE` varchar(100) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `subcategoriamodificadoen` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_subcategoria`
--

INSERT INTO `tsim_subcategoria` (`ID_SUBCATEGORIA`, `ID_CATEGORIA`, `DSC_NOMBRE`, `FEC_CREADOEN`, `subcategoriamodificadoen`, `ESTADO`) VALUES
(1, 7, 'Gaseosa', '2024-10-12 17:53:52', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_tipoproveedor`
--

DROP TABLE IF EXISTS `tsim_tipoproveedor`;

CREATE TABLE `tsim_tipoproveedor` (
    `ID_TIPOPROVEEDOR` int(11) NOT NULL,
    `DSC_NOMBRE` varchar(255) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_tipoproveedor`
--

INSERT INTO
    `tsim_tipoproveedor` (
        `ID_TIPOPROVEEDOR`,
        `DSC_NOMBRE`,
        `FEC_CREADOEN`,
        `ESTADO`
    )
VALUES (
        1,
        'Proveedor de Materia Prima',
        '2024-11-05 00:00:00',
        1
    ),
    (
        2,
        'Proveedor de Servicios',
        '2024-11-05 00:00:00',
        1
    ),
    (
        3,
        'Proveedor de Tecnología',
        '2024-11-05 00:00:00',
        1
    ),
    (
        4,
        'Proveedor de Transporte',
        '2024-11-05 00:00:00',
        1
    ),
    (
        5,
        'Proveedor de Mantenimiento',
        '2024-11-05 00:00:00',
        1
    ),
    (
        6,
        'Proveedor de Equipos',
        '2024-11-05 00:00:00',
        1
    ),
    (
        7,
        'Proveedor de Consultoría',
        '2024-11-05 00:00:00',
        1
    ),
    (
        8,
        'Proveedor de Limpieza',
        '2024-11-05 00:00:00',
        1
    ),
    (
        9,
        'Proveedor de Seguridad',
        '2024-11-05 00:00:00',
        1
    ),
    (
        10,
        'Proveedor de Marketing',
        '2024-11-05 00:00:00',
        1
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_cliente`
--

DROP TABLE IF EXISTS `tsit_cliente`;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_correoproveedor`
--

DROP TABLE IF EXISTS `tsit_correoproveedor`;

CREATE TABLE `tsit_correoproveedor` (
    `ID_CORREOPROVEEDOR` int(11) NOT NULL,
    `ID_PROVEEDOR` int(11) DEFAULT NULL,
    `DSC_CORREO` varchar(100) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_correoproveedor`
--

INSERT INTO
    `tsit_correoproveedor` (
        `ID_CORREOPROVEEDOR`,
        `ID_PROVEEDOR`,
        `DSC_CORREO`,
        `FEC_CREADOEN`,
        `ESTADO`
    )
VALUES (
        4,
        31,
        'contacto@proveedor.com',
        '2025-02-06 23:04:03',
        1
    ),
    (
        5,
        31,
        'ventas@proveedor.com',
        '2025-02-06 23:04:03',
        1
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_permisousuario`
--

DROP TABLE IF EXISTS `tsit_permisousuario`;

CREATE TABLE `tsit_permisousuario` (
    `ID_PERMISOUSUARIO` int(11) NOT NULL,
    `ID_USUARIO` int(11) DEFAULT NULL,
    `ID_PERMISO` int(11) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_proveedor`
--

DROP TABLE IF EXISTS `tsit_proveedor`;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_proveedor`
--

INSERT INTO
    `tsit_proveedor` (
        `ID_PROVEEDOR`,
        `IDENTIFICADOR_PROVEEDOR`,
        `DSC_NOMBRE`,
        `ID_TIPOPROVEEDOR`,
        `DSC_VENTA`,
        `CTA_BANCARIA`,
        `DSC_DIRECCIONEXACTA`,
        `ESTADO`,
        `FEC_CREADOEN`,
        `FEC_MODIFICADOEN`
    )
VALUES (
        31,
        'SUP-20250206 23040-986ba2b3',
        'Proveedor Ejemplo S.A.',
        1,
        'Venta  de construcción',
        'cta-77',
        'los lirios',
        1,
        '2025-02-06 23:04:03',
        '2025-02-06 23:44:41'
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_telefonocliente`
--

DROP TABLE IF EXISTS `tsit_telefonocliente`;

CREATE TABLE `tsit_telefonocliente` (
    `ID_TELEFONOCLIENTE` int(11) NOT NULL,
    `ID_CLIENTE` int(11) DEFAULT NULL,
    `DSC_TELEFONO` varchar(8) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `FEC_MODIFICADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_telefonoproveedor`
--

DROP TABLE IF EXISTS `tsit_telefonoproveedor`;

CREATE TABLE `tsit_telefonoproveedor` (
    `ID_TELEFONOPROVEEDOR` int(11) NOT NULL,
    `ID_PROVEEDOR` int(11) DEFAULT NULL,
    `DSC_TELEFONO` varchar(8) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_telefonoproveedor`
--

INSERT INTO
    `tsit_telefonoproveedor` (
        `ID_TELEFONOPROVEEDOR`,
        `ID_PROVEEDOR`,
        `DSC_TELEFONO`,
        `FEC_CREADOEN`,
        `ESTADO`
    )
VALUES (
        4,
        31,
        '12345678',
        '2025-02-06 23:04:03',
        1
    ),
    (
        5,
        31,
        '87654321',
        '2025-02-06 23:04:03',
        1
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_usuario`
--

DROP TABLE IF EXISTS `tsit_usuario`;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsit_usuario`
--

INSERT INTO
    `tsit_usuario` (
        `ID_USUARIO`,
        `DSC_NOMBREUSUARIO`,
        `DSC_CONTRASENIA`,
        `DSC_CORREO`,
        `DSC_TELEFONO`,
        `ID_ROL`,
        `DSC_CEDULA`,
        `DSC_NOMBRE`,
        `DSC_APELLIDOUNO`,
        `DSC_APELLIDODOS`,
        `FEC_CREADOEN`,
        `ESTADO`
    )
VALUES (
        10,
        'admin',
        '$2a$10$rD1Hd4SLCsWjJNS7aoWAw.Egg/N7YFbUh8LkXkExnz6KH7b37hb3G',
        'admin@gmail.com',
        '11111111',
        1,
        '1111111111',
        'Admin',
        'Admin',
        'Admin',
        '2024-10-12 17:53:52',
        1
    );

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
ALTER TABLE `tsim_empresa` ADD PRIMARY KEY (`ID_EMPRESA`);

--
-- Indices de la tabla `tsim_estado`
--
ALTER TABLE `tsim_estado` ADD PRIMARY KEY (`ID_ESTADO`);

--
-- Indices de la tabla `tsim_fechainiciosesion`
--
ALTER TABLE `tsim_fechainiciosesion`
ADD PRIMARY KEY (`ID_FECHAINICIOSESION`),
ADD KEY `ID_USUARIO` (`ID_USUARIO`);

--
-- Indices de la tabla `tsim_permiso`
--
ALTER TABLE `tsim_permiso` ADD PRIMARY KEY (`ID_PERMISO`);

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
-- Indices de la tabla `tsit_cliente`
--
ALTER TABLE `tsit_cliente`
ADD PRIMARY KEY (`ID_CLIENTE`),
ADD UNIQUE KEY `DSC_CEDULA` (`DSC_CEDULA`),
ADD UNIQUE KEY `FOTOURL` (`URL_FOTO`),
ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `tsit_correoproveedor`
--
ALTER TABLE `tsit_correoproveedor`
ADD PRIMARY KEY (`ID_CORREOPROVEEDOR`),
ADD KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
ADD KEY `ESTADO` (`ESTADO`);

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tsim_categoria`
--
ALTER TABLE `tsim_categoria`
MODIFY `ID_CATEGORIA` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 14;

--
-- AUTO_INCREMENT de la tabla `tsim_empresa`
--
ALTER TABLE `tsim_empresa`
MODIFY `ID_EMPRESA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsim_estado`
--
ALTER TABLE `tsim_estado`
MODIFY `ID_ESTADO` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT de la tabla `tsim_fechainiciosesion`
--
ALTER TABLE `tsim_fechainiciosesion`
MODIFY `ID_FECHAINICIOSESION` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsim_permiso`
--
ALTER TABLE `tsim_permiso`
MODIFY `ID_PERMISO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsim_producto`
--
ALTER TABLE `tsim_producto`
MODIFY `ID_PRODUCT` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsim_rol`
--
ALTER TABLE `tsim_rol`
MODIFY `ID_ROL` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 2;

--
-- AUTO_INCREMENT de la tabla `tsim_subcategoria`
--
ALTER TABLE `tsim_subcategoria`
MODIFY `ID_SUBCATEGORIA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsim_tipoproveedor`
--
ALTER TABLE `tsim_tipoproveedor`
MODIFY `ID_TIPOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 11;

--
-- AUTO_INCREMENT de la tabla `tsit_cliente`
--
ALTER TABLE `tsit_cliente`
MODIFY `ID_CLIENTE` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 6;

--
-- AUTO_INCREMENT de la tabla `tsit_correoproveedor`
--
ALTER TABLE `tsit_correoproveedor`
MODIFY `ID_CORREOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 6;

--
-- AUTO_INCREMENT de la tabla `tsit_permisousuario`
--
ALTER TABLE `tsit_permisousuario`
MODIFY `ID_PERMISOUSUARIO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsit_proveedor`
--
ALTER TABLE `tsit_proveedor`
MODIFY `ID_PROVEEDOR` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 32;

--
-- AUTO_INCREMENT de la tabla `tsit_telefonocliente`
--
ALTER TABLE `tsit_telefonocliente`
MODIFY `ID_TELEFONOCLIENTE` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 7;

--
-- AUTO_INCREMENT de la tabla `tsit_telefonoproveedor`
--
ALTER TABLE `tsit_telefonoproveedor`
MODIFY `ID_TELEFONOPROVEEDOR` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 6;

--
-- AUTO_INCREMENT de la tabla `tsit_usuario`
--
ALTER TABLE `tsit_usuario`
MODIFY `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 14;

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
-- Filtros para la tabla `tsit_cliente`
--
ALTER TABLE `tsit_cliente`
ADD CONSTRAINT `tsit_cliente_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `tsit_correoproveedor`
--
ALTER TABLE `tsit_correoproveedor`
ADD CONSTRAINT `tsit_correoproveedor_ibfk_1` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `tsit_proveedor` (`ID_PROVEEDOR`),
ADD CONSTRAINT `tsit_correoproveedor_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`);

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

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;