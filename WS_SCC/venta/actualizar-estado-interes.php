<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/log.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
      $venta = new Venta($db);
      $log = new Log($db);
      $data = json_decode(file_get_contents('php://input'), true);
      
      if (($_POST["prventa"])!=null)
      {
        $venta->id_venta=trim($_POST["prventa"]);
        $venta->estado_interes=trim($_POST["prestadointeres"]);

        $usuario_alvis = trim($_POST["usuario_alvis"]) ;
        
        if( $venta->actualizar_venta_estado_interes() )
        {
          // Si el estado de la penalidad que se envía es 1 (tiene penalidad)
          // la acción es 5 (activar). Si es 2 (no tiene penalidad), se envía 6 (desactivar).
          $accion = $venta->estado_interes == 1 ? 5 : 6 ;
          $log->create($usuario_alvis, 11, $accion, $venta->id_venta) ;
          print_json("0000", "Se actualizó el estado satisfactoriamente.", true);
        }
        else
        {
          print_json("9999", "Ocurrió un error al actualizar el estado.", false);
        }
      }
      else
      {
          print_json("9999", "Los campos no pueden estar vacíos.", "");
      }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el crédito.", $exception->getMessage());
    }

?>