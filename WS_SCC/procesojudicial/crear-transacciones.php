<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../entities/procesojudicial.php';
  include_once '../shared/utilities.php';

  $database = new Database();
  $db = $database->getConnection();

  try
  {
    $proceso = new Proceso($db);
    
    if (($_POST["prproceso"])!=null)
    {
      $proceso->proceso=trim($_POST["prproceso"]);
      $proceso->tipo=trim($_POST["prtipo"]);
      $proceso->transaccion=trim($_POST["prtransaccion"]);

      if($proceso->create_proceso_judicial_transaccion())
      {
        print_json("0000", "Se creó la transacción satisfactoriamente.", true);
      }
      else
      {
        print_json("9999", "Ocurrió un error al crear la transacción.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al eliminar la transacción.", $exception->getMessage());
  }

?>