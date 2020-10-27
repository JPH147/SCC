<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../entities/procesojudicial.php';
  include_once '../entities/log.php';
  include_once '../shared/utilities.php';

  $database = new Database();
  $db = $database->getConnection();
  
  try
  {
    $log = new Log($db);
    $proceso = new Proceso($db);
    
    if (($_POST["prcredito"])!=null)
    {

      $proceso->id_venta=trim($_POST["prventa"]);
      $proceso->id_credito=trim($_POST["prcredito"]);
      $proceso->expediente=trim($_POST["prexpediente"]);
      $proceso->instancia=trim($_POST["prinstancia"]);
      $proceso->juez=trim($_POST["prjuez"]);
      $proceso->especialista=trim($_POST["prespecialista"]);
      $proceso->fecha_inicio=trim($_POST["prfecha"]);
      $proceso->sumilla=trim($_POST["prsumilla"]);
      $proceso->numero_cuotas=trim($_POST["prnumerocuotas"]);
      $proceso->total=trim($_POST["prtotal"]);

      $usuario_alvis = trim($_GET["usuario_alvis"]) ;

      if($proceso->create_proceso_judicial())
      {
        $log->create($usuario_alvis, 1, 1, $proceso->id_proceso) ;

        print_json("0000", "Se creó el proceso satisfactoriamente.", $proceso->id_proceso);
      }
      else
      {
        print_json("9999", "Ocurrió un error al crear el proceso.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al eliminar el proceso.", $exception->getMessage());
  }

?>