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

        if (($_POST["prinstitucion"])!=null)
        {
            $cobranza->institucion=trim($_POST["prinstitucion"]);
            $cobranza->tipo_pago=trim($_POST["prtipopago"]);
            $cobranza->fecha_inicio=trim($_POST["prfechainicio"]);
            $cobranza->fecha_fin=trim($_POST["prfechafin"]);
            $cobranza->cantidad=trim($_POST["prcantidad"]);
            $cobranza->monto=trim($_POST["prmonto"]);
            $cobranza->archivo=trim($_POST["prarchivo"]);

            if($cobranza->create_cabecera())
            {
                print_json("0000", "Se creó la cobranza satisfactoriamente.", $cobranza->id_cobranza);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la cobranza.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la cobranza.", $exception->getMessage());
    }

?>