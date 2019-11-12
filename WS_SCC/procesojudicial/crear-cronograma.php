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
    $data = json_decode(file_get_contents('php://input'), true);

    if (($_POST["prproceso"])!=null)
    {
      $proceso->id_proceso=trim($_POST["prproceso"]);
      $proceso->monto_cuota=trim($_POST["prcuota"]);
      $proceso->fecha=trim($_POST["prfecha"]);

      if($proceso->create_proceso_judicial_cronograma())
      {
        print_json("0000", "Se creó el cronograma del proceso satisfactoriamente.", $proceso->id_proceso);
      }
      else
      {
        print_json("9999", "Ocurrió un error al crear el cronograma del proceso.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al eliminar el cronograma del proceso.", $exception->getMessage());
  }

?>