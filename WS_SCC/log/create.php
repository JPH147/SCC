<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../entities/log.php';
  include_once '../shared/utilities.php';

  $database = new Database();
  $db = $database->getConnection();

  try
  {
    $log = new Log($db);

    if (!empty(trim($_POST["prreferencia"])))
    {
      $id_referencia = trim($_POST["prreferencia"]);
      $id_accion = trim($_POST["praccion"]);
      $documento_referencia = trim($_POST["prdocumentoreferencia"]);

      $usuario_alvis = trim($_POST["usuario_alvis"]) ;

      if( $log->create($usuario_alvis, $id_referencia, $id_accion, $documento_referencia) )
      {
        print_json("0000", "Se creó el perfil satisfactoriamente.", true);
      }
      else
      {
        print_json("9999", "Ocurrió un error al crear el perfil.", false);
      }
    }
    else
    {
        print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al crear el perfil.", $exception->getMessage());
  }

?>