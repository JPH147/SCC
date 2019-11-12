<?php 

class Distrito{
	private $conn;

	public $id_distrito;
	public $dst_nombre;
	public $prv_nombre;
	public $dpt_nombre;
    public $numero_pagina;
    public $total_pagina;
    public $total_resultado;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listardistrito(?,?,?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->dpt_nombre);
		$result->bindParam(2, $this->prv_nombre);
		$result->bindParam(3, $this->dst_nombre);
        $result->bindParam(4, $this->numero_pagina);
        $result->bindParam(5, $this->total_pagina);

		$result->execute();

		$distrito_list=array();
        //$distrito_list["total"]=array();
		$distrito_list["distritos"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$distrito_fila = array(
				"numero"=>$contador,
				"id"=>$id_distrito,
				"departamento"=>$dpt_nombre,
				"provincia"=>$prv_nombre,
				"nombre"=>$dst_nombre
			);
			array_push($distrito_list["distritos"],$distrito_fila);
		}

		return $distrito_list;
	}

    function contar(){

        $query = "CALL sp_listardistritocontar(?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->dpt_nombre);
        $result->bindParam(2, $this->prv_nombre);
        $result->bindParam(3, $this->dst_nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
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
        $this->prv_nombre=$row['id_provincia'];
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