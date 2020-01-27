<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../entities/procesojudicial_vinculados.php';
  include_once '../shared/utilities.php';

  $database = new Database();
  $db = $database->getConnection();

  try
  {
    $proceso = new ProcesoVinculados($db);
    
    if (($_POST["prid"])!=null)
    {
      $proceso->id_instancia_juzgado=trim($_POST["prid"]);
      $proceso->id_distrito_juzgado=trim($_POST["prdistritojuzgado"]);
      $proceso->tipo_juez=trim($_POST["prtipojuez"]);
      $proceso->juzgado_juez=trim($_POST["prjuzgadojuez"]);

      if($proceso->update_juzgado_juez())
      {
        print_json("0000", "Se actualizó el juez satisfactoriamente.", $proceso->id_instancia_juzgado);
      }
      else
      {
        print_json("9999", "Ocurrió un error al actualizar el juez.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al actualizar el juez.", $exception->getMessage());
  }

?>