<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");

    include_once '../config/database.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $cobranza = new Cobranzas($db);

        $cobranza->archivo = !empty($_GET['prarchivo']) ? trim($_GET['prarchivo']) : '';
        $cobranza->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : '';
        $cobranza->sede = !empty($_GET['prsede']) ? trim($_GET['prsede']) : '';
        $cobranza->subsede = !empty($_GET['prsubsede']) ? trim($_GET['prsubsede']) : '';
        $cobranza->institucion = !empty($_GET['prinstitucion']) ? trim($_GET['prinstitucion']) : '';
        $cobranza->tipo_pago = !empty($_GET['prtipopago']) ? trim($_GET['prtipopago']) : 0;
        $cobranza->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null;
        $cobranza->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null;
        $cobranza->nivel_mora = !empty($_GET['prnivelmora']) ? trim($_GET['prnivelmora']) : 0;

        $cobranza_list = $cobranza->read_cobranzasxclienteunlimited();

        if ( $cobranza_list )
        { 
            print_json("0000", 1, $cobranza_list );
        }
        else
        { print_json("0001", 0, "" ); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>