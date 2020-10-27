<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/log.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$log = new Log($db);

      $log->usuario = !empty($_GET['prusuario']) ? trim($_GET['prusuario']) : '' ;
      $log->accion = !empty($_GET['praccion']) ? trim($_GET['praccion']) : -1 ;
      $log->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null ;
      $log->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null ;
      $log->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1 ;
      $log->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10 ;

    	$log_list = $log->read();
    	$log_contar = $log->contar();

    	if (count(array_filter($log_list))>0)
    	{
    		print_json("0000", $log_contar, $log_list);
    	}
    	else
    	{
    		print_json("0001", "No existen logs registradas", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }


?>