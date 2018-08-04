<?php 

class Provincia{
	private $conn;

	public $id_provincia;
	public $id_departamento;
	public $dpt_nombre;
	public $prv_nombre;
    public $total_pagina;
    public $total_resultado;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarprovincia(?,?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->dpt_nombre);
		$result->bindParam(2, $this->prv_nombre);
        $result->bindParam(3, $this->numero_pagina);
        $result->bindParam(4, $this->total_pagina);

		$result->execute();

		$provincia_list=array();
		$provincia_list["provincias"]=array();

		$contador = $this->total_pagina*($this->numero_pagina);

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$provincia_fila = array(
				"numero"=>$contador,
				"id"=>$id_provincia,
				"departamento"=>$dpt_nombre,
				"nombre"=>$prv_nombre
			);
			array_push($provincia_list["provincias"],$provincia_fila);
		}

		return $provincia_list;
	}

    function contar(){

        $query = "CALL sp_listarprovinciacontar(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->dpt_nombre);
        $result->bindParam(2, $this->prv_nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

	function readxId()
    {
        $query ="call sp_listarprovinciaxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_provincia);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->id_distrito=$row['id_provincia'];
        $this->dpt_nombre=$row['id_departamento'];
        $this->prv_nombre=$row['prv_nombre'];
    }

    function delete()
    {
        $query = "call sp_eliminarprovincia(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_provincia);

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
        $query = "CALL sp_crearprovincia(:prdepartamento,:prnombre)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prdepartamento", $this->id_departamento);
        $result->bindParam(":prnombre", $this->prv_nombre);

        $this->id_departamento=htmlspecialchars(strip_tags($this->id_departamento));
        $this->prv_nombre=htmlspecialchars(strip_tags($this->prv_nombre));

        if($result->execute())
        {
            return true;
        }else{
			return false;
        }
        
    }

    function update()
    {
        $query = "call sp_actualizarprovincia(:prid, :prdepartamento, :prnombre)";
        
        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_provincia);
        $result->bindParam(":prdepartamento", $this->id_departamento);
        $result->bindParam(":prnombre", $this->prv_nombre);

        $this->id_provincia=htmlspecialchars(strip_tags($this->id_provincia));
        $this->id_departamento=htmlspecialchars(strip_tags($this->id_departamento));
        $this->prv_nombre=htmlspecialchars(strip_tags($this->prv_nombre));

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