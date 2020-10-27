<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: *");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Max-Age: 3600");
    header("usuario: *");

    include_once '../config/database.php';
    include_once '../entities/cobranza.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    try{
        $cobranza = new Cobranzas($db);

        $cobranza->cliente = !empty($_GET['prcliente']) ? trim($_GET['prcliente']) : '';
        $cobranza->sede = !empty($_GET['prsede']) ? trim($_GET['prsede']) : '';
        $cobranza->subsede = !empty($_GET['prsubsede']) ? trim($_GET['prsubsede']) : '';
        $cobranza->institucion = !empty($_GET['prinstitucion']) ? trim($_GET['prinstitucion']) : '';
        $cobranza->tipo_pago = !empty($_GET['prtipopago']) ? trim($_GET['prtipopago']) : 0;
        $cobranza->fecha_inicio = !empty($_GET['prfechainicio']) ? trim($_GET['prfechainicio']) : null;
        $cobranza->fecha_fin = !empty($_GET['prfechafin']) ? trim($_GET['prfechafin']) : null;

        $cobranza_morosos1 = $cobranza->contar_cobranzasxcliente_morosos1();
        $cobranza_morosos2 = $cobranza->contar_cobranzasxcliente_morosos2();

	    $cobranza_list = array(
            "morosos" => $cobranza_morosos1,
            "muy_morosos" => $cobranza_morosos2
        ) ;

        if (count(array_filter($cobranza_list))>0)
        { 
            print_json("0000", 1, $cobranza_list);
        }
        else
        { print_json("0001", 0, $cobranza_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>