<?php 

class Subsede{
	private $conn;
	private $table_name = "subsede";

    public $id_subsede;
    public $id_sede;
	public $ssd_nombre;
	public $ssd_abreviatura;
	public $ssd_representante_legal;
	public $dst_nombre;
	public $ssd_direccion;
	public $ssd_telefono;
    public $ssd_codigo_cooperativa;
    public $ssd_estado;


	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
        $query = "CALL sp_listarsubsede(?,?)";
        $result = $this->conn->prepare($query);

		$result->bindParam(1, $this->id_sede);
		$result->bindParam(2, $this->ssd_nombre);

		$result->execute();

		$subsede_list=array();
		$subsede_list["subsede"]=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$subsede_fila = array(
				"numero"=>$contador,
				"id"=>$id_subsede,
				"nombre"=>$ssd_nombre,
				"abreviatura"=>$ssd_abreviatura,
				"representante"=>$ssd_representante_legal,
				"distrito"=>$dst_nombre,
				"direccion"=>$ssd_direccion,
				"telefono"=>$ssd_telefono,
				"codigo"=>$ssd_codigo_cooperativa
			);
			array_push($subsede_list["subsede"],$subsede_fila);
		}
		return $subsede_list;
	}
}

?>