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
    
    if (($_POST["prinstanciajuzgado"])!=null)
    {
      $proceso->id_instancia_juzgado=trim($_POST["prinstanciajuzgado"]);

      if($proceso->delete_instancia_juzgado())
      {
        print_json("0000", "Se eliminó la instancia judicial satisfactoriamente.", $proceso->id_instancia_juzgado);
      }
      else
      {
        print_json("9999", "Ocurrió un error al eliminar la instancia judicial.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al eliminar la instancia judicial.", $exception->getMessage());
  }

?>