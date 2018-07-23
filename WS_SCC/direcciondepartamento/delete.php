<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/direcciondepartamento.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
    	$departamento = new Departamento($db);
    	$data = json_decode(file_get_contents('php://input'),true);

    	if(($_POST["prid"])!=null)
    	{
    		$departamento->id_departamento = $_POST["prid"];

	    	if($departamento->delete())
	        {
	                print_json("0000", "Se eliminó el departamento satisfactoriamente.", "");
	        }
	        else
	        {
	                print_json("9999", "Ocurrió un error al eliminar el departamento.", "");
	        }
	    }
    	else
	    {
	            print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el departamento.", $exception->getMessage());
    }

?>