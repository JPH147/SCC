<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $credito = new Creditos($db);
        $data = json_decode(file_get_contents('php://input'), true);

        
        if (($_POST["prcredito"])!=null)
        {

            $credito->id_credito=trim($_POST["prcredito"]);
            $credito->pdf_foto=trim($_POST["prpdffoto"]);
            $credito->pdf_dni=trim($_POST["prpdfdni"]);
            $credito->pdf_cip=trim($_POST["prpdfcip"]);
            $credito->pdf_planilla=trim($_POST["prpdfplanilla"]);
            $credito->pdf_voucher=trim($_POST["prpdfvoucher"]);
            $credito->pdf_recibo=trim($_POST["prpdfrecibo"]);
            $credito->pdf_casilla=trim($_POST["prpdfcasilla"]);
            $credito->pdf_transaccion=trim($_POST["prpdftransaccion"]);
            $credito->pdf_autorizacion=trim($_POST["prpdfautorizacion"]);
            $credito->pdf_tarjeta=trim($_POST["prpdftarjeta"]);
            $credito->pdf_compromiso=trim($_POST["prpdfcompromiso"]);
            $credito->pdf_letra=trim($_POST["prpdfletra"]);
            $credito->pdf_ddjj=trim($_POST["prpdfddjj"]);
            $credito->pdf_oficio=trim($_POST["prpdfoficio"]);
            $credito->pdf_otros=trim($_POST["prpdfotros"]);

            if($credito->actualizar_documentos())
            {
                print_json("0000", "Se actualizó el credito satisfactoriamente.", $credito->id_credito);
            }
            else
            {
                print_json("9000", "Ocurrió un error al actualizar el credito.", "");
            }
        }
        else
        {
            print_json("9900", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el credito.", $exception->getMessage());
    }

?>