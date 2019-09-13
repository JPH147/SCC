<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    include_once '../config/database.php';
    include_once '../entities/cliente.php';
    include_once '../shared/utilities.php';

    $database = new Database();

    $db = $database->getConnection();

    $Cliente = new Cliente($db);

    $path = '../uploads/';
    $path_final = '../uploads/planilla-cobros/';
    
    $nameimg = trim($_POST["nameimg"]) ;
    $tipodoc = trim($_POST['tipodoc']);

    // print_json("0000", $nameimg , $tipodoc );

    $ext = pathinfo($nameimg, PATHINFO_EXTENSION);

    $return_name = $tipodoc;

    $return_path =$path.$return_name.".".$ext;
    $path_destino = $path_final.$return_name.".".$ext;

    if (rename( $nameimg ,$return_path ))
    {
        $total_procesado = 0;
        $total_descontado = 0 ;
        $total_Ndescontado = 0;
        $resultado=array();
        $resumen=array();

        $bool=rename( $return_path, $path_destino );

        $handle = @fopen($path_destino, "r");
        if ($handle) {
            while (($buffer = fgets($handle, 4096)) !== false) {
                $items = array (
                    "codofin"=> substr($buffer,0,9),
                    "cliente" => $Cliente->search_codigo(trim(substr($buffer,0,9)),4),
                    "descuento"=> substr($buffer,18,12)/100,
                    "no_descuento"=> substr($buffer,30,12)/100,
                    "cip"=> substr($buffer,42,9),
                    "comision"=> substr($buffer,51,6)/100,
                    "completado"=> true, // Esto se utiliza para indicar si la evaluación de pagos se completó
                    "realizados"=> "", // Esto se utliza para guardar las cuotas que se están cobrando al cliente
                );
                array_push($resultado,$items);

                $total_procesado = $total_procesado + 1 ;
                $total_descontado = $total_descontado + substr($buffer,18,12)/100 ;
                $total_Ndescontado = $total_Ndescontado + substr($buffer,30,12)/100 ;

                $resumen = array(
                    "total_procesado" => $total_procesado,
                    "total_descontado" => round($total_descontado,2),
                    "total_Ndescontado" => round($total_Ndescontado,2),
                );
            }
            if (!feof($handle)) {
                print_json("0002", "Ocurrió un error al leer el archivo", []);
            }
            fclose($handle);
            print_json("0000", $resumen, $resultado);
        }

    //   print_json("0000", trim( $path_destino ) , $bool );
    }
    else
    {
      print_json("0001", "Ocurrió un error", "");
    }



?>