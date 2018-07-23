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
	    $cliente->idcliente = isset($_GET['idcliente']) ? $_GET['idcliente'] : die();
	    
		$cliente->readxId();

	    $cliente_list = array(
                "inst_nombre"=>$cliente->inst_nombre,
                "clt_codigo"=>$cliente->clt_codigo,
                "clt_dni"=>$cliente->clt_dni,
                "clt_nombre"=>$cliente->clt_nombre,
                "clt_apellido"=>$cliente->clt_apellido,
                "clt_foto"=>$cliente->clt_foto,
                "clt_cip"=>$cliente->clt_cip,
                "clt_email"=>$cliente->clt_email,
                "clt_casilla"=>$cliente->clt_casilla,
                "clt_trabajo"=>$cliente->clt_trabajo,
                "clt_cargo"=>$cliente->clt_cargo,
                "clt_calificacion_crediticia"=>$cliente->clt_calificacion_crediticia,
                "clt_calificacion_personal"=>$cliente->clt_calificacion_personal,
                "clt_aporte"=>$cliente->clt_aporte,
                "clt_fecharegistro"=>$cliente->clt_fecharegistro
	    );

	    if(trim($cliente->clt_dni)!= ''){
	        print_json("0000", "OK", $cliente_list);
	    }
	    else{
	        print_json("0001", "No se encuentra producto registrado con el id " . $cliente->idcliente , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>