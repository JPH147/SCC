<?php
Class Almacen{

    private $conn;
    private $table_name = "almacen";

    public $idalmacen;
    public $alm_nombre;
    public $alm_descripcion;
    public $alm_estado;


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "CALL sp_listaralmacen";

        $result = $this->conn->prepare($query);
        $result->execute();
    
        $almacen_list=array();
        $almacen_list["almacenes"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $almacen_item = array (
                "id"=>$row['idalmacen'],
                "nombre"=>$row['alm_nombre'],
                "descripcion"=>$row['alm_descripcion']
            );

                array_push($almacen_list["almacenes"],$almacen_item);
        }
        return $almacen_list;
    }
    
    function create()
    {
        $query = "CALL sp_crearalmacen (:palm_nombre,:palm_descripcion,:palm_estado)"; 

        $result = $this->conn->prepare($query);

        $this->alm_nombre=htmlspecialchars(strip_tags($this->alm_nombre));
        $this->alm_descripcion=htmlspecialchars(strip_tags($this->alm_descripcion));
        $this->alm_estado=htmlspecialchars(strip_tags($this->alm_estado));


        $result->bindParam(":palm_nombre", $this->alm_nombre);
        $result->bindParam(":palm_descripcion", $this->alm_descripcion);
        $result->bindParam(":palm_estado", $this->alm_estado);


        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
    function readxId()
    {
        $query ="CALL sp_listaralmacenxId (?)";
        $result = $this->conn->prepare($query);
        $result->bindParam(1, $this->idalmacen);
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->alm_nombre=$row['alm_nombre'];
        $this->alm_descripcion=$row['alm_descripcion'];
        $this->alm_estado=$row['alm_estado'];

    }

    function update()
    {
        $query = "CALL sp_actualizaralmacen (:pidalmacen,:palm_nombre,:palm_descripcion)"; 

        $result = $this->conn->prepare($query);

        $this->idalmacen=htmlspecialchars(strip_tags($this->idalmacen));
        $this->alm_nombre=htmlspecialchars(strip_tags($this->alm_nombre));
        $this->alm_descripcion=htmlspecialchars(strip_tags($this->alm_descripcion));


        $result->bindParam(":pidalmacen", $this->idalmacen);
        $result->bindParam(":palm_nombre", $this->alm_nombre);
        $result->bindParam(":palm_descripcion", $this->alm_descripcion);


        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
    function delete()
    {
        $query = "call sp_eliminaralmacen(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idalmacen);

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }
}
?>