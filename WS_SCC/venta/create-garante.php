<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $venta = new Venta($db);
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (($_POST["prventa"])!=null)
        {
            $venta->venta=trim($_POST["prventa"]);
            $venta->id_cliente=trim($_POST["prcliente"]);
            $venta->pdfdni=trim($_POST["prdni"]);
            $venta->pdfcip=trim($_POST["prcip"]);
            $venta->pdfplanilla=trim($_POST["prplanilla"]);
            $venta->pdfletra=trim($_POST["prletra"]);
            $venta->pdfvoucher=trim($_POST["prvoucher"]);

            if($venta->create_garante())
            {
                print_json("0000", "Se creó el garante satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el garante.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el garante.", $exception->getMessage());
    }

?>