<?php

require '../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

date_default_timezone_set('America/Lima');

Class Cliente{

    private $conn;
    private $Direccion;

    public $id;
    public $idcliente;
    public $id_sede;
    public $id_institucion;
    public $id_subsede;
    public $id_cargo_estado;
    public $ssd_nombre;
    public $sd_nombre;
    public $inst_nombre;
    public $clt_codigo;
    public $clt_dni;
    public $dni;
    public $clt_numero;
    public $clt_nombre;
    public $clt_foto;
    public $clt_cip;
    public $clt_email;
    public $clt_casilla;
    public $clt_trabajo;
    public $id_distrito;
    public $id_provincia;
    public $id_departamento;
    public $provincia;
    public $departamento;
    public $clt_cargo;
    public $capacidad_pago;
    public $maximo_descuento;
    public $clt_calificacion_personal;
    public $clt_aporte;
    public $clt_estado;
    public $clt_fecharegistro;

    public $plantilla_tarjeta;
    public $plantilla_ddjj;
    public $plantilla_autorizacion;
    public $plantilla_transaccion;
    public $plantilla_compromiso;

    public $cargo;
    public $cargo_estado;
    public $archivo;

    public $clt_aporteinicio;
    public $clt_aportefin;
    public $prpagina;
    public $prtotalpagina;

    public $distrito;
    public $comisaria;
    public $division;
    public $telefono;
    public $direccion;
    public $pagina;
    public $total_pagina;
    public $id_centro_trabajo;

    public $path_reporte = '../uploads/reporte-clientes/';

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "CALL sp_listarcliente(?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->clt_codigo);
        $result->bindParam(2, $this->clt_cip);
        $result->bindParam(3, $this->clt_dni);
        $result->bindParam(4, $this->clt_nombre);
        $result->bindParam(5, $this->inst_nombre);
        $result->bindParam(6, $this->sd_nombre);
        $result->bindParam(7, $this->prpagina);
        $result->bindParam(8, $this->prtotalpagina);
        $result->bindParam(9, $this->clt_estado);

        $result->execute();
    
        $cliente_list=array();
        $cliente_list["clientes"]=array();
        $contador = $this->prtotalpagina*($this->prpagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $cliente_item = array (
                "numero"=>$contador,
                "id"=>$row['id'],
                "codigo"=> "'". $row['codigo'],
                "dni"=> "'" . $row['dni'],
                "nombre"=>$row['nombre'],
                "cip"=> "'" . $row['cip'],
                "email"=>$row['email'],
                "casilla"=>$row['casilla'],
                "trabajo"=>$row['trabajo'],
                "institucion"=>$row['institucion'],
                "id_sede"=>$row['id_sede'],
                "sede"=>$row['sede'],
                "subsede"=>$row['subsede'],
                "cargo"=>$row['cargo'],
                "capacidad_pago"=>$row['capacidad_pago'],
                "capacidad_pago"=>$row['capacidad_pago'],
                "maximo_descuento"=>$row['maximo_descuento'],
                "calificacion_personal"=>$row['calificacion_personal'],
                "aporte"=>$row['aporte'],
                "fecharegistro"=>$row['fecha_registro'],
                "foto"=>$row['foto'],
                "total_creditos"=>$row['total_creditos'],
                "total_ventas"=>$row['total_ventas'],
                "total_transacciones"=>$row['total_transacciones'],
                "total_observaciones"=>$row['total_observaciones'],
            );

            array_push($cliente_list["clientes"],$cliente_item);
        }
        return $cliente_list;
    }

    function contar(){

        $query = "CALL sp_listarclientecontar(?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->clt_codigo);
        $result->bindParam(2, $this->clt_cip);
        $result->bindParam(3, $this->clt_dni);
        $result->bindParam(4, $this->clt_nombre);
        $result->bindParam(5, $this->inst_nombre);
        $result->bindParam(6, $this->sd_nombre);
        $result->bindParam(7, $this->prpagina);
        $result->bindParam(8, $this->prtotalpagina);
        $result->bindParam(9, $this->clt_estado);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        if ($this->total_resultado>1) {
            $contador = $this->prtotalpagina*($this->prpagina);
        }else{
            $contador = $this->prtotalpagina*($this->prpagina)+1;
        }

        return $contador;
    }

    function read_comercial(){
        $query = "CALL sp_listarclienteestricto(?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->clt_codigo);
        $result->bindParam(2, $this->clt_cip);
        $result->bindParam(3, $this->clt_dni);
        $result->bindParam(4, $this->clt_nombre);
        $result->bindParam(5, $this->inst_nombre);
        $result->bindParam(6, $this->sd_nombre);
        $result->bindParam(7, $this->prpagina);
        $result->bindParam(8, $this->prtotalpagina);
        $result->bindParam(9, $this->clt_estado);

        $result->execute();
    
        $cliente_list=array();
        $cliente_list["clientes"]=array();
        $contador = $this->prtotalpagina*($this->prpagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $cliente_item = array (
                "numero"=>$contador,
                "id"=>$row['id'],
                "codigo"=> "'". $row['codigo'],
                "dni"=> "'" . $row['dni'],
                "nombre"=>$row['nombre'],
                "cip"=>$row['cip'],
                "email"=>$row['email'],
                "casilla"=>$row['casilla'],
                "trabajo"=>$row['trabajo'],
                "institucion"=>$row['institucion'],
                "id_sede"=>$row['id_sede'],
                "sede"=>$row['sede'],
                "subsede"=>$row['subsede'],
                "cargo"=>$row['cargo'],
                "capacidad_pago"=>$row['capacidad_pago'],
                "capacidad_pago"=>$row['capacidad_pago'],
                "maximo_descuento"=>$row['maximo_descuento'],
                "calificacion_personal"=>$row['calificacion_personal'],
                "aporte"=>$row['aporte'],
                "fecharegistro"=>$row['fecha_registro'],
                "foto"=>$row['foto'],
                "cuotas_vencidas"=>$row['cuotas_vencidas'],
                "verificado"=>$row['verificado'],
                "total_creditos"=>$row['total_creditos'],
                "total_ventas"=>$row['total_ventas'],
                "total_transacciones"=>$row['total_transacciones'],
                "total_observaciones"=>$row['total_observaciones'],
            );

            array_push($cliente_list["clientes"],$cliente_item);
        }
        return $cliente_list;
    }

    function contar_comercial(){

        $query = "CALL sp_listarclienteestrictocontar(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->clt_codigo);
        $result->bindParam(2, $this->clt_cip);
        $result->bindParam(3, $this->clt_dni);
        $result->bindParam(4, $this->clt_nombre);
        $result->bindParam(5, $this->inst_nombre);
        $result->bindParam(6, $this->sd_nombre);
        $result->bindParam(7, $this->prpagina);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        if ($this->total_resultado>1) {
            $contador = $this->prtotalpagina*($this->prpagina);
        }else{
            $contador = $this->prtotalpagina*($this->prpagina)+1;
        }

        return $contador;
    }

    function readpreciso(){
        $query = "CALL sp_listarclientepreciso(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->clt_dni);
        $result->bindParam(2, $this->clt_nombre);

        $result->execute();
    
        $cliente_list=array();
        $cliente_list["clientes"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $cliente_item = array (
                "id"=>$row['id'],
                "institucion"=>$row['institucion'],
                "sede"=>$row['sede'],
                "subsede"=>$row['subsede'],
                "cargo"=>$row['cargo'],
                "cargo_estado"=>$row['cargo_estado'],
                "codigo"=>$row['codofin'],
                "dni"=>$row['dni'],
                "nombre"=>$row['nombre'],
                "cip"=>$row['cip'],
                "email"=>$row['email'],
                "aporte"=>$row['aporte'],
            );

            array_push($cliente_list["clientes"],$cliente_item);
        }
        return $cliente_list;
    }
    
    function read_telefono(){

        $query = "CALL sp_listarclientexcelular(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->clt_numero);

        $result->execute();
    
        $cliente_list=array();
        $cliente_list["clientes"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $cliente_item = array (
                "id"=>$row['id'],
                "dni"=>$row['dni'],
                "nombre"=>$row['nombre'],
            );

            array_push($cliente_list["clientes"],$cliente_item);
        }
        return $cliente_list; 
    }

    function create(){
        $query = "CALL sp_crearcliente(
            :id_sub_sede,
            :id_cargo,
            :id_cargo_estado,
            :clt_codigo,
            :clt_dni,
            :clt_nombre,
            :clt_foto,
            :clt_cip,
            :clt_email,
            :clt_casilla,
            :id_distrito,
            :clt_trabajo,
            :clt_capacidad_pago,
            :clt_maximo_descuento,
            :clt_calificacion_personal,
            :clt_aporte,
            :clt_fecharegistro,
            :clt_estado,
            :prcentrotrabajo
        )"; 

        $result = $this->conn->prepare($query);

        $this->id_sub_sede=htmlspecialchars(strip_tags($this->id_sub_sede));
        $this->id_cargo=htmlspecialchars(strip_tags($this->id_cargo));
        $this->id_cargo_estado=htmlspecialchars(strip_tags($this->id_cargo_estado));
        $this->clt_codigo=htmlspecialchars(strip_tags($this->clt_codigo));
        $this->clt_dni=htmlspecialchars(strip_tags($this->clt_dni));
        $this->clt_nombre=htmlspecialchars(strip_tags($this->clt_nombre));
        $this->clt_foto=htmlspecialchars(strip_tags($this->clt_foto));
        $this->clt_cip=htmlspecialchars(strip_tags($this->clt_cip));
        $this->clt_email=htmlspecialchars(strip_tags($this->clt_email));
        $this->clt_casilla=htmlspecialchars(strip_tags($this->clt_casilla));
        $this->id_distrito=htmlspecialchars(strip_tags($this->id_distrito));
        $this->clt_trabajo=htmlspecialchars(strip_tags($this->clt_trabajo));
        $this->capacidad_pago=htmlspecialchars(strip_tags($this->capacidad_pago));
        $this->clt_maximo_descuento=htmlspecialchars(strip_tags($this->clt_maximo_descuento));
        $this->clt_calificacion_personal=htmlspecialchars(strip_tags($this->clt_calificacion_personal));
        $this->clt_aporte=htmlspecialchars(strip_tags($this->clt_aporte));
        $this->clt_fecharegistro=htmlspecialchars(strip_tags($this->clt_fecharegistro));
        $this->clt_estado=htmlspecialchars(strip_tags($this->clt_estado));
        $this->id_centro_trabajo=htmlspecialchars(strip_tags($this->id_centro_trabajo));

        $result->bindParam(":id_sub_sede", $this->id_sub_sede);
        $result->bindParam(":id_cargo", $this->id_cargo);
        $result->bindParam(":id_cargo_estado", $this->id_cargo_estado);
        $result->bindParam(":clt_codigo", $this->clt_codigo);
        $result->bindParam(":clt_dni", $this->clt_dni);
        $result->bindParam(":clt_nombre", $this->clt_nombre);
        $result->bindParam(":clt_foto", $this->clt_foto);
        $result->bindParam(":clt_cip", $this->clt_cip);
        $result->bindParam(":clt_email", $this->clt_email);
        $result->bindParam(":clt_casilla", $this->clt_casilla);
        $result->bindParam(":id_distrito", $this->id_distrito);
        $result->bindParam(":clt_trabajo", $this->clt_trabajo);
        $result->bindParam(":clt_capacidad_pago", $this->capacidad_pago);
        $result->bindParam(":clt_maximo_descuento", $this->clt_maximo_descuento);
        $result->bindParam(":clt_calificacion_personal", $this->clt_calificacion_personal);
        $result->bindParam(":clt_aporte", $this->clt_aporte);
        $result->bindParam(":clt_fecharegistro", $this->clt_fecharegistro);
        $result->bindParam(":clt_estado", $this->clt_estado);
        $result->bindParam(":prcentrotrabajo", $this->id_centro_trabajo);

        if($result->execute())
        {
            $row = $result->fetch(PDO::FETCH_ASSOC);
            $this->id=$row['id'];
            return true;
        }
        
        return false;
    }
    
    function readxId(){
        
        $query ="CALL sp_listarclientexId(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idcliente);

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $this->idcliente = $row['idcliente'];
        $this->id_institucion=$row['id_institucion'];
        $this->id_sede=$row['id_sede'];
        $this->sede=$row['sede'];
        $this->id_subsede=$row['id_subsede'];
        $this->id_cargo=$row['id_cargo'];
        $this->cargo=$row['crg_nombre'];
        $this->id_cargo_estado=$row['id_cargo_estado'];
        $this->cargo_estado=$row['cargo_estado'];
        $this->clt_codigo="'".$row['clt_codigo'];
        $this->clt_dni="'".$row['clt_dni'];
        $this->clt_nombre=$row['clt_nombre'];
        $this->clt_foto=$row['clt_foto'];
        $this->clt_cip= $row['clt_cip'];
        $this->clt_email=$row['clt_email'];
        $this->clt_casilla=$row['clt_casilla'];
        $this->clt_trabajo=$row['clt_trabajo'];
        $this->id_distrito_trabajo=$row['id_distrito_trabajo'];
        $this->id_provincia=$row['id_provincia'];
        $this->provincia=$row['prv_nombre'];
        $this->id_departamento=$row['id_departamento'];
        $this->departamento=$row['dpt_nombre'];
        $this->capacidad_pago=$row['clt_capacidad_pago'];
        $this->clt_maximo_descuento=$row['clt_maximo_descuento'];
        $this->clt_calificacion_personal= $row['clt_calificacion_personal'];
        $this->clt_aporte=$row['clt_aporte'];
        $this->clt_fecharegistro=$row['clt_fecharegistro'];
        $this->clt_estado=$row['estado'];
        $this->plantilla_tarjeta=$row['plantilla_tarjeta'];
        $this->plantilla_ddjj=$row['plantilla_ddjj'];
        $this->plantilla_autorizacion=$row['plantilla_autorizacion'];
        $this->plantilla_transaccion=$row['plantilla_transaccion'];
        $this->plantilla_compromiso=$row['plantilla_compromiso'];
        $this->id_centro_trabajo=$row['id_centro_trabajo'];
    }

    function update(){

        $query = "CALL sp_actualizarcliente (
            :idcliente,
            :id_subsede,
            :id_cargo,
            :id_cargo_estado,
            :clt_codigo,
            :clt_dni,
            :clt_nombre,
            :clt_cip,
            :clt_email,
            :clt_casilla,
            :clt_trabajo,
            :id_distrito_trabajo,
            :clt_capacidad_pago,
            :clt_maximo_descuento,
            :clt_calificacion_personal,
            :clt_aporte,
            :prestado,
            :prcentrotrabajo
        )"; 

        $result = $this->conn->prepare($query);

        $this->idcliente=htmlspecialchars(strip_tags($this->idcliente));
        $this->id_subsede=htmlspecialchars(strip_tags($this->id_subsede));
        $this->id_cargo=htmlspecialchars(strip_tags($this->id_cargo));
        $this->id_cargo_estado=htmlspecialchars(strip_tags($this->id_cargo_estado));
        $this->clt_codigo=htmlspecialchars(strip_tags($this->clt_codigo));
        $this->clt_dni=htmlspecialchars(strip_tags($this->clt_dni));
        $this->clt_nombre=htmlspecialchars(strip_tags($this->clt_nombre));
        $this->clt_cip=htmlspecialchars(strip_tags($this->clt_cip));
        $this->clt_email=htmlspecialchars(strip_tags($this->clt_email));
        $this->clt_casilla=htmlspecialchars(strip_tags($this->clt_casilla));
        $this->clt_trabajo=htmlspecialchars(strip_tags($this->clt_trabajo));
        $this->id_distrito_trabajo=htmlspecialchars(strip_tags($this->id_distrito_trabajo));
        $this->capacidad_pago=htmlspecialchars(strip_tags($this->capacidad_pago));
        $this->maximo_descuento=htmlspecialchars(strip_tags($this->maximo_descuento));
        $this->clt_calificacion_personal=htmlspecialchars(strip_tags($this->clt_calificacion_personal));
        $this->clt_aporte=htmlspecialchars(strip_tags($this->clt_aporte));
        $this->clt_estado=htmlspecialchars(strip_tags($this->clt_estado));
        $this->id_centro_trabajo=htmlspecialchars(strip_tags($this->id_centro_trabajo));

        $result->bindParam(":idcliente", $this->idcliente);
        $result->bindParam(":id_subsede", $this->id_subsede);
        $result->bindParam(":id_cargo", $this->id_cargo);
        $result->bindParam(":id_cargo_estado", $this->id_cargo_estado);
        $result->bindParam(":clt_codigo", $this->clt_codigo);
        $result->bindParam(":clt_dni", $this->clt_dni);
        $result->bindParam(":clt_nombre", $this->clt_nombre);
        $result->bindParam(":clt_cip", $this->clt_cip);
        $result->bindParam(":clt_email", $this->clt_email);
        $result->bindParam(":clt_casilla", $this->clt_casilla);
        $result->bindParam(":clt_trabajo", $this->clt_trabajo);
        $result->bindParam(":id_distrito_trabajo", $this->id_distrito_trabajo);
        $result->bindParam(":clt_capacidad_pago", $this->capacidad_pago);
        $result->bindParam(":clt_maximo_descuento", $this->maximo_descuento);
        $result->bindParam(":clt_calificacion_personal", $this->clt_calificacion_personal);
        $result->bindParam(":clt_aporte", $this->clt_aporte);
        $result->bindParam(":prestado", $this->clt_estado);
        $result->bindParam(":prcentrotrabajo", $this->id_centro_trabajo);
        

        if($result->execute())
        {
            return true;
        }
        
        return false;
        // return $query;
    }

    function update_parcial(){
        $query = "CALL sp_actualizarclienteparcial (
            :idcliente,
            :id_subsede,
            :id_cargo,
            :id_cargo_estado,
            :clt_codigo,
            :clt_dni,
            :clt_nombre,
            :clt_cip,
            :clt_email,
            :clt_casilla
        )"; 

        $result = $this->conn->prepare($query);

        $this->idcliente=htmlspecialchars(strip_tags($this->idcliente));
        $this->id_subsede=htmlspecialchars(strip_tags($this->id_subsede));
        $this->id_cargo=htmlspecialchars(strip_tags($this->id_cargo));
        $this->id_cargo_estado=htmlspecialchars(strip_tags($this->id_cargo_estado));
        $this->clt_codigo=htmlspecialchars(strip_tags($this->clt_codigo));
        $this->clt_dni=htmlspecialchars(strip_tags($this->clt_dni));
        $this->clt_nombre=htmlspecialchars(strip_tags($this->clt_nombre));
        $this->clt_cip=htmlspecialchars(strip_tags($this->clt_cip));
        $this->clt_email=htmlspecialchars(strip_tags($this->clt_email));
        $this->clt_casilla=htmlspecialchars(strip_tags($this->clt_casilla));

        $result->bindParam(":idcliente", $this->idcliente);
        $result->bindParam(":id_subsede", $this->id_subsede);
        $result->bindParam(":id_cargo", $this->id_cargo);
        $result->bindParam(":id_cargo_estado", $this->id_cargo_estado);
        $result->bindParam(":clt_codigo", $this->clt_codigo);
        $result->bindParam(":clt_dni", $this->clt_dni);
        $result->bindParam(":clt_nombre", $this->clt_nombre);
        $result->bindParam(":clt_cip", $this->clt_cip);
        $result->bindParam(":clt_email", $this->clt_email);
        $result->bindParam(":clt_casilla", $this->clt_casilla);
        
        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function delete(){

        $query = "call sp_eliminarcliente(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idcliente);

        if($result->execute())
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    function delete_pendientes(){

        $query = "call sp_eliminarclientespendientes()";
        $result = $this->conn->prepare($query);

        if($result->execute())
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function updatefoto() {
        $query= "CALL sp_actualizarfoto(:idcliente, :clt_foto)";

        $result = $this->conn->prepare($query);

        $this->idcliente=htmlspecialchars(strip_tags($this->idcliente));
        $this->clt_foto=htmlspecialchars(strip_tags($this->clt_foto));

        $result->bindParam(":idcliente", $this->idcliente);
        $result->bindParam(":clt_foto", $this->clt_foto);

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function search(){
        
        $query ="CALL sp_buscarcliente(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->dni);

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);

        $cliente = array(
            "id" => $row['id'] ,
            "dni" => $row['dni'] ,
            "nombre" => $row['nombre'] ,
            "codigo" => $row['codigo'] ,
            "id_institucion" => $row['id_institucion'] ,
            "id_sede" => $row['id_sede'] ,
            "sede" => $row['sede'] ,
            "plantilla_tarjeta" => $row['plantilla_tarjeta'] ,
            "plantilla_ddjj" => $row['plantilla_ddjj'] ,
            "plantilla_autorizacion" => $row['plantilla_autorizacion'] ,
            "plantilla_transaccion" => $row['plantilla_transaccion'] ,
            "plantilla_compromiso" => $row['plantilla_compromiso'] ,
            "parametro_condicion" => $row['parametro_condicion'] ,
            "parametro_domicilio" => $row['parametro_domicilio'] ,
            "parametro_autorizacion_1" => $row['parametro_autorizacion_1'] ,
            "parametro_autorizacion_2" => $row['parametro_autorizacion_2'] ,
            "id_subsede" => $row['id_subsede'] ,
            "subsede" => $row['subsede'] ,
            "id_cargo" => $row['id_cargo'] ,
            "cargo_nombre" => $row['cargo_nombre'] ,
            "id_cargo_estado" => $row['id_cargo_estado'] ,
            "cargo_estado" => $row['cargo_estado'] ,
            "cip" => $row['cip'] ,
            "email" => $row['email'] ,
            "email_real" => $row['email_real'] ,
            "casilla" => $row['casilla'] ,
            "casilla_real" => $row['casilla_real'] ,
            "trabajo" => $row['trabajo'] ,
            "id_trabajo_distrito" => $row['id_trabajo_distrito'] ,
            "trabajo_distrito" => $row['trabajo_distrito'] ,
            "id_trabajo_provincia" => $row['id_trabajo_provincia'] ,
            "trabajo_provincia" => $row['trabajo_provincia'] ,
            "id_trabajo_departamento" => $row['id_trabajo_departamento'] ,
            "trabajo_departamento" => $row['trabajo_departamento'] ,
            "foto" => $row['foto'] ,
            "fecha_afiliacion" => $row['fecha_afiliacion'] ,
        );

        return $cliente;

    }

    function search_codigo( $codigo , $institucion ){
        
        $query ="CALL sp_buscarclientexcodigoinstitucion(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam( 1 , $codigo );
        $result->bindParam( 2 , $institucion );

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);

        $cliente = array(
            "id" => $row['id'] ,
            "dni" => $row['dni'] ,
            "nombre" => $row['nombre'] ,
            "codigo" => $row['codigo'] ,
            "cip" => $row['cip']
        );

        return $cliente;
    }

    function read_comercial_unlimited() {

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
  
        $query = "CALL sp_listarclienteestrictounlimited(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->clt_codigo);
        $result->bindParam(2, $this->clt_cip);
        $result->bindParam(3, $this->clt_dni);
        $result->bindParam(4, $this->clt_nombre);
        $result->bindParam(5, $this->inst_nombre);
        $result->bindParam(6, $this->sd_nombre);
        $result->bindParam(7, $this->clt_estado);

        $result->execute();
        
        $archivo = "" ;
        $cobranza=array();
        $cobranza["clientes"]=array();
  
        $contador = 1;
  
        $sheet->setCellValue('A1', 'N°');
        $sheet->setCellValue('B1', 'Código');
        $sheet->setCellValue('C1', 'DNI');
        $sheet->setCellValue('D1', 'Nombre');
        $sheet->setCellValue('E1', 'CIP');
        $sheet->setCellValue('F1', 'Email');
        $sheet->setCellValue('G1', 'Cargo');
        $sheet->setCellValue('H1', 'Situacion');
        $sheet->setCellValue('I1', 'Casilla');
        $sheet->setCellValue('J1', 'Institución');
        $sheet->setCellValue('K1', 'Sede');
        $sheet->setCellValue('L1', 'Subsede');
        $sheet->setCellValue('M1', 'Trabajo');
        $sheet->setCellValue('N1', 'Distrito');
        $sheet->setCellValue('O1', 'Provincia');
        $sheet->setCellValue('P1', 'Departamento');
        $sheet->setCellValue('Q1', 'Cuotas vencidas');
  
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
  
            $sheet->setCellValue('A' . $contador, $contador-1 );
            $sheet->setCellValue('B' . $contador, $codigo );
            $sheet->setCellValue('C' . $contador, $dni );
            $sheet->setCellValue('D' . $contador, $nombre );
            $sheet->setCellValue('E' . $contador, $cip );
            $sheet->setCellValue('F' . $contador, $email );
            $sheet->setCellValue('G' . $contador, $cargo );
            $sheet->setCellValue('H' . $contador, $cargo_estado );
            $sheet->setCellValue('I' . $contador, $casilla );
            $sheet->setCellValue('J' . $contador, $institucion );
            $sheet->setCellValue('K' . $contador, $sede );
            $sheet->setCellValue('L' . $contador, $subsede );
            $sheet->setCellValue('M' . $contador, $trabajo );
            $sheet->setCellValue('N' . $contador, $distrito );
            $sheet->setCellValue('O' . $contador, $provincia );
            $sheet->setCellValue('P' . $contador, $departamento );
            $sheet->setCellValue('Q' . $contador, $cuotas_vencidas );
        }
  
        $writer = new Xlsx($spreadsheet);
  
        $archivo = $this->path_reporte.$this->archivo.'.xlsx';
  
        $writer->save($archivo);
        
        if( file_exists ( $archivo ) ){
          return $archivo;
        } else {
          return false;
        };
    }

    function verificar_transaccion(){
        $query = "call sp_actualizarverificartransaccioncronograma(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idcliente);

        if($result->execute())
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    function prueba_subida_cliente(){
        $file = "./prueba.txt";

        if ( !file_exists($file) ) {
            return "Arhivo no existe";
        }

        $fp = fopen($file, "r");

        $querys=array();
        $contador = 0 ;

        while ( !feof($fp) ) {
            $current_line = fgets ($fp);
            // echo($current_line);
            $query = $current_line;

            $result = $this->conn->prepare($query);

            $result->bindParam(1, $this->idcliente);

            if($result->execute())
            {
                $contador = $contador + 1 ;
            }
        }

        fclose($fp);
        return $contador;
    }

    function obtener_llamadas(){
        $path = '../../ACR/' ;

        $query = "CALL sp_listarclientetelefononumeros(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idcliente);

        $result->execute();
    
        $telefonos_cliente=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            array_push($telefonos_cliente,$row['numero']);
        }

        // Desde aquí se verifica en la carpeta
        $files = scandir($path);
        
        $llamadas = array() ;
        $files = array_diff(scandir($path), array('.', '..'));
        
        $contador = 0 ;

        foreach($files as $archivo) {
            foreach ($telefonos_cliente as $telefono) {
                if (strpos($archivo, $telefono) !== FALSE) {
                    $contador = $contador + 1 ;

                    $ano = substr($archivo,0,4);
                    $mes = substr($archivo,5,2);
                    $dia = substr($archivo,8,2);
                    $hora = substr($archivo,11,2);
                    $minuto = substr($archivo,14,2);
                    $segundo = substr($archivo,17,2);

                    $fecha = $ano . "-" . $mes . "-" . $dia . " " . $hora . ":" . $minuto . ":" . $segundo;

                    $dateTime = new DateTime($fecha);
                    $informacion = array(
                        "numero" => $contador ,
                        "fecha" => $fecha ,
                        "archivo" => $archivo ,
                        "telefono" => $telefono ,
                        "date" => $dateTime
                    ) ;
                    array_push($llamadas, $informacion) ;
                }
            }
        }

        usort($llamadas, function ($item1, $item2) {
            return $item2['date'] <=> $item1['date'];
        });

        return $llamadas;
    }

    function eliminar_llamada(){
        $path = '../../ACR/' ;

        $archivo = $path.$this->archivo ;

        $contador = 0 ;

        if ( unlink($archivo) ) {
            return true ;
        } else {
            return false ;
        }
    }

    function read_centro_trabajoxId(){
        
        $query ="CALL sp_listarcentrotrabajopnpxId(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam( 1 , $this->id_centro_trabajo );

        $result->execute();
    
        $centro_list=array();
        $contador = $this->prtotalpagina*($this->prpagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $cliente_item = array (
                "id_centro_trabajo_pnp" => $row['id_centro_trabajo_pnp'] ,
                "id_distrito" => $row['id_distrito'] ,
                "distrito" => $row['distrito'] ,
                "id_provincia" => $row['id_provincia'] ,
                "provincia" => $row['provincia'] ,
                "id_departamento" => $row['id_departamento'] ,
                "departamento" => $row['departamento'] ,
                "comisaria" => $row['comisaria'] ,
                "division" => $row['division'] ,
                "telefono" => $row['telefono'] ,
                "direccion" => $row['direccion'] ,
            );

            array_push($centro_list,$cliente_item);
        }
        return $centro_list;
    }

    function read_centro_trabajo(){
        
        $query ="CALL sp_listarcentrotrabajopnp(?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam( 1 , $this->departamento );
        $result->bindParam( 2 , $this->provincia );
        $result->bindParam( 3 , $this->distrito );
        $result->bindParam( 4 , $this->comisaria );
        $result->bindParam( 5 , $this->division );
        $result->bindParam( 6 , $this->telefono );
        $result->bindParam( 7 , $this->direccion );
        $result->bindParam( 8 , $this->pagina );
        $result->bindParam( 9 , $this->total_pagina );

        $result->execute();
    
        $centro_list=array();
        $centro_list["centro_trabajo"]=array();
        $contador = $this->prtotalpagina*($this->prpagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $cliente_item = array (
                "numero"=>$contador,
                "id_centro_trabajo_pnp" => $row['id_centro_trabajo_pnp'] ,
                "id_distrito" => $row['id_distrito'] ,
                "distrito" => $row['distrito'] ,
                "id_provincia" => $row['id_provincia'] ,
                "provincia" => $row['provincia'] ,
                "id_departamento" => $row['id_departamento'] ,
                "departamento" => $row['departamento'] ,
                "comisaria" => $row['comisaria'] ,
                "division" => $row['division'] ,
                "telefono" => $row['telefono'] ,
                "direccion" => $row['direccion'] ,
            );

            array_push($centro_list["centro_trabajo"],$cliente_item);
        }
        return $centro_list;
    }

    function read_centro_trabajo_contar(){
        
        $query ="CALL sp_listarcentrotrabajopnpcontar(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam( 1 , $this->departamento );
        $result->bindParam( 2 , $this->provincia );
        $result->bindParam( 3 , $this->distrito );
        $result->bindParam( 4 , $this->comisaria );
        $result->bindParam( 5 , $this->division );
        $result->bindParam( 6 , $this->telefono );
        $result->bindParam( 7 , $this->direccion );

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function create_centro_trabajo(){
        
        $query ="CALL sp_crearcentrotrabajopnp(?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam( 1 , $this->id_distrito );
        $result->bindParam( 2 , $this->comisaria );
        $result->bindParam( 3 , $this->division );
        $result->bindParam( 4 , $this->telefono );
        $result->bindParam( 5 , $this->direccion );

        if ( $result->execute() ) {
            return true ;
        }
        return false ;
    }

    function update_centro_trabajo(){
        
        $query ="CALL sp_actualizarcentrotrabajopnp(?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam( 1 , $this->id_centro_trabajo );
        $result->bindParam( 2 , $this->id_distrito );
        $result->bindParam( 3 , $this->comisaria );
        $result->bindParam( 4 , $this->division );
        $result->bindParam( 5 , $this->telefono );
        $result->bindParam( 6 , $this->direccion );

        if ( $result->execute() ) {
            return true ;
        }
        return false ;
    }

    function delete_centro_trabajo(){
        
        $query ="CALL sp_eliminarcentrotrabajopnp(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam( 1 , $this->id_centro_trabajo );

        if ( $result->execute() ) {
            return true ;
        }
        return false ;
    }
}
?>