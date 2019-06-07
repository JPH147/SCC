<?php

    header("Access-Control-Allow-Origin: *");

    include_once '../shared/utilities.php';

    $path = '../uploads/';

    $nameimg= trim($_GET['nameimg']);
    $tipodoc = trim($_GET['tipodoc']);
    $numdoc = trim($_GET['numdoc']);
    $grupo = trim($_GET['prgrupo']);

    $ext = pathinfo($nameimg, PATHINFO_EXTENSION);

    $return_name =$tipodoc . "_".$numdoc.".".$ext;
    $return_path =$path.$grupo."/".$return_name;

    if (rename( $nameimg ,$return_path ))
    {
        //echo ($path.$grupo."/");
        move_uploaded_file($return_path,$path.$grupo."/");
        print_json("0000", trim($return_name), "");


    //   copy($return_path, $path.$return_name);
        /*if (move_uploaded_file($_FILES['image']['tmp_name'], $filePath)) {
        }*/

    }
    else
    {
        print_json("0001", "Ocurrió un error", "");
    }


?>