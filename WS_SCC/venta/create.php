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

        
        if (($_POST["prfecha"])!=null)
        {

            $venta->fecha=trim($_POST["prfecha"]);
            $venta->sucursal=trim($_POST["prsucursal"]);
            $venta->salida_venta=trim($_POST["prsalida"]);
            $venta->talonario=trim($_POST["prtalonario"]);
            $venta->id_autorizador=trim($_POST["prautorizador"]);
            $venta->id_cliente=trim($_POST["prcliente"]);
            $venta->id_clientedireccion=trim($_POST["prclientedireccion"]);
            $venta->id_clientetelefono=trim($_POST["prclientetelefono"]);
            $venta->clientecargo=trim($_POST["prclientecargo"]);
            $venta->clientetrabajo=trim($_POST["prclientetrabajo"]);
            $venta->lugar=trim($_POST["prlugar"]);
            $venta->vendedor=trim($_POST["prvendedor"]);
            $venta->tipoventa=trim($_POST["prtipoventa"]);
            $venta->tipopago=trim($_POST["prtipopago"]);
            $venta->inicial=trim($_POST["prinicial"]);
            $venta->cuotas=trim($_POST["prcuotas"]);
            $venta->total=trim($_POST["prtotal"]);
            $venta->fechainicio=trim($_POST["prfechainicio"]);
            $venta->foto=trim($_POST["prfoto"]);
            $venta->pdfcontrato=trim($_POST["prpdfcontrato"]);
            $venta->pdfdni=trim($_POST["prpdfdni"]);
            $venta->pdfcip=trim($_POST["prpdfcip"]);
            $venta->pdfplanilla=trim($_POST["prpdfplanilla"]);
            $venta->pdfletra=trim($_POST["prpdfletra"]);
            $venta->pdfvoucher=trim($_POST["prpdfvoucher"]);
            $venta->pdfautorizacion=trim($_POST["prpdfautorizacion"]);
            $venta->vnt_otros_pdf=trim($_POST["prpdfotros"]);
            $venta->observaciones=trim($_POST["probservaciones"]);

            if($venta->create())
            {
                print_json("0000", "Se creó la venta satisfactoriamente.", $venta->id_venta);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la venta.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear la venta.", $exception->getMessage());
    }

?>