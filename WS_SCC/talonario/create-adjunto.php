<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/talonario.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
      $talonario = new Talonario($db);
      $data = json_decode(file_get_contents('php://input'), true);

      
      if (($_POST["prtalonario"])!=null)
      {
        $talonario->id_talonario=trim($_POST["prtalonario"]) ;
        $talonario->pdf_contrato=trim($_POST["prpdfcontrato"]) ;
        $talonario->id_cliente = trim($_POST["prcliente"]) ;
        $talonario->tipo_pago = trim($_POST["prtipopago"]) ;
        $talonario->fecha = trim($_POST["prfecha"])=="0" ? null : trim($_POST["prfecha"]) ;
        $talonario->monto = trim($_POST["prmonto"]) ;
        $talonario->cuotas = trim($_POST["prcuotas"]) ;

        if($talonario->crear_talonario_adjunto())
        {
            print_json("0000", "Se creó el talonario adjunto satisfactoriamente.", true);
        }
        else
        {
            print_json("9999", "Ocurrió un error al crear el talonario adjunto.", false);
        }
      }
      else
      {
          print_json("9999", "Los campos no pueden estar vacíos.", "");
      }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el talonario.", $exception->getMessage());
    }

?>