<?php

  Class Cobranzas{

    private $conn;
          
    public $path = '../descuentos/';

    public $id_cobranza;
    public $total_resultado;
    public $archivo;
    public $contenido;

    public $cliente;
    public $codigo;
    public $sede;
    public $subsede;
    public $institucion;
    public $tipo;
    public $tipo_pago;
    public $fecha_inicio;
    public $fecha_fin;
    public $cantidad;
    public $monto;
    public $estado;
    public $numero_pagina;
    public $total_pagina;

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

    function read_pnp(){

      $query = "CALL sp_listarcronogramaxcobrarpnp(?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->fecha_inicio);
      $result->bindParam(2, $this->fecha_fin);

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
            "codofin"=>$codofin,
            "cip"=>$cip,
            "id_cliente"=>$id_cliente,
            "cliente"=>$cliente,
            "fecha"=>$fecha,
            "monto_pendiente"=>$monto_pendiente,
            "archivo"=>$archivo
          );
          array_push($cronograma["cronograma"],$items);
      }

      return $cronograma;
    }

    function read_pnp_total(){

      $query = "CALL sp_listarcronogramaxcobrarpnptotal(?,?)";

      $result = $this->conn->prepare($query);

      $result->bindParam(1, $this->fecha_inicio);
      $result->bindParam(2, $this->fecha_fin);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->cantidad=$row['cantidad'];
      $this->total=$row['total'];

    }

    function generar_pnp(){

      $file = fopen($this->path.$this->archivo.".txt", "w") or die();

      $array =  explode(",",$this->contenido);

      foreach($array as $item){
        fwrite($file, $item."\n");

        if( !next( $array ) ) {
          fclose($file);
          return true;
        }

      }


      // $txt = "John Doe\n";
      // fwrite($myfile, $txt);
      // $txt = "Jane Doe\n";
      // fwrite($myfile, $txt);
      // fclose($myfile);


      

    }

    function create_cabecera(){
      $query = "CALL sp_crearcobranzacabecera(
        :prinstitucion,
        :prtipopago,
        :prfechainicio,
        :prfechafin,
        :prcantidad,
        :prmonto,
        :prarchivo
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prinstitucion", $this->institucion);
      $result->bindParam(":prtipopago", $this->tipo_pago);
      $result->bindParam(":prfechainicio", $this->fecha_inicio);
      $result->bindParam(":prfechafin", $this->fecha_fin);
      $result->bindParam(":prcantidad", $this->cantidad);
      $result->bindParam(":prmonto", $this->monto);
      $result->bindParam(":prarchivo", $this->archivo);

      $this->institucion=htmlspecialchars(strip_tags($this->institucion));
      $this->tipo_pago=htmlspecialchars(strip_tags($this->tipo_pago));
      $this->fecha_inicio=htmlspecialchars(strip_tags($this->fecha_inicio));
      $this->fecha_fin=htmlspecialchars(strip_tags($this->fecha_fin));
      $this->cantidad=htmlspecialchars(strip_tags($this->cantidad));
      $this->monto=htmlspecialchars(strip_tags($this->monto));
      $this->archivo=htmlspecialchars(strip_tags($this->archivo));


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

    function create_detalle(){
      $query = "CALL sp_crearcobranzadetalle(
        :prcobranza,
        :prcliente,
        :prcodofin,
        :prmonto
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":prcobranza", $this->id_cobranza);
      $result->bindParam(":prcliente", $this->cliente);
      $result->bindParam(":prcodofin", $this->codigo);
      $result->bindParam(":prmonto", $this->monto);

      $this->id_cobranza=htmlspecialchars(strip_tags($this->id_cobranza));
      $this->cliente=htmlspecialchars(strip_tags($this->cliente));
      $this->codigo=htmlspecialchars(strip_tags($this->codigo));
      $this->monto=htmlspecialchars(strip_tags($this->monto));


      if($result->execute())
      {
          return true;
      }
      return false;
    
    }

    function read_cabecera(){
      $query = "CALL sp_listarcobranzacabecera(?,?)";

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
            "fecha_creacion"=>$fecha_creacion,
            "institucion"=>$institucion,
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

    function read_cabecera_contar(){

      $query = "CALL sp_listarcobranzacabeceracontar()";

      $result = $this->conn->prepare($query);

      $result->execute();

      $row = $result->fetch(PDO::FETCH_ASSOC);

      $this->total_resultado=$row['total'];

      return $this->total_resultado;
    }

  }

?>