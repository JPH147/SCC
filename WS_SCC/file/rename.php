<?php
header("Access-Control-Allow-Origin: *");

$path = '../uploads/';

$nameimg= $_GET['nameimg'];
$tipodoc = $_GET['tipodoc'];
$numdoc = $_GET['numdoc'];

$ext = pathinfo($nameimg, PATHINFO_EXTENSION);

$return_path =$path . $tipodoc . "_".$numdoc.".".$ext;

if (rename( $nameimg ,$return_path ))
{
    echo json_encode(array('path'=>$return_path));
}
else
{
    echo 'No';
}


?>