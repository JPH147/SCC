<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/x-www-form-urlencoded; charset=UTF-8");
    header("Content-Type:multipart/form-data");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/cronograma.php';
    include_once '../shared/utilities.php';


    try
    {
        $cronograma = new Cronograma();

        $array = $cronograma->create(date_create("2018-07-19"),100,20);

        print_json("0000", "OK", $array);
        
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al generar el cronograma.", $exception->getMessage());
    }

?>