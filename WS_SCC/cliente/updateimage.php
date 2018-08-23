<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/cliente.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
    	$cliente = new Cliente($db);
    	$data = json_decode(file_get_contents('php://input'),true);

        if (( ($_POST["idcliente"])!=null) && !empty(trim($_POST["clt_foto"])))
    	{
            $cliente->idcliente= $_POST["idcliente"]; 
    		$cliente->clt_foto = $_POST["clt_foto"];

	    	if($cliente->updatefoto())
	        {
	            print_json("0000", "Se actualizó la foto del cliente satisfactoriamente.", "");
	        }
	        else
	        {
	            print_json("9999", "Ocurrió un error al actualizar la foto del cliente.", "");
	        }
	    }
    	else
	    {
	            print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la foto del cliente.", $exception->getMessage());
    }

?>