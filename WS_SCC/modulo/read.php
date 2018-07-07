<?php

    //header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/database.php';
    include_once '../entities/modulo.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

try
{
    $modulo = new Modulo($db);
    $result = $modulo->read();
    $num = $result->rowCount();

    if($num>0)
    {
        $modulo_list=array();
        $modulo_list["modulos"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $modulo_item = array (
                "idmodulo"=>$idmodulo,
                "mdl_nombre"=>$mdl_nombre
            );

            array_push($modulo_list["modulos"],$modulo_item);
        }
        print_json("0000", "OK", $modulo_list);
    }
    else
    {
        print_json("0001", "No existen módulos registrados", null);

    }
}
catch(Exception $exception)
{
    print_json("9999", "Ocurrió un error", $exception->getMessage());
}

?>