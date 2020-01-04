<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Max-Age: 3600");

  include_once '../config/database.php';
  include_once '../entities/procesojudicial.php';
  include_once '../shared/utilities.php';

  $database = new Database();

  $db = $database->getConnection();

  try{
      $proceso = new Proceso($db);

      $proceso->id_proceso = trim($_GET["prproceso"]) ;
      $proceso->tipo_documento = trim($_GET["prdocumento"]) ;
      $proceso->id_proceso_detalle = $_GET["prprocesodetalle"] ? trim($_GET["prprocesodetalle"]) : 0 ;

      $numero_proceso = $proceso->obtener_proximo_numero_judicial_detalle();

      if ( $numero_proceso > 0 )
      { 
        print_json("0000", 1, $numero_proceso);
      }
      else
      { print_json("0001", 0, $numero_proceso); }
  }

  catch(Exception $exception)
  {
      print_json("9999", "Ocurrió un error", $exception->getMessage());
  }

?>
