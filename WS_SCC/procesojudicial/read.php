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
      $proceso->distrito_judicial = !empty($_GET['prdistrito']) ? trim($_GET['prdistrito']) : '';
      $proceso->juzgado = !empty($_GET['prjuzgado']) ? trim($_GET['prjuzgado']) : '';
      $proceso->dni = !empty($_GET['prdni']) ? trim($_GET['prdni']) : '';
      $proceso->nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';
      $proceso->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null;
      $proceso->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null;
      $proceso->estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 0;
      $proceso->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
      $proceso->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;
      $proceso->orden = !empty($_GET['prorden']) ? trim($_GET['prorden']) : "id asc";

      $proceso_list = $proceso->read();
      $proceso_contar = $proceso->contar();

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
