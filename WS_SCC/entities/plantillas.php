<?php

include_once '../vendor/phpoffice/phpword/bootstrap.php';

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

    public $path_originales = '../plantillas/archivos/';
    public $path_estandar = '../plantillas/estaticos/';
    public $path = '../uploads/autogenerados/';

    public function __construct($db){
        $this->conn = $db;
    }

    function generar_tarjeta(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/'.$this->nombre_plantilla);

        $templateProcessor->setValue('nombre', $this->convertir_formato($this->nombre) );
        $templateProcessor->setValue('dni', str_pad( str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) , 15) );
        $templateProcessor->setValue('cip', str_pad($this->cip, 15) );
        $templateProcessor->setValue('codigo', $this->codigo);
        $templateProcessor->setValue('cargo_estado', $this->cargo_estado);
        $templateProcessor->setValue('direccion', str_pad($this->direccion,45) );
        $templateProcessor->setValue('provincia', $this->provincia);
        $templateProcessor->setValue('trabajo', str_pad($this->trabajo,40) );
        $templateProcessor->setValue('cuenta', $this->cuenta_numero);
        $templateProcessor->setValue('lugar', str_pad($this->lugar, 15) );
        $templateProcessor->setValue('celular', str_pad($this->celular, 15) );
        $templateProcessor->setValue('monto_afiliacion', $this->monto_afiliacion);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }

    function generar_ddjj(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/'.$this->nombre_plantilla);

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

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/'.$this->nombre_plantilla);

        $templateProcessor->setValue('cooperativa', $this->cooperativa);
        $templateProcessor->setValue('tipo_motivo', $tipo_autorizacion);
        $templateProcessor->setValue('nombre', $this->convertir_formato($this->nombre) );
        $templateProcessor->setValue('cargo_estado', ucwords(strtolower($this->cargo_estado)));
        $templateProcessor->setValue('dni', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) );
        $templateProcessor->setValue('cip', $this->cip);
        $templateProcessor->setValue('codigo', $this->codigo);
        $templateProcessor->setValue('ugel_nombre', $this->ugel_nombre);
        $templateProcessor->setValue('direccion', $this->direccion);
        $templateProcessor->setValue('tipo_telefono', $this->tipo_telefono);
        $templateProcessor->setValue('telefono', $this->telefono);
        $templateProcessor->setValue('email', $this->email);
        $templateProcessor->setValue('monto_cuota', number_format($this->monto_cuota,2));
        $templateProcessor->setValue('numero_cuotas', $this->numero_cuotas);
        $templateProcessor->setValue('lugar', $this->lugar);
        $templateProcessor->setValue('fecha', $this->fecha_letras);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }

    function generar_transaccion(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/'.$this->nombre_plantilla);

        $templateProcessor->setValue('cooperativa', $this->cooperativa);
        $templateProcessor->setValue('cooperativa_direccion', $this->cooperativa_direccion);
        $templateProcessor->setValue('cooperativa_direccion_1', $this->cooperativa_direccion_1);
        $templateProcessor->setValue('cooperativa_direccion_2', $this->cooperativa_direccion_2);
        $templateProcessor->setValue('cooperativa_direccion_3', $this->cooperativa_direccion_3);
        $templateProcessor->setValue('cooperativa_cuenta_banco', $this->cooperativa_cuenta_banco);
        $templateProcessor->setValue('cooperativa_cuenta_numero', $this->cooperativa_cuenta_numero);
        $templateProcessor->setValue('presidente', $this->presidente);
        $templateProcessor->setValue('presidente_dni', str_pad($this->presidente_dni, 8 ,"0" ,STR_PAD_LEFT));
        $templateProcessor->setValue('presidente_direccion', $this->presidente_direccion);

        $templateProcessor->setValue('nombre', $this->convertir_formato($this->nombre) );
        $templateProcessor->setValue('cargo', $this->cargo);
        $templateProcessor->setValue('dni', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT));
        $templateProcessor->setValue('cip', $this->cip);
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
        $templateProcessor->setValue('lugar', $this->lugar);
        $templateProcessor->setValue('vendedor', $this->vendedor);
        $templateProcessor->setValue('vendedor_dni', $this->vendedor_dni);
        
        // Para registrar el tipo de transacción
        switch ($this->tipo) {
            case 2:
                $tipo_transaccion = " un préstamo en dinero o venta de equipo celular y/o otros ";
                $templateProcessor->setValue('tipo_transaccion', $tipo_transaccion);
                break;
            case 3:
                $this->prueba=[];
                $tipo_transaccion =" una venta de " ;
                $this->productos = json_decode($this->productos) ;
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
            $informacion_aval = "Asimismo, en caso de no efectuarse los descuentos en su oportunidad AUTORIZA el descuento de sus haberes al garante "
            . $this->convertir_formato($this->nombre_aval) . " con DNI " .  $this->dni_aval . " la deuda de S/. " . number_format($this->monto_total,2) .
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
        $templateProcessor->cloneBlock('block_name', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_1', 0, true, false, $cronograma);
        $templateProcessor->cloneBlock('block_name_2', 0, true, false, $cronograma);

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

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/'.$this->nombre_plantilla);

        $templateProcessor->setValue('cooperativa', $this->cooperativa);
        $templateProcessor->setValue('nombre', $this->convertir_formato($this->nombre) );
        $templateProcessor->setValue('dni', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) );
        $templateProcessor->setValue('cip', $this->cip);
        $templateProcessor->setValue('fecha', $this->fecha);
        $templateProcessor->setValue('banco', $this->banco);
        $templateProcessor->setValue('cuenta', $this->cuenta);
        $templateProcessor->setValue('contacto', $this->contacto);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }
    
    function generar_tarjeta_socio(){
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/'.$this->nombre_plantilla);

        $templateProcessor->setValue('cooperativa', $this->cooperativa);
        $templateProcessor->setValue('nombre', $this->nombre);
        $templateProcessor->setValue('dni', str_pad($this->dni, 8 ,"0" ,STR_PAD_LEFT) );
        $templateProcessor->setValue('cip', $this->cip);
        $templateProcessor->setValue('fecha', $this->fecha);
        $templateProcessor->setValue('banco', $this->banco);
        $templateProcessor->setValue('cuenta', $this->cuenta);
        $templateProcessor->setValue('contacto', $this->contacto);
        $templateProcessor->setValue('monto_afiliacion', number_format($this->monto_afiliacion,2));

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

}

?>