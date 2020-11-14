<?php

include_once '../entities/seguimiento.php';

Class Creditos{

    private $conn;
    private $Seguimiento;

    public $id;
    public $id_credito;
    public $cliente;
    public $tipo_credito;
    public $fecha_inicio;
    public $fecha_fin;
    public $estado;
    public $documentos;

    public $monto;
    public $capital;
    public $interes_diario;
    public $interes;
    public $fecha;
    public $interes_generado;
    public $monto_pagado;
    public $fecha_cancelacion;
    public $monto_pendiente;
    public $tiempo;
    public $total_pagado;
    public $total_cuotas;
    public $codigo;
    public $numero;
    public $id_courier;
    public $courier;
    public $numero_seguimiento;
    public $id_credito_refinanciado;
    public $credito_refinanciado;
    public $sucursal;
    public $fecha_credito;
    public $autorizador;
    public $vendedor;
    public $cliente_dni;
    public $cliente_direccion;
    public $cliente_telefono;
    public $cliente_cargo;
    public $cliente_trabajo;
    public $tipo_pago;
    public $cuotas;
    public $total;
    public $pdf_foto;
    public $pdf_dni;
    public $pdf_cip;
    public $pdf_planilla;
    public $pdf_voucher;
    public $pdf_recibo;
    public $pdf_casilla;
    public $pdf_transaccion;
    public $pdf_autorizacion;
    public $pdf_tarjeta;
    public $pdf_compromiso;
    public $pdf_letra;
    public $pdf_ddjj;
    public $pdf_oficio;
    public $pdf_otros;
    public $observacion;
    public $monto_total;
    public $total_pendiente;
    public $total_pagadas;
    public $garante;
    public $cronograma;
    public $orden;
    public $numero_pagina;
    public $total_pagina;
    public $cuota_estandar ;
    public $monto_pendiente_hasta_hoy ;
    public $cumple_penalidad ;
    public $cuota_penalidad ;
    public $numero_cuotas ;
    public $monto_limite_penalidad ;
    public $monto_penalidad ;
    public $deuda_hasta_hoy ;
    public $cuotas_penalidad ;
    public $cuotas_interes ;
    public $adicional_penalidad ;
    public $pagado_interes ;
    public $estado_penalidad ;
    public $estado_interes ;
    public $tipo_cuota ;
    public $id_liquidacion ;
    public $pagado ;

    public function __construct($db){
        $this->conn = $db;
        $this->Seguimiento = new Seguimiento($db);
    }

    function read(){

        $query = "CALL sp_listarcredito(?,?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->cliente_dni);
        $result->bindParam(3, $this->tipo_credito);
        $result->bindParam(4, $this->documentos);
        $result->bindParam(5, $this->fecha_inicio);
        $result->bindParam(6, $this->fecha_fin);
        $result->bindParam(7, $this->estado);
        $result->bindParam(8, $this->numero_pagina);
        $result->bindParam(9, $this->total_pagina);
        $result->bindParam(10, $this->orden);

        $result->execute();
        
        $credito_list=array();
        $credito_list["creditos"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $items = array (
                "numero"=>$contador,
                "id"=>$id,
                "codigo"=>$codigo,
                "numero_credito"=>$numero,
                "institucion"=>$institucion,
                "sede"=>$sede,
                "subsede"=>$subsede,
                "id_cliente"=>$id_cliente,
                "cliente_nombre"=>$cliente_nombre,
                "fecha"=>$fecha,
                "tipo_pago"=>$tipo_pago,
                "numero_cuotas"=>$numero_cuotas,
                "monto_total"=>$monto_total,
                "monto_pagado"=>$monto_pagado,
                "cuota_estandar"=>$cuota_estandar,
                "monto_pendiente_hasta_hoy"=>$monto_pendiente_hasta_hoy,
                "cumple_penalidad"=>$cumple_penalidad,
                "id_tipo_credito"=>$id_tipo_credito,
                "tipo_credito"=>$tipo_credito,
                "observaciones"=>$observaciones,
                "documentos_adjuntos"=>$documentos_adjuntos,
                "documentos_totales"=>$documentos_totales,
                "numero_procesos"=>$numero_procesos,
                "cuotas_pendientes"=>$cuotas_pendientes,
                "cuotas_pagadas"=>$cuotas_pagadas,
                "ultima_fecha_pago"=>$ultima_fecha_pago,
                "estado_penalidad"=>$estado_penalidad,
                "id_liquidacion"=>$id_liquidacion,
                "pagado"=>$pagado,
                "estado"=>$estado,
            );
            array_push($credito_list["creditos"],$items);
        }

        return $credito_list;
    }

    function contar(){

        $query = "CALL sp_listarcreditocontar(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->cliente_dni);
        $result->bindParam(3, $this->tipo_credito);
        $result->bindParam(4, $this->documentos);
        $result->bindParam(5, $this->fecha_inicio);
        $result->bindParam(6, $this->fecha_fin);
        $result->bindParam(7, $this->estado);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function readxId(){

        $query ="call sp_listarcreditoxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_credito);

        $Courier=$this->Seguimiento->readxdocumento_export(2,$this->id_credito);
        $Garantes=$this->read_garantes($this->id_credito);
        $Cronograma=$this->read_cronograma_simple($this->id_credito);

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->id_tipo = $row['id_tipo'];
        $this->tipo = $row['tipo'];
        $this->id_sucursal = $row['id_sucursal'];
        $this->sucursal = $row['sucursal'];
        $this->fecha = $row['fecha'];
        $this->codigo = $row['codigo'];
        $this->numero = $row['numero'];
        $this->codigo_credito = $row['codigo_credito'];
        $this->id_autorizador = $row['id_autorizador'];
        $this->autorizador = $row['autorizador'];
        $this->id_vendedor = $row['id_vendedor'];
        $this->vendedor = $row['vendedor'];
        $this->id_cliente = $row['id_cliente'];
        $this->cliente = $row['cliente'];
        $this->cliente_direccion = $row['cliente_direccion'];
        $this->cliente_dni = $row['cliente_dni'];
        $this->cliente_telefono = $row['cliente_telefono'];
        $this->cliente_cargo = $row['cliente_cargo'];
        $this->cliente_trabajo = $row['cliente_trabajo'];
        $this->id_tipo_pago = $row['id_tipo_pago'];
        $this->tipo_pago = $row['tipo_pago'];
        $this->fecha_pago = $row['fecha_pago'];
        $this->interes_diario = $row['interes_diario'];
        $this->interes = $row['interes'];
        $this->capital = $row['capital'];
        $this->numero_cuotas = $row['numero_cuotas'];
        $this->total = $row['total'];
        $this->pdf_foto = $row['pdf_foto'];
        $this->pdf_dni = $row['pdf_dni'];
        $this->pdf_cip = $row['pdf_cip'];
        $this->pdf_planilla = $row['pdf_planilla'];
        $this->pdf_voucher = $row['pdf_voucher'];
        $this->pdf_recibo = $row['pdf_recibo'];
        $this->pdf_casilla = $row['pdf_casilla'];
        $this->pdf_transaccion = $row['pdf_transaccion'];
        $this->pdf_autorizacion = $row['pdf_autorizacion'];
        $this->pdf_tarjeta = $row['pdf_tarjeta'];
        $this->pdf_compromiso = $row['pdf_compromiso'];
        $this->pdf_letra = $row['pdf_letra'];
        $this->pdf_ddjj = $row['pdf_ddjj'];
        $this->pdf_oficio=$row['pdf_oficio'];
        $this->pdf_otros = $row['pdf_otros'];
        $this->observaciones = $row['observaciones'];
        $this->id_credito_refinanciado = $row['id_credito_refinanciado'];
        $this->cuota_estandar = $row['cuota_estandar'];
        $this->credito_refinanciado = $row['credito_refinanciado'];
        $this->monto_total = $row['monto_total'] ;
        $this->interes_generado = $row['interes_generado'] ;
        $this->monto_pagado = $row['monto_pagado'] ;
        $this->monto_pendiente = $row['monto_pendiente'] ;
        $this->monto_pendiente_hasta_hoy = $row['monto_pendiente_hasta_hoy'] ;
        $this->total_cuotas = $row['total_cuotas'] ;
        $this->total_pendiente = $row['total_pendiente'] ;
        $this->total_pagadas = $row['total_pagadas'] ;
        $this->cumple_penalidad = $row['cumple_penalidad'] ;
        $this->id_estado = $row['id_estado'];
        $this->estado = $row['estado'];
        $this->cuotas_penalidad = $row['cuotas_penalidad'];
        $this->cuotas_interes = $row['cuotas_interes'];
        $this->deuda_hasta_hoy = $row['deuda_hasta_hoy'] ;
        $this->monto_limite_penalidad = $row['monto_limite_penalidad'];
        $this->monto_penalidad = $row['monto_penalidad'];
        $this->adicional_penalidad = $row['adicional_penalidad'];
        $this->pagado_interes = $row['pagado_interes'];
        $this->estado_penalidad = $row['estado_penalidad'];
        $this->estado_interes = $row['estado_interes'];
        $this->id_liquidacion = $row['id_liquidacion'] ;
        $this->pagado = $row['pagado'] ;
        $this->courier = $Courier;
        $this->garante = $Garantes;
        // $this->cronograma = $Cronograma;
    }

    function read_garantes(){

        $query = "CALL sp_listarcreditogarante(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_credito);

        $result->execute();
        
        $transaccion_list=array();
        $transaccion_list["garantes"]=array();
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $transaccion_item = array (
                "id"=>$id,
                "id_cliente"=>$id_cliente,
                "cliente_dni"=>$cliente_dni,
                "cliente_nombre"=>$cliente_nombre,
                "cliente_telefono"=>$cliente_telefono,
                "cliente_direccion"=>$cliente_direccion,
                "dni_pdf"=>$dni_pdf,
                "cip_pdf"=>$cip_pdf,
                "planilla_pdf"=>$planilla_pdf,
            );
            array_push($transaccion_list["garantes"],$transaccion_item);
        }

        return $transaccion_list;
    }

    function read_cronogramaxId(){

        $query = "CALL sp_listarcreditocronogramaxId(?, ?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_credito);
        $result->bindParam(2, $this->orden);

        $result->execute();
        
        $credito_list=array();
        $credito_list["creditos"]=array();
        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $credito_item = array (
                "numero"=>$contador,
                "id_cronograma"=>$id_cronograma,
                "id_tipo_pago" => $id_tipo_pago ,
                "tipo_pago" => $tipo_pago ,
                "capital"=>$capital,
                "interes"=>$interes,
                "monto_cuota"=>$monto_cuota,
                "fecha_vencimiento"=>$fecha_vencimiento,
                "monto_interes"=>$monto_interes,
                "monto_pagado"=>$monto_pagado,
                "fecha_cancelacion"=>$fecha_cancelacion,
                "monto_pendiente"=>$monto_pendiente,
                "estado"=>$estado,
            );
            array_push($credito_list["creditos"],$credito_item);
        }

        return $credito_list;
    }

    function read_cronograma(){

      $query = "CALL sp_listarcreditocronograma(?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->id_credito);
      $result->bindParam(2, $this->tipo_cuota);

      $result->execute();
      
      $cronograma_list=array();
      $contador = 0;

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $cronograma_item = array (
                "numero" => $contador,
                "id_cronograma" => $id ,
                "tipo_pago" => $tipo_pago ,
                "fecha_vencimiento" => $fecha ,
                "capital" => $capital ,
                "interes" => $interes ,
                "monto" => $monto ,
                "monto_cuota" => $monto ,
                "interes_generado" => $interes_generado ,
                "monto_pagado" => $monto_pagado ,
                "fecha_cancelacion" => $fecha_cancelacion ,
                "monto_pendiente" => $monto_pendiente ,
                "estado" => $estado
          );
          array_push($cronograma_list,$cronograma_item);
      }

      return $cronograma_list;
    }

    function read_cronograma_resumen(){
        $query = "CALL sp_listarcreditocronogramaresumen(?,?)";
  
        $result = $this->conn->prepare($query) ;
 
        $result->bindParam(1, $this->id_credito) ;
        $result->bindParam(2, $this->tipo_cuota) ;
  
        $result->execute() ;
        
        $cronograma_list=array() ;
        $contador = 0 ;
  
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $cronograma_item = array (
                "id_credito" => $id_credito,
                "monto_total" => $row['monto_total'] ,
                "interes" => $row['interes'] ,
                "monto_pagado" => $row['monto_pagado'] ,
                "monto_pendiente" => $row['monto_pendiente'] ,
                "monto_pendiente_hasta_hoy" => $row['monto_pendiente_hasta_hoy'] ,
                "total_cuotas" => $row['total_cuotas'] ,
                "total_pendiente" => $row['total_pendiente'] ,
                "total_pagadas" => $row['total_pagadas'] ,
            );
            array_push($cronograma_list,$cronograma_item);
        }
        return $cronograma_list;
    }

    function read_cronograma_simple($id_credito){

      $query = "CALL sp_listarcreditocronograma(?,?)";

      $result = $this->conn->prepare($query);

      $orden = "fecha asc" ;

      $result->bindParam(1, $id_credito);
      $result->bindParam(2, $this->tipo_cuota);

      $result->execute();
      
      $cronograma_list=array();
      $contador = 0;

      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
          extract($row);
          $contador=$contador+1;
          $cronograma_item = array (
                "numero" => $contador,
                "id_cronograma" => $id ,
                "fecha_vencimiento" => $fecha ,
                "capital" => $capital ,
                "interes" => $interes ,
                "monto" => $monto ,
                "monto_cuota" => $monto ,
                "interes_generado" => $interes_generado ,
                "monto_pagado" => $monto_pagado ,
                "fecha_cancelacion" => $fecha_cancelacion ,
                "monto_pendiente" => $monto_pendiente ,
                "estado" => $estado
          );
          array_push($cronograma_list,$cronograma_item);
      }

      return $cronograma_list;
    }

    function read_tipo(){
        $query = "CALL sp_listarcreditotipo()";

        $result = $this->conn->prepare($query);
  
        $result->execute();
        
        $tipo_credito=array();
  
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $tipo_item = array (
                "id"=>$id,
                "nombre"=>$nombre,
            );
            array_push($tipo_credito,$tipo_item);
        }
  
        return $tipo_credito;
    }

    function crear(){
        $query = "CALL sp_crearcredito(
            :prtipo,
            :prsucursal,
            :prfecha,
            :prcodigo,
            :prnumero,
            :prautorizador,
            :prvendedor,
            :prcliente,
            :prclientedireccion,
            :prclientetelefono,
            :prclientecargo,
            :prclientetrabajo,
            :prtipopago,
            :prfechapago,
            :printeresdiario,
            :printeres,
            :prcapital,
            :prcuotas,
            :prtotal,
            :prpdffoto,
            :prpdfdni,
            :prpdfcip,
            :prpdfplanilla,
            :prpdfvoucher,
            :prpdfrecibo,
            :prpdfcasilla,
            :prpdftransaccion,
            :prpdfautorizacion,
            :prpdftarjeta,
            :prpdfcompromiso,
            :prpdfletra,
            :prpdfddjj,
            :prpdfoficio,
            :pdfotros,
            :probservacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prtipo", $this->tipo_credito);
        $result->bindParam(":prsucursal", $this->sucursal);
        $result->bindParam(":prfecha", $this->fecha_credito);
        $result->bindParam(":prcodigo", $this->codigo);
        $result->bindParam(":prnumero", $this->numero);
        $result->bindParam(":prautorizador", $this->autorizador);
        $result->bindParam(":prvendedor", $this->vendedor);
        $result->bindParam(":prcliente", $this->cliente);
        $result->bindParam(":prclientedireccion", $this->cliente_direccion);
        $result->bindParam(":prclientetelefono", $this->cliente_telefono);
        $result->bindParam(":prclientecargo", $this->cliente_cargo);
        $result->bindParam(":prclientetrabajo", $this->cliente_trabajo);
        $result->bindParam(":prtipopago", $this->tipo_pago);
        $result->bindParam(":prfechapago", $this->fecha_pago);
        $result->bindParam(":printeres", $this->interes);
        $result->bindParam(":printeresdiario", $this->interes_diario);
        $result->bindParam(":prcapital", $this->capital);
        $result->bindParam(":prcuotas", $this->cuotas);
        $result->bindParam(":prtotal", $this->total);
        $result->bindParam(":prpdffoto", $this->pdf_foto);
        $result->bindParam(":prpdfdni", $this->pdf_dni);
        $result->bindParam(":prpdfcip", $this->pdf_cip);
        $result->bindParam(":prpdfplanilla", $this->pdf_planilla);
        $result->bindParam(":prpdfvoucher", $this->pdf_voucher);
        $result->bindParam(":prpdfrecibo", $this->pdf_recibo);
        $result->bindParam(":prpdfcasilla", $this->pdf_casilla);
        $result->bindParam(":prpdftransaccion", $this->pdf_transaccion);
        $result->bindParam(":prpdfautorizacion", $this->pdf_autorizacion);
        $result->bindParam(":prpdftarjeta", $this->pdf_tarjeta);
        $result->bindParam(":prpdfcompromiso", $this->pdf_compromiso);
        $result->bindParam(":prpdfletra", $this->pdf_letra);
        $result->bindParam(":prpdfddjj", $this->pdf_ddjj);
        $result->bindParam(":prpdfoficio", $this->pdf_oficio);        
        $result->bindParam(":pdfotros", $this->pdf_otros);
        $result->bindParam(":probservacion", $this->observacion);

        $this->tipo_credito=htmlspecialchars(strip_tags($this->tipo_credito));
        $this->sucursal=htmlspecialchars(strip_tags($this->sucursal));
        $this->fecha_credito=htmlspecialchars(strip_tags($this->fecha_credito));
        $this->codigo=htmlspecialchars(strip_tags($this->codigo));
        $this->numero=htmlspecialchars(strip_tags($this->numero));
        $this->autorizador=htmlspecialchars(strip_tags($this->autorizador));
        $this->vendedor=htmlspecialchars(strip_tags($this->vendedor));
        $this->cliente=htmlspecialchars(strip_tags($this->cliente));
        $this->cliente_direccion=htmlspecialchars(strip_tags($this->cliente_direccion));
        $this->cliente_telefono=htmlspecialchars(strip_tags($this->cliente_telefono));
        $this->cliente_cargo=htmlspecialchars(strip_tags($this->cliente_cargo));
        $this->cliente_trabajo=htmlspecialchars(strip_tags($this->cliente_trabajo));
        $this->tipo_pago=htmlspecialchars(strip_tags($this->tipo_pago));
        $this->fecha_pago=htmlspecialchars(strip_tags($this->fecha_pago));
        $this->interes_diario=htmlspecialchars(strip_tags($this->interes_diario));
        $this->interes=htmlspecialchars(strip_tags($this->interes));
        $this->capital=htmlspecialchars(strip_tags($this->capital));
        $this->cuotas=htmlspecialchars(strip_tags($this->cuotas));
        $this->total=htmlspecialchars(strip_tags($this->total));
        $this->pdf_foto=htmlspecialchars(strip_tags($this->pdf_foto));
        $this->pdf_dni=htmlspecialchars(strip_tags($this->pdf_dni));
        $this->pdf_cip=htmlspecialchars(strip_tags($this->pdf_cip));
        $this->pdf_planilla=htmlspecialchars(strip_tags($this->pdf_planilla));
        $this->pdf_voucher=htmlspecialchars(strip_tags($this->pdf_voucher));
        $this->pdf_recibo=htmlspecialchars(strip_tags($this->pdf_recibo));
        $this->pdf_casilla=htmlspecialchars(strip_tags($this->pdf_casilla));
        $this->pdf_transaccion=htmlspecialchars(strip_tags($this->pdf_transaccion));
        $this->pdf_autorizacion=htmlspecialchars(strip_tags($this->pdf_autorizacion));
        $this->pdf_tarjeta=htmlspecialchars(strip_tags($this->pdf_tarjeta));
        $this->pdf_compromiso=htmlspecialchars(strip_tags($this->pdf_compromiso));
        $this->pdf_letra=htmlspecialchars(strip_tags($this->pdf_letra));
        $this->pdf_ddjj=htmlspecialchars(strip_tags($this->pdf_ddjj));
        $this->pdf_oficio=htmlspecialchars(strip_tags($this->pdf_oficio));
        $this->pdf_otros=htmlspecialchars(strip_tags($this->pdf_otros));
        $this->observacion=htmlspecialchars(strip_tags($this->observacion));

        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id_credito=$id;
            }
            return true;
        }
        return false;
    }

    function actualizar(){
        $query = "CALL sp_actualizarcredito(
            :prcredito,
            :prsucursal,
            :prfecha,
            :prautorizador,
            :prvendedor,
            :prcliente,
            :prclientedireccion,
            :prclientetelefono,
            :prclientecargo,
            :prclientetrabajo,
            :prtipopago,
            :prfechapago,
            :printeresdiario,
            :printeres,
            :prcapital,
            :prcuotas,
            :prtotal,
            :prpdffoto,
            :prpdfdni,
            :prpdfcip,
            :prpdfplanilla,
            :prpdfvoucher,
            :prpdfrecibo,
            :prpdfcasilla,
            :prpdftransaccion,
            :prpdfautorizacion,
            :prpdftarjeta,
            :prpdfcompromiso,
            :prpdfletra,
            :prpdfddjj,
            :prpdfoficio,
            :prpdfotros,
            :probservacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prsucursal", $this->sucursal);
        $result->bindParam(":prfecha", $this->fecha_credito);
        $result->bindParam(":prautorizador", $this->autorizador);
        $result->bindParam(":prvendedor", $this->vendedor);
        $result->bindParam(":prcliente", $this->cliente);
        $result->bindParam(":prclientedireccion", $this->cliente_direccion);
        $result->bindParam(":prclientetelefono", $this->cliente_telefono);
        $result->bindParam(":prclientecargo", $this->cliente_cargo);
        $result->bindParam(":prclientetrabajo", $this->cliente_trabajo);
        $result->bindParam(":prtipopago", $this->tipo_pago);
        $result->bindParam(":prfechapago", $this->fecha_pago);
        $result->bindParam(":printeresdiario", $this->interes_diario);
        $result->bindParam(":printeres", $this->interes);
        $result->bindParam(":prcapital", $this->capital);
        $result->bindParam(":prcuotas", $this->cuotas);
        $result->bindParam(":prtotal", $this->total);
        $result->bindParam(":prpdffoto", $this->pdf_foto);
        $result->bindParam(":prpdfdni", $this->pdf_dni);
        $result->bindParam(":prpdfcip", $this->pdf_cip);
        $result->bindParam(":prpdfplanilla", $this->pdf_planilla);
        $result->bindParam(":prpdfvoucher", $this->pdf_voucher);
        $result->bindParam(":prpdfrecibo", $this->pdf_recibo);
        $result->bindParam(":prpdfcasilla", $this->pdf_casilla);
        $result->bindParam(":prpdftransaccion", $this->pdf_transaccion);
        $result->bindParam(":prpdfautorizacion", $this->pdf_autorizacion);
        $result->bindParam(":prpdftarjeta", $this->pdf_tarjeta);
        $result->bindParam(":prpdfcompromiso", $this->pdf_compromiso);
        $result->bindParam(":prpdfletra", $this->pdf_letra);
        $result->bindParam(":prpdfddjj", $this->pdf_ddjj);
        $result->bindParam(":prpdfoficio", $this->pdf_oficio);
        $result->bindParam(":prpdfotros", $this->pdf_otros);
        $result->bindParam(":probservacion", $this->observacion);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->sucursal=htmlspecialchars(strip_tags($this->sucursal));
        $this->fecha_credito=htmlspecialchars(strip_tags($this->fecha_credito));
        $this->autorizador=htmlspecialchars(strip_tags($this->autorizador));
        $this->vendedor=htmlspecialchars(strip_tags($this->vendedor));
        $this->cliente=htmlspecialchars(strip_tags($this->cliente));
        $this->cliente_direccion=htmlspecialchars(strip_tags($this->cliente_direccion));
        $this->cliente_telefono=htmlspecialchars(strip_tags($this->cliente_telefono));
        $this->cliente_cargo=htmlspecialchars(strip_tags($this->cliente_cargo));
        $this->cliente_trabajo=htmlspecialchars(strip_tags($this->cliente_trabajo));
        $this->tipo_pago=htmlspecialchars(strip_tags($this->tipo_pago));
        $this->fecha_pago=htmlspecialchars(strip_tags($this->fecha_pago));
        $this->interes_diario=htmlspecialchars(strip_tags($this->interes_diario));
        $this->interes=htmlspecialchars(strip_tags($this->interes));
        $this->capital=htmlspecialchars(strip_tags($this->capital));
        $this->cuotas=htmlspecialchars(strip_tags($this->cuotas));
        $this->total=htmlspecialchars(strip_tags($this->total));
        $this->pdf_foto=htmlspecialchars(strip_tags($this->pdf_foto));
        $this->pdf_dni=htmlspecialchars(strip_tags($this->pdf_dni));
        $this->pdf_cip=htmlspecialchars(strip_tags($this->pdf_cip));
        $this->pdf_planilla=htmlspecialchars(strip_tags($this->pdf_planilla));
        $this->pdf_voucher=htmlspecialchars(strip_tags($this->pdf_voucher));
        $this->pdf_recibo=htmlspecialchars(strip_tags($this->pdf_recibo));
        $this->pdf_casilla=htmlspecialchars(strip_tags($this->pdf_casilla));
        $this->pdf_transaccion=htmlspecialchars(strip_tags($this->pdf_transaccion));
        $this->pdf_autorizacion=htmlspecialchars(strip_tags($this->pdf_autorizacion));
        $this->pdf_tarjeta=htmlspecialchars(strip_tags($this->pdf_tarjeta));
        $this->pdf_compromiso=htmlspecialchars(strip_tags($this->pdf_compromiso));
        $this->pdf_letra=htmlspecialchars(strip_tags($this->pdf_letra));
        $this->pdf_ddjj=htmlspecialchars(strip_tags($this->pdf_ddjj));
        $this->pdf_oficio=htmlspecialchars(strip_tags($this->pdf_oficio));
        $this->pdf_otros=htmlspecialchars(strip_tags($this->pdf_otros));
        $this->observacion=htmlspecialchars(strip_tags($this->observacion));


        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id_credito=$id;
            }
            return true;
        }
        return false;
    }

    function actualizar_documentos(){
        $query = "CALL sp_actualizarcreditodocumentos(
            :prcredito,
            :prpdffoto,
            :prpdfdni,
            :prpdfcip,
            :prpdfplanilla,
            :prpdfvoucher,
            :prpdfrecibo,
            :prpdfcasilla,
            :prpdftransaccion,
            :prpdfautorizacion,
            :prpdftarjeta,
            :prpdfcompromiso,
            :prpdfletra,
            :prpdfddjj,
            :prpdfoficio,
            :prpdfotros
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prpdffoto", $this->pdf_foto);
        $result->bindParam(":prpdfdni", $this->pdf_dni);
        $result->bindParam(":prpdfcip", $this->pdf_cip);
        $result->bindParam(":prpdfplanilla", $this->pdf_planilla);
        $result->bindParam(":prpdfvoucher", $this->pdf_voucher);
        $result->bindParam(":prpdfrecibo", $this->pdf_recibo);
        $result->bindParam(":prpdfcasilla", $this->pdf_casilla);
        $result->bindParam(":prpdftransaccion", $this->pdf_transaccion);
        $result->bindParam(":prpdfautorizacion", $this->pdf_autorizacion);
        $result->bindParam(":prpdftarjeta", $this->pdf_tarjeta);
        $result->bindParam(":prpdfcompromiso", $this->pdf_compromiso);
        $result->bindParam(":prpdfletra", $this->pdf_letra);
        $result->bindParam(":prpdfddjj", $this->pdf_ddjj);
        $result->bindParam(":prpdfoficio", $this->pdf_oficio);
        $result->bindParam(":prpdfotros", $this->pdf_otros);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->pdf_foto=htmlspecialchars(strip_tags($this->pdf_foto));
        $this->pdf_dni=htmlspecialchars(strip_tags($this->pdf_dni));
        $this->pdf_cip=htmlspecialchars(strip_tags($this->pdf_cip));
        $this->pdf_planilla=htmlspecialchars(strip_tags($this->pdf_planilla));
        $this->pdf_voucher=htmlspecialchars(strip_tags($this->pdf_voucher));
        $this->pdf_recibo=htmlspecialchars(strip_tags($this->pdf_recibo));
        $this->pdf_casilla=htmlspecialchars(strip_tags($this->pdf_casilla));
        $this->pdf_transaccion=htmlspecialchars(strip_tags($this->pdf_transaccion));
        $this->pdf_autorizacion=htmlspecialchars(strip_tags($this->pdf_autorizacion));
        $this->pdf_tarjeta=htmlspecialchars(strip_tags($this->pdf_tarjeta));
        $this->pdf_compromiso=htmlspecialchars(strip_tags($this->pdf_compromiso));
        $this->pdf_letra=htmlspecialchars(strip_tags($this->pdf_letra));
        $this->pdf_ddjj=htmlspecialchars(strip_tags($this->pdf_ddjj));
        $this->pdf_oficio=htmlspecialchars(strip_tags($this->pdf_oficio));
        $this->pdf_otros=htmlspecialchars(strip_tags($this->pdf_otros));

        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id_credito=$id;
            }
            return true;
        }
        return false;
    }

    function crear_garante(){
        $query = "CALL sp_crearcreditogarante(
            :prcredito,
            :prcliente,
            :prclientetelefono,
            :prclientedireccion,
            :prpdfdni,
            :prpdfcip,
            :prpdfplanilla
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prcliente", $this->cliente);
        $result->bindParam(":prclientetelefono", $this->cliente_direccion);
        $result->bindParam(":prclientedireccion", $this->cliente_telefono);
        $result->bindParam(":prpdfdni", $this->pdf_dni);
        $result->bindParam(":prpdfcip", $this->pdf_cip);
        $result->bindParam(":prpdfplanilla", $this->pdf_planilla);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->cliente=htmlspecialchars(strip_tags($this->cliente));
        $this->cliente_direccion=htmlspecialchars(strip_tags($this->cliente_direccion));
        $this->cliente_telefono=htmlspecialchars(strip_tags($this->cliente_telefono));
        $this->pdf_dni=htmlspecialchars(strip_tags($this->pdf_dni));
        $this->pdf_cip=htmlspecialchars(strip_tags($this->pdf_cip));
        $this->pdf_planilla=htmlspecialchars(strip_tags($this->pdf_planilla));


        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function crear_cronograma(){
        $query = "CALL sp_crearcreditocronograma(
            :prcredito,
            :prtipopago,
            :prcapital,
            :printeres,
            :prfechavencimiento
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prtipopago", $this->tipo_pago);
        $result->bindParam(":prcapital", $this->capital);
        $result->bindParam(":printeres", $this->interes);
        $result->bindParam(":prfechavencimiento", $this->fecha);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->tipo_pago=htmlspecialchars(strip_tags($this->tipo_pago));
        $this->capital=htmlspecialchars(strip_tags($this->capital));
        $this->interes=htmlspecialchars(strip_tags($this->interes));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));


        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function crear_cronograma_afiliacion(){
        $query = "CALL sp_crearcreditocronogramaafiliacion(
            :prcredito,
            :prtipopago,
            :prmonto,
            :prcuotas,
            :prprimeracuota
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prtipopago", $this->tipo_pago);
        $result->bindParam(":prmonto", $this->monto);
        $result->bindParam(":prcuotas", $this->total_cuotas);
        $result->bindParam(":prprimeracuota", $this->fecha);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->tipo_pago=htmlspecialchars(strip_tags($this->tipo_pago));
        $this->monto=htmlspecialchars(strip_tags($this->monto));
        $this->total_cuotas=htmlspecialchars(strip_tags($this->total_cuotas));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));


        if($result->execute())
        {
            // return true ;
            return $this->actualizar_cuotas_afiliacion_presente() ;
        }
        return false;
    }

    function actualizar_cuotas_afiliacion_presente() : bool {
        $query = "CALL sp_actualizarafiliacioncuotasalpresente(
            :prcredito
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function proximo_credito(){
        $query = "CALL sp_seleccionarproximocredito(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->numero=$row['numero'];
    }

    function verificar_afiliacion(){
        $query = "CALL sp_verificarafiliacion(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->codigo=$row['codigo_afiliacion'];
        $this->total_pagado=$row['pagado'];
        $this->total_cuotas=$row['total'];
    }

    function verificar_interes(){
        $query = "CALL sp_verificarinteres(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->total_pagado);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->interes=$row['interes'];
    }

    function seleccionar_parametros_afiliacion(){
      $query = "CALL sp_seleccionarparametroafiliacion()";

      $result = $this->conn->prepare($query);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->id=$row['id'];
      $this->monto=$row['monto'];
      $this->tiempo=$row['tiempo'];
      $this->fecha=$row['fecha'];
    }        

    function seleccionar_numero_afiliacion(){
        $query = "CALL sp_seleccionarproximaafiliacion()";

        $result = $this->conn->prepare($query);
  
        $result->execute();
  
        $row = $result->fetch(PDO::FETCH_ASSOC);
  
        $this->numero=$row['numero'];
    }

    // Este SP muestra las ventas y créditos que puede refinanciar
    function read_transacciones(){
        $query = "CALL sp_listartransaccionesxcliente(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);

        $result->execute();
        
        $credito_list=array();
        $credito_list["transacciones"]=array();

        $contador = 0;
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;

            $items = array (
                "numero"=>$contador,
                "id"=>$id,
                "id_tipo"=>$id_tipo,
                "tipo"=>$tipo,
                "fecha"=>$fecha,
                "documento"=>$documento,
                "total"=>$total,
                "monto_pendiente"=>$monto_pendiente,
                "considerar"=>false,
            );
            array_push($credito_list["transacciones"],$items);
        }

        return $credito_list;
    }

    // Este SP muestra las ventas y créditos que puede refinanciar incluido interés
    // se utiliza para generar un proceso judicial múltiple
    function read_transacciones_interes(){
        $query = "CALL sp_listartransaccionesxclienteconinteres(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);

        $result->execute();
        
        $credito_list=array();
        $credito_list["transacciones"]=array();

        $contador = 0;
        
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;

            $items = array (
                "numero"=>$contador,
                "id"=>$id,
                "id_tipo"=>$id_tipo,
                "tipo"=>$tipo,
                "fecha"=>$fecha,
                "documento"=>$documento,
                "total"=>$total,
                "monto_pendiente"=>$monto_pendiente,
                "considerar"=>false,
            );
            array_push($credito_list["transacciones"],$items);
        }

        return $credito_list;
    }

    function read_transacciones_cronograma(){
        $query = "CALL sp_listartransaccionesxclientecronograma(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);

        $result->execute();
        
        $credito_list=array();
        $credito_list['cronograma']=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $items = array (
                "tipo" => $tipo,
                "id_transaccion" => $id_transaccion,
                "fecha_vencimiento" => $fecha_vencimiento,
                "cuota_mensual" => $cuota_mensual,
                "capital" => $capital
            );
            array_push($credito_list['cronograma'],$items);
        }

        return $credito_list['cronograma'];
    }

    // Este SP muestra el monto mensual que tiene por pagar el cliente
    function read_cronogramasxcliente(){

        $query = "CALL sp_listartransaccionescronogramaxcliente(?)";
  
        $result = $this->conn->prepare($query);
  
        $result->bindParam(1, $this->cliente);
  
        $result->execute();
        
        $cronograma_list=array();
        $contador = 0;
  
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $item = array (
                "numero"=>$contador,
                "fecha_vencimiento"=>$fecha_vencimiento,
                "cuota_mensual"=>$cuota_mensual
            );
            array_push($cronograma_list,$item);
        }
  
        return $cronograma_list;
    }

    function actualizar_transacciones_refinanciadas(){
        $query = "CALL sp_actualizartransaccionrefinanciada(
            :prnuevocredito,
            :ptipo,
            :prtransaccion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prnuevocredito", $this->id_credito);
        $result->bindParam(":ptipo", $this->tipo);
        $result->bindParam(":prtransaccion", $this->id_transaccion);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->tipo=htmlspecialchars(strip_tags($this->tipo));
        $this->id_transaccion=htmlspecialchars(strip_tags($this->id_transaccion));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function eliminar_credito(){
        $query = "CALL sp_eliminarcredito(
            :prcredito
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function read_periodos_cuotas_pagos(){

        $query = "CALL sp_listarcronogramacreditopagosxmes(?)";
  
        $result = $this->conn->prepare($query);
  
        $result->bindParam(1, $this->id_credito);
  
        $result->execute();
        
        $cronograma_list=array();
        $contador = 0;
  
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $cronograma_item = array (
                  "numero" => $contador,
                  "periodo" => $periodo ,
                  "monto_cuota" => $monto_cuota ,
                  "monto_pago_manual" => $monto_pago_manual ,
                  "monto_pago_manual_directo" => $monto_pago_manual_directo ,
                  "monto_pago_manual_planilla" => $monto_pago_manual_planilla ,
                  "monto_pago_manual_judicial" => $monto_pago_manual_judicial ,
                  "monto_directo" => $monto_directo ,
                  "monto_planilla" => $monto_planilla ,
                  "total_planilla" => $total_planilla ,
                  "total_directo" => $total_directo ,
                  "total_judicial" => $total_judicial
            );
            array_push($cronograma_list,$cronograma_item);
        }
  
        return $cronograma_list;
    }

    function crear_penalidad_credito () {
        $query = "CALL sp_crearpenalidadcredito(
            :prcredito ,
            :prcuotapenalidad ,
            :prnumerocuotas ,
            :prfechainicio ,
            :prtipopago
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prcuotapenalidad", $this->cuota_penalidad);
        $result->bindParam(":prnumerocuotas", $this->numero_cuotas);
        $result->bindParam(":prfechainicio", $this->fecha_inicio);
        $result->bindParam(":prtipopago", $this->tipo_pago);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->cuota_penalidad=htmlspecialchars(strip_tags($this->cuota_penalidad));
        $this->numero_cuotas=htmlspecialchars(strip_tags($this->numero_cuotas));
        $this->fecha_inicio=htmlspecialchars(strip_tags($this->fecha_inicio));
        $this->tipo_pago=htmlspecialchars(strip_tags($this->tipo_pago));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function actualizar_credito_estado_penalidad() {
        $query = "CALL sp_actualizarcreditoestadopenalidad(
            :prcredito ,
            :prestadopenalidad
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prestadopenalidad", $this->estado_penalidad);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->estado_penalidad=htmlspecialchars(strip_tags($this->estado_penalidad));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function eliminar_penalidad_credito () {
        $query = "CALL sp_eliminarpenalidadcredito(
            :prcredito
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function crear_interes_credito() {
        $query = "CALL sp_crearcreditocronogramainteres1(
            :prcredito
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));

        if($result->execute())
        {
            return true;
        }
        return false;
    }
 
    function actualizar_credito_estado_interes() {
        $query = "CALL sp_actualizarcreditoestadointeres(
            :prcredito ,
            :prestado
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prestado", $this->estado_interes);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->estado_interes=htmlspecialchars(strip_tags($this->estado_interes));

        if($result->execute())
        {
            return true;
        }
        return false;
    }
 
    function eliminar_interes_credito() {
        $query = "CALL sp_eliminarcreditocronogramainteres(
            :prcredito
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));

        if($result->execute())
        {
            return true;
        }
        return false;
    }
}

?>