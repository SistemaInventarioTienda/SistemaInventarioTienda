-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-09-2025 a las 21:35:56
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsim_empresa`
--

CREATE TABLE IF NOT EXISTS `tsim_empresa` (
  `ID_EMPRESA` int(11) NOT NULL AUTO_INCREMENT,
  `DSC_RANGO_STOCK` int(255) NOT NULL,
  `DSC_NOMBRE` varchar(50) DEFAULT NULL,
  `NUM_TELEFONO` varchar(8) DEFAULT NULL,
  `DSC_CORREO` varchar(100) DEFAULT NULL,
  `DSC_DIRECCION` varchar(100) DEFAULT NULL,
  `DSC_ESLOGAN` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_EMPRESA`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tsim_empresa`
--

INSERT INTO `tsim_empresa` (`ID_EMPRESA`, `DSC_RANGO_STOCK`, `DSC_NOMBRE`, `NUM_TELEFONO`, `DSC_CORREO`, `DSC_DIRECCION`, `DSC_ESLOGAN`) VALUES
(1, 32, 'Tienda Zaid & Snayder', '88888888', 'tienda@gmail.com', 'Cariari, centro', 'Aquí esta el eslogan');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_productos_proforma`
--

CREATE TABLE IF NOT EXISTS `tsit_productos_proforma` (
  `ID_PRODUCTO_PROFORMA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_PROFORMA` int(11) NOT NULL,
  `ID_PRODUCTO` int(11) NOT NULL,
  `PRECIO_UNITARIO` double NOT NULL,
  `IMPUESTO` double NOT NULL,
  `DESCUENTO` int(11) NOT NULL,
  `CANTIDAD` int(11) NOT NULL,
  PRIMARY KEY (`ID_PRODUCTO_PROFORMA`),
  KEY `ID_PROFORMA` (`ID_PROFORMA`),
  KEY `ID_PRODUCTO` (`ID_PRODUCTO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsit_proforma`
--

CREATE TABLE IF NOT EXISTS `tsit_proforma` (
  `ID_PROFORMA` int(11) NOT NULL AUTO_INCREMENT,
  `DSC_CODIGO_BARRAS` varchar(255) NOT NULL,
  `ID_EMPRESA` int(11) NOT NULL,
  `FEC_CREACION` date NOT NULL,
  `FEC_LIMITE` date NOT NULL,
  `MON_TOTAL` double NOT NULL,
  PRIMARY KEY (`ID_PROFORMA`),
  UNIQUE KEY `DSC_CODIGO_BARRAS` (`DSC_CODIGO_BARRAS`),
  KEY `ID_EMPRESA` (`ID_EMPRESA`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tsit_productos_proforma`
--
ALTER TABLE `tsit_productos_proforma`
  ADD CONSTRAINT `tsit_productos_proforma_ibfk_1` FOREIGN KEY (`ID_PROFORMA`) REFERENCES `tsit_proforma` (`ID_PROFORMA`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tsit_productos_proforma_ibfk_2` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `tsim_producto` (`ID_PRODUCT`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tsit_proforma`
--
ALTER TABLE `tsit_proforma`
  ADD CONSTRAINT `tsit_proforma_ibfk_1` FOREIGN KEY (`ID_EMPRESA`) REFERENCES `tsim_empresa` (`ID_EMPRESA`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
