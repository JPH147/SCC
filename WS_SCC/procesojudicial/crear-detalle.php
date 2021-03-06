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
    $data = json_decode(file_get_contents('php://input'), true);

    
    if (($_POST["prproceso"])!=null)
    {

      $proceso->id_proceso=trim($_POST["prproceso"]);
      $proceso->tipo_documento=trim($_POST["prdocumento"]);
      $proceso->fecha=trim($_POST["prfecha"]);
      $proceso->trabajador=trim($_POST["prtrabajador"]);
      $proceso->id_estado=trim($_POST["prestado"]);
      $proceso->numero=trim($_POST["prnumero"]);
      $proceso->sumilla=trim($_POST["prsumilla"]);
      $proceso->archivo=trim($_POST["prarchivo"]);
      $proceso->comentarios=trim($_POST["prcomentarios"]);
      $proceso->fecha_notificacion_demandado=trim($_POST["prfechanotificaciondemandado"]) == 0 ? null : $_POST["prfechanotificaciondemandado"] ;
      $proceso->fecha_notificacion_cooperativa=trim($_POST["prfechanotificacioncooperativa"]) == 0 ? null : $_POST["prfechanotificacioncooperativa"] ;
      $proceso->fecha_notificacion_retorno=trim($_POST["prfechanotificacionretorno"]) == 0 ? null : $_POST["prfechanotificacionretorno"] ;

      $usuario_alvis = trim($_POST["usuario_alvis"]) ;

      $resultado = $proceso->create_proceso_judicial_detalle() ;
      if($resultado)
      {
        $log->create($usuario_alvis, 2, 1, $resultado) ;

        print_json("0000", "Se creó el detalle del proceso satisfactoriamente.", $resultado);
      }
      else
      {
        print_json("9999", "Ocurrió un error al crear el detalle del proceso.", "");
      }
    }
    else
    {
      print_json("9999", "Los campos no pueden estar vacíos.", "");
    }
  }
  catch(Exception $exception)
  {
    print_json("9999", "Ocurrió un error al eliminar el detalle del proceso.", $exception->getMessage());
  }

?>