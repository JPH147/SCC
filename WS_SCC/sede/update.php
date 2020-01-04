<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/sede.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    $sede = new Sede($db);
    
    try{
        if ( ($_POST["prid"])!=null )
        {
            $sede->id_sede=trim($_POST["prid"]) ;
            $sede->institucion=trim($_POST["prinstitucion"]) ;
            $sede->nombre=trim($_POST["prnombre"]) ;
            $sede->abreviatura = trim($_POST["prabreviatura"]) ;
            $sede->representante = trim($_POST["prrepresentante"]) ;
            $sede->distrito = trim($_POST["prdistrito"]) ;
            $sede->direccion = trim($_POST["prdireccion"]) ;
            $sede->telefono = trim($_POST["prtelefono"]) ;
            $sede->codigo_cooperativa = trim($_POST["prcodigocooperativa"]) ;
            $sede->plantilla_tarjeta = trim($_POST["prplantillatarjeta"]) ;
            $sede->plantilla_autorizacion = trim($_POST["prplantillaautorizacion"]) ;
            $sede->plantilla_ddjj = trim($_POST["prplantilladdjj"]) ;
            $sede->plantilla_compromiso = trim($_POST["prplantillacompromiso"]) ;
            $sede->plantilla_ttransaccion = trim($_POST["prplantillattransaccion"]) ;

            if( $sede->update() )
            {
                print_json("0000", "Se actualizó la sede satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar la sede.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>