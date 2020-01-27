<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Max-Age: 3600");

  include_once '../config/database.php';
  include_once '../entities/procesojudicial_vinculados.php';
  include_once '../shared/utilities.php';

  $database = new Database();

  $db = $database->getConnection();

  try{
      $proceso = new ProcesoVinculados($db);

      $proceso->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';

      $proceso_list = $proceso->read_distrito_activo();

      if (count(array_filter($proceso_list))>0)
      { 
          print_json("0000", 0, $proceso_list);
      }
      else
      { print_json("0001", 0, $proceso_list); }
  }

  catch(Exception $exception)
  {
      print_json("9999", "Ocurrió un error", $exception->getMessage());
  }

?>
