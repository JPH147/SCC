<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/database.php';
include_once '../entities/modulo.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
$modulo = new Modulo($db);
try
{
    $modulo->idmodulo = isset($_GET['idmodulo']) ? $_GET['idmodulo'] : die();
    
    $modulo->readxId();

    $modulo_list = array(
        "mdl_nombre"=>$modulo->mdl_nombre
    );

    if(!empty(trim($modulo->mdl_nombre))){
        print_json("0000", "OK", $modulo_list);
    }
    else{
        print_json("0001", "No se encuentra modulo registrado con el id " . $modulo->idmodulo , null);

    }

}
catch(Exception $exception){
    print_json("9999", "Ocurrió un error.", $exception->getMessage());
}
?>