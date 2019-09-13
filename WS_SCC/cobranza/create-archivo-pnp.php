<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../shared/utilities.php';
    include_once '../entities/cobranza.php';

    $database = new Database();
    $db = $database->getConnection();

    $cobranza = new Cobranzas($db);

    // ------------------


    $codigo ;
    $detalle ;
    $resultante = array() ;
    $resultante_formateado = array();

    if (($_POST["prdetalle"])!=null)
    {
    
        $detalle = json_decode($_POST["prdetalle"],true) ;
        $codigo = $_POST["prcodigo"] ;
        
        foreach ( $detalle as $item ) {
            if( $item['considerar'] ) {
                $key = $item['id_cliente'];
                if (!array_key_exists($key, $resultante)) {
                    $resultante[$key] = array(
                        'id' => $item['id'],
                        'codofin' => $item['codofin'],
                        'monto_pendiente' => round( $item['monto_pendiente'] , 2 ) ,
                        'fecha' => $item['fecha']
                    );
                } else {
                    $resultante[$key]['monto_pendiente'] = round( $resultante[$key]['monto_pendiente'] + $item['monto_pendiente'] , 2 );
                    $resultante[$key]['fecha'] = $item['fecha'];
                }
            }
        };
        foreach ( $resultante as $item ) {
            $comodin = (
                str_pad( $item['codofin'] , 9, " ", STR_PAD_LEFT) .
                $codigo .
                str_pad( $item['monto_pendiente']*100 , 12, "0", STR_PAD_LEFT) .
                "000000000000" .
                str_pad( $item['monto_pendiente']*100 , 12, "0", STR_PAD_LEFT) .
                date("d-m-Y", strtotime($item['fecha']) ) .
                str_pad( ceil($item['monto_pendiente'])*100 , 12, "0", STR_PAD_LEFT)
            );
            array_push( $resultante_formateado, $comodin );
        };

        $cobranza->archivo= trim($_POST['prarchivo']);
        $cobranza->contenido = $resultante_formateado;

        if ($cobranza->generar_pnp())
        {
            print_json("0000", "0", true);
        }
        else
        {
            print_json("0001", "1", "Ocurrió un error");
        }
    }
    else
    {
        print_json("9999", "Los campos no pueden estar vacíos.", "");
    }

?>