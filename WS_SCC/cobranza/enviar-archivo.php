<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: text/plain");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    $cobranza = new Cobranzas($db);

    $cobranza->archivo=trim($_POST["prarchivo"]);

    $file = $cobranza->path.$cobranza->archivo.".txt";

    if (file_exists($file)) {
        return readfile($file);
    }

    // try
    // {


    //     if (($_POST["prcobranza"])!=null)
    //     {
    //         $cobranza->id_cobranza=trim($_POST["prcobranza"]);
    //         $cobranza->cliente=trim($_POST["prcliente"]);
    //         $cobranza->codigo=trim($_POST["prcodofin"]);
    //         $cobranza->monto=trim($_POST["prmonto"]);

    //         if($cobranza->create_detalle())
    //         {
    //             print_json("0000", "Se creó la cobranza satisfactoriamente.", $cobranza->id_cobranza);
    //         }
    //         else
    //         {
    //             print_json("9999", "Ocurrió un error al crear la cobranza.", "");
    //         }
    //     }
    //     else
    //     {
    //         print_json("9999", "Los campos no pueden estar vacíos.", "");
    //     }
    // }
    // catch(Exception $exception)
    // {
    //     print_json("9999", "Ocurrió un error al eliminar la cobranza.", $exception->getMessage());
    // }

?>