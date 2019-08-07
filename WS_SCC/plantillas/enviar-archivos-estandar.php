<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: text/plain");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/plantillas.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    $plantillas = new Plantillas($db);

    $plantillas->archivo=trim($_POST["prarchivo"]);

    $file = $plantillas->path_estandar.$plantillas->archivo;

    if (file_exists($file)) {
        return readfile($file);
    }

?>