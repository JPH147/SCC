-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 31-07-2018 a las 12:53:40
-- Versión del servidor: 5.6.39-cll-lve
-- Versión de PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `GENUS_SCC`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizafechalogueo` (IN `pidusuario` INT)  MODIFIES SQL DATA
BEGIN
UPDATE usuario SET usr_ultimologueo= NOW() WHERE idusuario = pidusuario;
END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizaralmacen` (IN `pidalmacen` INT, IN `palm_nombre` VARCHAR(45) CHARSET utf8, IN `palm_descripcion` VARCHAR(45) CHARSET utf8)  MODIFIES SQL DATA
UPDATE almacen
SET alm_nombre = palm_nombre,
alm_descripcion= palm_descripcion
WHERE idalmacen = pidalmacen$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizaraval` (IN `pidaval` INT, IN `pavl_dni` VARCHAR(8) CHARSET utf8, IN `pavl_nombre` VARCHAR(45) CHARSET utf8, IN `pavl_apellido` VARCHAR(45) CHARSET utf8, IN `pavl_institucion` VARCHAR(100) CHARSET utf8, IN `pavl_observacion` VARCHAR(45) CHARSET utf8, IN `pid_cliente` INT)  MODIFIES SQL DATA
UPDATE aval
SET avl_dni = pavl_dni,
	avl_nombre = pavl_nombre,
	avl_apellido = pavl_apellido,
	avl_institucion = pavl_institucion,
	avl_observacion = pavl_observacion,
	id_cliente = pid_cliente
WHERE idaval = pidaval$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizaravalxventa` (IN `pid_avalxventa` INT, IN `pid_venta` INT, IN `pid_aval` INT)  MODIFIES SQL DATA
UPDATE avalxventa
SET id_venta = pid_venta,
id_aval = pid_aval
WHERE id_avalxventa = pid_avalxventa$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizarcliente` (IN `pidcliente` INT, IN `pid_institucion` INT, IN `pclt_codigo` VARCHAR(45) CHARSET utf8, IN `pclt_dni` VARCHAR(8) CHARSET utf8, IN `pclt_nombre` VARCHAR(45) CHARSET utf8, IN `pclt_apellido` VARCHAR(45) CHARSET utf8, IN `pclt_foto` VARCHAR(200) CHARSET utf8, IN `pclt_cip` VARCHAR(45) CHARSET utf8, IN `pclt_email` VARCHAR(45) CHARSET utf8, IN `pclt_casilla` VARCHAR(45) CHARSET utf8, IN `pclt_trabajo` VARCHAR(60) CHARSET utf8, IN `pclt_cargo` VARCHAR(45) CHARSET utf8, IN `pclt_calificacion_crediticia` VARCHAR(45) CHARSET utf8, IN `pclt_calificacion_personal` VARCHAR(45) CHARSET utf8, IN `pclt_aporte` FLOAT)  MODIFIES SQL DATA
UPDATE cliente
SET id_institucion = pid_institucion,
	clt_codigo = pclt_codigo,
	clt_dni = pclt_dni,
	clt_nombre = pclt_nombre,
	clt_apellido = pclt_apellido,
	clt_foto = pclt_foto,
	clt_cip = pclt_cip,
	clt_email = pclt_email,
	clt_casilla = pclt_casilla,
	clt_trabajo = pclt_trabajo,
	clt_cargo = pclt_cargo,
	clt_calificacion_crediticia	= pclt_calificacion_crediticia,
	clt_calificacion_personal = pclt_calificacion_personal,
	clt_aporte = pclt_aporte
WHERE idcliente = pidcliente$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizardepartamento` (IN `prid` INT, IN `prnombre` VARCHAR(40) CHARSET utf8)  MODIFIES SQL DATA
update
departamento
set
dpt_nombre=prnombre
where
id_departamento=prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizardistrito` (IN `prid` INT, IN `prprovincia` INT, IN `prnombre` VARCHAR(40) CHARSET utf8)  MODIFIES SQL DATA
update
distrito
set
id_provincia=prprovincia,
dst_nombre=prnombre
where
id_distrito=prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizarproducto` (IN `prid` INT, IN `pridmodelo` INT, IN `prdescripcion` VARCHAR(45), IN `prprecio` FLOAT)  MODIFIES SQL DATA
update producto
set
id_modelo=pridmodelo,
prd_descripcion=prdescripcion,
prd_precio=prprecio
where
prid=idproducto$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizarprovincia` (IN `prid` INT, IN `prdepartamento` INT, IN `prnombre` VARCHAR(40) CHARSET utf8)  MODIFIES SQL DATA
update
provincia
set
id_departamento = prdepartamento,
prv_nombre = prnombre
where
id_provincia = prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizartransaccioncabecera` (IN `prid` INT, IN `pralmacen` INT, IN `prtipo` INT, IN `prreferencia` INT, IN `prproveedor` INT, IN `prcliente` INT, IN `prsalida` INT, IN `prsucursal` INT, IN `prvendedor` INT, IN `prfecha` DATE, IN `prdocumento` VARCHAR(40) CHARSET utf8)  NO SQL
update
transaccion_cabecera
SET
id_almacen=pralmacen,
id_tipo_transaccion=prtipo,
tsccab_referencia=prreferencia,
id_proveedor=prproveedor,
id_cliente=prcliente,
id_salida_venta=prsalida,
id_sucursal=prsucursal,
id_vendedor=prvendedor,
tsccab_fecha=prfecha,
tsccab_documento_referencia=prdocumento
WHERE
idtransaccion_cabecera=prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizartransacciondetalle` (IN `prid` INT, IN `prproducto` INT, IN `prserie` VARCHAR(20) CHARSET utf8, IN `prcantidad` INT, IN `prprecio` INT)  MODIFIES SQL DATA
update
transaccion_detalle
SET
id_producto=prproducto,
tscdet_serie=prserie,
tscdet_cantidad=prcantidad,
tscdet_precio=prprecio
where
idtransaccion_detalle=prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_actualizarusuario` (IN `pidusuario` INT, IN `pusr_nombre` VARCHAR(45) CHARSET utf8, IN `pusr_usuario` VARCHAR(15) CHARSET utf8, IN `pusr_clave` VARCHAR(150) CHARSET utf8, IN `pidperfil` INT)  MODIFIES SQL DATA
UPDATE usuario 
SET usr_nombre = pusr_nombre,
	usr_usuario = pusr_usuario,
	usr_clave = pusr_clave,
	idperfil = pidperfil
WHERE idusuario = pidusuario$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_crearalmacen` (IN `palm_nombre` VARCHAR(45) CHARSET utf8, IN `palm_descripcion` VARCHAR(45) CHARSET utf8, IN `palm_estado` BOOLEAN)  MODIFIES SQL DATA
INSERT INTO almacen SET
alm_nombre=palm_nombre,
alm_descripcion=palm_descripcion,
alm_estado=palm_estado$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_crearaval` (IN `pavl_dni` VARCHAR(8) CHARSET utf8, IN `pavl_nombre` VARCHAR(45) CHARSET utf8, IN `pavl_apellido` VARCHAR(45) CHARSET utf8, IN `pavl_institucion` VARCHAR(100) CHARSET utf8, IN `pavl_observacion` VARCHAR(45) CHARSET utf8, IN `pid_cliente` INT)  MODIFIES SQL DATA
INSERT INTO aval
SET avl_dni = pavl_dni,
	avl_nombre = pavl_nombre,
	avl_apellido = pavl_apellido,
	avl_institucion = pavl_institucion,
	avl_observacion = pavl_observacion,
	id_cliente = pid_cliente$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_crearavalxventa` (IN `pid_venta` INT, IN `pid_aval` INT)  MODIFIES SQL DATA
INSERT INTO avalxventa
SET id_venta = pid_venta,
id_aval = pid_aval$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_crearcliente` (IN `pid_subsede` INT, IN `pclt_codigo` VARCHAR(45) CHARSET utf8, IN `pclt_dni` VARCHAR(8) CHARSET utf8, IN `pclt_nombre` VARCHAR(45) CHARSET utf8, IN `pclt_apellido` VARCHAR(45) CHARSET utf8, IN `pclt_foto` VARCHAR(200) CHARSET utf8, IN `pclt_cip` VARCHAR(45) CHARSET utf8, IN `pclt_email` VARCHAR(45) CHARSET utf8, IN `pclt_casilla` VARCHAR(45) CHARSET utf8, IN `pclt_trabajo` VARCHAR(60) CHARSET utf8, IN `pclt_cargo` VARCHAR(45) CHARSET utf8, IN `pclt_calificacion_crediticia` VARCHAR(45) CHARSET utf8, IN `pclt_calificacion_personal` VARCHAR(45) CHARSET utf8, IN `pclt_aporte` FLOAT, IN `pclt_estado` BOOLEAN, IN `pclt_fecharegistro` DATETIME)  MODIFIES SQL DATA
INSERT INTO cliente
SET id_subsede = pid_subsede,
	clt_codigo = pclt_codigo,
	clt_dni = pclt_dni,
	clt_nombre = pclt_nombre,
	clt_apellido = pclt_apellido,
	clt_foto = pclt_foto,
	clt_cip = pclt_cip,
	clt_email = pclt_email,
	clt_casilla = pclt_casilla,
	clt_trabajo = pclt_trabajo,
	clt_cargo = pclt_cargo,
	clt_calificacion_crediticia	= pclt_calificacion_crediticia,
	clt_calificacion_personal = pclt_calificacion_personal,
	clt_aporte = pclt_aporte,
	clt_estado = pclt_estado,
	clt_fecharegistro = pclt_fecharegistro$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_creardepartamento` (IN `prnombre` VARCHAR(40) CHARSET utf8)  MODIFIES SQL DATA
insert into departamento set dpt_nombre=prnombre$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_creardistrito` (IN `prprovincia` INT, IN `prnombre` VARCHAR(40) CHARSET utf8)  MODIFIES SQL DATA
insert into
distrito
set
dst_nombre=prnombre,
id_provincia=prprovincia$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_crearmodulo` (IN `pmdl_nombre` VARCHAR(45) CHARSET utf8)  MODIFIES SQL DATA
INSERT INTO modulo SET mdl_nombre=pmdl_nombre$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_crearperfil` (IN `pprf_nombre` VARCHAR(45) CHARSET utf8)  MODIFIES SQL DATA
INSERT INTO perfil SET prf_nombre=pprf_nombre$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_crearproducto` (IN `prmodelo` INT, IN `prdescripcion` VARCHAR(45) CHARSET utf8, IN `prprecio` FLOAT)  MODIFIES SQL DATA
insert into producto
set
id_modelo=prmodelo,
prd_descripcion=prdescripcion,
prd_precio=prprecio$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_crearprovincia` (IN `prdepartamento` INT, IN `prnombre` VARCHAR(40) CHARSET utf8)  MODIFIES SQL DATA
insert into
provincia
set
id_departamento=prdepartamento,
prv_nombre=prnombre$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_creartransaccioncabecera` (IN `pralmacen` INT, IN `prtipo` INT, IN `prreferencia` INT, IN `prproveedor` INT, IN `prcliente` INT, IN `prsalida` INT, IN `prsucursal` INT, IN `prvendedor` INT, IN `prfecha` DATE, IN `prdocumento` VARCHAR(40), OUT `idtransaccion` INT)  NO SQL
BEGIN

INSERT INTO
transaccion_cabecera
SET
id_almacen=pralmacen,
id_tipo_transaccion=prtipo,
tsccab_referencia=prreferencia,
id_proveedor=prproveedor,
id_cliente=prcliente,
id_salida_venta=prsalida,
id_sucursal=prsucursal,
id_vendedor=prvendedor,
tsccab_fecha=prfecha,
tsccab_documento_referencia=prdocumento;
SET idtransaccion=LAST_INSERT_ID();
Select idtransaccion;
END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_creartransacciondetalle` (IN `prcabecera` INT, IN `prproducto` INT, IN `prserie` VARCHAR(20), IN `prcantidad` INT, IN `prprecio` FLOAT)  NO SQL
insert into transaccion_detalle
SET
id_movimiento_cabecera=prcabecera,
id_producto=prproducto,
tscdet_serie=prserie,
tscdet_cantidad=prcantidad,
tscdet_precio=prprecio$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_crearusuario` (IN `pusr_nombre` VARCHAR(45) CHARSET utf8, IN `pusr_usuario` VARCHAR(15) CHARSET utf8, IN `pusr_clave` VARCHAR(150) CHARSET utf8, IN `pusr_fechacreacion` DATETIME, IN `pusr_ultimologueo` DATETIME, IN `pusr_estado` BOOLEAN, IN `pidperfil` INT)  MODIFIES SQL DATA
INSERT INTO usuario SET usr_nombre=pusr_nombre, usr_usuario=pusr_usuario,
usr_clave=pusr_clave,usr_fechacreacion=pusr_fechacreacion,
usr_ultimologueo=pusr_ultimologueo,usr_estado=pusr_estado,
idperfil=pidperfil$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_eliminaralmacen` (IN `pidalmacen` INT)  MODIFIES SQL DATA
UPDATE almacen 
SET alm_estado = 0
WHERE idalmacen = pidalmacen$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_eliminarcliente` (IN `pidcliente` INT)  MODIFIES SQL DATA
UPDATE cliente
SET clt_estado = 0
WHERE idcliente = pidcliente$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_eliminardepartamento` (IN `prid` INT)  MODIFIES SQL DATA
update
departamento
set
dpt_estado=0
where
id_departamento = prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_eliminardistrito` (IN `prid` INT)  MODIFIES SQL DATA
update
distrito
set
dst_estado=0
where
id_distrito=prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_eliminarproducto` (IN `idpr` INT)  MODIFIES SQL DATA
update producto
set
prd_estado=0
where
idproducto=idpr$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_eliminarprovincia` (IN `prid` INT)  MODIFIES SQL DATA
update
provincia
set
prv_estado=0
where
id_provincia = prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_eliminartransaccioncabecera` (IN `prid` INT)  NO SQL
UPDATE
transaccion_cabecera
SET
tsccab_estado=0
WHERE
idtransaccion_cabecera=prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_eliminarusuario` (IN `pidusuario` INT)  MODIFIES SQL DATA
UPDATE usuario
SET usr_estado = 0
WHERE idusuario = pidusuario$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listaralmacen` ()  READS SQL DATA
SELECT alm_nombre,alm_descripcion, 
--CASE WHEN alm_estado = 1 THEN 'Activo' ELSE 'Inactivo' END as 'alm_estado'
FROM almacen
WHERE alm_estado =1$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listaralmacenxId` (IN `pidalmacen` INT)  READS SQL DATA
SELECT alm_nombre,alm_descripcion, 
CASE WHEN alm_estado = 1 THEN 'Activo' ELSE 'Inactivo' END as 'alm_estado'
FROM almacen
WHERE idalmacen = pidalmacen$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listaraval` (IN `pavl_dni` VARCHAR(8) CHARSET utf8, IN `pclt_dni` VARCHAR(8) CHARSET utf8)  READS SQL DATA
SELECT a.avl_dni, a.avl_nombre, a.avl_apellido, a.avl_institucion,
a.avl_observacion, c.clt_dni
FROM aval a
INNER JOIN cliente c on a.idcliente =c.idcliente
WHERE (pavl_dni IS NULL OR a.avl_dni LIKE
       CONCAT('%',pavl_dni,'%')) AND
(pclt_cliente IS NULL OR c.clt_dni LIKE
       CONCAT('%',pclt_dni,'%'))$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listaravalxId` (IN `pidaval` INT)  READS SQL DATA
SELECT a.avl_dni, a.avl_nombre, a.avl_apellido, a.avl_institucion,
a.avl_observacion, c.clt_dni
FROM aval a
INNER JOIN cliente c on a.idcliente =c.idcliente
WHERE a.idaval = pidaval$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarcliente` (IN `pinst_nombre` VARCHAR(45) CHARSET utf8, IN `psd_nombre` VARCHAR(45) CHARSET utf8, IN `pssd_nombre` VARCHAR(45) CHARSET utf8, IN `pclt_dni` VARCHAR(8) CHARSET utf8, IN `pclt_nombre` VARCHAR(45) CHARSET utf8, IN `pclt_apellido` VARCHAR(45) CHARSET utf8)  MODIFIES SQL DATA
SELECT c.idcliente, inst.inst_nombre,s.sd_nombre , ssd.ssd_nombre, c.clt_codigo, c.clt_dni,
c.clt_nombre, c.clt_apellido, c.clt_cip, c.clt_email,
c.clt_casilla, c.clt_trabajo, c.clt_cargo, c.clt_calificacion_crediticia,
c.clt_calificacion_personal, c.clt_aporte, c.clt_fecharegistro
FROM cliente c
INNER JOIN subsede ssd on c.id_subsede = ssd.id_subsede
INNER JOIN sede s on ssd.id_sede = s.id_sede
INNER JOIN institucion inst on s.id_institucion = inst.id_institucion
WHERE c.clt_estado = 1 AND
(pinst_nombre IS NULL OR inst.inst_nombre LIKE CONCAT('%',pinst_nombre,'%')) AND
(psd_nombre IS NULL OR s.sd_nombre LIKE CONCAT('%',psd_nombre,'%')) AND
(pssd_nombre IS NULL OR ssd.ssd_nombre LIKE CONCAT('%',pssd_nombre,'%')) AND
(pclt_dni IS NULL OR c.clt_dni LIKE CONCAT('%',pclt_dni,'%'))AND
(pclt_nombre IS NULL OR c.clt_nombre LIKE CONCAT('%',pclt_nombre,'%'))AND
(pclt_apellido IS NULL OR c.clt_apellido LIKE CONCAT('%',pclt_apellido,'%'))$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarclientexId` (IN `pidcliente` INT)  READS SQL DATA
SELECT c.idcliente, inst.id_institucion,s.id_sede , ssd.id_subsede, c.clt_codigo, c.clt_dni,
c.clt_nombre, c.clt_apellido, c.clt_cip, c.clt_email,
c.clt_casilla, c.clt_trabajo, c.clt_cargo, c.clt_calificacion_crediticia,
c.clt_foto,
c.clt_calificacion_personal, c.clt_aporte, c.clt_fecharegistro
FROM cliente c
INNER JOIN subsede ssd on c.id_subsede = ssd.id_subsede
INNER JOIN sede s on ssd.id_sede = s.id_sede
INNER JOIN institucion inst on s.id_institucion = inst.id_institucion
WHERE c.clt_estado = 1 and c.idcliente = pidcliente$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listardepartamento` (IN `prnombre` VARCHAR(40) CHARSET utf8, IN `prpagina` INT, IN `prtotalpagina` INT)  READS SQL DATA
BEGIN

DECLARE IP  INT unsigned;
DECLARE TP  INT unsigned;

set IP = prpagina*prtotalpagina;
set TP=prtotalpagina;

select
id_departamento,
dpt_nombre
from
departamento
where
dpt_estado=1
and
(prnombre is null or dpt_nombre like CONCAT('%',prnombre,'%'))
order by
dpt_nombre asc

limit IP,TP;

END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listardepartamento2` (IN `prnombre` VARCHAR(40) CHARSET utf8)  READS SQL DATA
BEGIN

DECLARE VNOMBRE VARCHAR(255);

IF prnombre="null" THEN SET VNOMBRE = "";
ELSE SET VNOMBRE = concat("AND ('",prnombre,"' is null or dpt_nombre like CONCAT('%','", prnombre,"', '%'))");
END IF;

SET @SQLStatement = CONCAT("
select
id_departamento,
dpt_nombre
from
departamento
where
dpt_estado=1 ",
#"AND (dpt_nombre like CONCAT('%','", prnombre,"', '%'))"
VNOMBRE
," order by
dpt_nombre asc");
                           
PREPARE stmt FROM @SQLStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listardepartamentocontar` (IN `prnombre` VARCHAR(40))  READS SQL DATA
select count(*) as total
from
departamento
where
dpt_estado=1
and
(prnombre is null or dpt_nombre like CONCAT('%',prnombre,'%'))
order by
dpt_nombre asc$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listardepartamentoxId` (IN `prid` INT)  READS SQL DATA
select
id_departamento,
dpt_nombre
from
departamento
where
id_departamento=prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listardistrito` (IN `prdepartamento` VARCHAR(40) CHARSET utf8, IN `prprovincia` VARCHAR(40) CHARSET utf8, IN `prdistrito` VARCHAR(40) CHARSET utf8, IN `prpagina` INT, IN `prtotalpagina` INT)  READS SQL DATA
BEGIN

DECLARE IP  INT unsigned;
DECLARE TP  INT unsigned;

set IP = prpagina*prtotalpagina;
set TP=prtotalpagina;

select 
d.id_distrito,
dp.dpt_nombre,
p.prv_nombre,
d.dst_nombre
from
distrito d
inner join provincia p on
d.id_provincia = p.id_provincia
inner join departamento dp on
p.id_departamento = dp.id_departamento
where
dp.dpt_estado=1
and
p.prv_estado =1 
and
d.dst_estado = 1
and
(prdepartamento is null or dp.dpt_nombre like CONCAT('%',prdepartamento,'%'))
and 
(prprovincia is null or p.prv_nombre like CONCAT('%',prprovincia,'%'))
and
(prdistrito is null or d.dst_nombre like CONCAT('%',prdistrito,'%'))
order by
dp.dpt_nombre asc,
p.prv_nombre asc,
d.dst_nombre asc

limit IP,TP;

END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listardistritocontar` (IN `prdepartamento` VARCHAR(40) CHARSET utf8, IN `prprovincia` VARCHAR(40) CHARSET utf8, IN `prdistrito` VARCHAR(40) CHARSET utf8)  READS SQL DATA
select count(*) as total
from
distrito d
inner join provincia p on
d.id_provincia = p.id_provincia
inner join departamento dp on
p.id_departamento = dp.id_departamento
where
dp.dpt_estado=1
and
p.prv_estado =1 
and
d.dst_estado = 1
and
(prdepartamento is null or dp.dpt_nombre like CONCAT('%',prdepartamento,'%'))
and 
(prprovincia is null or p.prv_nombre like CONCAT('%',prprovincia,'%'))
and
(prdistrito is null or d.dst_nombre like CONCAT('%',prdistrito,'%'))
order by
dp.dpt_nombre asc,
p.prv_nombre asc,
d.dst_nombre asc$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listardistritoxId` (IN `prid` INT)  READS SQL DATA
select 
d.id_distrito,
dp.dpt_nombre,
p.id_provincia,
d.dst_nombre
from
distrito d
inner join provincia p on
d.id_provincia = p.id_provincia
inner join departamento dp on
p.id_departamento = dp.id_departamento
where
d.id_distrito = prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarinstitucion` ()  READS SQL DATA
SELECT inst.id_institucion, inst.inst_nombre, inst.isnt_abreviatura,
inst.isnt_representante_legal, dist.dst_nombre, inst.inst_direccion,
inst.inst_telefono, inst.inst_codigo_cooperativa
FROM institucion inst
INNER JOIN distrito dist ON inst.id_distrito= dist.id_distrito
WHERE inst.inst_estado=1$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarmarca` (IN `prtipo` INT, IN `prnombre` VARCHAR(45) CHARSET utf8)  READS SQL DATA
select
m.id_marca,
t.tprd_nombre,
m.mrc_nombre
from marca m
inner join tipo_producto t on
m.id_tipo_producto = t.id_tipo_producto
where
(prtipo is null or prtipo = m.id_tipo_producto)
and
(prnombre is null or prnombre = CONCAT('%',m.mrc_nombre,'%'))$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarmarcaxId` (IN `prid` INT)  READS SQL DATA
select
m.id_marca,
t.tprd_nombre,
m.mrc_nombre
from marca m
inner join tipo_producto t on
m.id_tipo_producto = t.id_tipo_producto
where m.id_marca = prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarmodelo` (IN `prmarca` INT, IN `prnombre` VARCHAR(45))  READS SQL DATA
select
md.id_modelo,
t.tprd_nombre,
m.mrc_nombre,
md.mdl_nombre
from
modelo md
inner join marca m on
md.id_marca = m.id_marca
inner join tipo_producto t on
m.id_tipo_producto = t.id_tipo_producto
where
(prmarca is null or prmarca = md.id_marca)
and
(prnombre is null or prnombre = CONCAT('%',md.mdl_nombre,'%'))$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarmodeloxId` (IN `prid` INT)  READS SQL DATA
select
md.id_modelo,
m.mrc_nombre,
md.mdl_nombre
from
modelo md
inner join marca m on
md.id_marca = m.id_marca
where
md.id_modelo = prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarmodulo` ()  READS SQL DATA
SELECT idmodulo,mdl_nombre FROM modulo$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarmoduloxId` (IN `pidmodulo` INT)  READS SQL DATA
SELECT mdl_nombre FROM modulo WHERE idmodulo = pidmodulo$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarperfil` ()  READS SQL DATA
SELECT prf_nombre FROM perfil$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarperfilxId` (IN `pidperfil` INT)  READS SQL DATA
SELECT prf_nombre FROM perfil WHERE idperfil = pidperfil$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarproducto` (IN `prtipo` VARCHAR(40) CHARSET utf8, IN `prmarca` VARCHAR(40) CHARSET utf8, IN `prmodelo` VARCHAR(40) CHARSET utf8, IN `prdescripcion` VARCHAR(40) CHARSET utf8, IN `prpagina` INT, IN `prtotalpagina` INT, IN `orden` VARCHAR(100) CHARSET utf8)  READS SQL DATA
BEGIN

DECLARE IP INT unsigned;
DECLARE TP INT unsigned;
DECLARE VTIPO VARCHAR(255);
DECLARE VMARCA VARCHAR(255);
DECLARE VMODELO VARCHAR(255);
DECLARE VDESCRIPCION VARCHAR(255);

set IP = (prpagina-1)*prtotalpagina;
set TP=prtotalpagina;

SET VTIPO = concat("AND (t.tprd_nombre like CONCAT('%','", prtipo,"', '%')) ");

SET VMARCA = concat("AND (m.mrc_nombre like CONCAT('%','", prmarca,"', '%')) ");

SET VMODELO = concat("AND (md.mdl_nombre like CONCAT('%','", prmodelo,"', '%')) ");

#IF prdescripcion="" THEN SET VDESCRIPCION = "";
#ELSE SET VDESCRIPCION = concat("AND (p.prd_descripcion like CONCAT('%','", prdescripcion,"', '%')) ");
#END IF;

SET VDESCRIPCION = concat("AND (p.prd_descripcion like CONCAT('%','", prdescripcion,"', '%')) ");

SET @SQLStatement = CONCAT(
"SELECT
p.idproducto as 'id',
t.tprd_nombre as 'tipo',
m.mrc_nombre as 'marca',
md.mdl_nombre as 'modelo',
p.prd_descripcion as 'descripcion',
u.und_nombre as 'unidad_medida',
p.prd_precio as 'precio' 
FROM producto p
inner join modelo md on
md.id_modelo=p.id_modelo
INNER JOIN marca m ON 
m.id_marca=md.id_marca
INNER JOIN tipo_producto t ON 
t.id_tipo_producto=m.id_tipo_producto
INNER JOIN unidad_medida u ON
u.idunidad_medida=t.id_unidad_medida
WHERE
(p.prd_estado=1) ",
VTIPO,
VMARCA,
VMODELO,
VDESCRIPCION,
" ORDER BY ",
orden,
" limit ",IP,",",TP);

PREPARE stmt FROM @SQLStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarproductocontar` (IN `prtipo` VARCHAR(40) CHARSET utf8, IN `prmarca` VARCHAR(40) CHARSET utf8, IN `prmodelo` VARCHAR(40) CHARSET utf8, IN `prdescripcion` VARCHAR(40) CHARSET utf8)  READS SQL DATA
select count(*) as total
FROM producto p
inner join modelo md on
md.id_modelo=p.id_modelo
INNER JOIN marca m ON 
m.id_marca=md.id_marca
INNER JOIN tipo_producto t ON 
t.id_tipo_producto=m.id_tipo_producto
INNER JOIN unidad_medida u ON
u.idunidad_medida=t.id_unidad_medida
WHERE
(p.prd_estado=1)
AND
(prtipo is null or t.tprd_nombre like CONCAT('%', prtipo, '%'))
and
(prmarca is null or m.mrc_nombre like CONCAT('%', prmarca, '%'))
and
(prmodelo is null or md.mdl_nombre like CONCAT('%', prmodelo, '%'))
and
(prdescripcion is null or p.prd_descripcion like CONCAT('%', prdescripcion, '%'))$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarproductoxId` (IN `prid` INT)  NO SQL
SELECT p.idproducto, t.id_tipo_producto, m.id_marca, md.id_modelo,
p.prd_descripcion, u.und_nombre, p.prd_precio FROM producto p
inner join modelo md on
md.id_modelo=p.id_modelo
INNER JOIN marca m ON 
m.id_marca=md.id_marca
INNER JOIN tipo_producto t ON 
t.id_tipo_producto=m.id_tipo_producto
INNER JOIN unidad_medida u ON
u.idunidad_medida=t.id_unidad_medida
WHERE
(prid=p.idproducto)$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarproveedor` (IN `prtipodocumento` INT, IN `prdocumento` VARCHAR(40) CHARSET utf8, IN `prnombre` VARCHAR(40), IN `prpagina` INT, IN `prtotalpagina` INT)  NO SQL
BEGIN

DECLARE IP INT unsigned;
DECLARE TP INT unsigned;

set IP = prpagina*prtotalpagina;
set TP=prtotalpagina;

select
idproveedor,
case when prv_tipo_documento =1 then 'DNI' else 'RUC' end as 'tipo_documeno',
prv_documento,
prv_nombre,
prv_representante_legal,
prv_observacion
FROM
proveedor
WHERE
prv_estado = 1
AND
(prtipodocumento is null or prtipodocumento=prv_tipo_documento)
AND
(prdocumento is null or prv_documento like concat('%',prdocumento,'%'))
AND
(prnombre is null or prv_nombre like concat('%',prnombre,'%'))
limit IP,TP;

END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarprovincia` (IN `prdepartamento` VARCHAR(40) CHARSET utf8, IN `prnombre` VARCHAR(40) CHARSET utf8, IN `prpagina` INT, IN `prtotalpagina` INT)  READS SQL DATA
BEGIN

DECLARE IP  INT unsigned;
DECLARE TP  INT unsigned;

set IP = prpagina*prtotalpagina;
set TP=prtotalpagina;

select
p.id_provincia,
d.dpt_nombre,
p.prv_nombre
from
provincia p
inner join departamento d on
p.id_departamento = d.id_departamento
where
d.dpt_estado=1
and
p.prv_estado =1 
and
(prdepartamento is null or d.dpt_nombre like CONCAT('%',prdepartamento,'%'))
and
(prnombre is null or p.prv_nombre like CONCAT('%',prnombre,'%'))
order by
d.dpt_nombre asc, p.prv_nombre asc

limit IP,TP;

END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarprovinciacontar` (IN `prdepartamento` VARCHAR(40), IN `prnombre` VARCHAR(40))  READS SQL DATA
select
count(*) as total
from
provincia p
inner join departamento d on
p.id_departamento = d.id_departamento
where
d.dpt_estado=1
and
p.prv_estado =1 
and
(prdepartamento is null or d.dpt_nombre like CONCAT('%',prdepartamento,'%'))
and
(prnombre is null or p.prv_nombre like CONCAT('%',prnombre,'%'))
order by
d.dpt_nombre asc, p.prv_nombre asc$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarprovinciaxId` (IN `prid` INT)  READS SQL DATA
select
p.id_provincia,
d.id_departamento,
p.prv_nombre
from
provincia p
inner join departamento d on
p.id_departamento = d.id_departamento
where
p.id_provincia=prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarsede` (IN `pid_institucion` INT, IN `psd_nombre` VARCHAR(60) CHARSET utf8)  READS SQL DATA
SELECT sd.id_sede, inst.inst_nombre, sd.sd_nombre,
sd.sd_abreviatura, sd.sd_representante_legal,
dist.dst_nombre, sd.sd_direccion, sd.sd_telefono,
sd.sd_codigo_cooperativa
FROM sede sd
INNER JOIN institucion inst ON sd.id_institucion = inst.id_institucion
INNER JOIN distrito dist ON sd.id_distrito = dist.id_distrito
WHERE sd.sd_estado = 1 AND
(pid_institucion IS NULL OR sd.id_institucion = pid_institucion) AND
(psd_nombre IS NULL OR sd.sd_nombre LIKE CONCAT ('%',psd_nombre,'%'))$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarstock` (IN `pralmacen` VARCHAR(40) CHARSET utf8, IN `prtipo` VARCHAR(40) CHARSET utf8, IN `prmarca` VARCHAR(40) CHARSET utf8, IN `prmodelo` VARCHAR(40) CHARSET utf8, IN `prdescripcion` VARCHAR(40) CHARSET utf8, IN `prpagina` INT, IN `prtotalpagina` INT, IN `orden` VARCHAR(100) CHARSET utf8)  READS SQL DATA
begin

DECLARE IP INT unsigned;
DECLARE TP INT unsigned;
DECLARE VALMACEN VARCHAR(255);
DECLARE VTIPO VARCHAR(255);
DECLARE VMARCA VARCHAR(255);
DECLARE VMODELO VARCHAR(255);
DECLARE VDESCRIPCION VARCHAR(255);

set IP = (prpagina-1)*prtotalpagina;
set TP=prtotalpagina;

SET VALMACEN = concat("AND (al.alm_nombre like CONCAT('%','", pralmacen,"', '%')) ");
SET VTIPO = concat("AND (t.tprd_nombre like CONCAT('%','", prtipo,"', '%')) ");
SET VMARCA = concat("AND (m.mrc_nombre like CONCAT('%','", prmarca,"', '%')) ");
SET VMODELO = concat("AND (md.mdl_nombre like CONCAT('%','", prmodelo,"', '%')) ");
SET VDESCRIPCION = concat("AND (p.prd_descripcion like CONCAT('%','", prdescripcion,"', '%')) ");

set @Statement = CONCAT("
select
al.alm_nombre as almacen,
t.tprd_nombre as tipo,
m.mrc_nombre as marca,
md.mdl_nombre as modelo,
p.prd_descripcion as descripcion,
u.und_nombre as unidad_medida,
SUM(tdet.tscdet_cantidad) as cantidad
from
transaccion_detalle tdet
inner join transaccion_cabecera tcab on
tdet.id_movimiento_cabecera = tcab.idtransaccion_cabecera
inner join almacen al on
tcab.id_almacen = al.idalmacen
inner join producto p on
tdet.id_producto = p.idproducto
inner join modelo md on
p.id_modelo = md.id_modelo
inner join marca m on
md.id_marca = m.id_marca
inner join tipo_producto t on
m.id_tipo_producto = t.id_tipo_producto
inner join unidad_medida u on
t.id_unidad_medida = u.idunidad_medida
WHERE
tcab.tsccab_estado = 1 ",
VALMACEN,
VTIPO,
VMARCA,
VMODELO,
VDESCRIPCION,
" group by
al.alm_nombre, tdet.id_producto
",
" order by ",
orden,           
" limit " ,IP,",",TP);

PREPARE stmt FROM @Statement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

end$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarsubsede` (IN `pid_sede` INT, IN `pssd_nombre` VARCHAR(60) CHARSET utf8)  READS SQL DATA
SELECT ssd.id_subsede, ssd.ssd_nombre, ssd.ssd_abreviatura,
ssd.ssd_representante_legal, dist.dst_nombre, ssd.ssd_direccion,
ssd.ssd_telefono, ssd.ssd_codigo_cooperativa
FROM subsede ssd
INNER JOIN distrito dist on ssd.id_distrito = dist.id_distrito
WHERE ssd.ssd_estado = 1 AND 
(pid_sede IS NULL OR ssd.id_sede = pid_sede) AND
(pssd_nombre IS NULL OR ssd.ssd_nombre LIKE 
 CONCAT('%',pssd_nombre,'%'))$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listartipoproducto` (IN `prnombre` VARCHAR(45), IN `prum` VARCHAR(45))  READS SQL DATA
select
tp.id_tipo_producto,
tp.tprd_nombre,
u.und_nombre
from
tipo_producto tp
inner join unidad_medida u on
tp.id_unidad_medida = u.idunidad_medida
where
(prnombre is null or tp.tprd_nombre like CONCAT('%', prnombre, '%'))
and
(prum is null or u.und_nombre like concat('%', prum, '%'))$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listartipoproductoxId` (IN `prid` INT)  MODIFIES SQL DATA
select
t.id_tipo_producto,
t.tprd_nombre,
u.und_nombre
from
tipo_producto t
inner join unidad_medida u on
t.id_unidad_medida = u.idunidad_medida
where
t.id_tipo_producto = prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listartransaccioncabecera` (IN `pralmacen` VARCHAR(40), IN `prtipo` VARCHAR(40), IN `prreferencia` INT, IN `prreferente` VARCHAR(40), IN `prfechainicio` DATE, IN `prfechafin` DATE, IN `prdocumento` VARCHAR(40), IN `prpagina` INT, IN `prtotalpagina` INT, IN `orden` VARCHAR(20))  READS SQL DATA
BEGIN

DECLARE IP INT unsigned;
DECLARE TP INT unsigned;
DECLARE VALMACEN varchar(255);
DECLARE VTIPO varchar(255);
DECLARE VREFERENCIA varchar(255);
DECLARE VREFERENTE varchar(255);
DECLARE VFECHA varchar(255);
DECLARE VDOCUMENTO varchar(255);

set IP = (prpagina-1)*prtotalpagina;
set TP=prtotalpagina;
SET VALMACEN = concat("AND (a.alm_nombre like concat('%','",pralmacen,"','%')) ");
SET VTIPO = concat("AND (tp.ttsc_nombre like concat('%','",prtipo,"','%')) ");
IF ISNULL(prreferencia) THEN SET VREFERENCIA = "";
ELSE SET VREFERENCIA = concat("AND  '",prreferencia,"'=tcab.tsccab_referencia ");
END IF;
SET VREFERENTE=concat("AND
('",prreferente,"' is null or
	p.prv_nombre like concat('%','",prreferente,"','%') or
 	c.clt_nombre like concat('%','",prreferente,"','%') OR
 	s.sc_codigo like concat('%','",prreferente,"','%') OR
 	al.alm_nombre like concat('%','",prreferente,"','%') OR
 	v.vnd_nombre like concat('%','",prreferente,"','%')) ");
IF (isnull(prfechainicio) and isnull(prfechafin)) then set VFECHA="";
ELSEIF (isnull(prfechafin)) then set VFECHA=CONCAT("AND (tcab.tsccab_fecha>='",prfechainicio,"') ");
ELSEIF (isnull(prfechainicio)) then set VFECHA=CONCAT("AND (tcab.tsccab_fecha<='",prfechafin,"') ");
ELSE set VFECHA=CONCAT("AND (tcab.tsccab_fecha between '",prfechainicio,"' and '",prfechafin,"') ");
END IF;
#SET VFECHA=concat("AND (ISNULL('",prfechainicio,"') or ISNULL('",prfechafin,"') or
# 	tcab.tsccab_fecha='",prfechainicio,"' or
# 	tcab.tsccab_fecha='",prfechafin,"' or
# 	tcab.tsccab_fecha BETWEEN '",prfechainicio,"' and '",prfechafin,"') ");

SET VDOCUMENTO=concat("AND (tcab.tsccab_documento_referencia like concat('%','",prdocumento,"','%')) ");

set @Statement=CONCAT("
SELECT
tcab.idtransaccion_cabecera as id,
a.alm_nombre as almacen,
tp.ttsc_nombre as tipo,
case tcab.tsccab_referencia
when 1 then 'Proveedor'
when 2 then 'Cliente'
when 3 then 'Salida de ventas'
when 4 then 'Almacen'
when 5 then 'Vendedor'
end AS referencia,
case
when (tcab.id_proveedor<>null OR tcab.id_proveedor<>0) then p.prv_nombre
when (tcab.id_cliente<>null OR tcab.id_cliente<>0) then c.clt_nombre
when (tcab.id_salida_venta<>null OR tcab.id_salida_venta<>0) then s.sc_codigo
when (tcab.id_sucursal<>null OR tcab.id_sucursal<>0)  then al.alm_nombre
when (tcab.id_vendedor<>null OR tcab.id_vendedor<>0)  then v.vnd_nombre
end AS referente,
tcab.tsccab_fecha as fecha,
tcab.tsccab_documento_referencia as documento
FROM
transaccion_cabecera as tcab
INNER JOIN almacen as a ON
tcab.id_almacen=a.idalmacen
inner join tipo_transaccion as tp ON
tcab.id_tipo_transaccion=tp.idtipo_transaccion
left join proveedor as p ON
tcab.id_proveedor=p.idproveedor
left join cliente as c ON
tcab.id_cliente=c.idcliente
left join salida_cabecera as s on
tcab.id_salida_venta=idsalida_vendedor
left join almacen as al ON
tcab.id_almacen=al.idalmacen
left join vendedor as v ON
tcab.id_vendedor=v.idvendedor
WHERE
tcab.tsccab_estado=1 ",
VALMACEN,
VTIPO,
VREFERENCIA,
VREFERENTE,
VFECHA,
VDOCUMENTO,
" order by ",orden,
" limit ",IP,",",TP);

prepare stmt from @Statement;
execute stmt;
DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listartransaccioncabeceracontar` (IN `pralmacen` VARCHAR(40) CHARSET utf8, IN `prtipo` VARCHAR(40) CHARSET utf8, IN `prreferencia` INT, IN `prreferente` VARCHAR(40) CHARSET utf8, IN `prfechainicio` DATE, IN `prfechafin` DATE, IN `prdocumento` VARCHAR(40) CHARSET utf8)  READS SQL DATA
BEGIN

select count(*) as total
FROM 
transaccion_cabecera as tcab
INNER JOIN almacen as a ON
tcab.id_almacen=a.idalmacen
inner join tipo_transaccion as tp ON
tcab.id_tipo_transaccion=tp.idtipo_transaccion
left join proveedor as p ON
tcab.id_proveedor=p.idproveedor
left join cliente as c ON
tcab.id_cliente=c.idcliente
left join salida_cabecera as s on
tcab.id_salida_venta=idsalida_vendedor
left join almacen as al ON
tcab.id_almacen=al.idalmacen
left join vendedor as v ON
tcab.id_vendedor=v.idvendedor
WHERE
tcab.tsccab_estado=1
AND
(pralmacen is null or a.alm_nombre like concat('%',pralmacen,'%'))
AND
(prtipo is null or tp.ttsc_nombre like concat('%',prtipo,'%')) 
AND
(prreferencia is null or prreferencia=tcab.tsccab_referencia)
AND
(prreferente is null or
	p.prv_nombre like concat('%',prreferente,'%') or
 	c.clt_nombre like concat('%',prreferente,'%') OR
 	s.sc_codigo like concat('%',prreferente,'%') OR
 	al.alm_nombre like concat('%',prreferente,'%') OR
 	v.vnd_nombre like concat('%',prreferente,'%')) 
AND
((prfechainicio is null and prfechainicio is null) OR
(prfechainicio is null and tcab.tsccab_fecha<=prfechafin) OR
(prfechafin is null and tcab.tsccab_fecha>=prfechainicio) OR
(tcab.tsccab_fecha between prfechainicio and prfechafin))
AND
(prdocumento is null or tcab.tsccab_documento_referencia like concat('%',prdocumento,'%'));

END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listartransaccioncabeceraxId` (IN `prid` INT)  NO SQL
SELECT
idtransaccion_cabecera,
id_almacen,
id_tipo_transaccion,
tsccab_referencia,
id_proveedor,
id_cliente,
id_salida_venta,
id_sucursal,
id_vendedor,
tsccab_fecha,
tsccab_documento_referencia
FROM
transaccion_cabecera
WHERE
idtransaccion_cabecera=prid$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listartransacciondetalle` (IN `prcabecera` INT, IN `prproducto` VARCHAR(40) CHARSET utf8, IN `prserie` VARCHAR(40) CHARSET utf8)  READS SQL DATA
select
tdet.id_movimiento_cabecera,
p.prd_descripcion,
tdet.tscdet_serie,
tdet.tscdet_cantidad,
tdet.tscdet_precio
from transaccion_detalle tdet
right join producto p on
tdet.id_producto=p.idproducto
WHERE
(prcabecera is null or tdet.id_movimiento_cabecera=prcabecera)
AND
(prproducto is null or p.prd_descripcion like concat('%',prproducto,'%'))
AND
(prserie is null or tdet.tscdet_serie like concat('%',prserie,'%'))$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarusuario` (IN `pidusuario` INT, IN `pusr_nombre` VARCHAR(45) CHARSET utf8, IN `pusr_usuario` VARCHAR(15) CHARSET utf8, IN `pusr_ultimologueo` DATE, IN `pusr_fechacreacion` DATE, IN `pusr_estado` INT, IN `pidperfil` INT)  READS SQL DATA
SELECT u.idusuario,u.usr_nombre, u.usr_usuario, u.usr_ultimologueo, 
u.usr_fechacreacion, CASE WHEN u.usr_estado= 1 
THEN 'Activo' ELSE 'Inactivo' END as 'usr_estado',
p.prf_nombre
FROM usuario u
INNER JOIN perfil p ON u.idperfil = p.idperfil
WHERE (pidusuario IS NULL OR  u.idusuario = pidusuario) AND 
	  (pusr_nombre IS NULL OR u.usr_nombre LIKE CONCAT('%',pusr_nombre,'%')) AND
	  (pusr_usuario IS NULL OR u.usr_usuario LIKE CONCAT('%',pusr_usuario,'%'))AND
      (pusr_ultimologueo IS NULL OR DATE(u.usr_ultimologueo) = pusr_ultimologueo)AND
      (pusr_fechacreacion IS NULL OR DATE(u.usr_fechacreacion) = pusr_fechacreacion)AND
	  (pusr_estado IS NULL OR u.usr_estado=pusr_estado) AND
	  (pidperfil IS NULL OR u.idperfil= pidperfil)$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_listarusuarioxId` (IN `pidusuario` INT)  READS SQL DATA
SELECT u.idusuario,u.usr_nombre,u.usr_usuario,u.usr_ultimologueo, 
u.usr_fechacreacion,u.usr_estado,p.prf_nombre FROM usuario u
INNER JOIN perfil p ON u.idperfil = p.idperfil WHERE u.idusuario = pidusuario$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_login` (IN `pusr_usuario` VARCHAR(15) CHARSET utf8)  BEGIN
SELECT * FROM usuario WHERE usr_usuario = TRIM(pusr_usuario);
END$$

CREATE DEFINER=`genus`@`localhost` PROCEDURE `sp_test` (`var1` INT)  BEGIN   
    DECLARE start  INT unsigned DEFAULT 1;  
    DECLARE finish INT unsigned DEFAULT 10;

    SELECT  var1, start, finish;

    SELECT * FROM producto WHERE id_producto BETWEEN start AND finish; 
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `accionXusuario`
--

CREATE TABLE `accionXusuario` (
  `idaccionXusuario` int(11) NOT NULL,
  `acc_nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividad`
--

CREATE TABLE `actividad` (
  `idactividad` int(11) NOT NULL,
  `act_nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividadXusuario`
--

CREATE TABLE `actividadXusuario` (
  `idactividadXusuario` int(11) NOT NULL,
  `id_vendedor` int(11) NOT NULL,
  `id_actividad` int(11) NOT NULL,
  `axu_hora_inicio` datetime NOT NULL,
  `axu_hora_fin` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacen`
--

CREATE TABLE `almacen` (
  `idalmacen` int(11) NOT NULL,
  `alm_nombre` varchar(45) NOT NULL,
  `alm_descripcion` varchar(45) NOT NULL,
  `alm_estado` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Activo -0 - Inactivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `almacen`
--

INSERT INTO `almacen` (`idalmacen`, `alm_nombre`, `alm_descripcion`, `alm_estado`) VALUES
(1, 'PRINCIPAL', 'ALMACEN DE PRODUCTOS', 1),
(2, 'Almacén de prueba', 'Prueba', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aval`
--

CREATE TABLE `aval` (
  `idaval` int(11) NOT NULL,
  `avl_dni` varchar(8) NOT NULL,
  `avl_nombre` varchar(45) NOT NULL,
  `avl_apellido` varchar(45) NOT NULL,
  `avl_institucion` varchar(100) NOT NULL,
  `avl_observacion` varchar(45) NOT NULL,
  `idcliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `avalxventa`
--

CREATE TABLE `avalxventa` (
  `id_avalxventa` int(11) NOT NULL,
  `idventa` int(11) NOT NULL,
  `idaval` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `banco`
--

CREATE TABLE `banco` (
  `idbanco` int(11) NOT NULL,
  `bnc_nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `idcliente` int(11) NOT NULL,
  `id_subsede` int(11) NOT NULL,
  `clt_codigo` varchar(45) NOT NULL COMMENT 'CODOFIN',
  `clt_dni` varchar(8) NOT NULL,
  `clt_nombre` varchar(45) NOT NULL,
  `clt_apellido` varchar(45) NOT NULL,
  `clt_foto` varchar(200) NOT NULL,
  `clt_cip` varchar(45) NOT NULL,
  `clt_email` varchar(45) NOT NULL,
  `clt_casilla` varchar(45) NOT NULL,
  `clt_trabajo` varchar(60) NOT NULL,
  `clt_cargo` varchar(45) NOT NULL,
  `clt_calificacion_crediticia` varchar(45) NOT NULL,
  `clt_calificacion_personal` varchar(45) NOT NULL,
  `clt_aporte` float NOT NULL,
  `clt_fecharegistro` datetime NOT NULL,
  `clt_estado` tinyint(11) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`idcliente`, `id_subsede`, `clt_codigo`, `clt_dni`, `clt_nombre`, `clt_apellido`, `clt_foto`, `clt_cip`, `clt_email`, `clt_casilla`, `clt_trabajo`, `clt_cargo`, `clt_calificacion_crediticia`, `clt_calificacion_personal`, `clt_aporte`, `clt_fecharegistro`, `clt_estado`) VALUES
(17, 3, '3335', '76861618', 'Jean Paul', 'Rodriguez Farfan', 'FOTO_76861618', '00035', 'jeanpaulrd1@gmail.com', 'Prueba', 'Av. Simon Bolivar 374', 'Prueba', 'Bueno', 'Bueno', 500, '2018-07-22 00:00:00', 1),
(18, 4, '000121', '76861618', 'Jean Pierre', 'Rodriguez Farfan', 'FOTO_76861618', '900', 'jph.rodriguez@gmail.com', 'Prueba', 'Av. Simon Bolivar 374', 'Prueba', 'Prueba', 'Prueba', 5000, '2018-07-22 00:00:00', 1),
(19, 13, '3335', '72638272', 'Ivette', 'Araujo García', 'FOTO_72638272', '00142', 'icristina.2211@gmail.com', 'Prueba', 'Av. Simon Bolivar 374', 'Cargo de Prueba', 'Bueno', 'Bueno', 500, '2018-07-22 00:00:00', 1),
(20, 8, '000354', '76861618', 'Jean Paul', 'Rodriguez Farfan', 'FOTO_76861618', '0035', 'jeanpaulrd1@gmail.com', 'Casilla', 'Lima', 'Analista', 'Buena', 'Buena', 500, '2018-07-24 00:00:00', 0),
(21, 5, '00054', '10103880', 'Carlos', 'Rodriguez García', 'FOTO_10103880', '00412', 'chrodriguez@speedy.com.pe', 'Casilla Prueba', 'Av. Simon Bolivar 374', 'Prueba', 'Buena', 'Buena', 600, '2018-07-24 00:00:00', 1),
(22, 17, '00312', '74222221', 'Prueba', 'Prueba', 'FOTO_74222221', 'Prueba', 'Prueba@oryeba', 'Prueba', 'Prueba', 'Prueba', 'Prueba', 'Prueba', 600, '2018-07-24 00:00:00', 1),
(23, 6, '00142', '74155524', 'Luis', 'Ramirez Lopez', 'FOTO_74155524', '1551', 'lramirez@gmail.com', 'Prueba', 'Prueba', 'Prueba', 'Prueba', 'Prueba', 600, '2018-07-25 00:00:00', 1),
(24, 10, '00515', '74626626', 'Prueba', 'Prueba', 'FOTO_74626626', '42562', 'prueba@prueba', 'Prueba', 'Prueba', 'Prueba', 'Prueba', 'Prueba', 5000, '2018-07-25 00:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente_direccion`
--

CREATE TABLE `cliente_direccion` (
  `idcliente_direccion` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `drc_nombre` varchar(100) DEFAULT NULL,
  `id_provincia` int(11) DEFAULT NULL,
  `drc_relevancia` tinyint(4) DEFAULT NULL COMMENT '0. Fiscal, 1. Primaria, 2. Secundaria',
  `drc_observacion` varchar(255) DEFAULT NULL,
  `drc_estado` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente_telefono`
--

CREATE TABLE `cliente_telefono` (
  `idcliente_telefono` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `tlf_numero` varchar(9) DEFAULT NULL,
  `tlf_observacion` varchar(255) DEFAULT NULL,
  `id_tipo` varchar(20) DEFAULT NULL,
  `tlf_relevancia` tinyint(4) DEFAULT '1' COMMENT '0. Inactivo, 1.Principal, 2. Secundario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comision_vendedor`
--

CREATE TABLE `comision_vendedor` (
  `id_comision_vendedor` int(11) NOT NULL,
  `id_tipo_venta` int(11) NOT NULL,
  `id_vendedor` int(11) NOT NULL,
  `comision_efectiva` float NOT NULL,
  `comision_efectiva_estado` tinyint(4) NOT NULL COMMENT '1. Pagado, 0. Por pagar',
  `comision_retenida` float NOT NULL,
  `comision_retenida_estado` tinyint(4) NOT NULL COMMENT '1. Pagado, 0. Por pagar'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cronograma_pago`
--

CREATE TABLE `cronograma_pago` (
  `idcronograma_pago` int(11) NOT NULL,
  `cng_monto` float DEFAULT NULL,
  `cng_fechapago` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuenta`
--

CREATE TABLE `cuenta` (
  `id_cuenta` int(11) NOT NULL,
  `id_banco` int(11) DEFAULT NULL,
  `id_moneda` int(11) DEFAULT NULL,
  `cnt_numero` varchar(20) DEFAULT NULL,
  `cnt_cci` varchar(20) DEFAULT NULL,
  `cnt_observacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `id_departamento` int(11) NOT NULL,
  `dpt_nombre` varchar(45) DEFAULT NULL,
  `dpt_estado` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `departamento`
--

INSERT INTO `departamento` (`id_departamento`, `dpt_nombre`, `dpt_estado`) VALUES
(1, 'BAGUA GRANDE', 1),
(2, 'ÁNCASH', 1),
(3, 'APURÍMAC', 1),
(4, 'AREQUIPA', 1),
(5, 'AYACUCHO', 1),
(6, 'CAJAMARCA', 1),
(7, 'CUSCO', 1),
(8, 'HUANCAVELICA', 1),
(9, 'HUÁNUCO', 1),
(10, 'ICA', 1),
(11, 'JUNÍN', 1),
(12, 'LA LIBERTAD', 1),
(13, 'LAMBAYEQUE', 1),
(14, 'LIMA', 1),
(15, 'LORETO', 1),
(16, 'MADRE DE DIOS', 1),
(17, 'MOQUEGUA', 1),
(18, 'PASCO', 1),
(19, 'PIURA', 1),
(20, 'PUNO', 1),
(21, 'SAN MARTÍN', 1),
(22, 'TACNA', 1),
(23, 'TUMBES', 1),
(24, 'UCAYALI', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `distrito`
--

CREATE TABLE `distrito` (
  `id_distrito` int(11) NOT NULL,
  `id_provincia` int(11) NOT NULL,
  `dst_nombre` varchar(45) NOT NULL,
  `dst_estado` tinyint(11) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `distrito`
--

INSERT INTO `distrito` (`id_distrito`, `id_provincia`, `dst_nombre`, `dst_estado`) VALUES
(1, 1, 'BAGUA GRANDE', 1),
(2, 2, 'CHACHAPOYAS', 1),
(3, 3, 'CHIMBOTE', 1),
(4, 3, 'COISHCO', 1),
(5, 3, 'NUEVO CHIMBOTE', 1),
(6, 4, 'HUARAZ', 1),
(7, 4, 'INDEPENDENCIA', 1),
(8, 5, 'CASMA', 1),
(9, 6, 'ABANCAY', 1),
(10, 6, 'TAMBURCO', 1),
(11, 7, 'ANDAHUAYLAS', 1),
(12, 7, 'SAN JERÓNIMO', 1),
(13, 7, 'TALAVERA', 1),
(14, 8, 'AREQUIPA', 1),
(15, 8, 'ALTO SELVA ALEGRE', 1),
(16, 8, 'CAYMA', 1),
(17, 8, 'CERRO COLORADO', 1),
(18, 8, 'JACOBO HUNTER', 1),
(19, 8, 'MARIANO MELGAR', 1),
(20, 8, 'MIRAFLORES', 1),
(21, 8, 'PAUCARPATA', 1),
(22, 8, 'SABANDÍA', 1),
(23, 8, 'SACHACA', 1),
(24, 8, 'SOCABAYA', 1),
(25, 8, 'TIABAYA', 1),
(26, 8, 'YANAHUARA', 1),
(27, 8, 'JOSÉ LUIS BUSTAMANTE Y RIVERO', 1),
(28, 9, 'CAMANÁ', 1),
(29, 9, 'JOSE MARÍA QUIMPER', 1),
(30, 9, 'SAMUEL PASTOR', 1),
(31, 10, 'MOLLENDO', 1),
(32, 11, 'AYACUCHO', 1),
(33, 11, 'CARMEN ALTO', 1),
(34, 11, 'SAN JUAN BAUTISTA', 1),
(35, 11, 'JESUS NAZARENO', 1),
(36, 12, 'HUANTA', 1),
(37, 13, 'CAJAMARCA', 1),
(38, 13, 'LOS BAÑOS DEL INCA', 1),
(39, 14, 'JAÉN', 1),
(40, 15, 'CUSCO', 1),
(41, 15, 'SAN JERÓNIMO', 1),
(42, 15, 'SAN SEBASTIÁN', 1),
(43, 15, 'SANTIAGO', 1),
(44, 15, 'WANCHAQ', 1),
(45, 16, 'SICUANI', 1),
(46, 17, 'SANTA ANA', 1),
(47, 18, 'ESPINAR', 1),
(48, 19, 'HUANCAVELICA', 1),
(49, 19, 'ASCENCIÓN', 1),
(50, 20, 'HUÁNUCO', 1),
(51, 20, 'AMARILIS', 1),
(52, 20, 'PILLCO MARCA', 1),
(53, 21, 'RUPA-RUPA', 1),
(54, 22, 'ICA', 1),
(55, 22, 'LA TINGUINA', 1),
(56, 22, 'PARCONA', 1),
(57, 22, 'SUBTANJALLA', 1),
(58, 23, 'CHINCHA ALTA', 1),
(59, 23, 'GROCIO PRADO', 1),
(60, 23, 'PUEBLO NUEVO', 1),
(61, 23, 'SUNAMPE', 1),
(62, 24, 'PISCO', 1),
(63, 24, 'SAN ANDRÉS', 1),
(64, 24, 'SAN CLEMENTE', 1),
(65, 24, 'TÚPAC AMARU INCA', 1),
(66, 25, 'NAZCA', 1),
(67, 25, 'VISTA ALEGRE', 1),
(68, 26, 'HUANCAYO', 1),
(69, 26, 'CHILCA', 1),
(70, 26, 'EL TAMBO', 1),
(71, 27, 'TARMA', 1),
(72, 28, 'LA OROYA', 1),
(73, 28, 'SANTA ROSA DE SACCO', 1),
(74, 29, 'JAUJA', 1),
(75, 30, 'TRUJILLO', 1),
(76, 30, 'EL PORVENIR', 1),
(77, 30, 'FLORENCIA DE MORA', 1),
(78, 30, 'LA ESPERANZA', 1),
(79, 30, 'VÍCTOR LARCO HERRERA', 1),
(80, 31, 'CHEPÉN', 1),
(81, 32, 'GUADALUPE', 1),
(82, 33, 'CASA GRANDE', 1),
(83, 34, 'PACASMAYO', 1),
(84, 35, 'HUAMACHUCO', 1),
(85, 36, 'LAREDO', 1),
(86, 37, 'MOCHE', 1),
(87, 38, 'CHICLAYO', 1),
(88, 38, 'JOSE LEONARDO ORTIZ', 1),
(89, 38, 'LA VICTORIA', 1),
(90, 38, 'PIMENTEL', 1),
(91, 39, 'LAMBAYEQUE', 1),
(92, 40, 'FERREÑAFE', 1),
(93, 40, 'PUEBLO NUEVO', 1),
(94, 41, 'TUMAN', 1),
(95, 42, 'MONSEFU', 1),
(96, 43, 'LIMA', 1),
(97, 43, 'ANCÓN', 1),
(98, 43, 'ATE', 1),
(99, 43, 'BARRANCO', 1),
(100, 43, 'BRENA', 1),
(101, 43, 'CARABAYLLO', 1),
(102, 43, 'CHACLACAYO', 1),
(103, 43, 'CHORRILLOS', 1),
(104, 43, 'CIENEGUILLA', 1),
(105, 43, 'COMAS', 1),
(106, 43, 'EL AGUSTINO', 1),
(107, 43, 'INDEPENDENCIA', 1),
(108, 43, 'JESÚS MARÍA', 1),
(109, 43, 'LA MOLINA', 1),
(110, 43, 'LA VICTORIA', 1),
(111, 43, 'LINCE', 1),
(112, 43, 'LOS OLIVOS', 1),
(113, 43, 'LURIGANCHO', 1),
(114, 43, 'LURIN', 1),
(115, 43, 'MAGDALENA DEL MAR', 1),
(116, 43, 'MAGDALENA VIEJA', 1),
(117, 43, 'MIRAFLORES', 1),
(118, 43, 'PACHACAMAC', 1),
(119, 43, 'PUCUSANA', 1),
(120, 43, 'PUENTE PIEDRA', 1),
(121, 43, 'PUNTA HERMOSA', 1),
(122, 43, 'PUNTA NEGRA', 1),
(123, 43, 'RÍMAC', 1),
(124, 43, 'SAN BARTOLO', 1),
(125, 43, 'SAN BORJA', 1),
(126, 43, 'SAN ISIDRO', 1),
(127, 43, 'SAN JUAN DE LURIGANCHO', 1),
(128, 43, 'SAN JUAN DE MIRAFLORES', 1),
(129, 43, 'SAN LUIS', 1),
(130, 43, 'SAN MARTÍN DE PORRES', 1),
(131, 43, 'SAN MIGUEL', 1),
(132, 43, 'SANTA ANITA', 1),
(133, 43, 'SANTA MARÍA DEL MAR', 1),
(134, 43, 'SANTA ROSA', 1),
(135, 43, 'SANTIAGO DE SURCO', 1),
(136, 43, 'SURQUILLO', 1),
(137, 43, 'VILLA EL SALVADOR', 1),
(138, 43, 'SURQUILLO', 1),
(139, 43, 'VILLA EL SALVADOR', 1),
(140, 43, 'VILLA MARÍA DEL TRIUNFO', 1),
(141, 43, 'CALLAO', 1),
(142, 43, 'BELLAVISTA', 1),
(143, 43, 'CARMEN DE LA LEGUA REYNOSO', 1),
(144, 43, 'LA PERLA', 1),
(145, 43, 'LA PUNTA', 1),
(146, 43, 'VENTANILLA', 1),
(147, 44, 'HUACHO', 1),
(148, 44, 'CALETA DE CARQUÍN', 1),
(149, 44, 'HUALMAY', 1),
(150, 45, 'HUARAL', 1),
(151, 46, 'SAN VICENTE DE CAÑETE', 1),
(152, 46, 'IMPERIAL', 1),
(153, 47, 'BARRANCA', 1),
(154, 48, 'HUAURA', 1),
(155, 48, 'SANTA MARÍA', 1),
(156, 49, 'PARAMONGA', 1),
(157, 49, 'PATIVILCA', 1),
(158, 50, 'CHANCAY', 1),
(159, 51, 'MALA', 1),
(160, 51, 'NUEVO IMPERIAL', 1),
(161, 52, 'SUPE', 1),
(162, 52, 'SUPE PUERTO', 1),
(163, 53, 'IQUITOS', 1),
(164, 53, 'PUNCHANA', 1),
(165, 53, 'BELÉN', 1),
(166, 53, 'SAN JUAN BAUTISTA', 1),
(167, 54, 'YURIMAGUAS', 1),
(168, 55, 'TAMBOPATA', 1),
(169, 56, 'ILO', 1),
(170, 57, 'MOQUEGUA', 1),
(171, 57, 'SAMEGUA', 1),
(172, 58, 'CHAUPIMARCA', 1),
(173, 58, 'SIMON BOLIVAR', 1),
(174, 58, 'YANACANCHA', 1),
(175, 59, 'PIURA', 1),
(176, 59, 'CASTILLA', 1),
(177, 60, 'SULLANA', 1),
(178, 60, 'BELLAVISTA', 1),
(179, 61, 'PARINAS', 1),
(180, 62, 'CATACAOS', 1),
(181, 63, 'PAITA', 1),
(182, 64, 'CHULUCANAS', 1),
(183, 65, 'SECHURA', 1),
(184, 66, 'JULIACA', 1),
(185, 67, 'PUNO', 1),
(186, 68, 'AYAVIRI', 1),
(187, 69, 'ILAVE', 1),
(188, 70, 'TARAPOTO', 1),
(189, 70, 'LA BANDA DE SHILCAYO', 1),
(190, 70, 'MORALES', 1),
(191, 71, 'MOYOBAMBA', 1),
(192, 72, 'RIOJA', 1),
(193, 73, 'TACNA', 1),
(194, 73, 'ALTO DE LA ALIANZA', 1),
(195, 73, 'CIUDAD NUEVA', 1),
(196, 73, 'POCOLLAY', 1),
(197, 73, 'CORONEL GREGORIO ALBARRACIN LANCHIPA', 1),
(198, 74, 'TUMBES', 1),
(199, 75, 'CALLARIA', 1),
(200, 75, 'YARINACOCHA', 1),
(205, 5, 'HOLA!', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `institucion`
--

CREATE TABLE `institucion` (
  `id_institucion` int(11) NOT NULL,
  `inst_nombre` varchar(60) NOT NULL,
  `isnt_abreviatura` varchar(30) NOT NULL,
  `isnt_representante_legal` varchar(40) NOT NULL,
  `id_distrito` int(11) NOT NULL,
  `inst_direccion` varchar(60) NOT NULL,
  `inst_telefono` varchar(20) NOT NULL,
  `inst_codigo_cooperativa` varchar(25) NOT NULL,
  `inst_estado` int(11) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `institucion`
--

INSERT INTO `institucion` (`id_institucion`, `inst_nombre`, `isnt_abreviatura`, `isnt_representante_legal`, `id_distrito`, `inst_direccion`, `inst_telefono`, `inst_codigo_cooperativa`, `inst_estado`) VALUES
(1, 'Institucion de Prueba', '0', '0', 0, '0', '', '', 1),
(2, 'PNP', '0', '0', 0, '0', '', '', 1),
(3, 'MINISTERIO DE SALUD', 'MINSA', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(4, 'MINISTERIO DEL INTERIOR', 'MINITER', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(5, 'MINISTERIO DE DUCACION', 'MINEDU', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(6, 'PODER JUDICIAL DEL PERU', 'PODER JUDICIAL', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `llegada_cabecera`
--

CREATE TABLE `llegada_cabecera` (
  `id_llegada_cabecera` int(11) NOT NULL,
  `id_salida_cabecera` int(11) NOT NULL,
  `lc_fecha_retorno` datetime NOT NULL,
  `lc_venta_total` float NOT NULL,
  `lc_observacion` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `llegada_detalle_comision`
--

CREATE TABLE `llegada_detalle_comision` (
  `id_llegada_detalle_comision` int(11) NOT NULL,
  `id_llegada_cabecera` int(11) NOT NULL,
  `id_vendedor` int(11) NOT NULL,
  `ldc_comision_efectiva` float NOT NULL,
  `ldc_comision_retenida` float NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `llegada_detalle_producto`
--

CREATE TABLE `llegada_detalle_producto` (
  `id_llegada_detalle_productos` int(11) NOT NULL,
  `id_llegada_cabecera` int(11) NOT NULL,
  `id_producto_serie` int(11) NOT NULL,
  `ldp_cantidad` int(11) NOT NULL,
  `ldp_estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `llegada_detalle_talonario`
--

CREATE TABLE `llegada_detalle_talonario` (
  `id_llegada_detalle_talonario` int(11) NOT NULL,
  `id_detalle_cabecera` int(11) NOT NULL,
  `ldt_serie` int(11) NOT NULL,
  `ldt_numero_desde` int(11) NOT NULL,
  `ldt_numero_hasta` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_marca` int(11) NOT NULL,
  `id_tipo_producto` int(11) NOT NULL,
  `mrc_nombre` varchar(45) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id_marca`, `id_tipo_producto`, `mrc_nombre`) VALUES
(1, 1, 'MOTOROLA'),
(2, 2, 'ASUS'),
(3, 1, 'SAMSUNG'),
(4, 1, 'HUAWEI');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelo`
--

CREATE TABLE `modelo` (
  `id_modelo` int(11) NOT NULL,
  `id_marca` int(11) NOT NULL,
  `mdl_nombre` varchar(45) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `modelo`
--

INSERT INTO `modelo` (`id_modelo`, `id_marca`, `mdl_nombre`) VALUES
(1, 1, 'MOTO X'),
(2, 1, 'MOTO G'),
(3, 1, 'MOTO E'),
(4, 2, 'XT147'),
(5, 3, 'GALAXY J7 PRIME'),
(6, 3, 'GALAXY S9'),
(7, 3, 'GALAXY S9 PLUS'),
(8, 4, 'P20 PRO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulo`
--

CREATE TABLE `modulo` (
  `idmodulo` int(11) NOT NULL,
  `mdl_nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `modulo`
--

INSERT INTO `modulo` (`idmodulo`, `mdl_nombre`) VALUES
(1, 'Ventas'),
(2, 'Logística'),
(3, 'Créditos'),
(4, 'Cobranzas'),
(5, 'Opciones del Sistema');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pais`
--

CREATE TABLE `pais` (
  `idpais` int(11) NOT NULL,
  `pss_nombre` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil`
--

CREATE TABLE `perfil` (
  `idperfil` int(11) NOT NULL,
  `prf_nombre` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `perfil`
--

INSERT INTO `perfil` (`idperfil`, `prf_nombre`) VALUES
(1, 'Administrador'),
(2, 'Secretaria'),
(3, 'Vendedor'),
(4, 'Abogado'),
(5, 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `idpermiso` int(11) NOT NULL,
  `id_perfil` int(11) NOT NULL,
  `id_accionXusuario` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `idproducto` int(11) NOT NULL,
  `id_modelo` int(11) DEFAULT NULL,
  `prd_descripcion` varchar(255) DEFAULT NULL,
  `prd_precio` float DEFAULT NULL,
  `prd_estado` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`idproducto`, `id_modelo`, `prd_descripcion`, `prd_precio`, `prd_estado`) VALUES
(5, 5, 'SAMSUNG GALAXY J7 PRIME COLOR ROSADO 16GB', 1600, 1),
(6, 6, 'SAMSUNG GALAXY S9 COLOR NEGRO 64GB RAM', 3500, 1),
(7, 6, 'SAMSUNG GALAXY S9 COLOR MORADO 128GB RAM', 3500, 1),
(8, 6, 'SAMSUNG GALAXY S9 COLOR PLATEADO 64GB RAM', 3500, 1),
(9, 7, 'SAMSUNG GALAXY S9 PLUS COLOR NEGRO 64GB RAM', 3900, 1),
(10, 8, 'HUAWEI P20 PRO COLOR NEGRO 128 GB', 3800, 1),
(53, 4, 'LAPTOP', 4000, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_serie`
--

CREATE TABLE `producto_serie` (
  `id_producto_serie` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `ps_serie` varchar(30) NOT NULL,
  `ps_estado` tinyint(4) NOT NULL COMMENT '1. Disponible, 0.No disponible'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `idproveedor` int(11) NOT NULL,
  `prv_tipo_documento` tinyint(4) NOT NULL COMMENT '1. DNI, 2.RUC',
  `prv_documento` varchar(11) NOT NULL,
  `prv_nombre` varchar(60) NOT NULL,
  `prv_representante_legal` varchar(40) NOT NULL,
  `prv_observacion` varchar(255) DEFAULT NULL,
  `prv_estado` tinyint(2) DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`idproveedor`, `prv_tipo_documento`, `prv_documento`, `prv_nombre`, `prv_representante_legal`, `prv_observacion`, `prv_estado`) VALUES
(1, 1, '73330106', 'JEAN PIERRE RODRIGUEZ FARFAN', '', 'DATOS DE PRUEBA', 1),
(2, 2, '20300263578', 'SAMSUNG ELECTRONICS PERU S.A.C', '', 'DATOS DE PRUEBA', 1),
(3, 2, '20507646728', 'HUAWEI DEL PERU SAC', '', 'DATOS DE PRUEBA', 1),
(4, 2, '20548483078', 'OLI PERU', '', 'DATOS DE PRUEBA', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor_contacto`
--

CREATE TABLE `proveedor_contacto` (
  `idproveedor_contacto` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `cnt_nombre` varchar(45) NOT NULL,
  `cnt_numero` varchar(9) NOT NULL,
  `cnt_email` varchar(40) NOT NULL,
  `cnt_observacion` int(255) NOT NULL,
  `cnt_relevancia` tinyint(1) NOT NULL COMMENT '1.Principal, 2. Secundario',
  `cnt_estado` int(11) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor_direccion`
--

CREATE TABLE `proveedor_direccion` (
  `id_proveedor_direccion` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `drc_nombre` varchar(80) NOT NULL,
  `id_provincia` int(11) NOT NULL,
  `drc_relevancia` tinyint(4) NOT NULL COMMENT '0. Fiscal, 1. Primaria, 2. Secundaria',
  `drc_observacion` varchar(255) CHARACTER SET utf16 NOT NULL,
  `drc_estado` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0. Inactivo'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincia`
--

CREATE TABLE `provincia` (
  `id_provincia` int(11) NOT NULL,
  `id_departamento` int(11) NOT NULL,
  `prv_nombre` varchar(45) NOT NULL,
  `prv_estado` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `provincia`
--

INSERT INTO `provincia` (`id_provincia`, `id_departamento`, `prv_nombre`, `prv_estado`) VALUES
(1, 1, 'BAGUA GRANDE', 1),
(2, 1, 'CHACHAPOYAS', 1),
(3, 2, 'CHIMBOTE', 1),
(4, 2, 'HUARAZ', 1),
(5, 2, 'CASMA', 1),
(6, 3, 'ABANCAY', 1),
(7, 3, 'ANDAHUAYLAS', 1),
(8, 4, 'AREQUIPA', 1),
(9, 4, 'CAMANÁ', 1),
(10, 4, 'ISLAY', 1),
(11, 5, 'AYACUCHO', 1),
(12, 5, 'HUANTA', 1),
(13, 6, 'CAJAMARCA', 1),
(14, 6, 'JAÉN', 1),
(15, 7, 'CUSCO', 1),
(16, 7, 'CANCHIS', 1),
(17, 7, 'LA CONVENCIÓN', 1),
(18, 7, 'YAURI (ESPINAR)', 1),
(19, 8, 'HUANCAVELICA', 1),
(20, 9, 'HUÁNUCO', 1),
(21, 9, 'LEONCIO PRADO', 1),
(22, 10, 'ICA', 1),
(23, 10, 'CHINCHA ALTA', 1),
(24, 10, 'PISCO', 1),
(25, 10, 'NAZCA', 1),
(26, 11, 'HUANCAYO', 1),
(27, 11, 'TARMA', 1),
(28, 11, 'LA OROYA', 1),
(29, 11, 'JAUJA', 1),
(30, 12, 'TRUJILLO', 1),
(31, 12, 'CHEPÉN', 1),
(32, 12, 'GUADALUPE', 1),
(33, 12, 'CASA GRANDE', 1),
(34, 12, 'PACASMAYO', 1),
(35, 12, 'HUAMACHUCO', 1),
(36, 12, 'LAREDO', 1),
(37, 12, 'MOCHE', 1),
(38, 13, 'CHICLAYO', 1),
(39, 13, 'LAMBAYEQUE', 1),
(40, 13, 'FERREÑAFE', 1),
(41, 13, 'TUMAN', 1),
(42, 13, 'MONSEFU', 1),
(43, 14, 'LIMA METROPOLITANA', 1),
(44, 14, 'HUACHO', 1),
(45, 14, 'HUARAL', 1),
(46, 14, 'SAN VICENTE DE CAÑETE', 1),
(47, 14, 'BARRANCA', 1),
(48, 14, 'HUAURA', 1),
(49, 14, 'PARAMONGA', 1),
(50, 14, 'CHANCAY', 1),
(51, 14, 'MALA', 1),
(52, 14, 'SUPE', 1),
(53, 15, 'IQUITOS', 1),
(54, 15, 'YURIMAGUAS', 1),
(55, 16, 'PUERTO MALDONADO', 1),
(56, 17, 'ILO', 1),
(57, 17, 'MOQUEGUA', 1),
(58, 18, 'CERRO DE PASCO', 1),
(59, 19, 'PIURA', 1),
(60, 19, 'SULLANA', 1),
(61, 19, 'TALARA', 1),
(62, 19, 'CATACAOS', 1),
(63, 19, 'PAITA', 1),
(64, 19, 'CHULUCANAS', 1),
(65, 19, 'SECHURA', 1),
(66, 20, 'JULIACA', 1),
(67, 20, 'PUNO', 1),
(68, 20, 'AYAVIRI', 1),
(69, 20, 'ILAVE', 1),
(70, 21, 'TARAPOTO', 1),
(71, 21, 'MOYOBAMBA', 1),
(72, 21, 'RIOJA', 1),
(73, 22, 'TACNA', 1),
(74, 23, 'TUMBES', 1),
(75, 24, 'PUCALLPA', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salida_cabecera`
--

CREATE TABLE `salida_cabecera` (
  `idsalida_vendedor` int(11) NOT NULL,
  `sc_codigo` int(11) DEFAULT NULL,
  `id_sucursal` int(11) DEFAULT NULL,
  `sc_fecha` datetime DEFAULT NULL,
  `sc_contrato_inicio` varchar(8) DEFAULT NULL,
  `sc_contrato_fin` varchar(8) DEFAULT NULL,
  `sc_destino` varchar(45) DEFAULT NULL,
  `sc_tipo_movilidad` tinyint(4) NOT NULL COMMENT '1. Propia, 0. Terceros',
  `sc_estadoactual` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0. Pendiente, 1. Cerrada, 2.Anulada',
  `sc_estado` tinyint(11) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salida_detalle_gasto`
--

CREATE TABLE `salida_detalle_gasto` (
  `id_salida_detalle_gasto` int(11) NOT NULL,
  `id_salida_cabecera` int(11) NOT NULL,
  `sdg_fecha` datetime NOT NULL,
  `sdg_monto` int(11) NOT NULL,
  `id_vendedor` int(11) NOT NULL COMMENT 'Vendedor que recibió el dinero'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salida_detalle_movilidad`
--

CREATE TABLE `salida_detalle_movilidad` (
  `id_salida_detalle_movilidad` int(11) NOT NULL,
  `id_salida_cabecera` int(11) NOT NULL,
  `sdm_vehiculo_placa` varchar(7) COLLATE utf8_bin NOT NULL,
  `sdm_chofer_dni` varchar(8) COLLATE utf8_bin NOT NULL,
  `sdm_chofer_nombre` varchar(45) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salida_detalle_producto`
--

CREATE TABLE `salida_detalle_producto` (
  `idvendedor_salida_producto` int(11) NOT NULL,
  `id_salida_cabecera` int(11) NOT NULL,
  `id_producto_serie` int(11) NOT NULL,
  `sdp_precio_minimo` float NOT NULL,
  `sdp_cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salida_detalle_talonario`
--

CREATE TABLE `salida_detalle_talonario` (
  `id_salida_detalle_talonario` int(11) NOT NULL,
  `id_salida_cabecera` int(11) NOT NULL,
  `sdt_serie` varchar(8) NOT NULL,
  `sdt_numero_desde` varchar(10) NOT NULL,
  `sdt_numero_hasta` varchar(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salida_detalle_vendedor`
--

CREATE TABLE `salida_detalle_vendedor` (
  `idsalida_vendedor` int(11) NOT NULL,
  `id_salida_cabecera` int(10) DEFAULT NULL,
  `id_vendedor` int(11) DEFAULT NULL,
  `sdv_comision_efectiva` float DEFAULT NULL,
  `sdv_comision_retenida` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sede`
--

CREATE TABLE `sede` (
  `id_sede` int(11) NOT NULL,
  `id_institucion` int(11) NOT NULL,
  `sd_nombre` varchar(60) NOT NULL,
  `sd_abreviatura` varchar(40) NOT NULL,
  `sd_representante_legal` varchar(40) NOT NULL,
  `id_distrito` int(11) NOT NULL,
  `sd_direccion` varchar(60) NOT NULL,
  `sd_telefono` varchar(20) NOT NULL,
  `sd_codigo_cooperativa` varchar(25) NOT NULL,
  `sd_estado` tinyint(4) NOT NULL COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `sede`
--

INSERT INTO `sede` (`id_sede`, `id_institucion`, `sd_nombre`, `sd_abreviatura`, `sd_representante_legal`, `id_distrito`, `sd_direccion`, `sd_telefono`, `sd_codigo_cooperativa`, `sd_estado`) VALUES
(1, 3, 'GOBIERNO REGIONAL DE DEPARTAMENTO DE PIURA', 'PIURA', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(2, 3, 'GOBIERNO REGIONAL DE DEPARTAMENTO DE AMAZONAS', 'AMAZONAS', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(3, 4, 'POLICIA NACIONAL DEL PERU', 'PNP', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(4, 4, 'EJERCITO DEL PERU', 'EJERCITO', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(5, 4, 'CAJA PENSION MILITAR', 'CAJA PENSION MILITAR', 'JEAN PIERRE RODRIGUEZ FARFAN', 97, 'CENTRO CIVICO S/N', '4421211', 'ALV008', 1),
(6, 5, 'DIRECCION REGIONAL DE EDUCACION JUNIN', 'JUNIN', 'JEAN PIERRE RODRIGUEZ FARFAN', 98, 'CENTRO CIVICO S/N', '4421212', 'ALV009', 1),
(7, 5, 'DIRECCION REGIONAL DE LIMA METROPOLITANA', 'LIMA METROPOLITANA', 'JEAN PIERRE RODRIGUEZ FARFAN', 99, 'CENTRO CIVICO S/N', '4421213', 'ALV010', 1),
(8, 5, 'DIRECCION REGIONAL DE EDUCACION LIMA PROVINCIAS', 'LIMA PROVINCIAS', 'JEAN PIERRE RODRIGUEZ FARFAN', 100, 'CENTRO CIVICO S/N', '4421214', 'ALV011', 1),
(9, 6, 'CORTE SUPERIOR DE JUSTICIA DE LIMA ESTE', 'CORTE DE JUSTICIA ATE', 'JEAN PIERRE RODRIGUEZ FARFAN', 101, 'CENTRO CIVICO S/N', '4421215', 'ALV012', 1);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `stock_vista`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `stock_vista` (
`almacen` varchar(45)
,`tipo` varchar(45)
,`marca` varchar(45)
,`modelo` varchar(45)
,`descripcion` varchar(255)
,`unidad_medida` varchar(45)
,`cantidad` double
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subsede`
--

CREATE TABLE `subsede` (
  `id_subsede` int(11) NOT NULL,
  `id_sede` int(11) NOT NULL,
  `ssd_nombre` varchar(60) NOT NULL,
  `ssd_abreviatura` varchar(40) NOT NULL,
  `ssd_representante_legal` varchar(40) NOT NULL,
  `id_distrito` int(11) NOT NULL,
  `ssd_direccion` varchar(60) NOT NULL,
  `ssd_telefono` varchar(20) NOT NULL,
  `ssd_codigo_cooperativa` varchar(25) NOT NULL,
  `ssd_estado` tinyint(4) NOT NULL COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `subsede`
--

INSERT INTO `subsede` (`id_subsede`, `id_sede`, `ssd_nombre`, `ssd_abreviatura`, `ssd_representante_legal`, `id_distrito`, `ssd_direccion`, `ssd_telefono`, `ssd_codigo_cooperativa`, `ssd_estado`) VALUES
(1, 1, 'SALUD PIURA', 'SALUD PIURA', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(2, 1, 'SALUD MORROPON CHULUCANAS', 'SALUD MORROPON CHULUCANAS', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(3, 1, 'HOSPITAL DE APOYO I SANTA ROSA', 'HOSPITAL DE APOYO I SANTA ROSA', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(4, 2, 'SALUD UTCUBAMBA', 'SALUD UTCUBAMBA', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(5, 2, 'SALUD BAGUA', 'SALUD BAGUA', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(6, 2, 'HOSPITAL DE APOYO CHACHAPOYAS', 'HOSPITAL DE APOYO CHACHAPOYAS', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(7, 3, 'DIRECCION DE RECURSOS HUMANOS DE LA PNP', 'DIRECCION DE RECURSOS HUMANOS DE LA PNP', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(8, 4, 'OFICINA GENERAL DE ECONOMIA DEL EJERCITO OGECOE', 'OFICINA GENERAL DE ECONOMIA DEL EJERCITO', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(9, 5, 'PNP RETIRADO', 'PNP RETIRADO', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(10, 5, 'EJERCITO RETIRADO', 'EJERCITO RETIRADO', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(11, 6, 'UGEL SATIPO', 'UGEL SATIPO', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(12, 6, 'UGEL TARMA', 'UGEL TARMA', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(13, 7, 'UGEL 01', 'UGEL 01', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(14, 7, 'UGEL 06', 'UGEL 06', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(15, 8, 'UGEL 08', 'UGEL 08', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(16, 8, 'UGEL 16', 'UGEL 16', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1),
(17, 9, 'JUZGADO DE PAZ LETRADO VITARTE', 'JUZGADO DE PAZ LETRADO VITARTE', 'JEAN PIERRE RODRIGUEZ FARFAN', 96, 'CENTRO CIVICO S/N', '4421210', 'ALV007', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursal`
--

CREATE TABLE `sucursal` (
  `idsucursal` int(11) NOT NULL,
  `scs_nombre` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `talonario`
--

CREATE TABLE `talonario` (
  `idtalonario` int(11) NOT NULL,
  `tln_serie_inicio` varchar(8) DEFAULT NULL,
  `tln_serie_fin` varchar(8) DEFAULT NULL,
  `tln_numero_inicio` varchar(8) DEFAULT NULL,
  `tln_numero_fin` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_calificacion_crediticia`
--

CREATE TABLE `tipo_calificacion_crediticia` (
  `id_tipo_calificacion_crediticia` int(11) NOT NULL,
  `tcc_nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_calificacion_personal`
--

CREATE TABLE `tipo_calificacion_personal` (
  `idtipo_calificacion_personal` int(11) NOT NULL,
  `tcp_nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_documento`
--

CREATE TABLE `tipo_documento` (
  `idtipo_documento` int(11) NOT NULL,
  `tdcm_nombre` varchar(45) DEFAULT NULL COMMENT 'Boleta o factura'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_moneda`
--

CREATE TABLE `tipo_moneda` (
  `idtipo_moneda` int(11) NOT NULL,
  `tmnd_nombre` varchar(45) DEFAULT NULL,
  `tmnd_simbolo` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_pago`
--

CREATE TABLE `tipo_pago` (
  `idtipo_pago` int(11) NOT NULL,
  `tpag_nombre` varchar(45) NOT NULL COMMENT 'PLANILLADIRECTOJUDICIALCONTADOCANJEANULADO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_producto`
--

CREATE TABLE `tipo_producto` (
  `id_tipo_producto` int(11) NOT NULL,
  `tprd_nombre` varchar(45) NOT NULL,
  `id_unidad_medida` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tipo_producto`
--

INSERT INTO `tipo_producto` (`id_tipo_producto`, `tprd_nombre`, `id_unidad_medida`) VALUES
(1, 'CELULAR', 1),
(2, 'LAPTOP', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_transaccion`
--

CREATE TABLE `tipo_transaccion` (
  `idtipo_transaccion` int(11) NOT NULL,
  `ttsc_tipo` tinyint(4) NOT NULL COMMENT '1. Ingreso 0. Salida',
  `ttsc_nombre` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tipo_transaccion`
--

INSERT INTO `tipo_transaccion` (`idtipo_transaccion`, `ttsc_tipo`, `ttsc_nombre`) VALUES
(1, 1, 'Compra de mercadería'),
(2, 1, 'Devolución de cliente'),
(3, 0, 'Venta a cliente'),
(4, 0, 'Salida de vendedor'),
(5, 0, 'Transferencia a sucursal'),
(6, 1, 'Devolucion de vendedor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transaccion_cabecera`
--

CREATE TABLE `transaccion_cabecera` (
  `idtransaccion_cabecera` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `id_tipo_transaccion` int(11) DEFAULT NULL,
  `tsccab_referencia` int(11) NOT NULL COMMENT '1. Proveedor, 2. Cliente, 3. Salida de venta, 4. Sucursal, 5. Vendedor',
  `id_proveedor` int(11) DEFAULT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_salida_venta` int(11) DEFAULT NULL,
  `id_sucursal` int(11) DEFAULT NULL,
  `id_vendedor` int(11) DEFAULT NULL,
  `tsccab_fecha` datetime DEFAULT NULL,
  `tsccab_documento_referencia` varchar(45) DEFAULT NULL COMMENT 'Factura',
  `tsccab_estado` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `transaccion_cabecera`
--

INSERT INTO `transaccion_cabecera` (`idtransaccion_cabecera`, `id_almacen`, `id_tipo_transaccion`, `tsccab_referencia`, `id_proveedor`, `id_cliente`, `id_salida_venta`, `id_sucursal`, `id_vendedor`, `tsccab_fecha`, `tsccab_documento_referencia`, `tsccab_estado`) VALUES
(1, 1, 1, 1, 2, NULL, NULL, NULL, NULL, '2018-06-11 00:00:00', 'FE003-00147', 1),
(2, 1, 1, 1, 4, NULL, NULL, NULL, NULL, '2018-06-11 00:00:00', 'F654-000041', 1),
(3, 1, 1, 1, 2, NULL, NULL, NULL, NULL, '2018-06-12 00:00:00', 'FE003-00148', 1),
(4, 1, 1, 1, 3, NULL, NULL, NULL, NULL, '2018-06-12 00:00:00', 'XT78-87517', 1),
(5, 2, 1, 1, 3, NULL, NULL, NULL, NULL, '2018-06-12 00:00:00', 'XT78-87517', 1),
(6, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(7, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(8, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(9, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(10, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(11, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(12, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(13, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(14, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(15, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(16, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(17, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(18, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(19, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(20, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(21, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(22, 1, 1, 1, 1, NULL, NULL, NULL, NULL, '2018-07-30 00:00:00', 'PRUEBA', 1),
(23, 1, 1, 1, 1, NULL, NULL, NULL, NULL, '2018-07-30 00:00:00', 'PRUEBA', 1),
(24, 1, 1, 1, 1, NULL, NULL, NULL, NULL, '2018-07-30 00:00:00', 'PRUEBA', 1),
(25, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(26, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(27, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(28, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(29, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(30, 1, 1, 1, 1, NULL, NULL, NULL, NULL, '2018-07-30 00:00:00', 'PRUEBA', 1),
(31, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(32, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(33, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(34, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(35, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(36, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(37, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(38, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(39, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(40, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(41, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(42, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(43, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1),
(44, 2, 2, 2, NULL, 1, NULL, NULL, NULL, '2018-08-00 00:00:00', 'Funciona', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transaccion_detalle`
--

CREATE TABLE `transaccion_detalle` (
  `idtransaccion_detalle` int(11) NOT NULL,
  `id_movimiento_cabecera` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `tscdet_serie` varchar(20) NOT NULL,
  `tscdet_cantidad` float DEFAULT NULL,
  `tscdet_precio` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `transaccion_detalle`
--

INSERT INTO `transaccion_detalle` (`idtransaccion_detalle`, `id_movimiento_cabecera`, `id_producto`, `tscdet_serie`, `tscdet_cantidad`, `tscdet_precio`) VALUES
(1, 1, 5, '355456498464519', 1, 1600),
(2, 1, 8, '355456498464514', 1, 3500),
(3, 2, 6, '355456498464512', 1, 3400),
(4, 2, 7, '355456498464513', 1, 3400),
(5, 3, 6, '355456498464515', 1, 3500),
(6, 3, 6, '355456498464516', 1, 3500),
(7, 3, 6, '355456498464517', 1, 3500),
(8, 3, 9, '355456498464518', 1, 3800),
(9, 4, 10, '355456498464519', 1, 3800),
(10, 5, 10, '355456498464519', 1, 3800);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_medida`
--

CREATE TABLE `unidad_medida` (
  `idunidad_medida` int(11) NOT NULL,
  `und_nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `unidad_medida`
--

INSERT INTO `unidad_medida` (`idunidad_medida`, `und_nombre`) VALUES
(1, 'UNIDAD'),
(2, 'METROS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idusuario` int(11) NOT NULL,
  `usr_nombre` varchar(45) NOT NULL,
  `usr_usuario` varchar(15) NOT NULL,
  `usr_clave` varchar(150) NOT NULL,
  `usr_fechacreacion` datetime NOT NULL,
  `usr_ultimologueo` datetime NOT NULL,
  `usr_estado` tinyint(1) NOT NULL,
  `idperfil` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `usr_nombre`, `usr_usuario`, `usr_clave`, `usr_fechacreacion`, `usr_ultimologueo`, `usr_estado`, `idperfil`) VALUES
(42, 'Jean Paul RF', 'jprodriguezf', '$2y$10$ff4osOxqP.2.KmFCHm.VruZmWiJTLLwzC01Brp59LxJXC9NcGjAhe', '2018-07-06 00:00:00', '2018-07-06 00:00:00', 0, 3),
(43, 'Jean Paul Rodriguez', 'jeanpaul', '$2y$10$ekUZzlxX/UV0/7GpIhH.quUeDtI08fo2XiTBRTrbKPYYH9UkqejRG', '2018-07-06 00:00:00', '2018-07-10 07:25:29', 0, 1),
(44, 'prueba', 'jeanpaulprueba', '$2y$10$YTRsqraTqIMPE0ptkcYyR.vRIkjy7ZA1wAhdx7yiQFI29csiIWtWO', '2018-07-06 00:00:00', '2018-07-06 00:00:00', 0, 3),
(45, 'Ivette Araujo', 'iaraujo', '$2y$10$qVSQilUUf/GgB2v4lGPm5.H1opVgcdAW/EbZ0jC/1QhioWvTqcWb2', '2018-07-06 00:00:00', '2018-07-06 00:00:00', 0, 1),
(46, 'Ivette Araujo 2', 'iaraujo', '$2y$10$sK/Lf82pzTXvOqDxuQd3i.583Mga6J6WfLsWBqcTB3plaebd2QIpy', '2018-07-06 00:00:00', '2018-07-06 00:00:00', 1, 2),
(47, 'Ivette Araujo 3', 'iaraujo', '$2y$10$vbsvsoKI46dLGW7k5/komO1UynognctiYuo.8fT0HipJy6bj8yIWu', '2018-07-07 00:00:00', '2018-07-07 00:00:00', 1, 4),
(48, 'Ivette Araujo 4', 'iaraujo', '$2y$10$SUSoGnGAj2Xv23ADdkQA/ulBtbAYGY32hm/Q4F/MHTLDU.z6yqzAa', '2018-07-07 00:00:00', '2018-07-07 00:00:00', 1, 1),
(49, 'Jean Paul Rodriguez 4', 'jrodriguezf', '$2y$10$5axKGkgJL2oT.PohSlXsuOOr/dLTwkNkubnE1s/CcwK5LrmGwZ0I2', '2018-07-07 00:00:00', '2018-07-07 00:00:00', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vendedor`
--

CREATE TABLE `vendedor` (
  `idvendedor` int(11) NOT NULL,
  `vnd_dni` varchar(45) NOT NULL,
  `vnd_nombre` varchar(45) NOT NULL,
  `vnd_email` varchar(45) NOT NULL,
  `vnd_estado` varchar(45) NOT NULL,
  `id_sucursal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `idventa` int(11) NOT NULL,
  `vnt_serie` varchar(8) NOT NULL,
  `vnt_numerodocumento` varchar(10) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `vnt_fecha` datetime NOT NULL,
  `id_vendedor` int(11) NOT NULL,
  `vnt_contrato_pdf` varchar(45) NOT NULL,
  `vnt_dni_pdf` varchar(45) NOT NULL,
  `vnt_cip_pdf` varchar(45) NOT NULL,
  `vnt_planilla_pdf` varchar(45) NOT NULL,
  `vnt_letra_pdf` varchar(45) NOT NULL,
  `vnt_voucher_pdf` varchar(45) NOT NULL,
  `vnt_autorizacion_pdf` varchar(45) NOT NULL,
  `vnt_fecha_inicio` datetime NOT NULL,
  `vnt_inicial` float NOT NULL,
  `vnt_numero_couta` int(11) NOT NULL,
  `vnt_cuotas` int(11) NOT NULL,
  `id_tipopago` int(11) NOT NULL,
  `vnt_total` float NOT NULL,
  `vnt_tipoventa` int(11) NOT NULL COMMENT '1. Directa, 2. Salida de vendedores',
  `id_tipoventa_referencia` int(11) NOT NULL COMMENT 'Cliente, Documento de salida, etc.',
  `vnt_estado` int(11) NOT NULL DEFAULT '1' COMMENT '1. Activo, 0.Inactivo '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta_producto`
--

CREATE TABLE `venta_producto` (
  `id_venta_producto` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_producto_serie` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura para la vista `stock_vista`
--
DROP TABLE IF EXISTS `stock_vista`;

CREATE ALGORITHM=UNDEFINED DEFINER=`genus`@`localhost` SQL SECURITY DEFINER VIEW `stock_vista`  AS  select `al`.`alm_nombre` AS `almacen`,`t`.`tprd_nombre` AS `tipo`,`m`.`mrc_nombre` AS `marca`,`md`.`mdl_nombre` AS `modelo`,`p`.`prd_descripcion` AS `descripcion`,`u`.`und_nombre` AS `unidad_medida`,sum(`tdet`.`tscdet_cantidad`) AS `cantidad` from (((((((`transaccion_detalle` `tdet` join `transaccion_cabecera` `tcab` on((`tdet`.`id_movimiento_cabecera` = `tcab`.`idtransaccion_cabecera`))) join `almacen` `al` on((`tcab`.`id_almacen` = `al`.`idalmacen`))) join `producto` `p` on((`tdet`.`id_producto` = `p`.`idproducto`))) join `modelo` `md` on((`p`.`id_modelo` = `md`.`id_modelo`))) join `marca` `m` on((`md`.`id_marca` = `m`.`id_marca`))) join `tipo_producto` `t` on((`m`.`id_tipo_producto` = `t`.`id_tipo_producto`))) join `unidad_medida` `u` on((`t`.`id_unidad_medida` = `u`.`idunidad_medida`))) where (`tcab`.`tsccab_estado` = 1) group by `al`.`alm_nombre`,`tdet`.`id_producto` order by `al`.`idalmacen` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `accionXusuario`
--
ALTER TABLE `accionXusuario`
  ADD PRIMARY KEY (`idaccionXusuario`);

--
-- Indices de la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD PRIMARY KEY (`idactividad`);

--
-- Indices de la tabla `actividadXusuario`
--
ALTER TABLE `actividadXusuario`
  ADD PRIMARY KEY (`idactividadXusuario`);

--
-- Indices de la tabla `almacen`
--
ALTER TABLE `almacen`
  ADD PRIMARY KEY (`idalmacen`);

--
-- Indices de la tabla `aval`
--
ALTER TABLE `aval`
  ADD PRIMARY KEY (`idaval`);

--
-- Indices de la tabla `avalxventa`
--
ALTER TABLE `avalxventa`
  ADD PRIMARY KEY (`id_avalxventa`);

--
-- Indices de la tabla `banco`
--
ALTER TABLE `banco`
  ADD PRIMARY KEY (`idbanco`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idcliente`);

--
-- Indices de la tabla `cliente_direccion`
--
ALTER TABLE `cliente_direccion`
  ADD PRIMARY KEY (`idcliente_direccion`);

--
-- Indices de la tabla `cliente_telefono`
--
ALTER TABLE `cliente_telefono`
  ADD PRIMARY KEY (`idcliente_telefono`);

--
-- Indices de la tabla `cronograma_pago`
--
ALTER TABLE `cronograma_pago`
  ADD PRIMARY KEY (`idcronograma_pago`);

--
-- Indices de la tabla `cuenta`
--
ALTER TABLE `cuenta`
  ADD PRIMARY KEY (`id_cuenta`);

--
-- Indices de la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD PRIMARY KEY (`id_departamento`);

--
-- Indices de la tabla `distrito`
--
ALTER TABLE `distrito`
  ADD PRIMARY KEY (`id_distrito`);

--
-- Indices de la tabla `institucion`
--
ALTER TABLE `institucion`
  ADD PRIMARY KEY (`id_institucion`);

--
-- Indices de la tabla `llegada_cabecera`
--
ALTER TABLE `llegada_cabecera`
  ADD PRIMARY KEY (`id_llegada_cabecera`);

--
-- Indices de la tabla `llegada_detalle_comision`
--
ALTER TABLE `llegada_detalle_comision`
  ADD PRIMARY KEY (`id_llegada_detalle_comision`);

--
-- Indices de la tabla `llegada_detalle_producto`
--
ALTER TABLE `llegada_detalle_producto`
  ADD PRIMARY KEY (`id_llegada_detalle_productos`);

--
-- Indices de la tabla `llegada_detalle_talonario`
--
ALTER TABLE `llegada_detalle_talonario`
  ADD PRIMARY KEY (`id_llegada_detalle_talonario`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id_marca`);

--
-- Indices de la tabla `modelo`
--
ALTER TABLE `modelo`
  ADD PRIMARY KEY (`id_modelo`);

--
-- Indices de la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD PRIMARY KEY (`idmodulo`);

--
-- Indices de la tabla `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`idpais`);

--
-- Indices de la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`idperfil`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`idpermiso`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`idproducto`);

--
-- Indices de la tabla `producto_serie`
--
ALTER TABLE `producto_serie`
  ADD PRIMARY KEY (`id_producto_serie`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`idproveedor`);

--
-- Indices de la tabla `provincia`
--
ALTER TABLE `provincia`
  ADD PRIMARY KEY (`id_provincia`);

--
-- Indices de la tabla `salida_cabecera`
--
ALTER TABLE `salida_cabecera`
  ADD PRIMARY KEY (`idsalida_vendedor`);

--
-- Indices de la tabla `salida_detalle_gasto`
--
ALTER TABLE `salida_detalle_gasto`
  ADD PRIMARY KEY (`id_salida_detalle_gasto`);

--
-- Indices de la tabla `salida_detalle_movilidad`
--
ALTER TABLE `salida_detalle_movilidad`
  ADD PRIMARY KEY (`id_salida_detalle_movilidad`);

--
-- Indices de la tabla `salida_detalle_producto`
--
ALTER TABLE `salida_detalle_producto`
  ADD PRIMARY KEY (`idvendedor_salida_producto`);

--
-- Indices de la tabla `salida_detalle_talonario`
--
ALTER TABLE `salida_detalle_talonario`
  ADD PRIMARY KEY (`id_salida_detalle_talonario`);

--
-- Indices de la tabla `salida_detalle_vendedor`
--
ALTER TABLE `salida_detalle_vendedor`
  ADD PRIMARY KEY (`idsalida_vendedor`);

--
-- Indices de la tabla `sede`
--
ALTER TABLE `sede`
  ADD PRIMARY KEY (`id_sede`);

--
-- Indices de la tabla `subsede`
--
ALTER TABLE `subsede`
  ADD PRIMARY KEY (`id_subsede`);

--
-- Indices de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  ADD PRIMARY KEY (`idsucursal`);

--
-- Indices de la tabla `talonario`
--
ALTER TABLE `talonario`
  ADD PRIMARY KEY (`idtalonario`);

--
-- Indices de la tabla `tipo_calificacion_crediticia`
--
ALTER TABLE `tipo_calificacion_crediticia`
  ADD PRIMARY KEY (`id_tipo_calificacion_crediticia`);

--
-- Indices de la tabla `tipo_calificacion_personal`
--
ALTER TABLE `tipo_calificacion_personal`
  ADD PRIMARY KEY (`idtipo_calificacion_personal`);

--
-- Indices de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  ADD PRIMARY KEY (`idtipo_documento`);

--
-- Indices de la tabla `tipo_moneda`
--
ALTER TABLE `tipo_moneda`
  ADD PRIMARY KEY (`idtipo_moneda`);

--
-- Indices de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  ADD PRIMARY KEY (`idtipo_pago`);

--
-- Indices de la tabla `tipo_producto`
--
ALTER TABLE `tipo_producto`
  ADD PRIMARY KEY (`id_tipo_producto`);

--
-- Indices de la tabla `tipo_transaccion`
--
ALTER TABLE `tipo_transaccion`
  ADD PRIMARY KEY (`idtipo_transaccion`);

--
-- Indices de la tabla `transaccion_cabecera`
--
ALTER TABLE `transaccion_cabecera`
  ADD PRIMARY KEY (`idtransaccion_cabecera`);

--
-- Indices de la tabla `transaccion_detalle`
--
ALTER TABLE `transaccion_detalle`
  ADD PRIMARY KEY (`idtransaccion_detalle`);

--
-- Indices de la tabla `unidad_medida`
--
ALTER TABLE `unidad_medida`
  ADD PRIMARY KEY (`idunidad_medida`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idusuario`);
ALTER TABLE `usuario` ADD FULLTEXT KEY `usr_nombre` (`usr_nombre`);

--
-- Indices de la tabla `vendedor`
--
ALTER TABLE `vendedor`
  ADD PRIMARY KEY (`idvendedor`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`idventa`);

--
-- Indices de la tabla `venta_producto`
--
ALTER TABLE `venta_producto`
  ADD PRIMARY KEY (`id_venta_producto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `accionXusuario`
--
ALTER TABLE `accionXusuario`
  MODIFY `idaccionXusuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `actividad`
--
ALTER TABLE `actividad`
  MODIFY `idactividad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `actividadXusuario`
--
ALTER TABLE `actividadXusuario`
  MODIFY `idactividadXusuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `almacen`
--
ALTER TABLE `almacen`
  MODIFY `idalmacen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `aval`
--
ALTER TABLE `aval`
  MODIFY `idaval` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `avalxventa`
--
ALTER TABLE `avalxventa`
  MODIFY `id_avalxventa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `banco`
--
ALTER TABLE `banco`
  MODIFY `idbanco` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idcliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `cliente_direccion`
--
ALTER TABLE `cliente_direccion`
  MODIFY `idcliente_direccion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cliente_telefono`
--
ALTER TABLE `cliente_telefono`
  MODIFY `idcliente_telefono` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cronograma_pago`
--
ALTER TABLE `cronograma_pago`
  MODIFY `idcronograma_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cuenta`
--
ALTER TABLE `cuenta`
  MODIFY `id_cuenta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `distrito`
--
ALTER TABLE `distrito`
  MODIFY `id_distrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=206;

--
-- AUTO_INCREMENT de la tabla `institucion`
--
ALTER TABLE `institucion`
  MODIFY `id_institucion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `llegada_cabecera`
--
ALTER TABLE `llegada_cabecera`
  MODIFY `id_llegada_cabecera` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `llegada_detalle_comision`
--
ALTER TABLE `llegada_detalle_comision`
  MODIFY `id_llegada_detalle_comision` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `llegada_detalle_producto`
--
ALTER TABLE `llegada_detalle_producto`
  MODIFY `id_llegada_detalle_productos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `llegada_detalle_talonario`
--
ALTER TABLE `llegada_detalle_talonario`
  MODIFY `id_llegada_detalle_talonario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `modelo`
--
ALTER TABLE `modelo`
  MODIFY `id_modelo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `modulo`
--
ALTER TABLE `modulo`
  MODIFY `idmodulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pais`
--
ALTER TABLE `pais`
  MODIFY `idpais` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `perfil`
--
ALTER TABLE `perfil`
  MODIFY `idperfil` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `idpermiso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `idproducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de la tabla `producto_serie`
--
ALTER TABLE `producto_serie`
  MODIFY `id_producto_serie` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `idproveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `provincia`
--
ALTER TABLE `provincia`
  MODIFY `id_provincia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT de la tabla `salida_cabecera`
--
ALTER TABLE `salida_cabecera`
  MODIFY `idsalida_vendedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `salida_detalle_gasto`
--
ALTER TABLE `salida_detalle_gasto`
  MODIFY `id_salida_detalle_gasto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `salida_detalle_movilidad`
--
ALTER TABLE `salida_detalle_movilidad`
  MODIFY `id_salida_detalle_movilidad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `salida_detalle_producto`
--
ALTER TABLE `salida_detalle_producto`
  MODIFY `idvendedor_salida_producto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `salida_detalle_talonario`
--
ALTER TABLE `salida_detalle_talonario`
  MODIFY `id_salida_detalle_talonario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `salida_detalle_vendedor`
--
ALTER TABLE `salida_detalle_vendedor`
  MODIFY `idsalida_vendedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sede`
--
ALTER TABLE `sede`
  MODIFY `id_sede` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `subsede`
--
ALTER TABLE `subsede`
  MODIFY `id_subsede` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  MODIFY `idsucursal` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `talonario`
--
ALTER TABLE `talonario`
  MODIFY `idtalonario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_calificacion_crediticia`
--
ALTER TABLE `tipo_calificacion_crediticia`
  MODIFY `id_tipo_calificacion_crediticia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_calificacion_personal`
--
ALTER TABLE `tipo_calificacion_personal`
  MODIFY `idtipo_calificacion_personal` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  MODIFY `idtipo_documento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_moneda`
--
ALTER TABLE `tipo_moneda`
  MODIFY `idtipo_moneda` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  MODIFY `idtipo_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_producto`
--
ALTER TABLE `tipo_producto`
  MODIFY `id_tipo_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_transaccion`
--
ALTER TABLE `tipo_transaccion`
  MODIFY `idtipo_transaccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `transaccion_cabecera`
--
ALTER TABLE `transaccion_cabecera`
  MODIFY `idtransaccion_cabecera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `transaccion_detalle`
--
ALTER TABLE `transaccion_detalle`
  MODIFY `idtransaccion_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `unidad_medida`
--
ALTER TABLE `unidad_medida`
  MODIFY `idunidad_medida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `vendedor`
--
ALTER TABLE `vendedor`
  MODIFY `idvendedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `idventa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `venta_producto`
--
ALTER TABLE `venta_producto`
  MODIFY `id_venta_producto` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
