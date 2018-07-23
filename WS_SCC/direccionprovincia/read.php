<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/direccionprovincia.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
        $provincia = new Provincia($db);

        $provincia->dst_nombre = !empty($_GET['prdepartamento']) ? $_GET['prdepartamento'] : null;
        $provincia->prv_nombre = !empty($_GET['prprovincia']) ? $_GET['prprovincia'] : null;

        $provincia_list = $provincia->read();

        if (count(array_filter($provincia_list))>0)
        {
            print_json("0000", count(array_filter($provincia_list)),$provincia_list);
        }
        else
        {
            print_json("0001", "No existen distritos registrados", null);
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>