<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/x-www-form-urlencoded; charset=UTF-8");
    header("Content-Type:multipart/form-data");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/cooperativa-configuracion.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $cooperativa = new Cooperativa($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if ( !empty(trim($_POST["prid"])))
        {
          $cooperativa->id_cooperativa = trim($_POST["prid"]);  
            
          if($cooperativa->delete())
          {
            print_json("0000", "Se eliminó la dirección de la cooperativa satisfactoriamente.", true);
          }
          else
          {
            print_json("9999", "Ocurrió un error al eliminar la dirección de la cooperativa.", "");
          }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
      print_json("9999", "Ocurrió un error al eliminar la dirección de la cooperativa.", $exception->getMessage());
    }

?>