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
      $proceso->codigo=trim($_POST["prcodigo"]);
      $proceso->destinatario=trim($_POST["prdestinatario"]);
      $proceso->anexos=trim($_POST["pranexos"]);
      $proceso->juzgado_fecha_resolucion=$_POST["prjuzgadofecharesolucion"];
      $proceso->juzgado_fecha_notificacion=$_POST["prjuzgadofechanotificacion"];
      $proceso->juzgado_fecha_envio=$_POST["prjuzgadofechaenvio"];
      $proceso->juzgado_fecha_recepcion=$_POST["prjuzgadofecharecepcion"];
      $proceso->central_fecha_notificacion=$_POST["prcentralfechanotificacion"];
      $proceso->central_fecha_cargo=$_POST["prcentralfechacargo"];
      $proceso->comentarios=trim($_POST["prcomentarios"]);
      $proceso->observacion=trim($_POST["probservacion"]);
      $proceso->archivo=trim($_POST["prarchivo"]);

      if($proceso->create_proceso_judicial_notificacion())
      {
        print_json("0000", "Se creó la notificación satisfactoriamente.", true);
      }
      else
      {
        print_json("9999", "Ocurrió un error al crear la notificación.", "");
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