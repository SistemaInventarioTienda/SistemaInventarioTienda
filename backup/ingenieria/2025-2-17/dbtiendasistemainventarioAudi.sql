-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsil_clienteaudi`
--

DROP TABLE IF EXISTS `tsil_clienteaudi`;

CREATE TABLE `tsil_clienteaudi` (
    `ID_CLIENTEAUDI` int(11) NOT NULL,
    `ID_CLIENTE` int(11) DEFAULT NULL,
    `DSC_CEDULA` varchar(15) DEFAULT NULL,
    `DSC_NOMBRE` varchar(50) DEFAULT NULL,
    `DSC_APELLIDOUNO` varchar(50) DEFAULT NULL,
    `DSC_APELLIDODOS` varchar(50) DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `FEC_MODIFICADOEN` datetime DEFAULT NULL,
    `DSC_ACCION` char(8) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsil_correoproveedoraudi`
--

DROP TABLE IF EXISTS `tsil_correoproveedoraudi`;

CREATE TABLE `tsil_correoproveedoraudi` (
    `ID_CORREOPROVEEDORAUDI` int(11) NOT NULL,
    `ID_CORREOPROVEEDOR` int(11) NOT NULL,
    `ID_PROVEEDOR` int(11) DEFAULT NULL,
    `DSC_CORREO` varchar(100) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL,
    `FEC_MODIFICADOEN` datetime DEFAULT NULL,
    `DSC_ACCION` char(8) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsil_direccionproveedoraudi`
--

DROP TABLE IF EXISTS `tsil_direccionproveedoraudi`;

CREATE TABLE `tsil_direccionproveedoraudi` (
    `ID_DIRECCIONPROVEEDORAUDI` int(11) NOT NULL,
    `ID_DIRECCIONPROVEEDOR` int(11) DEFAULT NULL,
    `DSC_DIRECCIONEXACTA` varchar(255) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsil_empresaaudi`
--

DROP TABLE IF EXISTS `tsil_empresaaudi`;

CREATE TABLE `tsil_empresaaudi` (
    `ID_EMPRESAAUDI` int(11) NOT NULL,
    `ID_EMPRESA` int(11) DEFAULT NULL,
    `DSC_NOMBRE` varchar(50) DEFAULT NULL,
    `NUM_TELEFONO` varchar(8) DEFAULT NULL,
    `DSC_MENSAJE_VENTA` varchar(100) DEFAULT NULL,
    `FEC_CREACICON` datetime DEFAULT NULL,
    `FEC_MODIFICADO` datetime DEFAULT NULL,
    `ID_USUARIOMODIFICADOR` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsil_permisousuarioaudi`
--

DROP TABLE IF EXISTS `tsil_permisousuarioaudi`;

CREATE TABLE `tsil_permisousuarioaudi` (
    `ID_PERMISOUSUARIOAUDI` int(11) NOT NULL,
    `ID_PERMISOUSUARIO` int(11) DEFAULT NULL,
    `ID_USUARIO` int(11) DEFAULT NULL,
    `ID_PERMISO` int(11) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL,
    `FECH_MODIFICADOEN` datetime DEFAULT NULL,
    `DSC_ACCION` char(8) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsil_proveedoraudi`
--

DROP TABLE IF EXISTS `tsil_proveedoraudi`;

CREATE TABLE `tsil_proveedoraudi` (
    `ID_PROVEEDORAUDI` int(11) NOT NULL,
    `IDENTIFICADOR_PROVEEDOR` varchar(255) DEFAULT NULL,
    `ID_PROVEEDOR` int(11) DEFAULT NULL,
    `DSC_NOMBRE` varchar(255) DEFAULT NULL,
    `ID_TIPOPROVEEDOR` int(11) DEFAULT NULL,
    `DSC_VENTA` varchar(500) NOT NULL,
    `CTA_BANCARIA` varchar(500) NOT NULL,
    `DSC_DIRECCIONEXACTA` varchar(255) DEFAULT NULL,
    `ID_DIRECCION` int(11) DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `FEC_MODIFICADOEN` datetime DEFAULT NULL,
    `ID_PROVEEDORMODIFICADOR` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsil_telefonoclienteaudi`
--

DROP TABLE IF EXISTS `tsil_telefonoclienteaudi`;

CREATE TABLE `tsil_telefonoclienteaudi` (
    `ID_TELEFONOCLIENTEAUDI` int(11) NOT NULL,
    `ID_TELEFONOCLIENTE` int(11) DEFAULT NULL,
    `ID_CLIENTE` int(11) DEFAULT NULL,
    `DSC_TELEFONO` varchar(8) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `FEC_MODIFICADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL,
    `DSC_ACCION` char(8) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsil_telefonoproveedoraudi`
--

DROP TABLE IF EXISTS `tsil_telefonoproveedoraudi`;

CREATE TABLE `tsil_telefonoproveedoraudi` (
    `ID_TELEFONOPROVEEDORAUDI` int(11) NOT NULL,
    `ID_TELEFONOPROVEEDOR` int(11) DEFAULT NULL,
    `ID_PROVEEDOR` int(11) DEFAULT NULL,
    `DSC_TELEFONO` varchar(8) DEFAULT NULL,
    `FEC_CREADOEN` datetime DEFAULT NULL,
    `ESTADO` int(11) DEFAULT NULL,
    `FEC_MODIFICADOEN` datetime DEFAULT NULL,
    `DSC_ACCION` char(8) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tsil_usuarioaudi`
--

DROP TABLE IF EXISTS `tsil_usuarioaudi`;

CREATE TABLE `tsil_usuarioaudi` (
    `ID_USUARIOAUDI` int(11) NOT NULL,
    `ID_USUARIO` int(11) DEFAULT NULL,
    `ID_USUARIOMODIFICADOR` int(11) DEFAULT NULL,
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
    `FEC_MODIFICADOEN` datetime DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tsil_clienteaudi`
--
ALTER TABLE `tsil_clienteaudi` ADD PRIMARY KEY (`ID_CLIENTEAUDI`);

--
-- Indices de la tabla `tsil_correoproveedoraudi`
--
ALTER TABLE `tsil_correoproveedoraudi`
ADD PRIMARY KEY (
    `ID_CORREOPROVEEDORAUDI`,
    `ID_CORREOPROVEEDOR`
);

--
-- Indices de la tabla `tsil_direccionproveedoraudi`
--
ALTER TABLE `tsil_direccionproveedoraudi`
ADD PRIMARY KEY (`ID_DIRECCIONPROVEEDORAUDI`);

--
-- Indices de la tabla `tsil_empresaaudi`
--
ALTER TABLE `tsil_empresaaudi` ADD PRIMARY KEY (`ID_EMPRESAAUDI`);

--
-- Indices de la tabla `tsil_permisousuarioaudi`
--
ALTER TABLE `tsil_permisousuarioaudi`
ADD PRIMARY KEY (`ID_PERMISOUSUARIOAUDI`);

--
-- Indices de la tabla `tsil_proveedoraudi`
--
ALTER TABLE `tsil_proveedoraudi`
ADD PRIMARY KEY (`ID_PROVEEDORAUDI`);

--
-- Indices de la tabla `tsil_telefonoclienteaudi`
--
ALTER TABLE `tsil_telefonoclienteaudi`
ADD PRIMARY KEY (`ID_TELEFONOCLIENTEAUDI`);

--
-- Indices de la tabla `tsil_telefonoproveedoraudi`
--
ALTER TABLE `tsil_telefonoproveedoraudi`
ADD PRIMARY KEY (`ID_TELEFONOPROVEEDORAUDI`);

--
-- Indices de la tabla `tsil_usuarioaudi`
--
ALTER TABLE `tsil_usuarioaudi` ADD PRIMARY KEY (`ID_USUARIOAUDI`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tsil_clienteaudi`
--
ALTER TABLE `tsil_clienteaudi`
MODIFY `ID_CLIENTEAUDI` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsil_correoproveedoraudi`
--
ALTER TABLE `tsil_correoproveedoraudi`
MODIFY `ID_CORREOPROVEEDORAUDI` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsil_direccionproveedoraudi`
--
ALTER TABLE `tsil_direccionproveedoraudi`
MODIFY `ID_DIRECCIONPROVEEDORAUDI` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsil_empresaaudi`
--
ALTER TABLE `tsil_empresaaudi`
MODIFY `ID_EMPRESAAUDI` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsil_permisousuarioaudi`
--
ALTER TABLE `tsil_permisousuarioaudi`
MODIFY `ID_PERMISOUSUARIOAUDI` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsil_proveedoraudi`
--
ALTER TABLE `tsil_proveedoraudi`
MODIFY `ID_PROVEEDORAUDI` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsil_telefonoclienteaudi`
--
ALTER TABLE `tsil_telefonoclienteaudi`
MODIFY `ID_TELEFONOCLIENTEAUDI` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsil_telefonoproveedoraudi`
--
ALTER TABLE `tsil_telefonoproveedoraudi`
MODIFY `ID_TELEFONOPROVEEDORAUDI` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tsil_usuarioaudi`
--
ALTER TABLE `tsil_usuarioaudi`
MODIFY `ID_USUARIOAUDI` int(11) NOT NULL AUTO_INCREMENT;