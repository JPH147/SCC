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

        if (($_POST["prid"])!=null)
        {
            $cobranza->tipo=trim($_POST["prtipo"]);
            $cobranza->id_cobranza=trim($_POST["prid"]);
            $cobranza->fecha=trim($_POST["prfecha"]);
            $cobranza->tipo_pago=trim($_POST["prtipopago"]);

            if($cobranza->actualizar_cuota())
            {
                print_json("0000", "Se actualizó la cuota satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar la cuota.", false);
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la cuota.", $exception->getMessage());
    }

?>