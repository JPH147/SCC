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
      $proceso->id_proceso = trim($_POST["prproceso"]);
      $proceso->fecha = trim($_POST["prfecha"]);
      $proceso->comentarios = trim($_POST["prcomentarios"]);
      $proceso->archivo = trim($_POST["prarchivo"]);

      if($proceso->update_proceso_judicial_devolucion_anexos())
      {
        print_json("0000", "Se actualizo la notificación satisfactoriamente.", true);
      }
      else
      {
        print_json("9999", "Ocurrió un error al actuakizar la notificación.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al actualizar el proceso.", $exception->getMessage());
  }

?>