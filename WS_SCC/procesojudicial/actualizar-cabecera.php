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
    // $data = json_decode(file_get_contents('php://input'), true);

    
    if (($_POST["prproceso"])!=null)
    {

      $proceso->id_proceso=trim($_POST["prproceso"]);
      $proceso->expediente=trim($_POST["prexpediente"]);
      $proceso->juzgado=trim($_POST["prjuzgado"]);
      $proceso->fecha_inicio=trim($_POST["prfecha"]);
      $proceso->sumilla=trim($_POST["prsumilla"]);
      $proceso->numero_cuotas=trim($_POST["prnumerocuotas"]);
      $proceso->total=trim($_POST["prtotal"]);

      if($proceso->update_proceso_judicial())
      {
        print_json("0000", "Se actualizó el proceso satisfactoriamente.", $proceso->id_proceso);
      }
      else
      {
        print_json("9999", "Ocurrió un error al actualizar el proceso.", "");
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