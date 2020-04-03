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

        if (( ($_POST["idcliente"])!=null))
    	{
            $cliente->idcliente= trim($_POST["idcliente"]); 
    		$cliente->id_subsede = trim($_POST["id_subsede"]);
            $cliente->id_cargo = trim($_POST["prcargo"]);
            $cliente->id_cargo_estado = trim($_POST["prcargoestado"]);
            $cliente->clt_codigo = trim($_POST["clt_codigo"]);
            $cliente->clt_dni = trim($_POST["clt_dni"]);
            $cliente->clt_nombre = trim($_POST["clt_nombre"]);
            $cliente->clt_cip = trim($_POST["clt_cip"]);
            $cliente->clt_email = trim($_POST["clt_email"]);
            $cliente->clt_casilla = trim($_POST["clt_casilla"]);

	    	if($cliente->update_parcial())
	        {
	            print_json("0000", "Se actualizó el cliente satisfactoriamente.", "");
	        }
	        else
	        {
	            print_json("9999", "Ocurrió un error al actualizar el cliente.", "");
	        }
	    }
    	else
	    {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el cliente.", $exception->getMessage());
    }

?>