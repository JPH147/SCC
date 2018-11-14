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

    	$tipo_producto->id_tipo_producto = !empty($_GET['prproducto']) ? trim($_GET['prproducto']) : null;

    	$unidad_medida_list = $tipo_producto->read_unidadmedida();

    	if (count(array_filter($unidad_medida_list))>0)
    	{
    		print_json("0000", 1,$unidad_medida_list);
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