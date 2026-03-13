-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: dbtiendasistemainventario
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'ac5f7eb6-f3cb-11f0-a0e2-047c165600d9:1-468';

--
-- Table structure for table `tsim_categoria`
--

DROP TABLE IF EXISTS `tsim_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_categoria` (
  `ID_CATEGORIA` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_CATEGORIA`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsim_categoria_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsim_empresa`
--

DROP TABLE IF EXISTS `tsim_empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_empresa` (
  `ID_EMPRESA` int NOT NULL AUTO_INCREMENT,
  `DSC_RANGO_STOCK` int NOT NULL,
  `DSC_NOMBRE` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NUM_TELEFONO` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_CORREO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_DIRECCION` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_ESLOGAN` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID_EMPRESA`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsim_estado`
--

DROP TABLE IF EXISTS `tsim_estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_estado` (
  `ID_ESTADO` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Activo, inactivo, suspendido',
  `DSC_PARA` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nombre de el modulo al que pertenece el estado',
  `FEC_CREADOEN` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsim_permiso`
--

DROP TABLE IF EXISTS `tsim_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_permiso` (
  `ID_PERMISO` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_DESCRIPCION` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID_PERMISO`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsim_producto`
--

DROP TABLE IF EXISTS `tsim_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_producto` (
  `ID_PRODUCT` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_DESCRIPTION` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_CODIGO_BARRAS` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `URL_IMAGEN` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MON_VENTA` double DEFAULT NULL,
  `MON_COMPRA` double DEFAULT NULL,
  `CANTIDAD` int DEFAULT '0',
  `FEC_CREATED_AT` datetime DEFAULT NULL,
  `FEC_UPDATE_AT` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  `ID_SUBCATEGORIA` int NOT NULL,
  `UPDATED_BY_USER` int DEFAULT NULL,
  `CREATED_BY_USER` int NOT NULL,
  PRIMARY KEY (`ID_PRODUCT`),
  UNIQUE KEY `DSC_CODIGO_BARRAS` (`DSC_CODIGO_BARRAS`),
  KEY `logs_userCreated` (`CREATED_BY_USER`),
  KEY `logs_userUpdated` (`UPDATED_BY_USER`),
  KEY `ID_SUBCATEGORIA` (`ID_SUBCATEGORIA`),
  CONSTRAINT `logs_userCreated` FOREIGN KEY (`CREATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`),
  CONSTRAINT `logs_userUpdated` FOREIGN KEY (`UPDATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`),
  CONSTRAINT `subcategoria` FOREIGN KEY (`ID_SUBCATEGORIA`) REFERENCES `tsim_subcategoria` (`ID_SUBCATEGORIA`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `dbtiendasistemainventario`.`tsim_producto` 
ADD COLUMN `DSC_CODIGO_PROD` VARCHAR(255) NULL AFTER `CREATED_BY_USER`;


/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsim_rol`
--

DROP TABLE IF EXISTS `tsim_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_rol` (
  `ID_ROL` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SuperAdmin, Administrador, ventas, etc',
  `DSC_DESCRIPCION` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_ROL`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsim_rol_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsim_subcategoria`
--

DROP TABLE IF EXISTS `tsim_subcategoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_subcategoria` (
  `ID_SUBCATEGORIA` int NOT NULL AUTO_INCREMENT,
  `ID_CATEGORIA` int DEFAULT NULL,
  `DSC_NOMBRE` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `subcategoriamodificadoen` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_SUBCATEGORIA`),
  KEY `ID_CATEGORIA` (`ID_CATEGORIA`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsim_subcategoria_ibfk_1` FOREIGN KEY (`ID_CATEGORIA`) REFERENCES `tsim_categoria` (`ID_CATEGORIA`),
  CONSTRAINT `tsim_subcategoria_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsim_tipoproveedor`
--

DROP TABLE IF EXISTS `tsim_tipoproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_tipoproveedor` (
  `ID_TIPOPROVEEDOR` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_TIPOPROVEEDOR`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsim_tipoproveedor_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_abono`
--

DROP TABLE IF EXISTS `tsit_abono`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_abono` (
  `ID_ABONO` int NOT NULL AUTO_INCREMENT,
  `ID_CREDITO` int NOT NULL,
  `FEC_ABONO` datetime NOT NULL,
  `MON_ABONADO` double NOT NULL,
  PRIMARY KEY (`ID_ABONO`),
  KEY `ID_CREDITO` (`ID_CREDITO`),
  CONSTRAINT `tsit_abono_ibfk_1` FOREIGN KEY (`ID_CREDITO`) REFERENCES `tsit_credito` (`ID_CREDITO`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_cliente`
--

DROP TABLE IF EXISTS `tsit_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_cliente` (
  `ID_CLIENTE` int NOT NULL AUTO_INCREMENT,
  `DSC_CEDULA` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DSC_NOMBRE` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_APELLIDOUNO` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_APELLIDODOS` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `URL_FOTO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DSC_DIRECCION` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID_CLIENTE`),
  UNIQUE KEY `DSC_CEDULA` (`DSC_CEDULA`),
  UNIQUE KEY `FOTOURL` (`URL_FOTO`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_cliente_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_compras`
--

DROP TABLE IF EXISTS `tsit_compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_compras` (
  `ID_COMPRA` int NOT NULL AUTO_INCREMENT,
  `FEC_COMPRA` date NOT NULL,
  `FEC_ENTRADA` date NOT NULL,
  `FEC_CREATED_AT` date NOT NULL,
  `FEC_UPDATE_AT` date DEFAULT NULL,
  `ESTADO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MON_TOTAL` double NOT NULL,
  `DSC_METODO_PAGO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ID_PROVEEDOR` int NOT NULL,
  `UPDATED_BY_USER` int DEFAULT NULL,
  `CREATED_BY_USER` int NOT NULL,
  PRIMARY KEY (`ID_COMPRA`),
  KEY `fk_compras_proveedor` (`ID_PROVEEDOR`),
  KEY `fk_compras_usuario_created` (`CREATED_BY_USER`),
  KEY `fk_compras_usuario_updated` (`UPDATED_BY_USER`),
  CONSTRAINT `fk_compras_proveedor` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `tsit_proveedor` (`ID_PROVEEDOR`),
  CONSTRAINT `fk_compras_usuario_created` FOREIGN KEY (`CREATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`),
  CONSTRAINT `fk_compras_usuario_updated` FOREIGN KEY (`UPDATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_correoproveedor`
--

DROP TABLE IF EXISTS `tsit_correoproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_correoproveedor` (
  `ID_CORREOPROVEEDOR` int NOT NULL AUTO_INCREMENT,
  `ID_PROVEEDOR` int DEFAULT NULL,
  `DSC_CORREO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_CORREOPROVEEDOR`),
  KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_correoproveedor_ibfk_1` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `tsit_proveedor` (`ID_PROVEEDOR`),
  CONSTRAINT `tsit_correoproveedor_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_credito`
--

DROP TABLE IF EXISTS `tsit_credito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_credito` (
  `ID_CREDITO` int NOT NULL AUTO_INCREMENT,
  `ID_VENTA` int NOT NULL,
  `FEC_ULTIMOPAGO` datetime NOT NULL,
  `FEC_VENCIMIENTO` datetime NOT NULL,
  `MON_PENDIENTE` double NOT NULL,
  `ESTADO_CREDITO` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID_CREDITO`),
  KEY `ID_VENTA` (`ID_VENTA`),
  CONSTRAINT `tsit_credito_ibfk_1` FOREIGN KEY (`ID_VENTA`) REFERENCES `tsit_venta` (`ID_VENTA`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_detalles_compras`
--

DROP TABLE IF EXISTS `tsit_detalles_compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_detalles_compras` (
  `ID_DETALLE_COMPRA` int NOT NULL AUTO_INCREMENT,
  `FEC_UPDATE_AT` date DEFAULT NULL,
  `ESTADO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MON_PRECIO_COMPRA` double NOT NULL,
  `MON_CANTIDAD` int NOT NULL,
  `ID_COMPRA` int NOT NULL,
  `UPDATED_BY_USER` int DEFAULT NULL,
  `DSC_CODIGO_BARRAS` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID_DETALLE_COMPRA`),
  KEY `fk_detalles_compras_compra` (`ID_COMPRA`),
  KEY `fk_detalles_compras_usuario_updated` (`UPDATED_BY_USER`),
  KEY `id_producto` (`DSC_CODIGO_BARRAS`),
  CONSTRAINT `fk_detalles_compras_compra` FOREIGN KEY (`ID_COMPRA`) REFERENCES `tsit_compras` (`ID_COMPRA`),
  CONSTRAINT `fk_detalles_compras_usuario_updated` FOREIGN KEY (`UPDATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`),
  CONSTRAINT `id_producto` FOREIGN KEY (`DSC_CODIGO_BARRAS`) REFERENCES `tsim_producto` (`DSC_CODIGO_BARRAS`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_detalleventa`
--

DROP TABLE IF EXISTS `tsit_detalleventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_detalleventa` (
  `ID_DETALLEVENTA` int NOT NULL AUTO_INCREMENT,
  `ID_VENTA` int NOT NULL,
  `ID_PRODUCTO` int NOT NULL,
  `MONT_UNITARIO` double NOT NULL,
  `PORCENT_IMPUESTO` double NOT NULL,
  `PORCENT_DESCUENTO` double NOT NULL,
  `CANTIDAD` int NOT NULL,
  PRIMARY KEY (`ID_DETALLEVENTA`),
  KEY `ID_VENTA` (`ID_VENTA`),
  KEY `ID_PRODUCTO` (`ID_PRODUCTO`),
  CONSTRAINT `tsit_detalleventa_ibfk_1` FOREIGN KEY (`ID_VENTA`) REFERENCES `tsit_venta` (`ID_VENTA`),
  CONSTRAINT `tsit_detalleventa_ibfk_2` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `tsim_producto` (`ID_PRODUCT`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_notificaciones`
--

DROP TABLE IF EXISTS `tsit_notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE tsit_notificaciones (
  ID_NOTIFICACION INT AUTO_INCREMENT PRIMARY KEY,
  ID_PRODUCTO INT NOT NULL,
  TIPO ENUM('STOCK_BAJO') NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  CANTIDAD INT NOT NULL,
  VISTO TINYINT(1) DEFAULT 0,
  FECHA DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_producto_tipo (ID_PRODUCTO, TIPO)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_permisousuario`
--

DROP TABLE IF EXISTS `tsit_permisousuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_permisousuario` (
  `ID_PERMISOUSUARIO` int NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int DEFAULT NULL,
  `ID_PERMISO` int DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_PERMISOUSUARIO`),
  KEY `ID_USUARIO` (`ID_USUARIO`),
  KEY `ID_PERMISO` (`ID_PERMISO`),
  CONSTRAINT `tsit_permisousuario_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `tsit_usuario` (`ID_USUARIO`),
  CONSTRAINT `tsit_permisousuario_ibfk_2` FOREIGN KEY (`ID_PERMISO`) REFERENCES `tsim_permiso` (`ID_PERMISO`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_productos_proforma`
--

DROP TABLE IF EXISTS `tsit_productos_proforma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_productos_proforma` (
  `ID_PRODUCTO_PROFORMA` int NOT NULL AUTO_INCREMENT,
  `ID_PROFORMA` int NOT NULL,
  `ID_PRODUCTO` int NOT NULL,
  `PRECIO_UNITARIO` double NOT NULL,
  `IMPUESTO` double NOT NULL,
  `DESCUENTO` int NOT NULL,
  `CANTIDAD` int NOT NULL,
  PRIMARY KEY (`ID_PRODUCTO_PROFORMA`),
  KEY `ID_PROFORMA` (`ID_PROFORMA`),
  KEY `ID_PRODUCTO` (`ID_PRODUCTO`),
  CONSTRAINT `tsit_productos_proforma_ibfk_1` FOREIGN KEY (`ID_PROFORMA`) REFERENCES `tsit_proforma` (`ID_PROFORMA`),
  CONSTRAINT `tsit_productos_proforma_ibfk_2` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `tsim_producto` (`ID_PRODUCT`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_proforma`
--

DROP TABLE IF EXISTS `tsit_proforma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_proforma` (
  `ID_PROFORMA` int NOT NULL AUTO_INCREMENT,
  `DSC_CODIGO_BARRAS` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ID_EMPRESA` int NOT NULL,
  `FEC_CREACION` date NOT NULL,
  `FEC_LIMITE` date NOT NULL,
  `MON_TOTAL` double NOT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_PROFORMA`),
  UNIQUE KEY `DSC_CODIGO_BARRAS` (`DSC_CODIGO_BARRAS`),
  KEY `ID_EMPRESA` (`ID_EMPRESA`),
  CONSTRAINT `tsit_proforma_ibfk_1` FOREIGN KEY (`ID_EMPRESA`) REFERENCES `tsim_empresa` (`ID_EMPRESA`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_proveedor`
--

DROP TABLE IF EXISTS `tsit_proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_proveedor` (
  `ID_PROVEEDOR` int NOT NULL AUTO_INCREMENT,
  `IDENTIFICADOR_PROVEEDOR` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ID_TIPOPROVEEDOR` int DEFAULT NULL,
  `DSC_VENTA` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CTA_BANCARIA` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DSC_DIRECCIONEXACTA` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_PROVEEDOR`),
  UNIQUE KEY `CTA_BANCARIA` (`CTA_BANCARIA`),
  UNIQUE KEY `IDENTIFICADOR_PROVEEDOR` (`IDENTIFICADOR_PROVEEDOR`),
  KEY `ID_TIPOPROVEEDOR` (`ID_TIPOPROVEEDOR`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_proveedor_ibfk_1` FOREIGN KEY (`ID_TIPOPROVEEDOR`) REFERENCES `tsim_tipoproveedor` (`ID_TIPOPROVEEDOR`),
  CONSTRAINT `tsit_proveedor_ibfk_3` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_telefonocliente`
--

DROP TABLE IF EXISTS `tsit_telefonocliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_telefonocliente` (
  `ID_TELEFONOCLIENTE` int NOT NULL AUTO_INCREMENT,
  `ID_CLIENTE` int DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_TELEFONOCLIENTE`),
  KEY `ID_CLIENTE` (`ID_CLIENTE`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_telefonocliente_ibfk_1` FOREIGN KEY (`ID_CLIENTE`) REFERENCES `tsit_cliente` (`ID_CLIENTE`),
  CONSTRAINT `tsit_telefonocliente_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_telefonoproveedor`
--

DROP TABLE IF EXISTS `tsit_telefonoproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_telefonoproveedor` (
  `ID_TELEFONOPROVEEDOR` int NOT NULL AUTO_INCREMENT,
  `ID_PROVEEDOR` int DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_TELEFONOPROVEEDOR`),
  KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_telefonoproveedor_ibfk_1` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `tsit_proveedor` (`ID_PROVEEDOR`),
  CONSTRAINT `tsit_telefonoproveedor_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_transacciones`
--

DROP TABLE IF EXISTS `tsit_transacciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_transacciones` (
  `ID_TRANSACCION` int NOT NULL AUTO_INCREMENT,
  `FEC_TRANSACCION` datetime NOT NULL,
  `METODO_PAGO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MONTO_PAGO` double NOT NULL,
  `DSC_TRANSACCION` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TIPO_TRANSACCION` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ESTADO` int NOT NULL,
  PRIMARY KEY (`ID_TRANSACCION`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_transacciones_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_usuario`
--

DROP TABLE IF EXISTS `tsit_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_usuario` (
  `ID_USUARIO` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBREUSUARIO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_CONTRASENIA` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_CORREO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ID_ROL` int DEFAULT NULL,
  `DSC_CEDULA` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_NOMBRE` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_APELLIDOUNO` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_APELLIDODOS` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  KEY `ID_ROL` (`ID_ROL`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_usuario_ibfk_1` FOREIGN KEY (`ID_ROL`) REFERENCES `tsim_rol` (`ID_ROL`),
  CONSTRAINT `tsit_usuario_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsit_venta`
--

DROP TABLE IF EXISTS `tsit_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_venta` (
  `ID_VENTA` int NOT NULL AUTO_INCREMENT,
  `ID_CLIENTE` int DEFAULT NULL,
  `FEC_VENTA` datetime NOT NULL,
  `METODO_PAGO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DSC_VENTA` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ESTADO_CREDITO` tinyint(1) NOT NULL,
  `MONT_SUBTOTAL` double NOT NULL,
  `ESTADO` int NOT NULL,
  PRIMARY KEY (`ID_VENTA`),
  KEY `ID_CLIENTE` (`ID_CLIENTE`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_venta_ibfk_1` FOREIGN KEY (`ID_CLIENTE`) REFERENCES `tsit_cliente` (`ID_CLIENTE`),
  CONSTRAINT `tsit_venta_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'dbtiendasistemainventario'
--
/*!50003 DROP PROCEDURE IF EXISTS `getSaleReport` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getSaleReport`(IN MIN_FEC DATE,
    IN MAX_FEC DATE)
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getShoppingsReport` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getShoppingsReport`(IN MIN_FEC DATE, IN MAX_FEC DATE)
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getTransactionReport` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getTransactionReport`(IN MIN_FEC_TRANSACCION DATETIME, IN MAX_FEC_TRANSACCION DATETIME)
BEGIN
SELECT 
        ID_TRANSACCION,
        FEC_TRANSACCION,
        METODO_PAGO,
        MONTO_PAGO,
        DSC_TRANSACCION,
        ESTADO
    FROM 
        tsit_transacciones
    WHERE 
        FEC_TRANSACCION >= MIN_FEC_TRANSACCION
        AND FEC_TRANSACCION <= DATE_ADD(MAX_FEC_TRANSACCION, INTERVAL 1 DAY)
    ORDER BY 
        FEC_TRANSACCION ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cash_closing` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cash_closing`(IN MIN_FEC DATE, IN MAX_FEC DATE)
BEGIN
-- Ventas
	SELECT 
		IFNULL(SUM(v.MONT_SUBTOTAL), 0) AS TOTAL_VENTAS
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
            v.MONT_SUBTOTAL AS MONTO,
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAllDataFromGrpahics` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getAllDataFromGrpahics`(IN MIN_FEC DATE, IN MAX_FEC DATE, IN LIMIT_PRODUCTS INT, IN CATEGORY VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, IN FEC_CURRENT DATE)
BEGIN
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
            SUM(MONT_SUBTOTAL) AS TotalContado
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAllShoppings` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getAllShoppings`(IN p_field VARCHAR(50),
    IN p_sortOrder VARCHAR(4),
    IN p_limit INT,
    IN p_offset INT)
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getClientCreditReport` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getClientCreditReport`(IN MIN_FEC DATE,
    IN MAX_FEC DATE)
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getSupplierReport` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getSupplierReport`()
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_products_report` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_products_report`(IN MIN_FEC DATE, IN MAX_FEC DATE)
BEGIN
SELECT
		p.DSC_NOMBRE AS NOMBRE,
        p.DSC_DESCRIPTION AS DESCRIPCION,
        p.DSC_CODIGO_BARRAS AS COD_BARRAS,
        p.MON_VENTA AS MON_VENTA,
        p.MON_COMPRA AS MON_COMPRA,
        p.CANTIDAD AS UNID_DISPONIBLE,
        CASE 
			WHEN p.ESTADO = 1 THEN 'Activo'
			ELSE 'Inactivo'
		END AS ESTADO
	FROM
		tsim_producto p
	WHERE
		DATE(p.FEC_CREATED_AT) >= MIN_FEC AND DATE(p.FEC_CREATED_AT) <= MAX_FEC
	ORDER BY
		p.FEC_CREATED_AT DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Sp_SearchCredits` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sp_SearchCredits`(IN termSearch VARCHAR(255),
    IN page INT,
    IN pageSize INT)
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_searchProformas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_searchProformas`(IN p_field VARCHAR(50),
    IN p_sortOrder VARCHAR(4),
    IN p_limit INT,
    IN p_offset INT,
    IN p_expectedMatch VARCHAR(255))
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
                limit 1
        ) AS DETALLE_PRODUCTO,

        -- Lista completa de productos (JSON real)
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
					'DSC_CODIGO_BARRAS', prod.DSC_CODIGO_BARRAS,
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Sp_SearchSales` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sp_SearchSales`(IN termSearch VARCHAR(255),
    IN page INT,
    IN pageSize INT)
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_searchShoppings` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_searchShoppings`(IN p_field VARCHAR(50),
    IN p_sortOrder VARCHAR(4),
    IN p_limit INT,
    IN p_offset INT,
    IN p_expectedMatch VARCHAR(255))
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

        -- Producto usado solo para ordenar
        (
            SELECT JSON_OBJECT(
                'DSC_NOMBRE', prodO.DSC_NOMBRE
            )
            FROM tsit_detalles_compras dO
            JOIN tsim_producto prodO 
                ON dO.DSC_CODIGO_BARRAS = prodO.DSC_CODIGO_BARRAS
            WHERE dO.ID_COMPRA = c.ID_COMPRA
            ORDER BY 
                CASE
                    WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'DESC' THEN prodO.DSC_NOMBRE
                END DESC,
                CASE
                    WHEN p_field = 'PRODUCTO' AND p_sortOrder = 'ASC' THEN prodO.DSC_NOMBRE
                END ASC
            LIMIT 1
        ) AS DETALLE_PRODUCTO,

        -- Lista completa de productos (JSON nativo)
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'DSC_NOMBRE', prod.DSC_NOMBRE,
                    'DSC_CODIGO_BARRAS', d.DSC_CODIGO_BARRAS,
                    'MON_CANTIDAD', d.MON_CANTIDAD,
                    'MON_PRECIO_COMPRA', d.MON_PRECIO_COMPRA
                )
            )
            FROM tsit_detalles_compras d
            JOIN tsim_producto prod 
                ON d.DSC_CODIGO_BARRAS = prod.DSC_CODIGO_BARRAS
            WHERE d.ID_COMPRA = c.ID_COMPRA
        ) AS PRODUCTS_LISTS

    FROM tsit_compras c
    JOIN tsit_proveedor p ON c.ID_PROVEEDOR = p.ID_PROVEEDOR

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
            JOIN tsim_producto prodD 
                ON d2.DSC_CODIGO_BARRAS = prodD.DSC_CODIGO_BARRAS
            WHERE d2.ID_COMPRA = c.ID_COMPRA
              AND (
                  d2.DSC_CODIGO_BARRAS LIKE CONCAT('%', p_expectedMatch, '%')
                  OR prodD.DSC_NOMBRE LIKE CONCAT('%', p_expectedMatch, '%')
              )
        )

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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


--
-- Data for tables
--

SET FOREIGN_KEY_CHECKS=0;

-- tsim_estado
INSERT INTO `tsim_estado` (`ID_ESTADO`, `DSC_NOMBRE`, `DSC_PARA`, `FEC_CREADOEN`) VALUES 
(1, 'Activo', 'General', NOW()),
(2, 'Inactivo', 'General', NOW()),
(3, 'Suspendido', 'General', NOW());

-- tsim_permiso
INSERT INTO `tsim_permiso` (`ID_PERMISO`, `DSC_NOMBRE`, `DSC_DESCRIPCION`) VALUES 
(1, 'Ver Ventas', 'Permiso para visualizar las ventas'),
(2, 'Registrar Compra', 'Permiso para registrar nuevas compras'),
(3, 'Gestionar Productos', 'Permiso para crear y editar productos');

-- tsim_empresa
INSERT INTO `tsim_empresa` (`ID_EMPRESA`, `DSC_RANGO_STOCK`, `DSC_NOMBRE`, `NUM_TELEFONO`, `DSC_CORREO`, `DSC_DIRECCION`, `DSC_ESLOGAN`) VALUES 
(1, 10, 'Tienda Briones', '88888888', 'contacto@tiendabriones.com', 'San Jose, Costa Rica', 'Calidad a su alcance'),
(2, 5, 'Supermercado Central', '22222222', 'info@central.com', 'Heredia, Costa Rica', 'Todo en un solo lugar');

-- tsim_rol
INSERT INTO `tsim_rol` (`ID_ROL`, `DSC_NOMBRE`, `DSC_DESCRIPCION`, `ESTADO`) VALUES 
(1, 'Administrador', 'Control total del sistema', 1),
(2, 'Vendedor', 'Realiza ventas y consultas', 1);

-- tsit_usuario
INSERT INTO `tsit_usuario` (`ID_USUARIO`, `DSC_NOMBREUSUARIO`, `DSC_CONTRASENIA`, `DSC_CORREO`, `DSC_TELEFONO`, `ID_ROL`, `DSC_CEDULA`, `DSC_NOMBRE`, `DSC_APELLIDOUNO`, `DSC_APELLIDODOS`, `FEC_CREADOEN`, `ESTADO`) VALUES 
(1, 'admin', 'password123', 'admin@tienda.com', '11111111', 1, '1-1111-1111', 'Admin', 'Sistema', 'Principal', NOW(), 1),
(2, 'ventas1', 'password123', 'ventas1@tienda.com', '22222222', 2, '2-2222-2222', 'Juan', 'Perez', 'Rodriguez', NOW(), 1);

-- tsim_categoria
INSERT INTO `tsim_categoria` (`ID_CATEGORIA`, `DSC_NOMBRE`, `FEC_CREADOEN`, `FEC_MODIFICADOEN`, `ESTADO`) VALUES 
(1, 'Alimentos', NOW(), NOW(), 1),
(2, 'Limpieza', NOW(), NOW(), 1),
(3, 'Electronica', NOW(), NOW(), 1);

-- tsim_subcategoria
INSERT INTO `tsim_subcategoria` (`ID_SUBCATEGORIA`, `ID_CATEGORIA`, `DSC_NOMBRE`, `FEC_CREADOEN`, `subcategoriamodificadoen`, `ESTADO`) VALUES 
(1, 1, 'Bebidas', NOW(), NOW(), 1),
(2, 2, 'Detergentes', NOW(), NOW(), 1),
(3, 3, 'Telefonos', NOW(), NOW(), 1);

-- tsim_producto
INSERT INTO `tsim_producto` (`ID_PRODUCT`, `DSC_NOMBRE`, `DSC_DESCRIPTION`, `DSC_CODIGO_BARRAS`, `URL_IMAGEN`, `MON_VENTA`, `MON_COMPRA`, `CANTIDAD`, `FEC_CREATED_AT`, `FEC_UPDATE_AT`, `ESTADO`, `ID_SUBCATEGORIA`, `UPDATED_BY_USER`, `CREATED_BY_USER`, `DSC_CODIGO_PROD`) VALUES 
(1, 'Coca Cola 1L', 'Refresco de cola', '7441001', 'img/coca.png', 1500, 1000, 50, NOW(), NOW(), 1, 1, 1, 1, 'PROD001'),
(2, 'Detergente Omo', 'Detergente liquido', '7442002', 'img/omo.png', 5000, 3500, 20, NOW(), NOW(), 1, 2, 1, 1, 'PROD002'),
(3, 'iPhone 15', 'Smartphone Apple', '7443003', 'img/iphone15.png', 800000, 600000, 5, NOW(), NOW(), 1, 3, 1, 1, 'PROD003');

-- tsim_tipoproveedor
INSERT INTO `tsim_tipoproveedor` (`ID_TIPOPROVEEDOR`, `DSC_NOMBRE`, `FEC_CREADOEN`, `ESTADO`) VALUES 
(1, 'Nacional', NOW(), 1),
(2, 'Internacional', NOW(), 1);

-- tsit_cliente
INSERT INTO `tsit_cliente` (`ID_CLIENTE`, `DSC_CEDULA`, `DSC_NOMBRE`, `DSC_APELLIDOUNO`, `DSC_APELLIDODOS`, `ESTADO`, `FEC_CREADOEN`, `FEC_MODIFICADOEN`, `URL_FOTO`, `DSC_DIRECCION`) VALUES 
(1, '3-0333-0333', 'Maria', 'Gomez', 'Mora', 1, NOW(), NOW(), 'img/maria.jpg', 'Alajuela'),
(2, '4-0444-0444', 'Pedro', 'Arias', 'Solano', 1, NOW(), NOW(), 'img/pedro.jpg', 'Cartago');

-- tsit_proveedor
INSERT INTO `tsit_proveedor` (`ID_PROVEEDOR`, `IDENTIFICADOR_PROVEEDOR`, `DSC_NOMBRE`, `ID_TIPOPROVEEDOR`, `DSC_VENTA`, `CTA_BANCARIA`, `DSC_DIRECCIONEXACTA`, `ESTADO`, `FEC_CREADOEN`, `FEC_MODIFICADOEN`) VALUES 
(1, 'PROV-001', 'Distribuidora Luces', 1, 'Varios', 'CR123456789012345678', 'Heredia Centro', 1, NOW(), NOW()),
(2, 'PROV-002', 'Apple Inc', 2, 'Electronica', 'US987654321098765432', 'California, USA', 1, NOW(), NOW());

-- tsit_compras
INSERT INTO `tsit_compras` (`ID_COMPRA`, `FEC_COMPRA`, `FEC_ENTRADA`, `FEC_CREATED_AT`, `FEC_UPDATE_AT`, `ESTADO`, `MON_TOTAL`, `DSC_METODO_PAGO`, `ID_PROVEEDOR`, `UPDATED_BY_USER`, `CREATED_BY_USER`) VALUES 
(1, '2026-03-01', '2026-03-02', NOW(), NOW(), '1', 50000, 'Transferencia', 1, 1, 1),
(2, '2026-03-05', '2026-03-10', NOW(), NOW(), '1', 1200000, 'Tarjeta', 2, 1, 1);

-- tsit_detalles_compras
INSERT INTO `tsit_detalles_compras` (`ID_DETALLE_COMPRA`, `FEC_UPDATE_AT`, `ESTADO`, `MON_PRECIO_COMPRA`, `MON_CANTIDAD`, `ID_COMPRA`, `UPDATED_BY_USER`, `DSC_CODIGO_BARRAS`) VALUES 
(1, NOW(), '1', 1000, 50, 1, 1, '7441001'),
(2, NOW(), '1', 600000, 2, 2, 1, '7443003');

-- tsit_venta
INSERT INTO `tsit_venta` (`ID_VENTA`, `ID_CLIENTE`, `FEC_VENTA`, `METODO_PAGO`, `DSC_VENTA`, `ESTADO_CREDITO`, `MONT_SUBTOTAL`, `ESTADO`) VALUES 
(1, 1, NOW(), 'Efectivo', 'Venta minorista', 0, 3000, 1),
(2, 2, NOW(), 'Credito', 'Venta a plazos', 1, 800000, 1);

-- tsit_detalleventa
INSERT INTO `tsit_detalleventa` (`ID_DETALLEVENTA`, `ID_VENTA`, `ID_PRODUCTO`, `MONT_UNITARIO`, `PORCENT_IMPUESTO`, `PORCENT_DESCUENTO`, `CANTIDAD`) VALUES 
(1, 1, 1, 1500, 13, 0, 2),
(2, 2, 3, 800000, 13, 5, 1);

-- tsit_credito
INSERT INTO `tsit_credito` (`ID_CREDITO`, `ID_VENTA`, `FEC_ULTIMOPAGO`, `FEC_VENCIMIENTO`, `MON_PENDIENTE`, `ESTADO_CREDITO`) VALUES 
(1, 2, NOW(), '2026-04-12', 400000, 1);

-- tsit_abono
INSERT INTO `tsit_abono` (`ID_ABONO`, `ID_CREDITO`, `FEC_ABONO`, `MON_ABONADO`) VALUES 
(1, 1, NOW(), 200000),
(2, 1, DATE_ADD(NOW(), INTERVAL 7 DAY), 200000);

-- tsit_correoproveedor
INSERT INTO `tsit_correoproveedor` (`ID_CORREOPROVEEDOR`, `ID_PROVEEDOR`, `DSC_CORREO`, `FEC_CREADOEN`, `ESTADO`) VALUES 
(1, 1, 'ventas@luces.com', NOW(), 1),
(2, 2, 'support@apple.com', NOW(), 1);

-- tsit_telefonocliente
INSERT INTO `tsit_telefonocliente` (`ID_TELEFONOCLIENTE`, `ID_CLIENTE`, `DSC_TELEFONO`, `FEC_CREADOEN`, `FEC_MODIFICADOEN`, `ESTADO`) VALUES 
(1, 1, '88881111', NOW(), NOW(), 1),
(2, 2, '77772222', NOW(), NOW(), 1);

-- tsit_telefonoproveedor
INSERT INTO `tsit_telefonoproveedor` (`ID_TELEFONOPROVEEDOR`, `ID_PROVEEDOR`, `DSC_TELEFONO`, `FEC_CREADOEN`, `ESTADO`) VALUES 
(1, 1, '22223333', NOW(), 1),
(2, 2, '18000123', NOW(), 1);

-- tsit_transacciones
INSERT INTO `tsit_transacciones` (`ID_TRANSACCION`, `FEC_TRANSACCION`, `METODO_PAGO`, `MONTO_PAGO`, `DSC_TRANSACCION`, `TIPO_TRANSACCION`, `ESTADO`) VALUES 
(1, NOW(), 'Efectivo', 3000, 'Venta contado', 'Ingreso', 1),
(2, NOW(), 'Transferencia', 50000, 'Pago proveedor', 'Egreso', 1);

-- tsit_proforma
INSERT INTO `tsit_proforma` (`ID_PROFORMA`, `DSC_CODIGO_BARRAS`, `ID_EMPRESA`, `FEC_CREACION`, `FEC_LIMITE`, `MON_TOTAL`, `ESTADO`) VALUES 
(1, 'PROF-001', 1, '2026-03-12', '2026-03-19', 15000, 1),
(2, 'PROF-002', 1, '2026-03-12', '2026-03-19', 10000, 1);

-- tsit_productos_proforma
INSERT INTO `tsit_productos_proforma` (`ID_PRODUCTO_PROFORMA`, `ID_PROFORMA`, `ID_PRODUCTO`, `PRECIO_UNITARIO`, `IMPUESTO`, `DESCUENTO`, `CANTIDAD`) VALUES 
(1, 1, 1, 1500, 13, 0, 10),
(2, 2, 2, 5000, 13, 0, 2);

-- tsit_notificaciones
INSERT INTO `tsit_notificaciones` (`ID_NOTIFICACION`, `ID_PRODUCTO`, `TIPO`, `CANTIDAD`, `VISTO`, `FECHA`) VALUES 
(1, 3, 'STOCK_BAJO', 5, 0, NOW()),
(2, 1, 'STOCK_BAJO', 10, 1, NOW());

-- tsit_permisousuario
INSERT INTO `tsit_permisousuario` (`ID_PERMISOUSUARIO`, `ID_USUARIO`, `ID_PERMISO`, `FEC_CREADOEN`, `ESTADO`) VALUES 
(1, 1, 1, NOW(), 1),
(2, 1, 2, NOW(), 1),
(3, 1, 3, NOW(), 1);

SET FOREIGN_KEY_CHECKS=1;

-- Dump completed on 2026-03-12 21:15:00
