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
    
    if (($_POST["prprocesoestado"])!=null)
    {
      $proceso->id_proceso_estado=trim($_POST["prprocesoestado"]);
      $proceso->id_proceso_documento=trim($_POST["prdocumento"]);
      $proceso->nombre=trim($_POST["prnombre"]);

      if($proceso->update_estado())
      {
        print_json("0000", "Se actualizó el distrito judicial satisfactoriamente.", $proceso->id_distrito_juzgado);
      }
      else
      {
        print_json("9999", "Ocurrió un error al actualizar el distrito judicial.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al actualizar el distrito judicial.", $exception->getMessage());
  }

?>