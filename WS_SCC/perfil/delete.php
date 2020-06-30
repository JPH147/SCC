<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../entities/perfil.php';
  include_once '../shared/utilities.php';

  $database = new Database();
  $db = $database->getConnection();

  try
  {
    $perfil = new Perfil($db);

    if (!empty(trim($_POST["prid"])))
    {
      $perfil->id_perfil = trim($_POST["prid"]);

      if($perfil->delete())
      {
        print_json("0000", "Se eliminó el perfil satisfactoriamente.", true);
      }
      else
      {
        print_json("9999", "Ocurrió un error al eliminar el perfil.", false);
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al eliminar el perfil.", $exception->getMessage());
  }

?>