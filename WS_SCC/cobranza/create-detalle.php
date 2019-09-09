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
            $cobranza->cobranza_directa=trim($_POST["prcobranzadirecta"]);
            $cobranza->cobranza_archivos=trim($_POST["prcobranzaarchivos"]);
            $cobranza->cobranza_judicial=trim($_POST["prcobranzajudicial"]);
            $cobranza->credito_cronograma=trim($_POST["prcreditocronograma"]);
            $cobranza->venta_cronograma=trim($_POST["prventacronograma"]);
            $cobranza->monto=trim($_POST["prmonto"]);
            $cobranza->fecha=trim($_POST["prfecha"]);

            if($cobranza->create_detalle())
            {
                print_json("0000", "Se creó el detalle satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el detalle.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el detalle.", $exception->getMessage());
    }

?>