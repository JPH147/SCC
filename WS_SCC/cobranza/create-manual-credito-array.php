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

        if (($_POST["prcredito"])!=null)
        {
            $cobranza->credito=trim($_POST["prcredito"]);
            $cobranza->informacion= trim($_POST["prinformacion"]);
            
            $cobranza->usuario_alvis=trim($_POST["usuario_alvis"]);

            $resultado = $cobranza->create_cobranza_manual_credito_array() ;
            if($resultado)
            {
              print_json("0000", "Se creó la cobranza satisfactoriamente.", $resultado);
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
      print_json("9999", "Ocurrió un error al crear la cobranza.", $exception->getMessage());
    }

?>