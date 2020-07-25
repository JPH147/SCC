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

      $proceso->expediente = !empty($_GET['prexpediente']) ? trim($_GET['prexpediente']) :'';

      $proceso_list = $proceso->verificar_procesojudicial_expediente();

      if ( $proceso_list >= 0 )
      { 
          print_json("0000", $proceso_list , $proceso_list );
      }
      else
      { print_json("0001", $proceso_list , $proceso_list ); }
  }

  catch(Exception $exception)
  {
      print_json("9999", "Ocurrió un error", $exception->getMessage());
  }

?>