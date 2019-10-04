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
            $cobranza->id_cobranza=trim($_POST["prid"]);
            $cobranza->fecha=trim($_POST["prfecha"]);
            $cobranza->cliente=trim($_POST["prcliente"]);
            $cobranza->cuenta=trim($_POST["prcuenta"]);
            $cobranza->operacion=trim($_POST["properacion"]);
            $cobranza->monto=trim($_POST["prmonto"]);
            $cobranza->solo_directas=trim($_POST["prsolodirectas"]);
            $cobranza->archivo=trim($_POST["prarchivo"]);
            $cobranza->observaciones=trim($_POST["probservaciones"]);
            $cobranza->detalle_cabecera = json_decode( trim($_POST["prdetalle"]) );

            if($cobranza->update_directa())
            {
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