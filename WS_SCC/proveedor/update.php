<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/proveedor.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
    	$proveedor = new Proveedor($db);
    	$data = json_decode(file_get_contents('php://input'),true);

        if (( trim($_POST["idproveedor"])!=null) && trim($_POST["prv_tipo_documento"])!=null  
            && !empty(trim($_POST["prv_documento"])) 
            && !empty(trim($_POST["prv_nombre"]))
            && !empty(trim($_POST["prv_representante_legal"]))
            && !empty(trim($_POST["prv_observacion"]))) 
    	{
            $proveedor->idproveedor= trim($_POST["idproveedor"]); 
    		$proveedor->prv_tipo_documento = trim($_POST["prv_tipo_documento"]);
            $proveedor->prv_documento = trim($_POST["prv_documento"]);
            $proveedor->prv_nombre = trim($_POST["prv_nombre"]);
            $proveedor->prv_representante_legal = trim($_POST["prv_representante_legal"]);
            $proveedor->prv_observacion = trim($_POST["prv_observacion"]);
           
           
	    	if($proveedor->update())
	        {
	            print_json("0000", "Se actualizó el proveedor satisfactoriamente.", "");
	        }
	        else
	        {
	            print_json("9999", "Ocurrió un error al actualizar el proveedor.", "");
	        }
	    }
    	else
	    {
	            print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el proveedor.", $exception->getMessage());
    }

?>