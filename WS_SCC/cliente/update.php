<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/producto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
    	$cliente = new Cliente($db);
    	$data = json_decode(file_get_contents('php://input'),true);

        if (( ($_POST["idcliente"])!=null) && ($_POST["id_subsede"])!=null  && !empty(trim($_POST["clt_codigo"])) && !empty(trim($_POST["clt_dni"]))
            && !empty(trim($_POST["clt_nombre"])) && !empty(trim($_POST["clt_apellido"]))
            && !empty(trim($_POST["clt_cip"])) && !empty(trim($_POST["clt_email"])) && !empty(trim($_POST["clt_casilla"]))
            && !empty(trim($_POST["clt_trabajo"])) && !empty(trim($_POST["clt_cargo"])) && !empty(trim($_POST["clt_calificacion_crediticia"]))
            && !empty(trim($_POST["clt_calificacion_personal"])) && ($_POST["clt_aporte"])!=null)
    	{
    		$producto->id_producto = $_POST["id_producto"];
            $producto->id_modelo = $_POST["id_modelo"];
            $producto->prd_descripcion = $_POST["prd_descripcion"];
            $producto->prd_precio = $_POST["prd_precio"];

            $this->idcliente=htmlspecialchars(strip_tags($this->idcliente));
            $this->id_subsede=htmlspecialchars(strip_tags($this->id_subsede));
            $this->clt_codigo=htmlspecialchars(strip_tags($this->clt_codigo));
            $this->clt_dni=htmlspecialchars(strip_tags($this->clt_dni));
            $this->clt_nombre=htmlspecialchars(strip_tags($this->clt_nombre));
            $this->clt_apellido=htmlspecialchars(strip_tags($this->clt_apellido));
            $this->clt_foto=htmlspecialchars(strip_tags($this->clt_foto));
            $this->clt_cip=htmlspecialchars(strip_tags($this->clt_cip));
            $this->clt_email=htmlspecialchars(strip_tags($this->clt_email));
            $this->clt_casilla=htmlspecialchars(strip_tags($this->clt_casilla));
            $this->clt_trabajo=htmlspecialchars(strip_tags($this->clt_trabajo));        
            $this->clt_cargo=htmlspecialchars(strip_tags($this->clt_cargo));
            $this->clt_calificacion_crediticia=htmlspecialchars(strip_tags($this->clt_calificacion_crediticia));
            $this->clt_calificacion_personal=htmlspecialchars(strip_tags($this->clt_calificacion_personal));        
            $this->clt_aporte=htmlspecialchars(strip_tags($this->clt_aporte));







	    	if($producto->update())
	        {
	            print_json("0000", "Se actualizó el producto satisfactoriamente.", "");
	        }
	        else
	        {
	            print_json("9999", "Ocurrió un error al actualizar el producto.", "");
	        }
	    }
    	else
	    {
	            print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el producto.", $exception->getMessage());
    }

?>