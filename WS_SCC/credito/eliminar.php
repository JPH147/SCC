<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/log.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $log = new Log($db);
        $credito = new Creditos($db);
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (($_POST["prcredito"])!=null)
        {
            $credito->id_credito=trim($_POST["prcredito"]);
            $credito->tipo_credito=trim($_POST["prtipo"]);
            $crear_registro=trim($_POST["prcrearregistro"]) ? trim($_POST["prcrearregistro"]) : "1" ;

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;

            if($credito->eliminar_credito())
            {
                if ( $crear_registro == "0" ) {
                    $referencia = $credito->tipo_credito == "1" ? 8 : 9 ;
                    $log->create($usuario_alvis, $referencia, 3, $credito->id_credito) ;
                }
                print_json("0000", "Se eliminó el crédito satisfactoriamente.", $credito->id_credito);
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar el crédito.", "");
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