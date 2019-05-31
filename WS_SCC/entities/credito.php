<?php

Class Creditos{

    private $conn;
    private $table_name = "venta";

    public $id_credito;
    public $cliente;
    public $tipo_credito;
    public $fecha_inicio;
    public $fecha_fin;
    public $estado;

    public $monto;
    public $fecha;
    public $total_pagado;
    public $total_cuotas;
    public $numero;

    public $sucursal;
    public $fecha_credito;
    public $autorizador;
    public $vendedor;
    public $cliente_direccion;
    public $cliente_telefono;
    public $cliente_cargo;
    public $cliente_trabajo;
    public $tipo_pago;
    public $interes;
    public $capital;
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
    public $observacion;
    
    public $cronograma;
    public $orden;
    public $numero_pagina;
    public $total_pagina;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarcredito(?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->tipo_credito);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->estado);
        $result->bindParam(6, $this->numero_pagina);
        $result->bindParam(7, $this->total_pagina);
        $result->bindParam(8, $this->orden);

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
                "institucion"=>$institucion,
                "sede"=>$sede,
                "subsede"=>$subsede,
                "id_cliente"=>$id_cliente,
                "cliente_nombre"=>$cliente_nombre,
                "fecha"=>$fecha,
                "tipo_pago"=>$tipo_pago,
                "numero_cuotas"=>$numero_cuotas,
                "monto_total"=>$monto_total,
                "tipo_credito"=>$tipo_credito,
                "observaciones"=>$observaciones,
                "estado"=>$estado,
            );
            array_push($credito_list["creditos"],$items);
        }

        return $credito_list;
    }

    function contar(){

        $query = "CALL sp_listarcreditocontar(?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->cliente);
        $result->bindParam(2, $this->tipo_credito);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->estado);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function readxId(){

        $query ="call sp_listarcreditoxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_credito);

        // $Garantes=$this->read_garantes($this->id_venta);
        $Cronograma=$this->read_cronograma($this->id_credito);

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->id_tipo = $row['id_tipo'];
        $this->tipo = $row['tipo'];
        $this->id_sucursal = $row['id_sucursal'];
        $this->sucursal = $row['sucursal'];
        $this->fecha = $row['fecha'];
        $this->numero = $row['numero'];
        $this->id_autorizador = $row['id_autorizador'];
        $this->autorizador = $row['autorizador'];
        $this->id_vendedor = $row['id_vendedor'];
        $this->vendedor = $row['vendedor'];
        $this->id_cliente = $row['id_cliente'];
        $this->cliente = $row['cliente'];
        $this->cliente_direccion = $row['cliente_direccion'];
        $this->cliente_telefono = $row['cliente_telefono'];
        $this->cliente_cargo = $row['cliente_cargo'];
        $this->cliente_trabajo = $row['cliente_trabajo'];
        $this->id_tipo_pago = $row['id_tipo_pago'];
        $this->tipo_pago = $row['tipo_pago'];
        $this->fecha_pago = $row['fecha_pago'];
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
        $this->observaciones = $row['observaciones'];
        $this->id_estado = $row['id_estado'];
        $this->estado = $row['estado'];
        $this->cronograma = $Cronograma;
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

      $query = "CALL sp_listarcreditocronograma(?)";

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
              "numero"=>$contador,
              "id_cronograma"=>$id,
              "monto_cuota"=>$monto,
              "fecha_vencimiento"=>$fecha,
              "estado"=>$estado
          );
          array_push($cronograma_list,$cronograma_item);
      }

      return $cronograma_list;
    }

    function crear(){
        $query = "CALL sp_crearcredito(
            :prtipo,
            :prsucursal,
            :prfecha,
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
            :probservacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prtipo", $this->tipo_credito);
        $result->bindParam(":prsucursal", $this->sucursal);
        $result->bindParam(":prfecha", $this->fecha_credito);
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
        $result->bindParam(":probservacion", $this->observacion);

        $this->tipo_credito=htmlspecialchars(strip_tags($this->tipo_credito));
        $this->sucursal=htmlspecialchars(strip_tags($this->sucursal));
        $this->fecha_credito=htmlspecialchars(strip_tags($this->fecha_credito));
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

    function crear_cronograma(){
        $query = "CALL sp_crearcreditocronograma(
            :prcredito,
            :prmonto,
            :prfechavencimiento
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcredito", $this->id_credito);
        $result->bindParam(":prmonto", $this->monto);
        $result->bindParam(":prfechavencimiento", $this->fecha);

        $this->id_credito=htmlspecialchars(strip_tags($this->id_credito));
        $this->monto=htmlspecialchars(strip_tags($this->monto));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));


        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function proximo_credito(){
        $query = "CALL sp_seleccionarproximocredito()";

        $result = $this->conn->prepare($query);

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

}