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
	public $institucion;
	public $nombre;
	public $numero_pagina;
	public $total_pagina;
	public $abreviatura;
	public $representante;
	public $distrito;
	public $direccion;
	public $telefono;
	public $codigo_cooperativa;
	public $plantilla_tarjeta;
	public $plantilla_autorizacion;
	public $plantilla_ddjj;
	public $plantilla_compromiso;
	public $plantilla_ttransaccion;
	public $parametro_condicion;
	public $parametro_domicilio;
	public $parametro_autorizacion_1;
	public $parametro_autorizacion_2;

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
				"codigo"=>$sd_codigo_cooperativa,
				"plantilla_tarjeta_socio"=>$plantilla_tarjeta_socio,
				"plantilla_autorizacion"=>$plantilla_autorizacion,
				"plantilla_ddjj"=>$plantilla_ddjj,
				"plantilla_compromiso"=>$plantilla_compromiso,
				"plantilla_transaccion"=>$plantilla_transaccion,
				"parametro_condicion" => $parametro_condicion,
				"parametro_domicilio" => $parametro_domicilio,
				"parametro_autorizacion_1" => $parametro_autorizacion_1,
				"parametro_autorizacion_2" => $parametro_autorizacion_2
			);
			array_push($sede_list["sede"],$sede_fila);
		}
		return $sede_list;
	}

	function read_normal(){
		$query = "CALL sp_listarsedes(?,?,?,?)";

		$result = $this->conn->prepare($query);

        $result->bindParam(1, $this->institucion);
        $result->bindParam(2, $this->nombre);
        $result->bindParam(3, $this->numero_pagina);
        $result->bindParam(4, $this->total_pagina);

		$result->execute();

		$sede_list=array();
		$sede_list["sede"]=array();

		$contador = $this->total_pagina*($this->numero_pagina-1);

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$item = array(
				"numero"=>$contador,
				"id" => $id ,
				"id_institucion" => $id_institucion ,
				"institucion" => $institucion ,
				"nombre" => $nombre ,
				"abreviatura" => $abreviatura ,
				"codigo_cooperativa" => $codigo_cooperativa 
			);
			array_push($sede_list["sede"],$item);
		}
		return $sede_list;
	}

	function read_normal_contar(){
		$query = "CALL sp_listarsedescontar(?,?)";

		$result = $this->conn->prepare($query);

        $result->bindParam(1, $this->institucion);
        $result->bindParam(2, $this->nombre);

		$result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
	}

	function read_parametros(){
		$query = "CALL sp_listarsedeparametros(?)";

		$result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_sede);

		$result->execute();

		$sede_list=array();

		$contador = 0;

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$item = array(
				"parametro_condicion" => $parametro_condicion ,
				"parametro_domicilio" => $parametro_domicilio ,
				"parametro_autorizacion_1" => $parametro_autorizacion_1 ,
				"parametro_autorizacion_2" => $parametro_autorizacion_2
			);
			array_push($sede_list,$item);
		}
		return $sede_list;
	}

    function delete(){
		$query = "CALL sp_eliminarsede(
		  :prsede
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prsede", $this->id_sede);
  
		$this->id_sede=htmlspecialchars(strip_tags($this->id_sede));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

    function create(){
		$query = "CALL sp_crearsede(
			:prinstitucion,
			:prnombre,
			:prabreviatura,
			:prrepresentante,
			:prdistrito,
			:prdireccion,
			:prtelefono,
			:prcodigocooperativa,
			:prplantillatarjeta,
			:prplantillaautorizacion,
			:prplantilladdjj,
			:prplantillacompromiso,
			:prplantillattransaccion
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prinstitucion", $this->institucion);
		$result->bindParam(":prnombre", $this->nombre);
		$result->bindParam(":prabreviatura", $this->abreviatura);
		$result->bindParam(":prrepresentante", $this->representante);
		$result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
		$result->bindParam(":prtelefono", $this->telefono);
		$result->bindParam(":prcodigocooperativa", $this->codigo_cooperativa);
		$result->bindParam(":prplantillatarjeta", $this->plantilla_tarjeta);
		$result->bindParam(":prplantillaautorizacion", $this->plantilla_autorizacion);
		$result->bindParam(":prplantilladdjj", $this->plantilla_ddjj);
		$result->bindParam(":prplantillacompromiso", $this->plantilla_compromiso);
		$result->bindParam(":prplantillattransaccion", $this->plantilla_ttransaccion);
  
		$this->institucion=htmlspecialchars(strip_tags($this->institucion));
		$this->nombre=htmlspecialchars(strip_tags($this->nombre));
		$this->abreviatura=htmlspecialchars(strip_tags($this->abreviatura));
		$this->representante=htmlspecialchars(strip_tags($this->representante));
		$this->distrito=htmlspecialchars(strip_tags($this->distrito));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
		$this->telefono=htmlspecialchars(strip_tags($this->telefono));
		$this->codigo_cooperativa=htmlspecialchars(strip_tags($this->codigo_cooperativa));
		$this->plantilla_tarjeta=htmlspecialchars(strip_tags($this->plantilla_tarjeta));
		$this->plantilla_autorizacion=htmlspecialchars(strip_tags($this->plantilla_autorizacion));
		$this->plantilla_ddjj=htmlspecialchars(strip_tags($this->plantilla_ddjj));
		$this->plantilla_compromiso=htmlspecialchars(strip_tags($this->plantilla_compromiso));
		$this->plantilla_ttransaccion=htmlspecialchars(strip_tags($this->plantilla_ttransaccion));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

    function update(){
		$query = "CALL sp_actualizarsede(
			:prid,
			:prinstitucion,
			:prnombre,
			:prabreviatura,
			:prrepresentante,
			:prdistrito,
			:prdireccion,
			:prtelefono,
			:prcodigocooperativa,
			:prplantillatarjeta,
			:prplantillaautorizacion,
			:prplantilladdjj,
			:prplantillacompromiso,
			:prplantillattransaccion
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prid", $this->id_sede);
		$result->bindParam(":prinstitucion", $this->institucion);
		$result->bindParam(":prnombre", $this->nombre);
		$result->bindParam(":prabreviatura", $this->abreviatura);
		$result->bindParam(":prrepresentante", $this->representante);
		$result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
		$result->bindParam(":prtelefono", $this->telefono);
		$result->bindParam(":prcodigocooperativa", $this->codigo_cooperativa);
		$result->bindParam(":prplantillatarjeta", $this->plantilla_tarjeta);
		$result->bindParam(":prplantillaautorizacion", $this->plantilla_autorizacion);
		$result->bindParam(":prplantilladdjj", $this->plantilla_ddjj);
		$result->bindParam(":prplantillacompromiso", $this->plantilla_compromiso);
		$result->bindParam(":prplantillattransaccion", $this->plantilla_ttransaccion);
  
		$this->id_sede=htmlspecialchars(strip_tags($this->id_sede));
		$this->institucion=htmlspecialchars(strip_tags($this->institucion));
		$this->nombre=htmlspecialchars(strip_tags($this->nombre));
		$this->abreviatura=htmlspecialchars(strip_tags($this->abreviatura));
		$this->representante=htmlspecialchars(strip_tags($this->representante));
		$this->distrito=htmlspecialchars(strip_tags($this->distrito));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
		$this->telefono=htmlspecialchars(strip_tags($this->telefono));
		$this->codigo_cooperativa=htmlspecialchars(strip_tags($this->codigo_cooperativa));
		$this->plantilla_tarjeta=htmlspecialchars(strip_tags($this->plantilla_tarjeta));
		$this->plantilla_autorizacion=htmlspecialchars(strip_tags($this->plantilla_autorizacion));
		$this->plantilla_ddjj=htmlspecialchars(strip_tags($this->plantilla_ddjj));
		$this->plantilla_compromiso=htmlspecialchars(strip_tags($this->plantilla_compromiso));
		$this->plantilla_ttransaccion=htmlspecialchars(strip_tags($this->plantilla_ttransaccion));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

    function update_parametros(){
		$query = "CALL sp_actualizarsedeparametros(
			:prid,
			:prcondicion,
			:prdomicilio,
			:prautorizacion1,
			:prautorizacion2
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prid", $this->id_sede);
		$result->bindParam(":prcondicion", $this->parametro_condicion);
		$result->bindParam(":prdomicilio", $this->parametro_domicilio);
		$result->bindParam(":prautorizacion1", $this->parametro_autorizacion_1);
		$result->bindParam(":prautorizacion2", $this->parametro_autorizacion_2);
  
		$this->id_sede=htmlspecialchars(strip_tags($this->id_sede));
		$this->parametro_condicion=htmlspecialchars(strip_tags($this->parametro_condicion));
		$this->parametro_domicilio=htmlspecialchars(strip_tags($this->parametro_domicilio));
		$this->parametro_autorizacion_1=htmlspecialchars(strip_tags($this->parametro_autorizacion_1));
		$this->parametro_autorizacion_2=htmlspecialchars(strip_tags($this->parametro_autorizacion_2));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

}

?>