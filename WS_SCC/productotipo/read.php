<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/productotipo.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$tipo_producto = new Tipo_Producto($db);

<<<<<<< HEAD
    	$tipo_producto->tprd_nombre = !empty($_GET['prnombre']) trim(? $_GET['prnombre']) : null;
=======
    	$tipo_producto->tprd_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : null;
>>>>>>> 2d425fe34127d1eae71278d7be7bf87585aa22f6
    	$tipo_producto->und_nombre = !empty($_GET['prum']) ? trim($_GET['prum']) : null;

    	$tipo_producto_list = $tipo_producto->read();

    	if (count(array_filter($tipo_producto_list))>0)
    	{
    		print_json("0000", count(array_filter($tipo_producto_list)),$tipo_producto_list);
    	}
    	else
    	{
    		print_json("0001", "No existen tipos de producto registrados", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>