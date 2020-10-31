<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/log.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $log = new Log($db);
        $cobranza = new Cobranzas($db);

        if (($_POST["prtransaccion"])!=null)
        {
            $cobranza->tipo = trim($_POST["prtipo"]) ;
            $cobranza->transaccion = trim($_POST["prtransaccion"]) ;
            $cobranza->monto = trim($_POST["prmonto"]) ;
            $cobranza->fecha = trim($_POST["prfecha"]) ;
            $cobranza->usuario = trim($_POST["prusuario"]) ;
            $cobranza->observaciones = trim($_POST["probservacion"]) ;
  
            $usuario_alvis = trim($_POST["usuario_alvis"]) ;
            if($cobranza->create_liquidacion())
            {
                $log->create($usuario_alvis, 19, 1, $cobranza->id_liquidacion) ;
                print_json("0000", "Se creó la liquidacion satisfactoriamente.", $cobranza->id_liquidacion);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la liquidacion.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear la liquidacion.", $exception->getMessage());
    }

?>