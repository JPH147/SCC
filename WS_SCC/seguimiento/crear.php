<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/seguimiento.php';
    include_once '../entities/log.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $log = new Log($db);
        $seguimiento = new Seguimiento($db);
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (($_POST["prseguimiento"])!=null)
        {

            $seguimiento->id_venta=trim($_POST["prventa"]);
            $seguimiento->id_credito=trim($_POST["prcredito"]);
            $seguimiento->id_courier=trim($_POST["prcourier"]);
            $seguimiento->fecha=trim($_POST["prfecha"]);
            $seguimiento->numero_seguimiento=trim($_POST["prseguimiento"]);
            $seguimiento->pdf_foto=trim($_POST["prpdffoto"]);
            $seguimiento->observacion=trim($_POST["probservacion"]);

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;

            $id_seguimiento = $seguimiento->crear() ;
            if( $id_seguimiento )
            {
                $log->create($usuario_alvis, 5, 1, $id_seguimiento) ;

                print_json("0000", "Se creó el seguimiento satisfactoriamente.", $id_seguimiento );
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el seguimiento.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el seguimiento.", $exception->getMessage());
    }

?>