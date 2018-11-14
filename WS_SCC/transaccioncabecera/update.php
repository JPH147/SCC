<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/transaccioncabecera.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
    	$transaccion = new TransaccionCabecera($db);
    	$data = json_decode(file_get_contents('php://input'),true);

    	if(trim($_POST["prid"])!=null)
    	{
            $transaccion->id_transaccion = trim($_POST["prid"]);
            $transaccion->id_almacen = trim($_POST["pralmacen"]);
            $transaccion->id_tipo = trim($_POST["prtipo"]);
            $transaccion->id_referencia = trim($_POST["prreferencia"]);
            $transaccion->id_proveedor = !empty($_POST["prproveedor"]) ? trim($_POST["prproveedor"]) : null;
            $transaccion->id_cliente = !empty($_POST["prcliente"]) ? trim($_POST["prcliente"]) : null;
            $transaccion->id_salida_venta = !empty($_POST["prsalida"]) ? trim($_POST["prsalida"]) : null;
            $transaccion->id_sucursal = !empty($_POST["prsucursal"]) ? trim($_POST["prsucursal"]) : null;
            $transaccion->id_vendedor = !empty($_POST["prvendedor"]) ? trim($_POST["prvendedor"]) : null;
            $transaccion->fecha = trim($_POST["prfecha"]);
            $transaccion->documento = trim($_POST["prdocumento"]);

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