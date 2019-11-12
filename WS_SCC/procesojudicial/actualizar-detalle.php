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
      $proceso->tipo_documento=trim($_POST["prdocumento"]);
      $proceso->fecha=trim($_POST["prfecha"]);
      $proceso->numero=trim($_POST["prnumero"]);
      $proceso->sumilla=trim($_POST["prsumilla"]);
      $proceso->archivo=trim($_POST["prarchivo"]);
      $proceso->comentarios=trim($_POST["prcomentarios"]);

      if($proceso->update_proceso_judicial_detalle())
      {
        print_json("0000", "Se actualizar el detalle del proceso satisfactoriamente.", $proceso->id_proceso);
      }
      else
      {
        print_json("9999", "Ocurrió un error al actualizar el detalle del proceso.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al actualizar el detalle del proceso.", $exception->getMessage());
  }

?>