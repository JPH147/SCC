<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $cobranza = new Cobranzas($db);

        if ( ($_POST["prmonto"])!=null )
        {
            $cobranza->cobranza_manual=trim($_POST["prcobranzamanual"]);
            $cobranza->credito=trim($_POST["prcredito"]);
            $cobranza->monto=trim($_POST["prmonto"]);
            $cobranza->fecha=trim($_POST["prfecha"]);

            if($cobranza->crear_regularizacion_pago_credito())
            {
                print_json("0000", "Se creó el pago satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el pago.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el pago.", $exception->getMessage());
    }

?>