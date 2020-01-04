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

      $proceso->id_distrito_juzgado = !empty($_GET['priddistritojuzgado']) ? trim($_GET['priddistritojuzgado']) : 0;
      $proceso->distrito_juzgado = !empty($_GET['prdistritojuzgado']) ? trim($_GET['prdistritojuzgado']) : '';
      $proceso->instancia_juzgado = !empty($_GET['prinstanciajuzgado']) ? trim($_GET['prinstanciajuzgado']) : '';
      $proceso->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
      $proceso->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;

      $proceso_list = $proceso->read_instancia();
      $proceso_contar = $proceso->contar_instancia();

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
