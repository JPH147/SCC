<?php

header("Access-Control-Allow-Origin: *");

include_once '../shared/utilities.php';

$path = '../uploads/';

$nameimg= $_GET['nameimg'];
$tipodoc = $_GET['tipodoc'];
$numdoc = $_GET['numdoc'];

$ext = pathinfo($nameimg, PATHINFO_EXTENSION);

$return_name =$tipodoc . "_".$numdoc.".".$ext;
$return_path =$path . $return_name;
if (rename( $nameimg ,$return_path ))
{
    print_json("0000", trim($return_name), "");
}
else
{
    print_json("0001", "Ocurrió un error", "");
}


?>