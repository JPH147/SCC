<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $credito = new Creditos($db);
        $data = json_decode(file_get_contents('php://input'), true);

        
        if (($_POST["prcredito"])!=null)
        {
            $credito->id_credito=trim($_POST["prcredito"]);
            $credito->tipo_pago=trim($_POST["prtipopago"]);
            $credito->monto=trim($_POST["prmonto"]);
            $credito->total_cuotas=trim($_POST["prcuotas"]);
            $credito->fecha=trim($_POST["prprimeracuota"]);

            if($credito->crear_cronograma_afiliacion())
            {
                print_json("0000", "Se creó el cronograma satisfactoriamente.", $credito->id_credito);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el cronograma.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el cronograma.", $exception->getMessage());
    }

?>