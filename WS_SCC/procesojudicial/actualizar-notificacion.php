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
    
    if (($_POST["prprocesonotificacion"])!=null)
    {
      $proceso->id_proceso_notificacion=trim($_POST["prprocesonotificacion"]);
      $proceso->codigo=trim($_POST["prcodigo"]);
      $proceso->destinatario=trim($_POST["prdestinatario"]);
      $proceso->anexos=trim($_POST["pranexos"]);
      $proceso->juzgado_fecha_resolucion= $_POST["prjuzgadofecharesolucion"] == "0" ? null : $_POST["prjuzgadofecharesolucion"] ;
      $proceso->juzgado_fecha_notificacion= $_POST["prjuzgadofechanotificacion"] == "0" ? null : $_POST["prjuzgadofechanotificacion"] ;
      $proceso->juzgado_fecha_envio= $_POST["prjuzgadofechaenvio"] == "0" ? null : $_POST["prjuzgadofechaenvio"] ;
      $proceso->juzgado_fecha_recepcion= $_POST["prjuzgadofecharecepcion"] == "0" ? null : $_POST["prjuzgadofecharecepcion"] ;
      $proceso->central_fecha_notificacion= $_POST["prcentralfechanotificacion"] == "0" ? null : $_POST["prcentralfechanotificacion"] ;
      $proceso->central_fecha_cargo= $_POST["prcentralfechacargo"] == "0" ? null : $_POST["prcentralfechacargo"] ;
      $proceso->comentarios=trim($_POST["prcomentarios"]);
      $proceso->observacion=trim($_POST["probservacion"]);
      $proceso->archivo=trim($_POST["prarchivo"]);

      if($proceso->update_proceso_judicial_notificacion())
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