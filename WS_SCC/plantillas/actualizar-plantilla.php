<?php

    header("Access-Control-Allow-Origin: *");

    include_once '../shared/utilities.php';

    $path = '../uploads/';
    $path_final = '../plantillas/archivos/';

    $nameimg= trim($_GET['nameimg']); //path+nombre antiguo
    $tipodoc = trim($_GET['tipodoc']);

    $ext = pathinfo($nameimg, PATHINFO_EXTENSION);

    $return_name =$tipodoc;
    $return_name2 ="JeanPierre.txt";

    $return_path =$path.$return_name; //destino
    $path_destino = $path_final.$return_name;
    // $path_destino = "./jean.docx";

    if (rename( $nameimg ,$return_path ))
    {
        // move_uploaded_file( $return_path, $path_destino);
        // $bool=move_uploaded_file( $return_path, $path_destino );
        $bool=rename( $return_path, $path_destino );
        // $bool=file_exists($return_path);
        // $bool=file_exists($path_final.$return_name);
        print_json("0000", trim( $path_destino  ), $bool );
    }
    else
    {
        print_json("0001", "Ocurrió un error", "");
    }


?>