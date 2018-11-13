<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/database.php';
include_once '../entities/almacen.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
$almacen = new Almacen($db);
try
{
    $almacen->idalmacen = isset($_GET['idalmacen']) ? trim($_GET['idalmacen']) : die();
    
    $almacen->readxId();

    $almacen_list = array(
        "alm_nombre"=>$almacen->alm_nombre,
        "alm_descripcion"=>$almacen->alm_descripcion,
        "alm_estado"=>$almacen->alm_estado
    );

    if(!empty(trim($almacen->alm_nombre)) && !empty(trim($almacen->alm_descripcion)) && !empty(trim($almacen->alm_estado))){
        print_json("0000", "OK", $almacen_list);
    }
    else{
        print_json("0001", "No se encuentra usuario registrado con el id " . $almacen->idalmacen , null);

    }

}
catch(Exception $exception){
    print_json("9999", "Ocurrió un error.", $exception->getMessage());
}
?>