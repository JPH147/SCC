<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
    	$venta = new Venta($db);
    	$data = json_decode(file_get_contents('php://input'),true);

    	if(trim($_POST["prventa"])!=null)
    	{
    		$venta->id_venta = trim($_POST["prventa"]);
            $venta->cuota_penalidad = trim($_POST["prcuotapenalidad"]);
            $venta->numero_cuotas = trim($_POST["prnumerocuotas"]);
            $venta->fecha_inicio = trim($_POST["prfechainicio"]);
            $venta->tipo_pago = trim($_POST["prtipopago"]);

	    	if($venta->crear_penalidad_venta())
	        {
            print_json("0000", "Se eliminó la venta satisfactoriamente.", true);
	        }
	        else
	        {
            print_json("9999", "Ocurrió un error al eliminar la venta.", false);
	        }
	    }
    	else
	    {
        print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la venta.", $exception->getMessage());
    }

?>