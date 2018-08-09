<?php 
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/tipopago.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$tipopago = new TipoPago($db);

        $tipopago_list = $tipopago->read();

        if (count(array_filter($tipopago_list))>0)
        { 
            print_json("0000", "OK", $tipopago_list);
         }
        else
        { 
            print_json("0001", "No existen tipo de pagos registrados", null);
        }

    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }


?>