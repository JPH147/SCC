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
	    $cliente->idcliente = isset($_GET['idcliente']) ? trim($_GET['idcliente']) : die();
	    
		$cliente->readxId();

	    $cliente_list = array(
				"id" => $cliente->idcliente,
				"institucion"=>$cliente->id_institucion,
				"sede"=>$cliente->id_sede,
                "subsede"=>$cliente->id_subsede,
                "id_cargo"=>$cliente->id_cargo,
                "cargo"=>$cliente->cargo,
                "id_cargo_estado"=>$cliente->id_cargo_estado,
                "cargo_estado"=>$cliente->cargo_estado,
                "codigo"=>$cliente->clt_codigo,
                "dni"=>$cliente->clt_dni,
                "nombre"=>$cliente->clt_nombre,
                "foto"=>$cliente->clt_foto,
                "cip"=>$cliente->clt_cip,
                "email"=>$cliente->clt_email,
                "casilla"=>$cliente->clt_casilla,
                "trabajo"=>$cliente->clt_trabajo,
                "id_distrito_trabajo"=>$cliente->id_distrito_trabajo,
                "id_provincia"=>$cliente->id_provincia,
                "provincia"=>$cliente->provincia,
                "departamento"=>$cliente->departamento,
                "id_departamento"=>$cliente->id_departamento,
                "capacidad_pago"=>$cliente->capacidad_pago,
                "maximo_descuento"=>$cliente->clt_maximo_descuento,
                "calificacion_personal"=>$cliente->clt_calificacion_personal,
                "aporte"=>$cliente->clt_aporte,
                "fecharegistro"=>$cliente->clt_fecharegistro
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