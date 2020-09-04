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

        if (($_POST["prventa"])!=null)
        {
            $cobranza->venta=trim($_POST["prventa"]);
            $cobranza->tipo_cobranza=trim($_POST["prtipocobranza"]);
            $cobranza->fecha=trim($_POST["prfecha"]);
            $cobranza->comprobante=trim($_POST["prcomprobante"]);
            $cobranza->total=trim($_POST["prtotal"]);
            $cobranza->observacion=trim($_POST["probservacion"]);
            
            if($cobranza->create_cobranza_manual_venta())
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
      print_json("9999", "Ocurrió un error al crear la cobranza.", $exception->getMessage());
    }

?>