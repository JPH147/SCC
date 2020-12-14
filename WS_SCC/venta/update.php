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
            $venta->id_acreedor=trim($_POST["pracreedor"]);
            $venta->fecha=trim($_POST["prfecha"]);
            $venta->sucursal=trim($_POST["prsucursal"]);
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
            $venta->salida_venta=trim($_POST["prsalida"]);
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
            $venta->pdf_oficio=trim($_POST["prpdfoficio"]);
            $venta->vnt_otros_pdf=trim($_POST["prpdfotros"]);
            $venta->observaciones=trim($_POST["probservaciones"]);
            $venta->vendedores_array= json_decode( trim($_POST["prvendedoresarray"]) );

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;

            if($venta->update())
            {
                $venta->crear_vendedor_array();
                $log->create($usuario_alvis, 6, 2, $venta->id_venta) ;
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