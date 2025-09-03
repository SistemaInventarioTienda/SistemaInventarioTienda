-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: dbtiendasistemainventario
-- ------------------------------------------------------
-- Server version	8.0.41

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

--
-- Base de datos: `dbtiendasistemainventario`
--
DROP DATABASE IF EXISTS `dbtiendasistemainventario`;

CREATE DATABASE IF NOT EXISTS `dbtiendasistemainventario` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `dbtiendasistemainventario`;

--
-- Table structure for table `tsim_categoria`
--

DROP TABLE IF EXISTS `tsim_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_categoria` (
  `ID_CATEGORIA` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_CATEGORIA`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsim_categoria_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsim_categoria`
--

LOCK TABLES `tsim_categoria` WRITE;
/*!40000 ALTER TABLE `tsim_categoria` DISABLE KEYS */;
INSERT INTO `tsim_categoria` VALUES (3,'Electronica','2024-10-14 18:15:14','2024-10-14 18:49:36',2),(4,'Ropa','2024-10-14 18:15:23',NULL,1),(5,'Hogar y oficina','2024-10-14 18:17:02','2024-10-14 18:17:22',1),(6,'Juguetes y juegos','2024-10-14 18:18:05','2024-10-14 18:51:34',1),(7,'Alimentos y bebidas','2024-10-14 18:18:15',NULL,1),(8,'Deportes y Aire libre','2024-10-14 18:18:27',NULL,1),(9,'Belleza y cuidado personal','2024-10-14 18:18:54','2025-01-17 14:24:55',2),(10,'Libros y papelería','2024-10-14 18:19:09',NULL,1),(11,'Zapatos y accesorios','2024-10-14 18:19:21','2024-10-14 18:20:40',1),(12,'Salud y bienestar','2024-10-14 18:19:33','2024-12-11 19:34:57',1);
/*!40000 ALTER TABLE `tsim_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsim_empresa`
--

DROP TABLE IF EXISTS `tsim_empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_empresa` (
  `ID_EMPRESA` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NUM_TELEFONO` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_MENSAJE_VENTA` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREACICON` datetime DEFAULT NULL,
  `FEC_MODIFICADO` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_EMPRESA`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsim_empresa`
--

LOCK TABLES `tsim_empresa` WRITE;
/*!40000 ALTER TABLE `tsim_empresa` DISABLE KEYS */;
/*!40000 ALTER TABLE `tsim_empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsim_estado`
--

DROP TABLE IF EXISTS `tsim_estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_estado` (
  `ID_ESTADO` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Activo, inactivo, suspendido',
  `DSC_PARA` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nombre de el modulo al que pertenece el estado',
  `FEC_CREADOEN` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsim_estado`
--

LOCK TABLES `tsim_estado` WRITE;
/*!40000 ALTER TABLE `tsim_estado` DISABLE KEYS */;
INSERT INTO `tsim_estado` VALUES (1,'Activo','Lo que sea','2024-10-12 17:53:52'),(2,'Inactivo','Lo que sea x2','2024-10-12 17:53:52');
/*!40000 ALTER TABLE `tsim_estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsim_fechainiciosesion`
--

DROP TABLE IF EXISTS `tsim_fechainiciosesion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_fechainiciosesion` (
  `ID_FECHAINICIOSESION` int NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int DEFAULT NULL,
  `FEC_ULTIMOINGRESO` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_FECHAINICIOSESION`),
  KEY `ID_USUARIO` (`ID_USUARIO`),
  CONSTRAINT `tsim_fechainiciosesion_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `tsit_usuario` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsim_fechainiciosesion`
--

LOCK TABLES `tsim_fechainiciosesion` WRITE;
/*!40000 ALTER TABLE `tsim_fechainiciosesion` DISABLE KEYS */;
/*!40000 ALTER TABLE `tsim_fechainiciosesion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsim_permiso`
--

DROP TABLE IF EXISTS `tsim_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_permiso` (
  `ID_PERMISO` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_DESCRIPCION` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID_PERMISO`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsim_permiso`
--

LOCK TABLES `tsim_permiso` WRITE;
/*!40000 ALTER TABLE `tsim_permiso` DISABLE KEYS */;
INSERT INTO `tsim_permiso` VALUES (1,'Usuarios','Se le permite el acceso a la página de usuarios. Puede realizar acciones como: ver todos los usuarios, eliminar, agregar, modificar y cambiar permisos.'),(2,'Categorias','Se le permite el acceso a la página de categorias. Puede realizar acciones como: ver todas las categorias y sus subcategorias, eliminar, agregar y modificar.'),(3,'Proveedores','Se le permite el acceso a la página de proveedores. Puede realizar acciones como: ver todos los proveedores e información detallada, eliminar, agregar y modificar.'),(4,'Clientes','Se le permite el acceso a la página de clientes. Puede realizar acciones como: ver todos los clientes e información detallada, eliminar, agregar y modificar.'),(5,'Compras','Se le permite el acceso a la página de compras. Puede realizar acciones como: ver todas las compras e información detallada, eliminar, agregar y modificar.'),(6,'Reportes','Se le permite el acceso a la página de reportes. Puede realizar acciones como: ver todos los reportes e información detallada, eliminar, agregar, modificar y descargar los reportes.'),(7,'Productos','Se le permite el acceso a la página de productos. Puede realizar acciones como: ver todos los productos, eliminar, agregar y modificar'),(8,'Ventas','Se le permite el acceso a la página de ventas. Puede realizar acciones como: ver realizar una venta, anular venta.');
/*!40000 ALTER TABLE `tsim_permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsim_producto`
--

DROP TABLE IF EXISTS `tsim_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_producto` (
  `ID_PRODUCT` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_DESCRIPTION` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_CODIGO_BARRAS` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `URL_IMAGEN` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MON_VENTA` double DEFAULT NULL,
  `MON_COMPRA` double DEFAULT NULL,
  `CANTIDAD` int DEFAULT 0,
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsim_producto`
--

LOCK TABLES `tsim_producto` WRITE;
/*!40000 ALTER TABLE `tsim_producto` DISABLE KEYS */;
INSERT INTO `tsim_producto` VALUES (21,'Coca cola','Esta es con un recipiente de 1.5L','PROD202502190056154','image_not_found.png',2200,1950, 100, '2025-02-19 00:56:15',NULL,2,1,NULL,10);
/*!40000 ALTER TABLE `tsim_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsim_rol`
--

DROP TABLE IF EXISTS `tsim_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_rol` (
  `ID_ROL` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SuperAdmin, Administrador, ventas, etc',
  `DSC_DESCRIPCION` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_ROL`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsim_rol_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsim_rol`
--

LOCK TABLES `tsim_rol` WRITE;
/*!40000 ALTER TABLE `tsim_rol` DISABLE KEYS */;
INSERT INTO `tsim_rol` VALUES (1,'Admin','Para usuarios administradores',1);
/*!40000 ALTER TABLE `tsim_rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsim_subcategoria`
--

DROP TABLE IF EXISTS `tsim_subcategoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_subcategoria` (
  `ID_SUBCATEGORIA` int NOT NULL AUTO_INCREMENT,
  `ID_CATEGORIA` int DEFAULT NULL,
  `DSC_NOMBRE` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `subcategoriamodificadoen` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_SUBCATEGORIA`),
  KEY `ID_CATEGORIA` (`ID_CATEGORIA`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsim_subcategoria_ibfk_1` FOREIGN KEY (`ID_CATEGORIA`) REFERENCES `tsim_categoria` (`ID_CATEGORIA`),
  CONSTRAINT `tsim_subcategoria_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsim_subcategoria`
--

LOCK TABLES `tsim_subcategoria` WRITE;
/*!40000 ALTER TABLE `tsim_subcategoria` DISABLE KEYS */;
INSERT INTO `tsim_subcategoria` VALUES (1,7,'Gaseosa','2024-10-12 17:53:52',NULL,1);
/*!40000 ALTER TABLE `tsim_subcategoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsim_tipoproveedor`
--

DROP TABLE IF EXISTS `tsim_tipoproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsim_tipoproveedor` (
  `ID_TIPOPROVEEDOR` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBRE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_TIPOPROVEEDOR`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsim_tipoproveedor_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsim_tipoproveedor`
--

LOCK TABLES `tsim_tipoproveedor` WRITE;
/*!40000 ALTER TABLE `tsim_tipoproveedor` DISABLE KEYS */;
INSERT INTO `tsim_tipoproveedor` VALUES (1,'Proveedor de Materia Prima','2024-11-05 00:00:00',1),(2,'Proveedor de Servicios','2024-11-05 00:00:00',1),(3,'Proveedor de Tecnología','2024-11-05 00:00:00',1),(4,'Proveedor de Transporte','2024-11-05 00:00:00',1),(5,'Proveedor de Mantenimiento','2024-11-05 00:00:00',1),(6,'Proveedor de Equipos','2024-11-05 00:00:00',1),(7,'Proveedor de Consultoría','2024-11-05 00:00:00',1),(8,'Proveedor de Limpieza','2024-11-05 00:00:00',1),(9,'Proveedor de Seguridad','2024-11-05 00:00:00',1),(10,'Proveedor de Marketing','2024-11-05 00:00:00',1);
/*!40000 ALTER TABLE `tsim_tipoproveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsit_cliente`
--

DROP TABLE IF EXISTS `tsit_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_cliente` (
  `ID_CLIENTE` int NOT NULL AUTO_INCREMENT,
  `DSC_CEDULA` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DSC_NOMBRE` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_APELLIDOUNO` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_APELLIDODOS` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `URL_FOTO` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DSC_DIRECCION` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID_CLIENTE`),
  UNIQUE KEY `DSC_CEDULA` (`DSC_CEDULA`),
  UNIQUE KEY `FOTOURL` (`URL_FOTO`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_cliente_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsit_cliente`
--

LOCK TABLES `tsit_cliente` WRITE;
/*!40000 ALTER TABLE `tsit_cliente` DISABLE KEYS */;
INSERT INTO `tsit_cliente` VALUES (6,'703050017','Anthony Daniel','Briones','Vargas',1,'2025-03-12 21:31:31',NULL,'public/Assets/image/clientes/703050017.png','Guápiles');
/*!40000 ALTER TABLE `tsit_cliente` ENABLE KEYS */;
UNLOCK TABLES;

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
  `ESTADO` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MON_TOTAL` double NOT NULL,
  `DSC_METODO_PAGO` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsit_compras`
--

LOCK TABLES `tsit_compras` WRITE;
/*!40000 ALTER TABLE `tsit_compras` DISABLE KEYS */;
/*!40000 ALTER TABLE `tsit_compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsit_correoproveedor`
--

DROP TABLE IF EXISTS `tsit_correoproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_correoproveedor` (
  `ID_CORREOPROVEEDOR` int NOT NULL AUTO_INCREMENT,
  `ID_PROVEEDOR` int DEFAULT NULL,
  `DSC_CORREO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_CORREOPROVEEDOR`),
  KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_correoproveedor_ibfk_1` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `tsit_proveedor` (`ID_PROVEEDOR`),
  CONSTRAINT `tsit_correoproveedor_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsit_correoproveedor`
--

LOCK TABLES `tsit_correoproveedor` WRITE;
/*!40000 ALTER TABLE `tsit_correoproveedor` DISABLE KEYS */;
INSERT INTO `tsit_correoproveedor` VALUES (4,31,'contacto@proveedor.com','2025-02-06 23:04:03',1),(5,31,'ventas@proveedor.com','2025-02-06 23:04:03',1);
/*!40000 ALTER TABLE `tsit_correoproveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsit_detalles_compras`
--

DROP TABLE IF EXISTS `tsit_detalles_compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_detalles_compras` (
  `ID_DETALLE_COMPRA` int NOT NULL AUTO_INCREMENT,
  `FEC_UPDATE_AT` date DEFAULT NULL,
  `ESTADO` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MON_PRECIO_COMPRA` double NOT NULL,
  `MON_CANTIDAD` int NOT NULL,
  `ID_COMPRA` int NOT NULL,
  `UPDATED_BY_USER` int DEFAULT NULL,
  `DSC_CODIGO_BARRAS` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID_DETALLE_COMPRA`),
  KEY `fk_detalles_compras_compra` (`ID_COMPRA`),
  KEY `fk_detalles_compras_usuario_updated` (`UPDATED_BY_USER`),
  KEY `id_producto` (`DSC_CODIGO_BARRAS`),
  CONSTRAINT `fk_detalles_compras_compra` FOREIGN KEY (`ID_COMPRA`) REFERENCES `tsit_compras` (`ID_COMPRA`),
  CONSTRAINT `fk_detalles_compras_usuario_updated` FOREIGN KEY (`UPDATED_BY_USER`) REFERENCES `tsit_usuario` (`ID_USUARIO`),
  CONSTRAINT `id_producto` FOREIGN KEY (`DSC_CODIGO_BARRAS`) REFERENCES `tsim_producto` (`DSC_CODIGO_BARRAS`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsit_detalles_compras`
--

LOCK TABLES `tsit_detalles_compras` WRITE;
/*!40000 ALTER TABLE `tsit_detalles_compras` DISABLE KEYS */;
/*!40000 ALTER TABLE `tsit_detalles_compras` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsit_permisousuario`
--

LOCK TABLES `tsit_permisousuario` WRITE;
/*!40000 ALTER TABLE `tsit_permisousuario` DISABLE KEYS */;
INSERT INTO `tsit_permisousuario` VALUES (57,10,1,'2025-03-19 20:23:09',1),(58,10,7,'2025-03-19 20:23:09',1),(59,10,2,'2025-03-19 20:23:09',1),(60,10,3,'2025-03-19 20:23:09',1),(61,10,4,'2025-03-19 20:23:09',1),(62,10,5,'2025-03-19 20:23:09',1),(63,10,8,'2025-03-19 20:23:09',1),(64,10,6,'2025-03-19 20:23:09',0),(65,14,1,'2025-03-19 20:23:17',0),(66,14,7,'2025-03-19 20:23:17',0),(67,14,2,'2025-03-19 20:23:17',0),(68,14,3,'2025-03-19 20:23:17',0),(69,14,4,'2025-03-19 20:23:17',0),(70,14,5,'2025-03-19 20:23:17',1),(71,14,8,'2025-03-19 20:23:17',1),(72,14,6,'2025-03-19 20:23:17',1),(81,18,1,'2025-03-19 20:23:38',0),(82,18,7,'2025-03-19 20:23:38',0),(83,18,2,'2025-03-19 20:23:38',0),(84,18,3,'2025-03-19 20:23:38',0),(85,18,4,'2025-03-19 20:23:38',0),(86,18,5,'2025-03-19 20:23:38',0),(87,18,8,'2025-03-19 20:23:38',0),(88,18,6,'2025-03-19 20:23:38',0),(97,19,1,'2025-03-19 20:35:19',1),(98,19,7,'2025-03-19 20:35:19',0),(99,19,2,'2025-03-19 20:35:19',1),(100,19,3,'2025-03-19 20:35:19',0),(101,19,4,'2025-03-19 20:35:19',1),(102,19,5,'2025-03-19 20:35:19',0),(103,19,8,'2025-03-19 20:35:19',1),(104,19,6,'2025-03-19 20:35:19',0),(113,20,1,'2025-03-19 20:47:52',1),(114,20,7,'2025-03-19 20:47:52',0),(115,20,2,'2025-03-19 20:47:52',1),(116,20,3,'2025-03-19 20:47:52',0),(117,20,4,'2025-03-19 20:47:52',1),(118,20,5,'2025-03-19 20:47:52',0),(119,20,8,'2025-03-19 20:47:52',1),(120,20,6,'2025-03-19 20:47:52',0),(121,21,1,'2025-03-19 20:50:40',0),(122,21,2,'2025-03-19 20:50:40',0),(123,21,3,'2025-03-19 20:50:40',0),(124,21,4,'2025-03-19 20:50:40',0),(125,21,5,'2025-03-19 20:50:40',0),(126,21,6,'2025-03-19 20:50:40',0),(127,21,7,'2025-03-19 20:50:40',0),(128,21,8,'2025-03-19 20:50:40',0);
/*!40000 ALTER TABLE `tsit_permisousuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsit_proveedor`
--

DROP TABLE IF EXISTS `tsit_proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_proveedor` (
  `ID_PROVEEDOR` int NOT NULL AUTO_INCREMENT,
  `IDENTIFICADOR_PROVEEDOR` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ID_TIPOPROVEEDOR` int DEFAULT NULL,
  `DSC_VENTA` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CTA_BANCARIA` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DSC_DIRECCIONEXACTA` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsit_proveedor`
--

LOCK TABLES `tsit_proveedor` WRITE;
/*!40000 ALTER TABLE `tsit_proveedor` DISABLE KEYS */;
INSERT INTO `tsit_proveedor` VALUES (31,'SUP-20250206 23040-986ba2b3','Proveedor Ejemplo S.A.',1,'Venta  de construcción','cta-77','los lirios',1,'2025-02-06 23:04:03','2025-02-06 23:44:41');
/*!40000 ALTER TABLE `tsit_proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsit_telefonocliente`
--

DROP TABLE IF EXISTS `tsit_telefonocliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_telefonocliente` (
  `ID_TELEFONOCLIENTE` int NOT NULL AUTO_INCREMENT,
  `ID_CLIENTE` int DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `FEC_MODIFICADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_TELEFONOCLIENTE`),
  KEY `ID_CLIENTE` (`ID_CLIENTE`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_telefonocliente_ibfk_1` FOREIGN KEY (`ID_CLIENTE`) REFERENCES `tsit_cliente` (`ID_CLIENTE`),
  CONSTRAINT `tsit_telefonocliente_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsit_telefonocliente`
--

LOCK TABLES `tsit_telefonocliente` WRITE;
/*!40000 ALTER TABLE `tsit_telefonocliente` DISABLE KEYS */;
INSERT INTO `tsit_telefonocliente` VALUES (7,6,'84042628','2025-03-12 21:31:31',NULL,1);
/*!40000 ALTER TABLE `tsit_telefonocliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsit_telefonoproveedor`
--

DROP TABLE IF EXISTS `tsit_telefonoproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_telefonoproveedor` (
  `ID_TELEFONOPROVEEDOR` int NOT NULL AUTO_INCREMENT,
  `ID_PROVEEDOR` int DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_TELEFONOPROVEEDOR`),
  KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_telefonoproveedor_ibfk_1` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `tsit_proveedor` (`ID_PROVEEDOR`),
  CONSTRAINT `tsit_telefonoproveedor_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsit_telefonoproveedor`
--

LOCK TABLES `tsit_telefonoproveedor` WRITE;
/*!40000 ALTER TABLE `tsit_telefonoproveedor` DISABLE KEYS */;
INSERT INTO `tsit_telefonoproveedor` VALUES (4,31,'12345678','2025-02-06 23:04:03',1),(5,31,'87654321','2025-02-06 23:04:03',1);
/*!40000 ALTER TABLE `tsit_telefonoproveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tsit_usuario`
--

DROP TABLE IF EXISTS `tsit_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsit_usuario` (
  `ID_USUARIO` int NOT NULL AUTO_INCREMENT,
  `DSC_NOMBREUSUARIO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_CONTRASENIA` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_CORREO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_TELEFONO` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ID_ROL` int DEFAULT NULL,
  `DSC_CEDULA` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_NOMBRE` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_APELLIDOUNO` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_APELLIDODOS` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_CREADOEN` datetime DEFAULT NULL,
  `ESTADO` int DEFAULT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  KEY `ID_ROL` (`ID_ROL`),
  KEY `ESTADO` (`ESTADO`),
  CONSTRAINT `tsit_usuario_ibfk_1` FOREIGN KEY (`ID_ROL`) REFERENCES `tsim_rol` (`ID_ROL`),
  CONSTRAINT `tsit_usuario_ibfk_2` FOREIGN KEY (`ESTADO`) REFERENCES `tsim_estado` (`ID_ESTADO`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tsit_usuario`
--

LOCK TABLES `tsit_usuario` WRITE;
/*!40000 ALTER TABLE `tsit_usuario` DISABLE KEYS */;
INSERT INTO `tsit_usuario` VALUES (10,'admin','$2a$10$rD1Hd4SLCsWjJNS7aoWAw.Egg/N7YFbUh8LkXkExnz6KH7b37hb3G','admin@gmail.com','11111111',1,'1111111111','Admin','Admin','Admin','2024-10-12 17:53:52',1),(14,'DanielBv','$2a$10$tYK3/3qUDH8bGkKjIHr11eNoMSBGlmYf/y7d9p1PNpTY21jGYGMSC','danielbv0415@gmail.com','84042628',1,'703050017','Anthony Daniel','Briones','Vargas','2025-03-19 14:19:49',1),(18,'randy123','$2a$10$IS5ToD.KHH8AY2otfxaiVunBdRByjxptwyx3SUsoXJsU/grfYh7ke','randy@gmail.com','84042612',1,'703050018','Randy','Mora','Duran','2025-03-19 16:03:20',1),(19,'LuisaSa','$2a$10$NBSKWPTIs80jaCtlRF3Xn.oZgBpqSjb0l0FBTjMC4niu2mCKQOPbG','luisasala@gmail.com','12717127',1,'703050015','Luisa Anayeri','Salazar','Rueda','2025-03-19 20:35:08',2),(20,'judson','$2a$10$rD1Hd4SLCsWjJNS7aoWAw.Egg/N7YFbUh8LkXkExnz6KH7b37hb3G','judson@gmail.com','78905632',1,'703050019','Judson Andres','Rodriguez','Garita','2025-03-19 20:39:27',1),(21,'test1','$2a$10$x9wXwTPKLBmc0XTgcZqmRe1uYY7/kVPhnbRXBurEullKdypmLqXaK','test@gmail.com','78785632',1,'703050012','Jeanmar','Martinez','Rubi','2025-03-19 20:50:40',1);
/*!40000 ALTER TABLE `tsit_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'dbtiendasistemainventario'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAllShoppings` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getAllShoppings`(IN `p_field` VARCHAR(50), IN `p_sortOrder` VARCHAR(4), IN `p_limit` INT, IN `p_offset` INT)
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
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_searchShoppings`(IN `p_field` VARCHAR(50), IN `p_sortOrder` VARCHAR(4), IN `p_limit` INTEGER, IN `p_offset` INTEGER, IN `p_expectedMatch` VARCHAR(255))
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-19 21:36:38
