<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/transacciondetalle.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
    	$transaccion = new transacciondetalle($db);
    	$data = json_decode(file_get_contents('php://input'),true);

    	if(($_POST["prid"])!=null)
    	{
    		$transaccion->id_transaccion = $_POST["prid"];

	    	if($transaccion->delete())
	        {
	                print_json("0000", "Se eliminó el detalle satisfactoriamente.", "");
	        }
	        else
	        {
	                print_json("9999", "Ocurrió un error al eliminar el detalle.", "");
	        }
	    }
    	else
	    {
	            print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el detalle.", $exception->getMessage());
    }

?>