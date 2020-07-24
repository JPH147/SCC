<?php

    header("Access-Control-Allow-Origin: *");

    include_once '../shared/utilities.php';

    $path = '../uploads/plantillas/';
    $path_final = '../plantillas/archivos/';

    $nombre_archivo= trim($_GET['prnombrearchivo']); //path+nombre antiguo
    $nombre_plantilla = trim($_GET['prnombreplantilla']);

    $archivo_por_copiar = $path . $nombre_archivo ;

    // $return_path =$path.$return_name; //destino
    $path_destino = $path_final.$nombre_plantilla;

    if ( copy( $archivo_por_copiar ,$path_destino ) )
    {
      print_json("0000", trim( $path_destino  ), true );
    }
    else
    {
      print_json("0001", "Ocurrió un error", "");
    }


?>