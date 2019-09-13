<?php

  Class Cobranzas{

    private $conn;
          
    public $path = '../uploads/planilla-descuentos/';
    public $path_cobros = '../uploads/planilla-cobros/';

    public $id_cobranza;
    public $total_resultado;
    public $archivo;
    public $contenido;

    public $cobranza_directa;
    public $cobranza_archivos;
    public $cobranza_judicial;
    public $credito_cronograma;
    public $venta_cronograma;

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
    public $numero_pagina;
    public $total_pagina;
    public $fecha;
    public $banco;
    public $cuenta;
    public $operacion;
    public $solo_directas;
    public $observaciones;
    public $detalle_cabecera;

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
              "id"=>$id,
              "tipo"=>$tipo,
              "codigo"=>$codigo,
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
            "monto" => $monto ,
            "fecha_pago" => $fecha_pago ,
            "documento" => $documento ,
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

        foreach ($this->detalle_cabecera as $item) {
          // echo "Tipo:" . $item->id_tipo . "/n" ;
          if( $item->considerar ){
            if( $item->id_tipo == 3 ) {
              // echo "TipoV:" . $item->id_tipo . "/n" ;
              $this->create_archivos_detalle($item->id_cliente, 0, $item->id, $item->monto_pendiente) ;
            } else {
              // echo "TipoC:" . $item->id_tipo . "/n" ;
              $this->create_archivos_detalle($item->id_cliente, $item->id, 0, $item->monto_pendiente) ;
            }
          }
        }
        
        return true;
      }
      return false;
    }

    function create_archivos_detalle($cliente, $credito_cronongrama, $venta_cronograma, $monto){
      $query = "CALL sp_crearcobranzaarchivosdetalle(
        :prcobranza,
        :prcliente,
        :prcreditocronograma,
        :prventacronograma,
        :prmonto
      )";

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
        echo "1-ParamsOK:" . " id: ".$this->id_cobranza . " cliente: " . $cliente . " cc: " . $credito_cronongrama . " vc: " . $venta_cronograma . " monto: " . $monto . "\n";
        return true;
      } else {
        echo "ParamsErr:" . " id: ".$this->id_cobranza . " cliente: " . $cliente . " cc: " . $credito_cronongrama . " vc: " . $venta_cronograma . " monto: " . $monto . "\n";
        return false;
      }
    
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
            "archivo"=>$archivo
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

    function read_cobranza_directa(){
      $query = "CALL sp_listarcobranzadirecta(?,?,?,?,?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->banco);
      $result->bindParam(3, $this->operacion);
      $result->bindParam(4, $this->fecha_inicio);
      $result->bindParam(5, $this->fecha_fin);
      $result->bindParam(6, $this->numero_pagina);
      $result->bindParam(7, $this->total_pagina);
      $result->bindParam(8, $this->orden);

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
            "numero_operacion"=>$numero_operacion,
            "monto"=>$monto
          );
          array_push($cronograma["cobranzas"],$items);
      }

      return $cronograma;
    
    }

    function contar_cobranza_directa(){

      $query = "CALL sp_listarcobranzadirectacontar(?,?,?,?,?)";
      
      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->banco);
      $result->bindParam(3, $this->operacion);
      $result->bindParam(4, $this->fecha_inicio);
      $result->bindParam(5, $this->fecha_fin);

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
        "solo_directas" => $row['solo_directas'] ,
        "archivo" => $row['archivo'] ,
        "observaciones" => $row['observaciones'] ,
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
        :prmonto,
        :prestricto,
        :prarchivo,
        :probservaciones
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prfecha", $this->fecha);
      $result->bindParam(":prcliente", $this->cliente);
      $result->bindParam(":prcuenta", $this->cuenta);
      $result->bindParam(":properacion", $this->operacion);
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prestricto", $this->solo_directas);
      $result->bindParam(":prarchivo", $this->archivo);
      $result->bindParam(":probservaciones", $this->observaciones);

      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->cliente=htmlspecialchars(strip_tags($this->cliente));
      $this->cuenta=htmlspecialchars(strip_tags($this->cuenta));
      $this->operacion=htmlspecialchars(strip_tags($this->operacion));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->solo_directas=htmlspecialchars(strip_tags($this->solo_directas));
      $this->archivo=htmlspecialchars(strip_tags($this->archivo));
      $this->observaciones=htmlspecialchars(strip_tags($this->observaciones));

      if($result->execute())
      {
          while($row = $result->fetch(PDO::FETCH_ASSOC))
          {
              extract($row);
              $this->id_cobranza=$id;
          }
          return true;
      }
      return false;
    }

    function update_directa(){
      $query = "CALL sp_actualizarcobranzadirecta(
        :prid,
        :prfecha,
        :prcliente,
        :prcuenta,
        :properacion,
        :prmonto,
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
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prestricto", $this->solo_directas);
      $result->bindParam(":prarchivo", $this->archivo);
      $result->bindParam(":probservaciones", $this->observaciones);

      $this->id_cobranza=htmlspecialchars(strip_tags($this->id_cobranza));
      $this->fecha=htmlspecialchars(strip_tags($this->fecha));
      $this->cliente=htmlspecialchars(strip_tags($this->cliente));
      $this->cuenta=htmlspecialchars(strip_tags($this->cuenta));
      $this->operacion=htmlspecialchars(strip_tags($this->operacion));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->solo_directas=htmlspecialchars(strip_tags($this->solo_directas));
      $this->archivo=htmlspecialchars(strip_tags($this->archivo));
      $this->observaciones=htmlspecialchars(strip_tags($this->observaciones));

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
      $query = "CALL sp_listarcobranzasposiblescuotas(?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->monto);
      $result->bindParam(3, $this->solo_directas);

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
      $query = "CALL sp_listarcobranzasposiblescuotasSINdirecta(?,?,?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->monto);
      $result->bindParam(3, $this->solo_directas);
      $result->bindParam(4, $this->id_cobranza);

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

      $result->bindParam(1, $this->cliente);
      $result->bindParam(2, $this->monto);

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
        :prcreditocronograma,
        :prventacronograma,
        :prmonto,
        :prfecha
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcobranzadirecta", $this->cobranza_directa);
      $result->bindParam(":prcobranzaarchivos", $this->cobranza_archivos);
      $result->bindParam(":prcobranzajudicial", $this->cobranza_judicial);
      $result->bindParam(":prcreditocronograma", $this->credito_cronograma);
      $result->bindParam(":prventacronograma", $this->venta_cronograma);
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prfecha", $this->fecha);

      $this->cobranza_directa=htmlspecialchars(strip_tags($this->cobranza_directa));
      $this->cobranza_archivos=htmlspecialchars(strip_tags($this->cobranza_archivos));
      $this->cobranza_judicial=htmlspecialchars(strip_tags($this->cobranza_judicial));
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

  }

?>