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

      $proceso->tipo_transaccion = !empty($_GET['prtipotransaccion']) ? trim($_GET['prtipotransaccion']) : die();
      $proceso->id_transaccion = !empty($_GET['prtransaccion']) ? trim($_GET['prtransaccion']) : die();

      $proceso_list = $proceso->read_procesosxtransaccion();

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
