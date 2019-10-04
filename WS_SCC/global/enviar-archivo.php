<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: text/plain");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    $archivo=trim($_POST["prarchivo"]);

    $file = $archivo;

    if (file_exists($file)) {
        return readfile($file);
    }

?>