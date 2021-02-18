<?php

include_once '../vendor/phpoffice/phpword/bootstrap.php';
ini_set("pcre.backtrack_limit", "-1");

Class Plantillas{

    public $nombre_plantilla;

    public $nombre_archivo;
    public $aporte;
    public $nombre;
    public $cargo;
    public $cargo_estado;
    public $dni;
    public $nombre_aval ;
    public $dni_aval ;
    public $direccion_cliente;
    public $direccion_aval ;
    public $cip;
    public $codigo;
    public $cooperativa;
    public $cooperativa_direccion;
    public $cooperativa_direccion_1;
    public $cooperativa_direccion_2;
    public $cooperativa_direccion_3;
    public $cooperativa_direccion_4;
    public $cooperativa_cuenta_banco;
    public $cooperativa_cuenta_numero;
    public $presidente;
    public $presidente_dni;
    public $presidente_direccion;
    public $ugel_nombre;
    public $trabajo;
    public $distrito;
    public $provincia;
    public $direccion;
    public $tipo_telefono;
    public $telefono;
    public $casilla;
    public $whatsapp;
    public $email;
    public $monto_asociado;
    public $es_prestamo;
    public $es_venta;
    public $monto_cuota;
    public $numero_cuotas;
    public $numero_cuotas_letras;
    public $fecha;
    public $fecha_anterior;
    public $fecha_letras;
    public $monto_total;
    public $monto_total_letras;
    public $fecha_dia;
    public $fecha_dia_letras;
    public $banco_nombre;
    public $cuenta_numero;
    public $monto_penalidad;
    public $monto_penalidad_letras;
    public $numero_cuotas_penalidad;
    public $numero_cuotas_penalidad_letras;
    public $monto_cuota_penalidad;
    public $monto_cuota_penalidad_letras;
    public $vendedor;
    public $vendedor_dni;
    public $trabajador;
    public $trabajador_dni;
    public $trabajador_cargo;
    public $detalle;
    public $productos;
    public $prueba;
    public $parametro_condicion;
    public $parametro_domicilio_laboral;
    public $parametro_autorizacion_1;
    public $parametro_autorizacion_2;

    public $tipo_plantilla;
    public $usuario;
    public $comentarios;
    public $archivos;

    public $tipo ;
    public $relevancia ;
    public $id_plantilla ;

    public $total_prestamo ;
    public $fecha_afiliacion ;

    public $path_originales = '../plantillas/archivos/';
    public $path_estandar = '../plantillas/estaticos/';
    public $path_nuevo = '../uploads/plantillas/';
    public $path = '../uploads/autogenerados/';

    public function __construct($db){
        $this->conn = $db;
    }

    function generar_tarjeta(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/tarjeta_X.docx');

        $templateProcessor->setValue('nombre', $this->convertir_formato($this->numero_cuotas) );
        $templateProcessor->setValue('dni', str_pad( str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) , 15) );
        if( $this->cip ) {
            $templateProcessor->setValue('cip', 'CIP: ' . str_pad($this->cip, 15) );
        } else {
            $templateProcessor->setValue('cip', '' );
        }
        $templateProcessor->setValue('codofin', $this->codigo);
        $templateProcessor->setValue('cargo_estado', $this->cargo_estado);
        $templateProcessor->setValue('direccion', str_pad($this->direccion,45) );
        $templateProcessor->setValue('departamento', $this->departamento);
        $templateProcessor->setValue('provincia', $this->provincia);
        $templateProcessor->setValue('distrito', $this->distrito);
        $templateProcessor->setValue('trabajo', str_pad($this->trabajo,40) );
        $templateProcessor->setValue('cuenta', $this->cuenta_numero);
        $templateProcessor->setValue('celular', str_pad($this->celular, 15) );
        $templateProcessor->setValue('fecha', $this->fecha ) ;

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
    }

    function generar_ddjj(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/ddjj_X.docx');

        $templateProcessor->setValue('nombre', $this->convertir_formato($this->nombre) );
        $templateProcessor->setValue('dni', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) );
        $templateProcessor->setValue('distrito', $this->distrito);
        $templateProcessor->setValue('direccion', $this->direccion);
        $templateProcessor->setValue('lugar', $this->lugar);
        $templateProcessor->setValue('fecha', $this->fecha);
        $templateProcessor->setValue('fecha_letras', $this->fecha_letras);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }

    function generar_autorizacion(){

        switch ($this->tipo) {
            case 1:
                $tipo_autorizacion = "APORTE DE SOCIO (S/." . $this->monto_asociado . ")";
                break;
            case 2:
                $tipo_autorizacion = "CUOTAS DE PAGO DEL PRÉSTAMO";
                break;
            case 3:
                $tipo_autorizacion = "CUOTAS DE PAGO DEL EQUIPO CELULAR";
                break;
        }

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/autorizacion_X.docx');

        $templateProcessor->setValue('cooperativa', $this->cooperativa);
        $templateProcessor->setValue('tipo_motivo', $tipo_autorizacion);
        $templateProcessor->setValue('nombre', $this->convertir_formato($this->nombre) );
        $templateProcessor->setValue('cargo_estado', ucwords(strtolower($this->cargo_estado)));
        $templateProcessor->setValue('dni', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) );
        if( $this->cip ) {
            $templateProcessor->setValue('cip', ', CIP: ' . $this->cip);
        } else {
            $templateProcessor->setValue('cip', '');
        }
        if( $this->codigo ) {
            $templateProcessor->setValue('codigo', ', CODOFIN: ' . $this->codigo);
        } else {
            $templateProcessor->setValue('codigo', '');
        }
        $templateProcessor->setValue('ugel_nombre', $this->ugel_nombre);
        $templateProcessor->setValue('direccion', $this->direccion);
        $templateProcessor->setValue('tipo_telefono', $this->tipo_telefono);
        $templateProcessor->setValue('telefono', $this->telefono);
        $templateProcessor->setValue('email', $this->email);
        $templateProcessor->setValue('monto_cuota', number_format($this->monto_cuota,2));
        $templateProcessor->setValue('numero_cuotas', $this->numero_cuotas);
        $templateProcessor->setValue('lugar', $this->lugar);
        $templateProcessor->setValue('fecha', $this->fecha_letras);
        $templateProcessor->setValue('autorizacion1', $this->parametro_autorizacion_1);
        $templateProcessor->setValue('autorizacion2', $this->parametro_autorizacion_2);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }

    function generar_transaccion(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/transaccion_X.docx');

        $direccion_totales = $this->consultar_direccion_transaccion() ;
        
        forEach($direccion_totales as $direccion) {
            $etiqueta = "cooperativa_direccion_" . $direccion['numero_orden'] ;
            // ob_start();
            // echo($etiqueta);
            // error_log(ob_get_clean(), 4) ;
            $templateProcessor->setValue($etiqueta, $direccion['direccion']) ;    
        }

        $templateProcessor->setValue('cooperativa', $this->cooperativa);
        // $templateProcessor->setValue('cooperativa_direccion', $this->cooperativa_direccion);
        // $templateProcessor->setValue('cooperativa_direccion_1', $this->cooperativa_direccion_1);
        // $templateProcessor->setValue('cooperativa_direccion_2', $this->cooperativa_direccion_2);
        // $templateProcessor->setValue('cooperativa_direccion_3', $this->cooperativa_direccion_3);
        // $templateProcessor->setValue('cooperativa_direccion_4', $this->cooperativa_direccion_4);
        $templateProcessor->setValue('cooperativa_cuenta_banco', $this->cooperativa_cuenta_banco);
        $templateProcessor->setValue('cooperativa_cuenta_numero', $this->cooperativa_cuenta_numero);
        $templateProcessor->setValue('presidente', $this->presidente);
        $templateProcessor->setValue('presidente_dni', str_pad($this->presidente_dni, 8 ,"0" ,STR_PAD_LEFT));
        $templateProcessor->setValue('presidente_direccion', $this->presidente_direccion);
        $templateProcessor->setValue('condicion', $this->parametro_condicion);
        $templateProcessor->setValue('domicilio_laboral', $this->parametro_domicilio_laboral);
        $templateProcessor->setValue('autorizacion1', $this->parametro_autorizacion_1);
        $templateProcessor->setValue('autorizacion2', $this->parametro_autorizacion_2);

        $templateProcessor->setValue('nombre', $this->convertir_formato($this->nombre) );
        $templateProcessor->setValue('cargo', $this->cargo);
        $templateProcessor->setValue('dni', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT));
        if ( $this->cip ){
            $templateProcessor->setValue('cip', "con CIP N° " . $this->cip);
        } else {
            $templateProcessor->setValue('cip', "");
        }
        $templateProcessor->setValue('direccion', $this->direccion);
        $templateProcessor->setValue('casilla', $this->casilla);
        $templateProcessor->setValue('fecha_anterior', $this->fecha_anterior);
        $templateProcessor->setValue('fecha_letras', $this->fecha_letras);
        $templateProcessor->setValue('monto_total', number_format($this->monto_total,2));
        $templateProcessor->setValue('monto_total_letras', $this->monto_total_letras);

        $templateProcessor->setValue('monto_cuotas', number_format($this->monto_cuota,2));
        $templateProcessor->setValue('monto_cuotas_letras', $this->monto_cuota_letras);
        $templateProcessor->setValue('ugel_nombre', $this->ugel_nombre);
        $templateProcessor->setValue('numero_cuotas', $this->numero_cuotas);
        $templateProcessor->setValue('numero_cuotas_letras', $this->numero_cuotas_letras);
        $templateProcessor->setValue('fecha_dia', $this->fecha_dia);
        $templateProcessor->setValue('fecha_dia_letras', $this->fecha_dia_letras);
        $templateProcessor->setValue('banco_nombre', $this->banco_nombre);
        $templateProcessor->setValue('cuenta_numero', $this->cuenta_numero);
        $templateProcessor->setValue('monto_penalidad', number_format($this->monto_penalidad,2));
        $templateProcessor->setValue('monto_penalidad_letras', $this->monto_penalidad_letras);
        $templateProcessor->setValue('numero_cuotas_penalidad', $this->numero_cuotas_penalidad);
        $templateProcessor->setValue('numero_cuotas_penalidad_letras', $this->numero_cuotas_penalidad_letras);
        $templateProcessor->setValue('monto_cuota_penalidad', number_format($this->monto_cuota_penalidad,2));
        $templateProcessor->setValue('monto_cuota_penalidad_letras', $this->monto_cuota_penalidad_letras);
        $templateProcessor->setValue('email', $this->email);
        $templateProcessor->setValue('whatsapp', $this->whatsapp);
        $templateProcessor->setValue('lugar', ucwords(strtolower($this->lugar)) );
        $templateProcessor->setValue('vendedor', $this->vendedor);
        $templateProcessor->setValue('vendedor_dni', $this->vendedor_dni);
        
        // Para registrar el tipo de transacción
        switch ($this->tipo) {
            case 1:
                $tipo_transaccion = " un préstamo en dinero ";
                $templateProcessor->setValue('tipo_transaccion', $tipo_transaccion);
                break;
            case 2:
                $this->prueba=[];
                $tipo_transaccion =" una venta de " ;
                // echo $this->productos ;
                $this->productos = json_decode($this->productos) ;
                // print_r($this->productos) ;
                foreach ( $this->productos as $producto ) {
                    $tipo_transaccion = $tipo_transaccion . ", " . $producto->descripcion . " con IMEI " . $producto->serie ;
                }
                $templateProcessor->setValue('tipo_transaccion', $tipo_transaccion);
                break;
        }

        // En caso haya algún garante
        if( $this->nombre_aval == "0" ) {
            $informacion_aval = "";
            $templateProcessor->setValue('aval_linea', "");
            $templateProcessor->setValue('aval', "");
            $templateProcessor->setValue('aval_dni', "");
            $templateProcessor->setValue('aval_cargo', "");
        } else {
            $informacion_aval = "Asimismo, en caso de no efectuarse los descuentos en su oportunidad AUTORIZA el descuento de sus haberes al Sr.(a) "
            . $this->nombre_aval . " (GARANTE) con DNI N°" .  $this->dni_aval . " la deuda de S/. " . number_format($this->monto_total,2) .
            " (" . $this->monto_total_letras ."). ";
            $templateProcessor->setValue('aval_linea', "___________________________________");
            $templateProcessor->setValue('aval', $this->convertir_formato($this->nombre_aval));
            $templateProcessor->setValue('aval_dni', "DNI: " . $this->dni_aval);
            $templateProcessor->setValue('aval_cargo', "GARANTE-AVAL");
        }
        $templateProcessor->setValue('información_aval', $informacion_aval);

        // Se le da el formato a los números del cronograma
        $cronograma=json_decode($this->detalle);
        forEach ($cronograma as $valor){
            $valor->monto = number_format($valor->monto, 2);
        }

        // ob_start();
        // var_dump($cronograma);
        // error_log(ob_get_clean(), 4) ;

        // $templateProcessor->cloneBlock('cronograma', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_1', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_2', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_3', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_4', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_5', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_6', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_7', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_8', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_9', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_10', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_11', 0, true, false, $cronograma);

        // forEach($direccion_totales as $direccion) {
        //     $etiqueta = "block_name_" . $direccion['numero_orden'] ;
        //     $templateProcessor->cloneBlock($etiqueta, 0, true, false, $cronograma) ;    
        // }

        // Para las hojas 2 y 3, se evalúa que no se repitan las direcciones
        $this->direccion_cliente = filter_var($this->direccion_cliente, FILTER_VALIDATE_BOOLEAN);
        if ( $this->direccion_cliente ) {
            $direccion_cliente = " y/o en " . $this->direccion;
        } else {
            $direccion_cliente = "" ;
        }
        $templateProcessor->setValue('dirección_cliente', $direccion_cliente);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
    }

    function generar_compromiso(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/compromiso_X.docx');

        $templateProcessor->setValue('cooperativa', $this->cooperativa);
        $templateProcessor->setValue('nombre', $this->convertir_formato($this->nombre) );
        $templateProcessor->setValue('dni', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) );
        if( $this->cip ) {
            $templateProcessor->setValue('cip', 'y CIP ' . $this->cip );
        } else {
            $templateProcessor->setValue('cip', '' );
        }
        $templateProcessor->setValue('fecha', $this->fecha);
        $templateProcessor->setValue('banco', $this->banco);
        $templateProcessor->setValue('cuenta', $this->cuenta);
        $templateProcessor->setValue('contacto', $this->contacto);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }
    
    function generar_tarjeta_socio(){
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/tarjeta_X.docx');

        $templateProcessor->setValue('cooperativa', $this->cooperativa);
        $templateProcessor->setValue('nombre', $this->nombre);
        $templateProcessor->setValue('dni', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) );
        $templateProcessor->setValue('cip', $this->cip);
        $templateProcessor->setValue('codofin', $this->codigo);
        $templateProcessor->setValue('cargo_estado', $this->cargo_estado);
        $templateProcessor->setValue('direccion', $this->direccion);
        $templateProcessor->setValue('distrito', $this->distrito);
        $templateProcessor->setValue('provincia', $this->provincia);
        $templateProcessor->setValue('departamento', $this->departamento);
        $templateProcessor->setValue('celular', $this->celular);
        $templateProcessor->setValue('banco', $this->banco);
        $templateProcessor->setValue('cuenta', $this->cuenta);
        $templateProcessor->setValue('fecha', $this->fecha);
        $templateProcessor->setValue('autorizacion1', $this->parametro_autorizacion_1);
        $templateProcessor->setValue('autorizacion2', $this->parametro_autorizacion_2);
        
        $templateProcessor->setValue('total_prestamo', number_format($this->total_prestamo,2) ) ;
        $templateProcessor->setValue('numero_cuotas', $this->numero_cuotas ) ;
        $templateProcessor->setValue('cuota_mensual', number_format($this->total_prestamo / $this->numero_cuotas, 2) ) ;
        $templateProcessor->setValue('fecha_afiliacion', $this->fecha_afiliacion ) ;

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
    }

    function generar_carta(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/carta_aval.docx');

        $templateProcessor->setValue('nombre_aval', $this->convertir_formato($this->nombre_aval) );
        $templateProcessor->setValue('dni_aval', str_pad($this->dni_aval, 8 ,"0" ,STR_PAD_LEFT) );
        $templateProcessor->setValue('dirección_aval', $this->direccion_aval );
        $templateProcessor->setValue('nombre_cliente', $this->convertir_formato($this->nombre) );
        $templateProcessor->setValue('dni_cliente', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) );
        $templateProcessor->setValue('lugar', $this->lugar);
        $templateProcessor->setValue('fecha', $this->fecha_letras);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }

    function consultar_direccion_ddjj(){
        $query = "CALL sp_listarplantilladireccionddjj()";

        $result = $this->conn->prepare($query);

        $result->execute();
        
        $listado=array();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $direccion = array(
            "direccion" => $row['direccion_ddjj'],
            "distrito" => $row['distrito_ddjj'],
        );

        return $direccion;
    }

    function consultar_direccion_transaccion(){
        $query = "CALL sp_listarplantilladirecciontransaccion()";

        $result = $this->conn->prepare($query);

        $result->execute();
        
        $listado=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
            extract($row);
            $item = array (
                "direccion"=>$direccion,
                "id_tipo"=>$id_tipo,
                "tipo"=>$tipo,
                "numero_orden"=>$numero_orden
            );
            array_push($listado, $item);
        }

        return $listado;
    }

    function consultar_cooperativa_configuracion(){
        $query = "CALL sp_listarplantillacooperativaconfiguracion()";

        $result = $this->conn->prepare($query);

        $result->execute();
        
        $listado=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
            extract($row);
            $item = array (
                "parametro"=>$parametro,
                "valor"=>$valor,
            );
            array_push($listado, $item);
        }

        return $listado;
    }

    function consultar_cooperativa(){
        $query = "CALL sp_listarplantillacooperativa()";

        $result = $this->conn->prepare($query);

        $result->execute();
        
        $listado=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
            extract($row);
            $item = array (
                "parametro"=>$parametro,
                "valor"=>$valor,
            );
            array_push($listado, $item);
        }

        return $listado;
    }

    function consultar_presidente(){
        
        $query = "CALL sp_listarplantillacooperativapresidente()";

        $result = $this->conn->prepare($query);

        $result->execute();
        
        $listado=array();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $presidente = array(
            "documento" => $row['documento'],
            "nombre" => $row['nombre'],
            "direccion" => $row['direccion'],
        );

        return $presidente;
    }

    function consultar_cuenta(){
        $query = "CALL sp_listarplantillacooperativacuenta()";

        $result = $this->conn->prepare($query);

        $result->execute();
        
        $listado=array();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $cuenta = array(
            "cuenta" => $row['cuenta'],
            "banco" => $row['banco'],
        );

        return $cuenta;
    }

    function consultar_contacto(){
        $query = "CALL sp_listarplantillacooperativacontacto()";

        $result = $this->conn->prepare($query);

        $result->execute();
        
        $listado=array();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        return $row['numero'];
    }

    function consultar_informacion(){
        $listado = array(
            "cooperativa" => $this->consultar_cooperativa(),
            "presidente"=> $this->consultar_presidente(),
            "cooperativa_configuracion" => $this->consultar_cooperativa_configuracion(),
            "direccion_ddjj" => $this->consultar_direccion_ddjj(),
            "direccion_transaccion" => $this->consultar_direccion_transaccion(),
            "cuenta" => $this->consultar_cuenta(),
            "contacto" => $this->consultar_contacto(),
        );

        return $listado;
    }

    function convertir_formato($nombre){

        $posicion_coma = strpos($nombre, ',');
        if( $posicion_coma === false ){
            return $nombre;
        } else {
            $apellido = TRIM(substr($nombre, 0, $posicion_coma ));
            $nombre = TRIM(substr($nombre, $posicion_coma + 1 ));
            $nombre_corregido = strtoupper( $apellido ) .", " . ucwords(strtolower($nombre));
            return $nombre_corregido;
        }
    }

    function read_tipo() {
        $query = "CALL sp_listarplantillastipo()";

        $result = $this->conn->prepare($query);

        $result->execute();

        $listado=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
            extract($row);
            $item = array (
                "id"=>$id,
                "nombre"=>$nombre,
            );
            array_push($listado, $item);
        }

        return $listado;
    }

    function crear_plantilla(){
        $query = "CALL sp_crearplantillas(
            :prtipoplantilla,
            :fecha,
            :prusuario,
            :prcomentarios,
            :prarchivos
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prtipoplantilla", $this->tipo_plantilla);
        $result->bindParam(":fecha", $this->fecha);
        $result->bindParam(":prusuario", $this->usuario);
        $result->bindParam(":prcomentarios", $this->comentarios);
        $result->bindParam(":prarchivos", $this->archivos);

        $this->tipo_plantilla=htmlspecialchars(strip_tags($this->tipo_plantilla));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->usuario=htmlspecialchars(strip_tags($this->usuario));
        $this->comentarios=htmlspecialchars(strip_tags($this->comentarios));
        $this->archivos=htmlspecialchars(strip_tags($this->archivos));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function read(){

        $query = "CALL sp_listarplantillas(?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tipo);
        $result->bindParam(2, $this->relevancia);
        $result->bindParam(3, $this->usuario);
        $result->bindParam(4, $this->numero_pagina);
        $result->bindParam(5, $this->total_pagina);

        $result->execute();
        
        $plantillas_list=array();
        $plantillas_list["plantillas"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $items = array (
                "numero"=>$contador,
                "id_plantilla"=>$id_plantilla,
                "id_tipo_plantilla"=>$id_tipo_plantilla,
                "tipo_plantilla"=>$tipo_plantilla,
                "fecha"=>$fecha,
                "usuario"=>$usuario,
                "comentarios"=>$comentarios,
                "archivo"=>$archivo,
                "relevancia"=>$relevancia,
            );
            array_push($plantillas_list["plantillas"],$items);
        }

        return $plantillas_list;
    }

    function contar(){

        $query = "CALL sp_listarplantillascontar(?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tipo);
        $result->bindParam(2, $this->relevancia);
        $result->bindParam(3, $this->usuario);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function eliminar_plantilla(){
        $query = "CALL sp_eliminarplantilla(
            :prplantilla
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prplantilla", $this->id_plantilla);

        $this->id_plantilla=htmlspecialchars(strip_tags($this->id_plantilla));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function actualizar_plantilla_relevancia(){
        $query = "CALL sp_actualizarplantillarelevancia(
            :prplantilla ,
            :prtipo
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prplantilla", $this->id_plantilla);
        $result->bindParam(":prtipo", $this->tipo_plantilla);

        $this->id_plantilla=htmlspecialchars(strip_tags($this->id_plantilla));
        $this->tipo_plantilla=htmlspecialchars(strip_tags($this->tipo_plantilla));

        if($result->execute())
        {
            return true;
        }
        return false;
    }
    

}

?>
