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
    	$transaccion = new TransaccionDetalle($db);
    	$data = json_decode(file_get_contents('php://input'),true);

    	if(($_POST["prid"])!=null)
    	{
            $transaccion->id_transaccion = $_POST["prid"];
            $transaccion->id_producto_serie = $_POST["prproductoserie"];
            $transaccion->cantidad = $_POST["prcantidad"];
            $transaccion->precio =  $_POST["prprecio"];

	    	if($transaccion->update())
	        {
	                print_json("0000", "Se actualizó la transaccion satisfactoriamente.", "");
	        }
	        else
	        {
	                print_json("9999", "Ocurrió un error al actualizar la transaccion.", "");
	        }
	    }
    	else
	    {
	            print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la transaccion.", $exception->getMessage());
    }

?>