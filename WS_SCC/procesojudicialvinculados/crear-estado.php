<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../entities/procesojudicial_vinculados.php';
  include_once '../shared/utilities.php';

  $database = new Database();
  $db = $database->getConnection();

  try
  {
    $proceso = new ProcesoVinculados($db);
    
    if (($_POST["prnombre"])!=null)
    {
      $proceso->id_proceso_documento=trim($_POST["prdocumento"]);
      $proceso->nombre=trim($_POST["prnombre"]);

      if($proceso->create_estado())
      {
        print_json("0000", "Se creó el estado judicial satisfactoriamente.", true);
      }
      else
      {
        print_json("9999", "Ocurrió un error al crear el estado judicial.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al eliminar el estado judicial.", $exception->getMessage());
  }

?>