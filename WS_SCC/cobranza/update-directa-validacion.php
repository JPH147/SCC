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

        if (($_POST["prid"])!=null)
        {
            $cobranza->id_cobranza=trim($_POST["prid"]);
            $cobranza->validado=trim($_POST["prvalidado"]);

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;

            if($cobranza->update_directa_validacion())
            {
                $accion = $cobranza->validado == 1 ? 9 : 10 ;
                $log->create($usuario_alvis, 16, $accion, $cobranza->id_cobranza) ;
                print_json("0000", "Se actualizó la cobranza satisfactoriamente.", $cobranza->id_cobranza);
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar la cobranza.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la cobranza.", $exception->getMessage());
    }

?>