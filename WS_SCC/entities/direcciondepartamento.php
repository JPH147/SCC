<?php 

class Departamento{
	private $conn;
	//private $table_name = "tipo_producto";

	public $id_departamento;
	public $dpt_nombre;

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listardepartamento(?,?,?)";

		$result = $this->conn->prepare($query);

		$result->bindParam(1, $this->dpt_nombre);
        $result->bindParam(2, $this->numero_pagina);
        $result->bindParam(3, $this->total_pagina);

		$result->execute();

		$departamento_list=array();
		$departamento_list["departamentos"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$departamento_fila = array(
				"numero"=>$contador,
				"id"=>$id_departamento,
				"nombre"=>$dpt_nombre,
			);
			array_push($departamento_list["departamentos"],$departamento_fila);
		}

		return $departamento_list;
	}

    function contar(){

        $query = "CALL sp_listardepartamentocontar(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->dpt_nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function readxId()
    {
        $query ="call sp_listardepartamentoxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_departamento);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->id_departamento=$row['id_departamento'];
        $this->dpt_nombre=$row['dpt_nombre'];
    }

    function delete()
    {
        $query = "call sp_eliminardepartamento(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_departamento);

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
        $query = "CALL sp_creardepartamento(:prnombre)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prnombre", $this->dpt_nombre);

        $this->dpt_nombre=htmlspecialchars(strip_tags($this->dpt_nombre));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function update()
    {
        $query = "call sp_actualizardepartamento(:prid, :prnombre)";
        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_departamento);
        $result->bindParam(":prnombre", $this->dpt_nombre);

        $this->id_departamento=htmlspecialchars(strip_tags($this->id_departamento));
        $this->dpt_nombre=htmlspecialchars(strip_tags($this->dpt_nombre));

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