<?php
Class ClienteTelefono{

    private $conn;
    private $table_name = "cliente_telefono";

    public $idcliente_telefono;
    public $id_cliente;
    public $tlf_numero;
    public $tlf_observacion;
    public $id_tipo;
    public $tlf_relevancia;
    public $prpagina;
    public $prtotalpagina;

    public function __construct($db){
        $this->conn = $db;
    }

    function create()
    {
      $query = "CALL sp_crearclientetelefono(
        :id_cliente,
        :tlf_numero,
        :id_tipo
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":id_cliente", $this->id_cliente);
      $result->bindParam(":tlf_numero", $this->tlf_numero);
      $result->bindParam(":id_tipo", $this->id_tipo);

      $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
      $this->tlf_numero=htmlspecialchars(strip_tags($this->tlf_numero));
      $this->id_tipo=htmlspecialchars(strip_tags($this->id_tipo));

      if($result->execute())
      {
       return true;
      }
      return false;
    }

    function delete(){
      $query = "CALL sp_eliminarclientetelefono(:id_telefono)";

      $result = $this->conn->prepare($query);

      $result->bindParam(":id_telefono", $this->idcliente_telefono);

      $this->idcliente_telefono=htmlspecialchars(strip_tags($this->idcliente_telefono));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function read()
    {
        $query = "CALL sp_listarclientetelefono(:pid_cliente, :ptlf_relevancia, :pagina, :total_pagina)";

        $result = $this->conn->prepare($query);
        $result->bindParam(":pid_cliente", $this->id_cliente);
        $result->bindParam(":ptlf_relevancia", $this->tlf_relevancia);
        $result->bindParam(":pagina", $this->prpagina);
        $result->bindParam(":total_pagina", $this->prtotalpagina);

        $result->execute();
        $telefono_list=array();
        $telefono_list["telefonos"]=array();
        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $telefono_item = array (
                "numero"=>$contador,
                "id"=>$row['idcliente_telefono'],
                "idcliente"=>$row['idcliente'],
                "cliente"=>$row['cliente'],
                "tlf_numero"=>$row['tlf_numero'],
                "id_tipo"=>$row['id_tipo'],
                "tlf_relevancia"=>$row['tlf_relevancia'],
                "estado"=>$row['tlf_estado'],
            );

            array_push($telefono_list["telefonos"],$telefono_item);
        }
        return $telefono_list;
    }

    function contar(){

        $query = "CALL sp_listarclientetelefonocontar(:pid_cliente, :ptlf_relevancia)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pid_cliente", $this->id_cliente);
        $result->bindParam(":ptlf_relevancia", $this->tlf_relevancia);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }
 
    function actualizar_primario()
    {
      $query = "CALL sp_actualizarrelevanciatelefono(
        :id_telefono
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":id_telefono", $this->idcliente_telefono);

      $this->idcliente_telefono=htmlspecialchars(strip_tags($this->idcliente_telefono));

      if($result->execute())
      {
       return true;
      }
      return false;
    }
}
?>