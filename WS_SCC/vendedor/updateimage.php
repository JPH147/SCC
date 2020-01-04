<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/vendedor.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
    	$vendedor = new Vendedor($db);
    	$data = json_decode(file_get_contents('php://input'),true);

        if (( ($_POST["prvendedor"])!=null) && !empty(trim($_POST["prfoto"])))
    	{
            $vendedor->idvendedor= trim($_POST["prvendedor"]); 
    		$vendedor->foto = trim($_POST["prfoto"]);

	    	if( $vendedor->updatefoto() )
	        {
	            print_json("0000", "Se actualizó la foto del vendedor satisfactoriamente.", "");
	        }
	        else
	        {
	            print_json("9999", "Ocurrió un error al actualizar la foto del vendedor.", "");
	        }
	    }
    	else
	    {
	            print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la foto del vendedor.", $exception->getMessage());
    }

?>