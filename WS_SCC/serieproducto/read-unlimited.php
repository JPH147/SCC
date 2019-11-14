<?php

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Max-Age: 3600");
  //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../entities/serieproducto.php';
  include_once '../shared/utilities.php';

  $database = new Database();
  $db = $database->getConnection();

  try{
    $producto_serie = new SerieProducto($db);

    $producto_serie->archivo = !empty($_GET['prarchivo']) ? trim($_GET['prarchivo']) : "";
    $producto_serie->serie = !empty($_GET['prserie']) ? trim($_GET['prserie']) : "";

    $producto_serie_list = $producto_serie->read_unlimited();
    
    if ($producto_serie_list)
    { 
      print_json("0000", 1,$producto_serie_list);
    }
    else
    { print_json("0001", "No existen serie registrados", null); }
  }

  catch(Exception $exception)
  {
      print_json("9999", "Ocurrió un error", $exception->getMessage());
  }

?>