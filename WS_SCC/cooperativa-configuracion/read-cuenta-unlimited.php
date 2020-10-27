<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/cooperativa-configuracion.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $cooperativa = new Cooperativa($db);

        if ( !empty($_POST['prcuenta']) ) {
          
          $cooperativa->id_cooperativa_cuenta = $_POST['prcuenta'] ;
          $cooperativa->archivo = !empty($_POST['prarchivo']) ;
  
          $cooperativa_list = $cooperativa->read_cuenta_unlimited();
  
          if ( $cooperativa_list ) { 
            print_json("0000", 1, $cooperativa_list);
          }
          else {
            print_json("0001", 0, false);
          }
        } else {
          print_json("9999", "0", "Los campos no pueden estar vacíos");
        }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>