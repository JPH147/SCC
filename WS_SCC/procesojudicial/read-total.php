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

      $proceso->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null;
      $proceso->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null;
      $proceso->estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : -1;

      $proceso_total = $proceso->contarV2();

      if ( $proceso_total > 0 )
      { 
          print_json("0000", $proceso_total, $proceso_total);
      }
      else
      { print_json("0001", 0, 0); }
  }

  catch(Exception $exception)
  {
      print_json("9999", "Ocurrió un error", $exception->getMessage());
  }

?>
