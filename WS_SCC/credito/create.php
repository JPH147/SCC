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
        
        if (($_POST["prtipo"])!=null)
        {

            $credito->tipo_credito=trim($_POST["prtipo"]);
            $credito->sucursal=trim($_POST["prsucursal"]);
            $credito->fecha_credito=trim($_POST["prfecha"]);
            $credito->codigo=trim($_POST["prcodigo"]);
            $credito->numero=trim($_POST["prnumero"]);
            $credito->autorizador=trim($_POST["prautorizador"]);
            $credito->vendedor=trim($_POST["prvendedor"]);
            $credito->cliente=trim($_POST["prcliente"]);
            $credito->cliente_direccion=trim($_POST["prclientedireccion"]);
            $credito->cliente_telefono=trim($_POST["prclientetelefono"]);
            $credito->cliente_cargo=trim($_POST["prclientecargo"]);
            $credito->cliente_trabajo=trim($_POST["prclientetrabajo"]);
            $credito->tipo_pago=trim($_POST["prtipopago"]);
            $credito->fecha_pago=trim($_POST["prfechapago"]);
            $credito->interes=trim($_POST["printeres"]);
            $credito->capital=trim($_POST["prcapital"]);
            $credito->cuotas=trim($_POST["prcuotas"]);
            $credito->total=trim($_POST["prtotal"]);
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
            $credito->observacion=trim($_POST["probservacion"]);

            if($credito->crear())
            {
                print_json("0000", "Se creó el credito satisfactoriamente.", $credito->id_credito);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el credito.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el credito.", $exception->getMessage());
    }

?>