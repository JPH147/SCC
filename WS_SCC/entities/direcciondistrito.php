<?php 

class Distrito{
	private $conn;

	public $id_distrito;
	public $dst_nombre;
	public $prv_nombre;
	public $dpt_nombre;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listardistrito(?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->dpt_nombre);
		$result->bindParam(2, $this->prv_nombre);
		$result->bindParam(3, $this->dst_nombre);

		$result->execute();

		$distrito_list=array();
		$distrito_list["distritos"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$distrito_fila = array(
				"numero"=>$contador,
				"id"=>$id_distrito,
				"departamento"=>$dpt_nombre,
				"provincia"=>$prv_nombre,
				"distrito"=>$dst_nombre
			);
			array_push($distrito_list["distritos"],$distrito_fila);
		}

		return $distrito_list;
	}
	
	function readxId()
    {
        $query ="call sp_listardistritoxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_distrito);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->id_distrito=$row['id_distrito'];
        $this->dpt_nombre=$row['dpt_nombre'];
        $this->prv_nombre=$row['prv_nombre'];
        $this->dst_nombre=$row['dst_nombre'];
    }

    function delete()
    {
        $query = "call sp_eliminardistrito(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_distrito);

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }

    function create()
    {
        $query = "CALL sp_creardistrito(:prprovincia,:prnombre)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prprovincia", $this->id_provincia);
        $result->bindParam(":prnombre", $this->dst_nombre);

        $this->id_provincia=htmlspecialchars(strip_tags($this->id_provincia));
        $this->dst_nombre=htmlspecialchars(strip_tags($this->dst_nombre));

        if($result->execute())
        {
            return true;
        }else{
			return false;
        }
        
    }

    function update()
    {
        $query = "call sp_actualizardistrito(:prid, :prprovincia, :prnombre)";
        
        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_distrito);
        $result->bindParam(":prprovincia", $this->id_provincia);
        $result->bindParam(":prnombre", $this->dst_nombre);

        $this->id_distrito=htmlspecialchars(strip_tags($this->id_distrito));
        $this->id_provincia=htmlspecialchars(strip_tags($this->id_provincia));
        $this->dst_nombre=htmlspecialchars(strip_tags($this->dst_nombre));

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