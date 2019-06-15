<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/cliente.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$cliente = new Cliente($db);

	try
	{
	    $cliente->dni = isset($_GET['prdni']) ? trim($_GET['prdni']) : die();
	    
		$cliente->search();

	    $cliente_list = array(
            "codigo"=>$cliente->clt_codigo,
            "nombre"=>$cliente->clt_nombre
	    );

	    if(trim($cliente->clt_codigo) != ''){
	        print_json("0000", "OK", $cliente_list);
	    }
	    else{
	        print_json("0001", "No se encuentra el cliente registrado con el dni " . $cliente->dni , null);
	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>