<?php
Class ClienteDireccion{

    private $conn;
    private $table_name = "cliente_direccion";

    public $idcliente_direccion;
    public $id_cliente;
    public $clt_nombre;
    public $drc_nombre;
    public $id_distrito;
    public $drc_relevancia;
    public $drc_observacion;
    public $drc_estado;

    public function __construct($db){
        $this->conn = $db;
    }

    function create()
    {
        $query = "CALL sp_crearclientedireccion(
            :id_cliente,
            :drc_nombre,
            :pid_distrito,
            :drc_relevancia,
            :drc_observacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_cliente", $this->id_cliente);
        $result->bindParam(":drc_nombre", $this->drc_nombre);
        $result->bindParam(":pid_distrito", $this->id_distrito);
        $result->bindParam(":drc_relevancia", $this->drc_relevancia);
        $result->bindParam(":drc_observacion", $this->drc_observacion);

        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        $this->drc_nombre=htmlspecialchars(strip_tags($this->drc_nombre));
        $this->id_distrito=htmlspecialchars(strip_tags($this->id_distrito));
        $this->drc_relevancia=htmlspecialchars(strip_tags($this->drc_relevancia));
        $this->drc_observacion=htmlspecialchars(strip_tags($this->drc_observacion));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function delete(){
      $query = "CALL sp_eliminarclientedireccion(:id_direccion)";

      $result = $this->conn->prepare($query);

      $result->bindParam(":id_direccion", $this->idcliente_direccion);

      $this->idcliente_direccion=htmlspecialchars(strip_tags($this->idcliente_direccion));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function read()
    {
        $query = "CALL sp_listarclientedireccion(:pid_cliente, :pdrc_relevancia)";

        $result = $this->conn->prepare($query);
        $result->bindParam(":pid_cliente", $this->id_cliente);
        $result->bindParam(":pdrc_relevancia", $this->drc_relevancia);

        $result->execute();
        $direccion_list=array();
        $direccion_list["direcciones"]=array();
        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $direccion_item = array (
                "numero"=>$contador,
                "id"=>$row['id'],
                "idcliente"=>$row['idcliente'],
                "cliente"=>$row['cliente'],
                "direccion"=>$row['direccion'],
                "id_departamento"=>$row['id_departamento'],
                "departamento"=>$row["dpt_nombre"],
                "id_provincia"=>$row['id_provincia'],
                "provincia"=>$row['prv_nombre'],
                "id_distrito"=>$row['id_distrito'],
                "distrito"=> $row['dst_nombre'],
                "direccioncompleta"=> $row['direccioncompleta'],
                "relevancia"=>$row['drc_relevancia'],
                "observacion"=>$row['drc_observacion'],
                "estado"=>$row['drc_estado']
            );

            array_push($direccion_list["direcciones"],$direccion_item);
        }
        return $direccion_list;
    }
}
?>