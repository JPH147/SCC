<?php 

class Sede{
	private $conn;
	private $table_name = "sede";

	public $id_sede;
	public $id_institucion;
	public $sd_nombre;
	public $sd_abreviatura;
	public $sd_representante_legal;
	public $dst_nombre;
	public $sd_direccion;
	public $sd_telefono;
    public $sd_codigo_cooperativa;
    public $sd_estado;


	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
        $query = "CALL sp_listarsede(?,?)";
        $result = $this->conn->prepare($query);

		$result->bindParam(1, $this->id_institucion);
		$result->bindParam(2, $this->sd_nombre);

		$result->execute();

		$sede_list=array();
		$sede_list["sede"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$sede_fila = array(
				"numero"=>$contador,
				"id"=>$id_sede,
				"nombre"=>$sd_nombre,
				"abreviatura"=>$sd_abreviatura,
				"representante"=>$sd_representante_legal,
				"distrito"=>$dst_nombre,
				"direccion"=>$sd_direccion,
				"telefono"=>$sd_telefono,
				"codigo"=>$sd_codigo_cooperativa
			);
			array_push($sede_list["sede"],$sede_fila);
		}
		return $sede_list;
	}
}

?>