use dbtiendasistemainventario;

-- Elimina el procedimiento almacenado si ya existe, para evitar errores al recrearlo.
DROP PROCEDURE IF EXISTS actualizar_tsim_empresa;

-- Cambia el delimitador temporalmente para que MySQL no interprete el punto y coma dentro del cuerpo del procedimiento.
DELIMITER //

-- Crea el procedimiento almacenado llamado `actualizar_tsim_empresa`.
CREATE PROCEDURE actualizar_tsim_empresa()
BEGIN

    -- 1. Declara variables para almacenar los datos del único registro de la tabla.
    DECLARE var_ID_EMPRESA INT(11);
    DECLARE var_DSC_RANGO_STOCK INT(255);
    DECLARE var_DSC_NOMBRE VARCHAR(50);
    DECLARE var_NUM_TELEFONO VARCHAR(8);
    DECLARE var_DSC_CORREO VARCHAR(100);
    DECLARE var_DSC_DIRECCION VARCHAR(100);
    DECLARE var_DSC_ESLOGAN VARCHAR(255);
    
    -- 2. Selecciona el único registro de la tabla y lo guarda en las variables declaradas.
    -- Se asume que solo hay un registro, como se indica en la solicitud.
    SELECT
        ID_EMPRESA,
        DSC_RANGO_STOCK,
        DSC_NOMBRE,
        NUM_TELEFONO,
        DSC_CORREO,
        DSC_DIRECCION,
        DSC_ESLOGAN
    INTO
        var_ID_EMPRESA,
        var_DSC_RANGO_STOCK,
        var_DSC_NOMBRE,
        var_NUM_TELEFONO,
        var_DSC_CORREO,
        var_DSC_DIRECCION,
        var_DSC_ESLOGAN
    FROM
        tsim_empresa;

    -- 3. Elimina la tabla `tsim_empresa` si existe.
    DROP TABLE IF EXISTS `tsim_empresa`;

    -- 4. Vuelve a crear la tabla con la misma estructura.
    CREATE TABLE IF NOT EXISTS `tsim_empresa` (
        `ID_EMPRESA` INT(11) NOT NULL AUTO_INCREMENT,
        `DSC_RANGO_STOCK` INT(255) NOT NULL,
        `DSC_NOMBRE` VARCHAR(50) DEFAULT NULL,
        `NUM_TELEFONO` VARCHAR(8) DEFAULT NULL,
        `DSC_CORREO` VARCHAR(100) DEFAULT NULL,
        `DSC_DIRECCION` VARCHAR(100) DEFAULT NULL,
        `DSC_ESLOGAN` VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (`ID_EMPRESA`)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- 5. Inserta el registro que fue almacenado en las variables, en la nueva tabla.
    INSERT INTO `tsim_empresa` (
        `ID_EMPRESA`,
        `DSC_RANGO_STOCK`,
        `DSC_NOMBRE`,
        `NUM_TELEFONO`,
        `DSC_CORREO`,
        `DSC_DIRECCION`,
        `DSC_ESLOGAN`
    ) VALUES (
        var_ID_EMPRESA,
        var_DSC_RANGO_STOCK,
        var_DSC_NOMBRE,
        var_NUM_TELEFONO,
        var_DSC_CORREO,
        var_DSC_DIRECCION,
        var_DSC_ESLOGAN
    );
    
    
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

END //

-- Vuelve a cambiar el delimitador a su valor por defecto.
DELIMITER ;

-- Ejemplo de cómo llamar al procedimiento para ejecutarlo:
CALL actualizar_tsim_empresa();

-- Elimina el procedimiento almacenado después de haberlo llamado.
DROP PROCEDURE IF EXISTS actualizar_tsim_empresa;
