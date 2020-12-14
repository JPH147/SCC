<?php

  require '../vendor/autoload.php';
  use PhpOffice\PhpSpreadsheet\Spreadsheet;
  use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

  date_default_timezone_set("America/Lima") ;

  Class Cobranzas{
    
    private $conn;

    public $path = '../uploads/planilla-descuentos/';
    public $path_cobros = '../uploads/planilla-cobros/';
    public $path_reporte = '../uploads/reporte-cobranzas/';

    public $id_cobranza;
    public $id_transaccion;
    public $total_resultado;
    public $archivo;
    public $contenido;

    public $cobranza_directa;
    public $cobranza_archivos;
    public $cobranza_judicial;
    public $cobranza_manual;
    public $credito_cronograma;
    public $venta_cronograma;

    public $tipo_transaccion ;
    public $cronograma ;
    public $interes ;

    public $cabecera;
    public $cliente;
    public $codigo;
    public $sede;
    public $subsede;
    public $institucion;
    public $tipo;
    public $transaccion;
    public $tipo_pago;
    public $fecha_inicio;
    public $fecha_fin;
    public $cantidad;
    public $monto;
    public $estado;
    public $nombre;
    public $numero_pagina;
    public $total_pagina;
    public $fecha;
    public $banco;
    public $cuenta;
    public $operacion;
    public $solo_directas;
    public $observaciones;
    public $detalle_cabecera;
    public $nivel_mora;
    public $tipo_cobranza;
    public $comprobante;
    public $vendedor;
    public $cliente_dni ;
    public $usuario;
    public $orden ;
    public $validado ;

    public $credito ;
    public $venta ;
    public $id_liquidacion ;
    public $usuario_alvis ;
    public $referente ;
    public $periodo ;

    public $informacion;

    public function __construct($db){
      $this->conn = $db;
    }

    function read_cronograma() {
      $query = "CALL sp_listarcronograma(?,?,?,?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->subsede);
      $result->bindParam(4, $this->institucion);
      $result->bindParam(5, $this->tipo);
      $result->bindParam(6, $this->fecha_inicio);
      $result->bindParam(7, $this->fecha_fin);
      $result->bindParam(8, $this->estado);
      $result->bindParam(9, $this->numero_pagina);
      $result->bindParam(10, $this->total_pagina);

      $result->execute();
      
      $cronograma=array();
      $cronograma["cronograma"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);
      
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $contador=$contador+1;
        $items = array (
          "numero"=>$contador,
          "id_cronograma"=>$id_cronograma,
          "id_tipo"=>$id_tipo,
          "tipo"=>$tipo,
          "codigo"=>$codigo,
          "id_tipo_pago"=>$id_tipo_pago,
          "tipo_pago"=>$tipo_pago,
          "cliente"=>$cliente,
          "id_subsede"=>$id_subsede,
          "subsede"=>$subsede,
          "id_sede"=>$id_sede,
          "sede"=>$sede,
          "id_institucion"=>$id_institucion,
          "institucion"=>$institucion,
          "monto_total"=>$monto_total,
          "monto_pendiente"=>$monto_pendiente,
          "fecha_vencimiento"=>$fecha_vencimiento,
          "fecha_cancelacion"=>$fecha_cancelacion,
          "id_estado"=>$id_estado,
          "estado"=>$estado,
        );
        array_push($cronograma["cronograma"],$items);
      }

      return $cronograma;
    }

    function contar_cronograma(){

      $query = "CALL sp_listarcronogramacontar(?,?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->subsede);
      $result->bindParam(4, $this->institucion);
      $result->bindParam(5, $this->tipo);
      $result->bindParam(6, $this->fecha_inicio);
      $result->bindParam(7, $this->fecha_fin);
      $result->bindParam(8, $this->estado);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function actualizar_cuota(){
      $query = "CALL sp_actualizarcronograma(
        :prtipo,
        :prid,
        :prfecha,
        :prtipopago
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prtipo", $this->tipo);
      $result->bindParam(":prid", $this->id_cobranza);
      $result->bindParam(":prfecha", $this->fecha);
      $result->bindParam(":prtipopago", $this->tipo_pago);

      $this->tipo=htmlspecialchars(strip_tags($this->tipo));
      $this->id_cobranza=htmlspecialchars(strip_tags($this->id_cobranza));
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->tipo_pago=htmlspecialchars(strip_tags($this->tipo_pago));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function read_pagos_cuotas(){
      
      $query = "CALL sp_listarcobranzasxcuota(?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->tipo) ;
      $result->bindParam(2, $this->cuota) ;
      $result->bindParam(3, $this->numero_pagina) ;
      $result->bindParam(4, $this->total_pagina) ;

      $result->execute();

      $cronograma=array();
      $cronograma["pagos"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "numero" => $contador ,
            "id_detalle" => $id_detalle ,
            "id_cobranza_directa" => $id_cobranza_directa ,
            "id_cobranza_archivos" => $id_cobranza_archivos ,
            "id_cobranza_judicial" => $id_cobranza_judicial ,
            "id_cobranza_manual" => $id_cobranza_manual ,
            "monto" => $monto ,
            "fecha_pago" => $fecha_pago ,
            "documento" => $documento ,
            "id_tipo" => $id_tipo ,
            "tipo" => $tipo
          );
          array_push($cronograma["pagos"],$items);
      }

      return $cronograma;
    }

    function contar_pagos_cuotas(){
      
      $query = "CALL sp_listarcobranzasxcuotacontar(?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->tipo) ;
      $result->bindParam(2, $this->cuota) ;

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function read_pagos_cuotas_periodos(){
      
      $query = "CALL sp_listarcobranzasxcuotaperiodos(?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->tipo_transaccion) ;
      $result->bindParam(2, $this->transaccion) ;
      $result->bindParam(3, $this->periodo) ;
      $result->bindParam(4, $this->numero_pagina) ;
      $result->bindParam(5, $this->total_pagina) ;

      $result->execute();

      $cronograma=array();
      $cronograma["pagos"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "numero" => $contador ,
            "id_detalle" => $id_detalle ,
            "id_cobranza_directa" => $id_cobranza_directa ,
            "id_cobranza_archivos" => $id_cobranza_archivos ,
            "id_cobranza_judicial" => $id_cobranza_judicial ,
            "id_cobranza_manual" => $id_cobranza_manual ,
            "monto" => $monto ,
            "fecha_pago" => $fecha_pago ,
            "documento" => $documento ,
            "id_tipo" => $id_tipo ,
            "tipo" => $tipo
          );
          array_push($cronograma["pagos"],$items);
      }

      return $cronograma;
    }

    function contar_pagos_cuotas_periodos(){
      
      $query = "CALL sp_listarcobranzasxcuotaperiodoscontar(?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->tipo_transaccion) ;
      $result->bindParam(2, $this->transaccion) ;
      $result->bindParam(3, $this->periodo) ;

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    // Esta función es como la siguiente pero agrupa los resultados por cliente
    function read_pnp_clientes(){

      $query = "CALL sp_listarcronogramaxcobrarpnpclientes(?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->sede);
      $result->bindParam(2, $this->fecha_inicio);
      $result->bindParam(3, $this->fecha_fin);

      $result->execute();

      $cronograma=array();
      $cronograma["cronograma"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "numero"=>$contador,
            "id_cliente"=>$id_cliente,
            "cliente"=>$cliente,
            "monto_pendiente"=>$monto_pendiente,
          );
          array_push($cronograma["cronograma"],$items);
      }

      return $cronograma;
    }

    function read_pnp(){

      $query = "CALL sp_listarcronogramaxcobrarpnp(?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->sede);
      $result->bindParam(2, $this->fecha_inicio);
      $result->bindParam(3, $this->fecha_fin);

      $result->execute();

      $cronograma=array();
      $cronograma["cronograma"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "numero"=>$contador,
            "id"=>$id,
            "id_tipo"=>$id_tipo,
            "tipo"=>$tipo,
            "codigo"=>$codigo,
            "codofin"=>$codofin,
            "cip"=>$cip,
            "id_cliente"=>$id_cliente,
            "cliente"=>$cliente,
            "fecha"=>$fecha,
            "monto_pendiente"=>$monto_pendiente,
            // "archivo"=>$archivo,
            "considerar"=>true,
          );
          array_push($cronograma["cronograma"],$items);
      }

      return $cronograma;
    }

    function read_pnp_total(){

      $query = "CALL sp_listarcronogramaxcobrarpnptotal(?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->sede);
      $result->bindParam(2, $this->fecha_inicio);
      $result->bindParam(3, $this->fecha_fin);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->cantidad=$row['cantidad'];
      $this->total=$row['total'];

    }

    function generar_pnp(){

      $file = fopen($this->path.$this->archivo.".txt", "w") or die();

      $array = $this->contenido;

      foreach($this->contenido as $item){
        fwrite($file, $item."\n");

        if( !next( $array ) ) {
          fclose($file);
          return true;
        }

      }
    }

    function create_archivos_cabecera(){
      $query = "CALL sp_crearcobranzaarchivoscabecera(
        :prsede,
        :prtipopago,
        :prfechainicio,
        :prfechafin,
        :prcantidad,
        :prmonto,
        :prarchivo
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prsede", $this->sede);
      $result->bindParam(":prtipopago", $this->tipo_pago);
      $result->bindParam(":prfechainicio", $this->fecha_inicio);
      $result->bindParam(":prfechafin", $this->fecha_fin);
      $result->bindParam(":prcantidad", $this->cantidad);
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prarchivo", $this->archivo);

      $this->sede=htmlspecialchars(strip_tags($this->sede));
      $this->tipo_pago=htmlspecialchars(strip_tags($this->tipo_pago));
      // $this->fecha_inicio=htmlspecialchars(strip_tags($this->fecha_inicio));
      $this->fecha_fin=htmlspecialchars(strip_tags($this->fecha_fin));
      $this->cantidad=htmlspecialchars(strip_tags($this->cantidad));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->archivo=htmlspecialchars(strip_tags($this->archivo));

      if($result->execute())
      {
        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->id_cobranza = $row['id'];

        $this->create_archivos_detalle() ;
        
        return true;
      }
      return false;
    }

    function create_archivos_detalle(){
      $query = "CALL sp_crearcobranzaarchivosdetalle(
        :prcobranza,
        :prcliente,
        :prcreditocronograma,
        :prventacronograma,
        :prmonto
      )";

      // Se crea un primer elemento sin información
      // Se hace esto porque la primera iteración falla
      $array = (object) array(
        "considerar" => true ,
        "id_tipo" => 0 ,
        "id" => 0 ,
        "id_cliente" => 0 ,
        "monto_pendiente" => 0
      );
      array_unshift($this->detalle_cabecera, $array);
      // ---------------------------------------------->

      foreach ($this->detalle_cabecera as $item) {
        if( $item->considerar ){

          $cliente = $item->id_cliente ;
          $monto = $item->monto_pendiente ;

          if( $item->id_tipo == 3 ) {
            $venta_cronograma = $item->id ;
            $credito_cronongrama = 0;
          } else {
            $venta_cronograma = 0 ;
            $credito_cronongrama = $item->id ;
          }
          $result = $this->conn->prepare($query);

          $result->bindParam(":prcobranza", $this->id_cobranza);
          $result->bindParam(":prcliente", $cliente);
          $result->bindParam(":prcreditocronograma", $credito_cronongrama);
          $result->bindParam(":prventacronograma", $venta_cronograma);
          $result->bindParam(":prmonto", $monto);
    
          $this->id_cobranza=htmlspecialchars(strip_tags($this->id_cobranza));
          $cliente=htmlspecialchars(strip_tags($cliente));
          $credito_cronongrama=htmlspecialchars(strip_tags($credito_cronongrama));
          $venta_cronograma=htmlspecialchars(strip_tags($venta_cronograma));
          $monto=htmlspecialchars(strip_tags($monto));
    
          if( $result->execute() )
          {
            // echo "ParamsOK:" . " id: ".$this->id_cobranza . " cliente: " . $cliente . " cc: " . $credito_cronongrama . " vc: " . $venta_cronograma . " monto: " . $monto . "\n";
            // return true;
          } else {
            // echo "ParamsErr:" . " id: ".$this->id_cobranza . " cliente: " . $cliente . " cc: " . $credito_cronongrama . " vc: " . $venta_cronograma . " monto: " . $monto . "\n";
            // return false;
          }
        }
      }
    }

    function create_archivos_cabecera_pago(){
      $query = "CALL sp_crearcobranzaarchivoscabecerapago(
        :prcobranza,
        :prfechapago,
        :prmontopagado
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcobranza", $this->id_cobranza);
      $result->bindParam(":prfechapago", $this->fecha);
      $result->bindParam(":prmontopagado", $this->monto);

      $this->id_cobranza=htmlspecialchars(strip_tags($this->id_cobranza));
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->monto=htmlspecialchars(strip_tags($this->monto));

      if($result->execute())
      {
        $this->create_detalle_array(2);
        return true;
      }
      return false;
    }

    function delete_archivos_cabecera(){
      $query = "CALL sp_eliminarcobranzaarchivos(
        :prcobranza
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcobranza", $this->id_cobranza);

      $this->id_cobranza=htmlspecialchars(strip_tags($this->id_cobranza));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function verificar_pago_sede(){

      $query = "CALL sp_verificarpagosede(?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->sede);
      $result->bindParam(2, $this->fecha);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }
    
    function read_planilla_cabecera(){
      $query = "CALL sp_listarcobranzaplanillacabecera(?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->numero_pagina);
      $result->bindParam(2, $this->total_pagina);

      $result->execute();

      $cronograma=array();
      $cronograma["cobranzas"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "numero"=>$contador,
            "id"=>$id,
            "fecha_creacion"=>$fecha_creacion,
            "sede"=>$sede,
            "tipo_pago"=>$tipo_pago,
            "fecha_inicio"=>$fecha_inicio,
            "fecha_fin"=>$fecha_fin,
            "cantidad"=>$cantidad,
            "monto"=>$monto,
            "archivo"=>$archivo,
            "estado"=>$estado,
            "id_estado"=>$id_estado
          );
          array_push($cronograma["cobranzas"],$items);
      }

      return $cronograma;
    }

    function read_planilla_cabecera_contar(){

      $query = "CALL sp_listarcobranzaplanillacabeceracontar()";

      $result = $this->conn->prepare($query);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function read_planilla_detalle_consolidadoxcliente(){
      $query = "CALL sp_listarcobranzadetalleplanillaconsolidadoxcliente(?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->id_cobranza);

      $result->execute();

      $cronograma=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = $codigo ."-" . ROUND($monto,2) ;
          array_push($cronograma,$items);
      }

      return $cronograma;
    
    }

    function read_cobranza_archivosxId(){
      $query ="CALL sp_listarcobranzaarchivosxId(?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->id_cobranza);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);
      $transacciones = array (
        "id" => $row['id'] ,
        "institucion" => $row['institucion'] ,
        "sede" => $row['sede'] ,
        "tipo_pago" => $row['tipo_pago'] ,
        "fecha_inicio" => $row['fecha_inicio'] ,
        "fecha_fin" => $row['fecha_fin'] ,
        "fecha_pago" => $row['fecha_pago'] ,
        "cantidad" => $row['cantidad'] ,
        "monto" => $row['monto'] ,
        "monto_pagado" => $row['monto_pagado'] ,
        "archivo" => $row['archivo'] ,
        "id_estado" => $row['id_estado'] ,
        "estado" => $row['estado'] ,
      );

      return $transacciones;
    }

    function read_cobranza_detallexcabecera(){
      $query = "CALL sp_listarcobranzaarchivosdetalle(?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->id_cobranza);

      $result->execute();

      $cronograma=array();
      $cronograma["cobranzas"]=array();

      $contador = 0;

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "numero"=>$contador,
            "id_cliente" => $id_cliente ,
            "cliente_dni" => $cliente_dni ,
            "cliente" => $cliente ,
            "id_tipo" => $id_tipo ,
            "tipo" => $tipo ,
            "documento" => $documento ,
            "monto_enviado" => $monto_enviado ,
            "monto_pagado" => $monto_pagado ,
          );
          array_push($cronograma["cobranzas"],$items);
      }

      return $cronograma;
    }

    function read_cobranza_directa(){
      $query = "CALL sp_listarcobranzadirecta(?,?,?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->banco);
      $result->bindParam(3, $this->operacion);
      $result->bindParam(4, $this->fecha_inicio);
      $result->bindParam(5, $this->fecha_fin);
      $result->bindParam(6, $this->validado);
      $result->bindParam(7, $this->numero_pagina);
      $result->bindParam(8, $this->total_pagina);
      $result->bindParam(9, $this->orden);

      $result->execute();

      $cronograma=array();
      $cronograma["cobranzas"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "numero"=>$contador,
            "id"=>$id,
            "fecha"=>$fecha,
            "id_cliente"=>$id_cliente,
            "cliente"=>$cliente,
            "cooperativa_cuenta"=>$cooperativa_cuenta,
            "banco"=>$banco,
            "cooperativa_cuenta_alias"=>$cooperativa_cuenta_alias,
            "numero_operacion"=>$numero_operacion . " ",
            "monto"=>$monto,
            "fecha_referencia"=>$fecha_referencia,
            "validado"=>$validado,
          );
          array_push($cronograma["cobranzas"],$items);
      }

      return $cronograma;
    
    }

    function contar_cobranza_directa(){

      $query = "CALL sp_listarcobranzadirectacontar(?,?,?,?,?,?)";
      
      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->banco);
      $result->bindParam(3, $this->operacion);
      $result->bindParam(4, $this->fecha_inicio);
      $result->bindParam(5, $this->fecha_fin);
      $result->bindParam(6, $this->validado);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function read_cobranza_directaxId(){
      $query ="call sp_listarcobranzadirectaxId(?)";
        
      $result = $this->conn->prepare($query);
      
      $result->bindParam(1, $this->id_cobranza);

      $Detalle = $this->read_cobranza_detallexdirecta($this->id_cobranza);

      $result->execute();
  
      $row = $result->fetch(PDO::FETCH_ASSOC);

      $resultado = array (
        "id" => $row['id'] ,
        "fecha" => $row['fecha'] ,
        "id_cliente" => $row['id_cliente'] ,
        "cliente" => $row['cliente'] ,
        "cooperativa_cuenta" => $row['cooperativa_cuenta'] ,
        "id_banco" => $row['id_banco'] ,
        "banco" => $row['banco'] ,
        "numero_operacion" => $row['numero_operacion'] ,
        "monto" => $row['monto'] ,
        "id_transaccion" => $row['id_transaccion'] ,
        "fecha_referencia" => $row['fecha_referencia'] ,
        "solo_directas" => $row['solo_directas'] ,
        "archivo" => $row['archivo'] ,
        "observaciones" => $row['observaciones'] ,
        "id_vendedor" => $row['id_vendedor'] ,
        "vendedor" => $row['vendedor'] ,
        "detalle" => $Detalle
      );
      return $resultado;
    }

    function read_cobranza_detallexdirecta($id_cobranza){

      $query ="call sp_listarcobranzadetallexdirecta(?)";
        
      $result = $this->conn->prepare($query);
      
      $result->bindParam(1, $id_cobranza);

      $result->execute();
      $cuentas=array();

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $items = array (
          "id_detalle" => $row['id_detalle'] ,
          "tipo" => $row['tipo'] ,
          "codigo" => $row['codigo'] ,
          "id_cronograma" => $row['id_cronograma'] ,
          "id_transaccion" => $row['id_transaccion'] ,
          "fecha_vencimiento" => $row['fecha_vencimiento'] ,
          "monto_total" => $row['monto_total'] ,
          "monto_pendiente" => $row['monto_pendiente'] ,
          "monto" => $row['monto'] ,
          "pagar" => $row['monto'] ,
          "id_estado" => $row['id_estado'] ,
        );
        array_push($cuentas,$items);
      };

      return $cuentas;
    }

    function create_directa(){
      $query = "CALL sp_crearcobranzadirecta(
        :prfecha,
        :prcliente,
        :prcuenta,
        :properacion,
        :prreferente,
        :prmonto,
        :prtransaccion,
        :prestricto,
        :prarchivo,
        :prfechareferencia,
        :probservaciones
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prfecha", $this->fecha);
      $result->bindParam(":prcliente", $this->cliente);
      $result->bindParam(":prcuenta", $this->cuenta);
      $result->bindParam(":properacion", $this->operacion);
      $result->bindParam(":prreferente", $this->referente);
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prtransaccion", $this->transaccion);
      $result->bindParam(":prestricto", $this->solo_directas);
      $result->bindParam(":prarchivo", $this->archivo);
      $result->bindParam(":prfechareferencia", $this->fecha_referencia);
      $result->bindParam(":probservaciones", $this->observaciones);
      
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->cliente=htmlspecialchars(strip_tags($this->cliente));
      $this->cuenta=htmlspecialchars(strip_tags($this->cuenta));
      $this->operacion=htmlspecialchars(strip_tags($this->operacion));
      $this->referente=htmlspecialchars(strip_tags($this->referente));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->transaccion=htmlspecialchars(strip_tags($this->transaccion));
      $this->solo_directas=htmlspecialchars(strip_tags($this->solo_directas));
      $this->archivo=htmlspecialchars(strip_tags($this->archivo));
      $this->observaciones=htmlspecialchars(strip_tags($this->observaciones));
      
      if ($this->fecha_referencia) {
        $this->fecha_referencia=htmlspecialchars(strip_tags($this->fecha_referencia));
      } else {
        $this->fecha_referencia = null ;
      }

      if($result->execute())
      {
          $row = $result->fetch(PDO::FETCH_ASSOC);
          $this->id_cobranza=$row['id'];
          $this->create_detalle_array(1);
          return true;
      }
      return false;
    }

    function create_directa_masivo(){
      $query = "CALL sp_crearcobranzadirectamasivo(
        :prfecha,
        :prcliente,
        :prcuenta,
        :properacion,
        :prreferente,
        :prmonto,
        :prtipo,
        :prtransaccion,
        :probservaciones,
        :prusuarioalvis,
        :prfechaactual
      )";

      $result = $this->conn->prepare($query);

      $momento = date("Y-m-d H:i:s");
      $result->bindParam(":prfecha", $this->fecha);
      $result->bindParam(":prcliente", $this->cliente);
      $result->bindParam(":prcuenta", $this->cuenta);
      $result->bindParam(":properacion", $this->operacion);
      $result->bindParam(":prreferente", $this->referente);
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prtipo", $this->tipo_transaccion);
      $result->bindParam(":prtransaccion", $this->transaccion);
      $result->bindParam(":probservaciones", $this->observaciones);
      $result->bindParam(":prusuarioalvis", $this->usuario_alvis);
      $result->bindParam(":prfechaactual", $momento);
      
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->cliente=htmlspecialchars(strip_tags($this->cliente));
      $this->cuenta=htmlspecialchars(strip_tags($this->cuenta));
      $this->operacion=htmlspecialchars(strip_tags($this->operacion));
      $this->referente=htmlspecialchars(strip_tags($this->referente));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->tipo_transaccion=htmlspecialchars(strip_tags($this->tipo_transaccion));
      $this->transaccion=htmlspecialchars(strip_tags($this->transaccion));
      $this->observaciones=htmlspecialchars(strip_tags($this->observaciones));
      $this->usuario_alvis=htmlspecialchars(strip_tags($this->usuario_alvis));
      
      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function create_directa_masivo_array(){
      $query = "CALL sp_crearcobranzadirectamasivo(
        :prfecha,
        :prcliente,
        :prcuenta,
        :properacion,
        :prreferente,
        :prmonto,
        :prtipo,
        :prtransaccion,
        :probservaciones,
        :prusuarioalvis,
        :prfechaactual
      )";

      $exito = 0;
      $error = 0;
      
      $detalle = json_decode($this->informacion) ;

      $this->cliente=htmlspecialchars(strip_tags($this->cliente));
      $this->tipo_transaccion=htmlspecialchars(strip_tags($this->tipo_transaccion));
      $this->transaccion=htmlspecialchars(strip_tags($this->transaccion));
      $momento = date("Y-m-d H:i:s");

      foreach($detalle as $elemento) {
        $result = $this->conn->prepare($query);

        $result->bindParam(":prcliente", $this->cliente);
        $result->bindParam(":prtipo", $this->tipo_transaccion);
        $result->bindParam(":prtransaccion", $this->transaccion);

        $result->bindParam(":prfecha", $elemento->fecha);
        $result->bindParam(":prcuenta", $elemento->cuenta);
        $result->bindParam(":properacion", $elemento->operacion);
        $result->bindParam(":prreferente", $elemento->referente);
        $result->bindParam(":prmonto", $elemento->monto);
        $result->bindParam(":probservaciones", $elemento->observacion);
        
        ob_start();
        echo($elemento->fecha) ;
        echo($elemento->cuenta) ;
        echo($elemento->operacion) ;
        echo($elemento->referente) ;
        echo($elemento->monto) ;
        echo($elemento->observacion) ;
        error_log(ob_get_clean(), 4) ;

        $elemento->fecha=htmlspecialchars(strip_tags($elemento->fecha));
        $elemento->cuenta=htmlspecialchars(strip_tags($elemento->cuenta));
        $elemento->operacion=htmlspecialchars(strip_tags($elemento->operacion));
        $elemento->referente=htmlspecialchars(strip_tags($elemento->referente));
        $elemento->monto=htmlspecialchars(strip_tags($elemento->monto));
        $elemento->observacion=htmlspecialchars(strip_tags($elemento->observacion));
        
        $result->bindParam(":prusuarioalvis", $this->usuario_alvis);
        $this->usuario_alvis=htmlspecialchars(strip_tags($this->usuario_alvis));
        $result->bindParam(":prfechaactual", $momento);

        if ( $result->execute() ) {
          $exito = $exito + 1 ;
        } else {
          $error = $error + 1 ;
        }
      } ;

      return array("exito"=> $exito, "error"=> $error);
    }

    function update_directa(){
      $query = "CALL sp_actualizarcobranzadirecta(
        :prid,
        :prfecha,
        :prcliente,
        :prcuenta,
        :properacion,
        :prreferente,
        :prmonto,
        :prtransaccion,
        :prestricto,
        :prarchivo,
        :probservaciones
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prid", $this->id_cobranza);
      $result->bindParam(":prfecha", $this->fecha);
      $result->bindParam(":prcliente", $this->cliente);
      $result->bindParam(":prcuenta", $this->cuenta);
      $result->bindParam(":properacion", $this->operacion);
      $result->bindParam(":prreferente", $this->referente);
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prtransaccion", $this->id_transaccion);
      $result->bindParam(":prestricto", $this->solo_directas);
      $result->bindParam(":prarchivo", $this->archivo);
      $result->bindParam(":probservaciones", $this->observaciones);

      $this->id_cobranza=htmlspecialchars(strip_tags($this->id_cobranza));
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->cliente=htmlspecialchars(strip_tags($this->cliente));
      $this->cuenta=htmlspecialchars(strip_tags($this->cuenta));
      $this->operacion=htmlspecialchars(strip_tags($this->operacion));
      $this->referente=htmlspecialchars(strip_tags($this->referente));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->id_transaccion=htmlspecialchars(strip_tags($this->id_transaccion));
      $this->solo_directas=htmlspecialchars(strip_tags($this->solo_directas));
      $this->archivo=htmlspecialchars(strip_tags($this->archivo));
      $this->observaciones=htmlspecialchars(strip_tags($this->observaciones));

      if($result->execute())
      {
        $this->create_detalle_array(1);
        return true;
      }
      return false;
    }

    function update_directa_validacion(){
      $query = "CALL sp_actualizarcobranzadirectavalidacion(
        :prid,
        :prvalidado
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prid", $this->id_cobranza);
      $result->bindParam(":prvalidado", $this->validado);

      $this->id_cobranza=htmlspecialchars(strip_tags($this->id_cobranza));
      $this->validado=htmlspecialchars(strip_tags($this->validado));

      if($result->execute())
      {
        return true;
      }
      return false;
    }
    
    function search_cobranza_directa(){
      $query = "CALL sp_buscarcobranzadirecta(?)";
      
      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->operacion);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function read_cooperativa_cuenta(){
      
      $query = "CALL sp_listarcooperativacuenta()";

      $result = $this->conn->prepare($query);

      $result->execute();

      $cuentas=array();
      $cuentas["cuentas"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "numero" => $contador,
            "id" => $id,
            "id_banco" => $id_banco,
            "banco" => $banco,
            "numero_cuenta" => $numero_cuenta,
            "cci" => $cci,
          );
          array_push($cuentas["cuentas"],$items);
      }

      return $cuentas;
    }

    function seleccionar_cuotas_pagar(){
      $query = "CALL sp_listarcobranzasposiblescuotas(?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->monto);
      $result->bindParam(3, $this->id_transaccion);
      $result->bindParam(4, $this->solo_directas);
      $result->bindParam(5, $this->fecha_referencia);

      $result->execute();

      $cronograma=array();
      $cronograma["cuotas"]=array();

      $contador = 0;

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "id" => $id ,
            "id_cronograma" => $id_cronograma ,
            "id_tipo" => $id_tipo ,
            "tipo" => $tipo ,
            "codigo" => $codigo ,
            "capital" => $capital ,
            "interes" => $interes ,
            "interes_considerado" => $interes_considerado ,
            "monto_total" => $monto_total ,
            "monto_pendiente" => $monto_pendiente ,
            "fecha_vencimiento" => $fecha_vencimiento ,
            "pagar" => 0 ,
            "fecha_cancelacion" => $fecha_cancelacion ,
            "estado" => $estado ,
            "id_estado" => $id_estado ,
          );
          array_push($cronograma["cuotas"],$items);
      }

      return $cronograma;

    }

    function seleccionar_cuotas_pagar_SIN_directa(){
      $query = "CALL sp_listarcobranzasposiblescuotasSINdirecta(?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->monto);
      $result->bindParam(3, $this->id_transaccion);
      $result->bindParam(4, $this->solo_directas);
      $result->bindParam(5, $this->fecha_referencia);
      $result->bindParam(6, $this->id_cobranza);

      $result->execute();

      $cronograma=array();
      $cronograma["cuotas"]=array();

      $contador = 0;

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
            "id" => $id ,
            "id_cronograma" => $id_cronograma ,
            "id_tipo" => $id_tipo ,
            "tipo" => $tipo ,
            "codigo" => $codigo ,
            "capital" => $capital ,
            "interes" => $interes ,
            "interes_considerado" => $interes_considerado ,
            "monto_total" => $monto_total ,
            "monto_pendiente" => $monto_pendiente ,
            "fecha_vencimiento" => $fecha_vencimiento ,
            "pagar" => 0 ,
            "fecha_cancelacion" => $fecha_cancelacion ,
            "estado" => $estado ,
            "id_estado" => $id_estado ,
          );
          array_push($cronograma["cuotas"],$items);
      }

      return $cronograma;
    }

    function seleccionar_cuotas_pagadas_planilla(){
      $query = "CALL sp_listarcobranzasrealizadasplanilla(?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cabecera);
      $result->bindParam(2, $this->cliente);

      $result->execute();

      $cronograma=array();
      $cronograma["cuotas"]=array();

      $contador = 0;
      $comodin = $this->monto ;

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          if( $comodin > $monto_pendiente) {
            $pagar = $monto_pendiente ;
            $comodin = ROUND($comodin - $monto_pendiente ,2) ;
          } else {
            $pagar = $comodin ;
            $comodin = 0 ;
          }
          $items = array (
            "id" => $id ,
            "id_cronograma" => $id_cronograma ,
            "id_tipo" => $id_tipo ,
            "tipo" => $tipo ,
            "codigo" => $codigo ,
            "capital" => $capital ,
            "interes" => $interes ,
            "monto_total" => $monto_total ,
            "monto_pendiente" => $monto_pendiente ,
            "fecha_vencimiento" => $fecha_vencimiento ,
            "pagar" => $pagar ,
            "fecha_cancelacion" => $fecha_cancelacion ,
            "estado" => $estado ,
            "id_estado" => $id_estado ,
          );
          array_push($cronograma["cuotas"],$items);
      }

      return $cronograma;

    }

    function create_detalle(){
      $query = "CALL sp_crearcobranzadetalle(
        :prcobranzadirecta,
        :prcobranzaarchivos,
        :prcobranzajudicial,
        :prcobranzamanual,
        :prcreditocronograma,
        :prventacronograma,
        :prmonto,
        :prfecha
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcobranzadirecta", $this->cobranza_directa);
      $result->bindParam(":prcobranzaarchivos", $this->cobranza_archivos);
      $result->bindParam(":prcobranzajudicial", $this->cobranza_judicial);
      $result->bindParam(":prcobranzamanual", $this->cobranza_manual);
      $result->bindParam(":prcreditocronograma", $this->credito_cronograma);
      $result->bindParam(":prventacronograma", $this->venta_cronograma);
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prfecha", $this->fecha);

      $this->cobranza_directa=htmlspecialchars(strip_tags($this->cobranza_directa));
      $this->cobranza_archivos=htmlspecialchars(strip_tags($this->cobranza_archivos));
      $this->cobranza_judicial=htmlspecialchars(strip_tags($this->cobranza_judicial));
      $this->cobranza_manual=htmlspecialchars(strip_tags($this->cobranza_manual));
      $this->credito_cronograma=htmlspecialchars(strip_tags($this->credito_cronograma));
      $this->venta_cronograma=htmlspecialchars(strip_tags($this->venta_cronograma));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function create_detalle_array($tipo){
      $query = "CALL sp_crearcobranzadetalle(
        :prcobranzadirecta,
        :prcobranzaarchivos,
        :prcobranzajudicial,
        :prcobranzamanual,
        :prcreditocronograma,
        :prventacronograma,
        :prmonto,
        :prfecha
      )";

      $array = (object) array(
        "id" => 0 ,
        "id_tipo" => 0 ,
        "id_cronograma" => 0 ,
        "pagar" => 0
      );
      array_unshift($this->detalle_cabecera, $array);

      foreach ($this->detalle_cabecera as $item) {
        if ( $item->pagar >= 0 ) {
          $cobranza_directa = 0 ;
          $cobranza_archivos = 0 ;
          $cobranza_judicial = 0 ;
          $cobranza_manual = 0 ;
          
          if( $tipo == 1 && $item->pagar > 0 ) {
            $cobranza_directa = $this->id_cobranza ;
          }
          if( $tipo == 2 && $item->pagar > 0 ) {
            $cobranza_archivos = $item->id ;
          }
  
          if( $item->id_tipo == 3 ) {
            $venta_cronograma = $item->id_cronograma ;
            $credito_cronograma = 0;
          } else {
            $venta_cronograma = 0 ;
            $credito_cronograma = $item->id_cronograma ;
          }
  
          $monto = $item->pagar ;
          $fecha = $this->fecha ;
  
          $result = $this->conn->prepare($query);
  
          $result->bindParam(":prcobranzadirecta", $cobranza_directa);
          $result->bindParam(":prcobranzaarchivos", $cobranza_archivos);
          $result->bindParam(":prcobranzajudicial", $cobranza_judicial);
          $result->bindParam(":prcobranzamanual", $cobranza_manual);
          $result->bindParam(":prcreditocronograma", $credito_cronograma);
          $result->bindParam(":prventacronograma", $venta_cronograma);
          $result->bindParam(":prmonto", $monto);
          $result->bindParam(":prfecha", $fecha);
  
          $cobranza_directa=htmlspecialchars(strip_tags($cobranza_directa));
          $cobranza_archivos=htmlspecialchars(strip_tags($cobranza_archivos));
          $cobranza_judicial=htmlspecialchars(strip_tags($cobranza_judicial));
          $cobranza_manual=htmlspecialchars(strip_tags($cobranza_manual));
          $credito_cronograma=htmlspecialchars(strip_tags($credito_cronograma));
          $venta_cronograma=htmlspecialchars(strip_tags($venta_cronograma));
          $monto=htmlspecialchars(strip_tags($monto));
          $fecha=htmlspecialchars(strip_tags($fecha));

          $result->execute();

          // if($result->execute()) {
          //   echo "Ok." . " - " . $cobranza_directa . " - " .$cobranza_archivos . " - " .$cobranza_judicial . " - " .$credito_cronograma . " - " .$venta_cronograma . " - " .$monto . " - " .$fecha . "\n" ;
          // } else {
          //   echo "Err." . " - " . $cobranza_directa . " - " .$cobranza_archivos . " - " .$cobranza_judicial . " - " .$credito_cronograma . " - " .$venta_cronograma . " - " .$monto . " - " .$fecha . "\n" ;
          // };
        }
      }

    }

    function delete_cobranza_directa(){
      $query = "CALL sp_eliminarcobranzadirecta(
        :prcobranzadirecta
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcobranzadirecta", $this->cobranza_directa);

      $this->cobranza_directa=htmlspecialchars(strip_tags($this->cobranza_directa));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function read_cobranzasxcliente() {
      $query = "CALL sp_listarcobranzasxcliente(?,?,?,?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->subsede);
      $result->bindParam(4, $this->institucion);
      $result->bindParam(5, $this->tipo_pago);
      $result->bindParam(6, $this->fecha_inicio);
      $result->bindParam(7, $this->fecha_fin);
      $result->bindParam(8, $this->nivel_mora);
      $result->bindParam(9, $this->numero_pagina);
      $result->bindParam(10, $this->total_pagina);

      $result->execute();
      
      $cobranza=array();
      $cobranza["cobranza"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);
      
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $items = array (
              "numero"=>$contador,
              "id_cliente"=>$id_cliente,
              "cliente"=>$cliente,
              "cliente_dni"=>$cliente_dni,
              "tipo_pago"=>$tipo_pago,
              "subsede"=>$subsede,
              "sede"=>$sede,
              "institucion"=>$institucion,
              "monto_pendiente"=>$monto_pendiente,
          );
          array_push($cobranza["cobranza"],$items);
      }

      return $cobranza;
    }

    // Estas funciones retornan la deuda acumulada de los clientes
    function contar_cobranzasxcliente(){

      $query = "CALL sp_listarcobranzasxclientecontar(?,?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->subsede);
      $result->bindParam(4, $this->institucion);
      $result->bindParam(5, $this->tipo_pago);
      $result->bindParam(6, $this->fecha_inicio);
      $result->bindParam(7, $this->fecha_fin);
      $result->bindParam(8, $this->nivel_mora);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function read_cobranzasxclienteunlimited() {

      $spreadsheet = new Spreadsheet();
      $sheet = $spreadsheet->getActiveSheet();

      $query = "CALL sp_listarcobranzasxclienteunlimited(?,?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->subsede);
      $result->bindParam(4, $this->institucion);
      $result->bindParam(5, $this->tipo_pago);
      $result->bindParam(6, $this->fecha_inicio);
      $result->bindParam(7, $this->fecha_fin);
      $result->bindParam(8, $this->nivel_mora);

      $result->execute();
      
      $archivo = "" ;
      $cobranza=array();
      $cobranza["cobranza"]=array();

      $contador = 1;

      $sheet->setCellValue('A1', 'N°');
      $sheet->setCellValue('B1', 'DNI');
      $sheet->setCellValue('C1', 'Codigo');
      $sheet->setCellValue('D1', 'Cliente');
      $sheet->setCellValue('E1', 'Tipo de pago');
      $sheet->setCellValue('F1', 'Subsede');
      $sheet->setCellValue('G1', 'Sede');
      $sheet->setCellValue('H1', 'Institución');
      $sheet->setCellValue('I1', 'Monto pendiente');

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;

          $sheet->setCellValue('A' . $contador, $contador-1 );
          $sheet->setCellValue('B' . $contador, $cliente_dni );
          $sheet->setCellValue('C' . $contador, $cliente_codigo );
          $sheet->setCellValue('D' . $contador, $cliente );
          $sheet->setCellValue('E' . $contador, $tipo_pago );
          $sheet->setCellValue('F' . $contador, $subsede );
          $sheet->setCellValue('G' . $contador, $sede );
          $sheet->setCellValue('H' . $contador, $institucion );
          $sheet->setCellValue('I' . $contador, $monto_pendiente );
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

    // Estas funciones retornan las cuotas por cliente
    function read_cronogramaxcliente() {
      $query = "CALL sp_listarcronogramaxcliente(?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->fecha_inicio);
      $result->bindParam(3, $this->fecha_fin);
      $result->bindParam(4, $this->numero_pagina);
      $result->bindParam(5, $this->total_pagina);

      $result->execute();
      
      $cronograma=array();
      $cronograma["cronograma"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);
      
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $contador=$contador+1;
        $items = array (
          "numero"=>$contador,
          "id_cronograma"=>$id_cronograma,
          "id_tipo"=>$id_tipo,
          "tipo"=>$tipo,
          "codigo"=>$codigo,
          "id_tipo_pago"=>$id_tipo_pago,
          "tipo_pago"=>$tipo_pago,
          "monto_total"=>$monto_total,
          "monto_pendiente"=>$monto_pendiente,
          "fecha_vencimiento"=>$fecha_vencimiento,
          "fecha_cancelacion"=>$fecha_cancelacion,
          "id_estado"=>$id_estado,
          "estado"=>$estado,
        );
        array_push($cronograma["cronograma"],$items);
      }

      return $cronograma;
    }

    function contar_cronogramaxcliente(){

      $query = "CALL sp_listarcronogramaxclientecontar(?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->fecha_inicio);
      $result->bindParam(3, $this->fecha_fin);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function read_cronograma_vencido() {
      $query = "CALL sp_listarcronogramavencidosxcliente(?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->numero_pagina);
      $result->bindParam(3, $this->total_pagina);

      $result->execute();
      
      $cronograma=array();
      $cronograma["cronograma"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);
      
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $contador=$contador+1;
        $items = array (
          "numero"=>$contador,
          "id_cronograma"=>$id_cronograma,
          "id_tipo"=>$id_tipo,
          "tipo"=>$tipo,
          "codigo"=>$codigo,
          "id_tipo_pago"=>$id_tipo_pago,
          "tipo_pago"=>$tipo_pago,
          "monto_total"=>$monto_total,
          "monto_pendiente"=>$monto_pendiente,
          "fecha_vencimiento"=>$fecha_vencimiento,
          "estado"=>$estado,
        );
        array_push($cronograma["cronograma"],$items);
      }

      return $cronograma;
    }

    function contar_cronograma_vencido(){

      $query = "CALL sp_listarcronogramavencidosxclientecontar(?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    // Esta función recibe de por sí un parámetro 1
    function contar_cobranzasxcliente_morosos1(){

      $query = "CALL sp_listarcobranzasxclientecontar(?,?,?,?,?,?,?,1)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->subsede);
      $result->bindParam(4, $this->institucion);
      $result->bindParam(5, $this->tipo_pago);
      $result->bindParam(6, $this->fecha_inicio);
      $result->bindParam(7, $this->fecha_fin);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    // Esta función recibe de por sí un parámetro 1
    function contar_cobranzasxcliente_morosos2(){

      $query = "CALL sp_listarcobranzasxclientecontar(?,?,?,?,?,?,?,2)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->sede);
      $result->bindParam(3, $this->subsede);
      $result->bindParam(4, $this->institucion);
      $result->bindParam(5, $this->tipo_pago);
      $result->bindParam(6, $this->fecha_inicio);
      $result->bindParam(7, $this->fecha_fin);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function crear_cobranza_manual(){
      $query = "CALL sp_crearcobranzamanual(
        :prcliente,
        :prtipocobranza,
        :prfecha,
        :prcomprobante,
        :prvendedor,
        :prtotal,
        :probservacion
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcliente", $this->cliente);
      $result->bindParam(":prtipocobranza", $this->tipo_cobranza);
      $result->bindParam(":prfecha", $this->fecha);
      $result->bindParam(":prcomprobante", $this->comprobante);
      $result->bindParam(":prvendedor", $this->vendedor);
      $result->bindParam(":prtotal", $this->monto);
      $result->bindParam(":probservacion", $this->observaciones);

      $this->cliente=htmlspecialchars(strip_tags($this->cliente));
      $this->tipo_cobranza=htmlspecialchars(strip_tags($this->tipo_cobranza));
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->comprobante=htmlspecialchars(strip_tags($this->comprobante));
      $this->vendedor=htmlspecialchars(strip_tags($this->vendedor));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->observaciones=htmlspecialchars(strip_tags($this->observaciones));

      if($result->execute())
      {
          $row = $result->fetch(PDO::FETCH_ASSOC);
          $this->id_cobranza=$row['id'];
          return true;
      }
      return false;
    }

    function read_cobranza_manual_tipos(){
      $query = "CALL sp_listarcobranzamanualtipo(?,?,?)";
  
      $result = $this->conn->prepare($query);
  
      $result->bindParam(1, $this->nombre);
      $result->bindParam(2, $this->numero_pagina);
      $result->bindParam(3, $this->total_pagina);
  
      $result->execute();
  
      $tipos_listado=array();
      $tipos_listado["tipos"]=array();
  
      $contador = $this->total_pagina*($this->numero_pagina-1);
  
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $contador = $contador+1;
        $tipo_fila = array(
          "numero"=>$contador,
          "id"=>$id,
          "nombre"=>$nombre,
        );
        array_push($tipos_listado["tipos"],$tipo_fila);
      }
  
      return $tipos_listado;
    }
  
    function contar_cobranza_manual_tipos(){

        $query = "CALL sp_listarcobranzamanualtipocontar(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function read_cobranzas_manuales() {
      $query = "CALL sp_listarcobranzasmanuales(?,?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->cliente_dni);
      $result->bindParam(3, $this->vendedor);
      $result->bindParam(4, $this->tipo);
      $result->bindParam(5, $this->fecha_inicio);
      $result->bindParam(6, $this->fecha_fin);
      $result->bindParam(7, $this->numero_pagina);
      $result->bindParam(8, $this->total_pagina);

      $result->execute();
      
      $cronograma=array();
      $cronograma["cobranzas"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);
      
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $contador=$contador+1;
        $items = array (
          "numero"=>$contador,
          "id" => $id ,
          "id_cliente" => $id_cliente ,
          "cliente" => $cliente ,
          "id_tipo" => $id_tipo ,
          "tipo" => $tipo ,
          "fecha" => $fecha ,
          "comprobante" => $comprobante ,
          "id_vendedor" => $id_vendedor ,
          "vendedor" => $vendedor ,
          "total" => $total ,
          "observaciones" => $observaciones ,
        );
        array_push($cronograma["cobranzas"],$items);
      }

      return $cronograma;
    }

    function contar_cobranzas_manuales(){

      $query = "CALL sp_listarcobranzasmanualescontar(?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->cliente_dni);
      $result->bindParam(3, $this->vendedor);
      $result->bindParam(4, $this->tipo);
      $result->bindParam(5, $this->fecha_inicio);
      $result->bindParam(6, $this->fecha_fin);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function read_cobranzas_manualesxID() {
      $query = "CALL sp_listarcobranzasmanualesxid(?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->id_cobranza);
      $Detalle = $this->read_cobranza_detallexmanual($this->id_cobranza);

      $result->execute();
      
      $contador = $this->total_pagina*($this->numero_pagina-1);
      
      $row = $result->fetch(PDO::FETCH_ASSOC);
      $cronograma = array (
        "id" => $row['id'] ,
        "id_cliente" => $row['id_cliente'] ,
        "cliente" => $row['cliente'] ,
        "id_tipo" => $row['id_tipo'] ,
        "tipo" => $row['tipo'] ,
        "fecha" => $row['fecha'] ,
        "comprobante" => $row['comprobante'] ,
        "id_vendedor" => $row['id_vendedor'] ,
        "vendedor" => $row['vendedor'] ,
        "total" => $row['total'] ,
        "observaciones" => $row['observaciones'] ,
        "detalle" => $Detalle
      );

      return $cronograma;
    }

    function read_cobranza_detallexmanual($id_cobranza){

      $query ="call sp_listarcobranzadetallexmanual(?)";
        
      $result = $this->conn->prepare($query);
      
      $result->bindParam(1, $id_cobranza);

      $result->execute();
      $cuentas=array();

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $items = array (
          "id_detalle" => $row['id_detalle'] ,
          "tipo" => $row['tipo'] ,
          "codigo" => $row['codigo'] ,
          "id_cronograma" => $row['id_cronograma'] ,
          "id_transaccion" => $row['id_transaccion'] ,
          "fecha_vencimiento" => $row['fecha_vencimiento'] ,
          "monto_total" => $row['monto_total'] ,
          "monto_pendiente" => $row['monto_pendiente'] ,
          "monto" => $row['monto'] ,
          "pagar" => $row['monto'] ,
          "id_estado" => $row['id_estado'] ,
        );
        array_push($cuentas,$items);
      };

      return $cuentas;
    }

    function delete_cobranza_manual(){
      $query = "CALL sp_eliminarcobranzamanual(
        :prcobranzamanual
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcobranzamanual", $this->cobranza_manual);

      $this->cobranza_manual=htmlspecialchars(strip_tags($this->cobranza_manual));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    // DEPRECIADO
    // Esta función asigna el cronograma en el mismo campo de cuota
    // esta es la forma 'antigua' 
    function actualizar_interes_cronograma(){
      $query = "CALL sp_actualizarinterescronograma(
        :prtipo,
        :prtransaccion,
        :prcronograma,
        :printeres
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prtipo", $this->tipo_transaccion);
      $result->bindParam(":prtransaccion", $this->transaccion);
      $result->bindParam(":prcronograma", $this->cronograma);
      $result->bindParam(":printeres", $this->interes);

      $this->tipo_transaccion=htmlspecialchars(strip_tags($this->tipo_transaccion));
      $this->transaccion=htmlspecialchars(strip_tags($this->transaccion));
      $this->cronograma=htmlspecialchars(strip_tags($this->cronograma));
      $this->interes=htmlspecialchars(strip_tags($this->interes));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    // DEPRECIADO
    // Esta función se utiliza cuando se sube un pago masivo, el procedimiento
    // calcula y paga la cuota correspondiente
    // Luego este procedimiento se reemplazó por los dos que siguen ------>
    function crear_regularizacion_pago_credito(){
      $query = "CALL sp_crearpagocredito(
        :prcobranzamanual,
        :prcredito,
        :prmonto,
        :prfecha
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcobranzamanual", $this->cobranza_manual);
      $result->bindParam(":prcredito", $this->credito);
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prfecha", $this->fecha);

      $this->cobranza_manual=htmlspecialchars(strip_tags($this->cobranza_manual));
      $this->credito=htmlspecialchars(strip_tags($this->credito));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    // Esta función crea una cobranza manual desde pagos pasivos
    // Aquí se recalculan los intereses luego de que se hace el pago
    function create_cobranza_manual_credito(){
      $query = "CALL sp_crearcobranzamanualcredito(
        :prcredito,
        :prtipocobranza,
        :prfecha,
        :prcomprobante,
        :prtotal,
        :probservacion,
        :prusuarioalvis,
        :prfechaactual
      )";

      $result = $this->conn->prepare($query);

      $this->credito=htmlspecialchars(strip_tags($this->credito));
      $this->tipo_cobranza=htmlspecialchars(strip_tags($this->tipo_cobranza));
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->comprobante=htmlspecialchars(strip_tags($this->comprobante));
      $this->total=htmlspecialchars(strip_tags($this->total));
      $this->observacion=htmlspecialchars(strip_tags($this->observacion));
      $this->usuario_alvis=htmlspecialchars(strip_tags($this->usuario_alvis));

      
      if ( $this->delete_cobranzas_manualesxtransaccion(1, $this->credito) ) {
        $momento = date("Y-m-d H:i:s");
        $result->bindParam(":prcredito", $this->credito);
        $result->bindParam(":prtipocobranza", $this->tipo_cobranza);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prcomprobante", $this->comprobante);
        $result->bindParam(":prtotal", $this->total);
        $result->bindParam(":probservacion", $this->observacion);
        $result->bindParam(":prusuarioalvis", $this->usuario_alvis);
        $result->bindParam(":prfechaactual", $momento);

        if($result->execute())
        {
          return true;
        }
        return false;
      } else {
        return false;
      }
    }

    // Esta función crea una cobranza manual desde pagos pasivos
    // Aquí se recalculan los intereses luego de que se hace el pago
    function create_cobranza_manual_venta(){
      $query = "CALL sp_crearcobranzamanualventa(
        :prventa,
        :prtipocobranza,
        :prfecha,
        :prcomprobante,
        :prtotal,
        :probservacion,
        :prusuarioalvis,
        :prfechaactual
      )";

      $result = $this->conn->prepare($query);

      $this->venta=htmlspecialchars(strip_tags($this->venta));
      $this->tipo_cobranza=htmlspecialchars(strip_tags($this->tipo_cobranza));
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->comprobante=htmlspecialchars(strip_tags($this->comprobante));
      $this->total=htmlspecialchars(strip_tags($this->total));
      $this->observacion=htmlspecialchars(strip_tags($this->observacion));
      $this->usuario_alvis=htmlspecialchars(strip_tags($this->usuario_alvis));

      
      if ( $this->delete_cobranzas_manualesxtransaccion(1, $this->venta) ) {
        $momento = date("Y-m-d H:i:s");
        $result->bindParam(":prventa", $this->venta);
        $result->bindParam(":prtipocobranza", $this->tipo_cobranza);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prcomprobante", $this->comprobante);
        $result->bindParam(":prtotal", $this->total);
        $result->bindParam(":probservacion", $this->observacion);
        $result->bindParam(":prusuarioalvis", $this->usuario_alvis);
        $result->bindParam(":prfechaactual", $momento);

        if($result->execute())
        {
          return true;
        }
        return false;
      } else {
        return false;
      }
    }

    // Esta función crea una cobranza manual desde pagos pasivos
    // Aquí se recalculan los intereses luego de que se hace el pago
    function create_cobranza_manual_credito_array(){
      $query = "CALL sp_crearcobranzamanualcredito(
        :prcredito,
        :prtipocobranza,
        :prfecha,
        :prcomprobante,
        :prtotal,
        :probservacion,
        :prusuarioalvis,
        :prfechaactual
      )";

      $exito = 0;
      $error = 0;
      
      $detalle = json_decode($this->informacion) ;

      $this->credito=htmlspecialchars(strip_tags($this->credito));
      $this->usuario_alvis=htmlspecialchars(strip_tags($this->usuario_alvis));

      if ( $this->delete_cobranzas_manualesxtransaccion(1, $this->credito) ) {
        foreach($detalle as $elemento) {
          $momento = date("Y-m-d H:i:s");
  
          $result = $this->conn->prepare($query);
  
          $result->bindParam(":prcredito", $this->credito);
          $result->bindParam(":prtipocobranza", $elemento->tipo_cobranza);
          $result->bindParam(":prfecha", $elemento->fecha);
          $result->bindParam(":prcomprobante", $elemento->comprobante);
          $result->bindParam(":prtotal", $elemento->total);
          $result->bindParam(":probservacion", $elemento->observacion);
          $result->bindParam(":prusuarioalvis", $this->usuario_alvis);
          $result->bindParam(":prfechaactual", $momento);
            
          // ob_start();
          // echo($elemento->tipo_cobranza) ;
          // echo($elemento->fecha) ;
          // echo($elemento->comprobante) ;
          // echo($elemento->total) ;
          // echo($elemento->observacion) ;
          // error_log(ob_get_clean(), 4) ;
  
          $elemento->tipo_cobranza=htmlspecialchars(strip_tags($elemento->tipo_cobranza));
          $elemento->fecha=htmlspecialchars(strip_tags($elemento->fecha));
          $elemento->comprobante=htmlspecialchars(strip_tags($elemento->comprobante));
          $elemento->total=htmlspecialchars(strip_tags($elemento->total));
          $elemento->observacion=htmlspecialchars(strip_tags($elemento->observacion));
  
          if ( $result->execute() ) {
            $exito = $exito + 1 ;
          } else {
            $error = $error + 1 ;
          }
        } ;
  
        return array("exito"=> $exito, "error"=> $error);
      } else {
        return false ;
      }
    }

    // Esta función crea una cobranza manual desde pagos pasivos
    function create_cobranza_manual_venta_array(){
      $query = "CALL sp_crearcobranzamanualventa(
        :prventa,
        :prtipocobranza,
        :prfecha,
        :prcomprobante,
        :prtotal,
        :probservacion,
        :prusuarioalvis,
        :prfechaactual
      )";

      $exito = 0;
      $error = 0;
      
      $detalle = json_decode($this->informacion) ;

      $this->venta=htmlspecialchars(strip_tags($this->venta));
      $this->usuario_alvis=htmlspecialchars(strip_tags($this->usuario_alvis));

      if ( $this->delete_cobranzas_manualesxtransaccion(2, $this->venta) ) {
        foreach($detalle as $elemento) {
          $momento = date("Y-m-d H:i:s");
  
          $result = $this->conn->prepare($query);
  
          $result->bindParam(":prventa", $this->venta);
          $result->bindParam(":prtipocobranza", $elemento->tipo_cobranza);
          $result->bindParam(":prfecha", $elemento->fecha);
          $result->bindParam(":prcomprobante", $elemento->comprobante);
          $result->bindParam(":prtotal", $elemento->total);
          $result->bindParam(":probservacion", $elemento->observacion);
          $result->bindParam(":prusuarioalvis", $this->usuario_alvis);
          $result->bindParam(":prfechaactual", $momento);

          $elemento->tipo_cobranza=htmlspecialchars(strip_tags($elemento->tipo_cobranza));
          $elemento->fecha=htmlspecialchars(strip_tags($elemento->fecha));
          $elemento->comprobante=htmlspecialchars(strip_tags($elemento->comprobante));
          $elemento->total=htmlspecialchars(strip_tags($elemento->total));
          $elemento->observacion=htmlspecialchars(strip_tags($elemento->observacion));
  
          if ( $result->execute() ) {
            $exito = $exito + 1 ;
          } else {
            $error = $error + 1 ;
          }
        } ;
  
        return array("exito"=> $exito, "error"=> $error);
      } else {
        return false ;
      }
    }
   
    function delete_cobranzas_manualesxtransaccion(
      $tipo_transaccion ,
      $id_transaccion
    ){
      $query = "CALL sp_eliminarcobranzasmasivasxtransaccion(
        :prtipotransaccion,
        :prtransaccion
      )";

      $result = $this->conn->prepare($query);
      
      // ob_start();
      // echo($tipo_transaccion) ;
      // echo($id_transaccion) ;
      // error_log(ob_get_clean(), 4) ;

      $result->bindParam(":prtipotransaccion", $tipo_transaccion);
      $result->bindParam(":prtransaccion", $id_transaccion);

      if($result->execute())
      {
        // ob_start();
        // echo(1) ;
        // error_log(ob_get_clean(), 4) ;
        return true;
      }
      // ob_start();
      // echo(2) ;
      // error_log(ob_get_clean(), 4) ;
      return false;
    }
 
    function read_liquidaciones() {
      $query = "CALL sp_listarliquidaciones(?,?,?,?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->tipo_transaccion);
      $result->bindParam(2, $this->codigo);
      $result->bindParam(3, $this->cliente_dni);
      $result->bindParam(4, $this->cliente);
      $result->bindParam(5, $this->fecha_inicio);
      $result->bindParam(6, $this->fecha_fin);
      $result->bindParam(7, $this->usuario);
      $result->bindParam(8, $this->numero_pagina);
      $result->bindParam(9, $this->total_pagina);
      $result->bindParam(10, $this->orden);

      $result->execute();
      
      $cronograma=array();
      $cronograma["cobranzas"]=array();

      $contador = $this->total_pagina*($this->numero_pagina-1);
      
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
        extract($row);
        $contador=$contador+1;
        $items = array (
          "numero" => $contador ,
          "id_liquidacion" => $id_liquidacion ,
          "id_tipo" => $id_tipo ,
          "tipo" => $tipo ,
          "codigo" => $codigo ,
          "cliente_dni" => $cliente_dni ,
          "cliente_nombre" => $cliente_nombre ,
          "id_transaccion" => $id_transaccion ,
          "monto" => $monto ,
          "fecha" => $fecha ,
          "id_usuario" => $id_usuario ,
          "usuario" => $usuario ,
          "total_pagado" => $total_pagado ,
        );
        array_push($cronograma["cobranzas"],$items);
      }

      return $cronograma;
    }

    function read_liquidaciones_contar(){

      $query = "CALL sp_listarliquidacionescontar(?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->tipo_transaccion);
      $result->bindParam(2, $this->codigo);
      $result->bindParam(3, $this->cliente_dni);
      $result->bindParam(4, $this->cliente);
      $result->bindParam(5, $this->fecha_inicio);
      $result->bindParam(6, $this->fecha_fin);
      $result->bindParam(7, $this->usuario);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

    function create_liquidacion() {
      $query = "CALL sp_crearliquidacion(
        :prtipo,
        :prtransaccion,
        :prmonto,
        :prfecha,
        :prusuario,
        :probservacion
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prtipo", $this->tipo) ;
      $result->bindParam(":prtransaccion", $this->transaccion) ;
      $result->bindParam(":prmonto", $this->monto) ;
      $result->bindParam(":prfecha", $this->fecha) ;
      $result->bindParam(":prusuario", $this->usuario) ;
      $result->bindParam(":probservacion", $this->observaciones) ;

      $this->tipo = htmlspecialchars(strip_tags($this->tipo)) ;
      $this->transaccion = htmlspecialchars(strip_tags($this->transaccion)) ;
      $this->monto = htmlspecialchars(strip_tags($this->monto)) ;
      $this->fecha = htmlspecialchars(strip_tags($this->fecha)) ;
      $this->usuario = htmlspecialchars(strip_tags($this->usuario)) ;
      $this->observaciones = htmlspecialchars(strip_tags($this->observaciones)) ;

      if($result->execute())
      {
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $this->id_liquidacion=$row['id'];
        return true;
      }
      return false;
    }
  }

?>