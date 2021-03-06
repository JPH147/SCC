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

      $proceso->id_proceso = !empty($_GET['prproceso']) ? trim($_GET['prproceso']) :'';

      $proceso_list = $proceso->read_procesosjudicialesnotificacionxproceso() ;
      $proceso_contar = count($proceso_list) ;

      if (count(array_filter($proceso_list))>0)
      { 
          print_json("0000", $proceso_contar, $proceso_list);
      }
      else
      { print_json("0001", $proceso_contar, $proceso_list); }
  }

  catch(Exception $exception)
  {
      print_json("9999", "Ocurrió un error", $exception->getMessage());
  }

?>
