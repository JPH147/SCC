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
      $proceso->id_proceso=trim($_POST["prproceso"]);
      $proceso->expediente=trim($_POST["prexpediente"]);
      $proceso->instancia=trim($_POST["prinstancia"]);
      $proceso->juez=trim($_POST["prjuez"]);
      $proceso->especialista=trim($_POST["prespecialista"]);
      $proceso->sumilla=trim($_POST["prsumilla"]);

      if($proceso->create_proceso_judicial_traslado())
      {
        print_json("0000", "Se creó el traslado satisfactoriamente.", true);
      }
      else
      {
        print_json("9999", "Ocurrió un error al crear el traslado.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al eliminar el traslado.", $exception->getMessage());
  }

?>