<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/database.php';
include_once '../entities/perfil.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
$perfil = new Perfil($db);
try
{
    $perfil->idperfil = isset($_GET['idperfil']) ? trim($_GET['idperfil']) : die();
    
    $perfil->readxId();

    $perfil_list = array(
        "prf_nombre"=>$perfil->prf_nombre
    );

    if(!empty(trim($perfil->prf_nombre))){
        print_json("0000", "OK", $perfil_list);
    }
    else{
        print_json("0001", "No se encuentra perfil registrado con el id " . $perfil->idperfil , null);

    }

}
catch(Exception $exception){
    print_json("9999", "Ocurrió un error.", $exception->getMessage());
}
?>