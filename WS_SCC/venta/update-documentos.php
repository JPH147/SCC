<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/log.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $log = new Log($db);
        $venta = new Venta($db);
        $data = json_decode(file_get_contents('php://input'), true);

        
        if (($_POST["prid"])!=null)
        {

            $venta->id_venta=trim($_POST["prid"]);
            $venta->foto=trim($_POST["prfoto"]);
            $venta->pdfcontrato=trim($_POST["prpdfcontrato"]);
            $venta->pdfdni=trim($_POST["prpdfdni"]);
            $venta->pdfcip=trim($_POST["prpdfcip"]);
            $venta->pdfplanilla=trim($_POST["prpdfplanilla"]);
            $venta->pdfletra=trim($_POST["prpdfletra"]);
            $venta->pdfvoucher=trim($_POST["prpdfvoucher"]);
            $venta->pdfautorizacion=trim($_POST["prpdfautorizacion"]);
            $venta->pdf_oficio=trim($_POST["prpdfoficio"]);
            $venta->vnt_otros_pdf=trim($_POST["prpdfotros"]);

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;

            if($venta->update_documentos())
            {
                $log->create($usuario_alvis, 6, 8, $credito->id_venta) ;
                print_json("0000", "Se actualizó la venta satisfactoriamente.", $venta->id_venta);
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar la venta.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la venta.", $exception->getMessage());
    }

?>