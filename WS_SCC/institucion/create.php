<?php 
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../entities/institucion.php';
  include_once '../shared/utilities.php';

  $database = new Database();
  $db = $database -> getConnection();

  $institucion = new Institucion($db);

  try{
    if ( ($_POST["prnombre"])!=null )
    {
        $institucion->nombre = trim($_POST["prnombre"]) ;
        $institucion->abreviatura = trim($_POST["prabreviatura"]) ;
        $institucion->representante = trim($_POST["prrepresentante"]) ;
        $institucion->distrito = trim($_POST["prdistrito"]) ;
        $institucion->direccion = trim($_POST["prdireccion"]) ;
        $institucion->telefono = trim($_POST["prtelefono"]) ;
        $institucion->codigo_cooperativa = trim($_POST["prcodigocooperativa"]) ;

        if($institucion->create())
        {
            print_json("0000", "Se creó la institución satisfactoriamente.", true);
        }
        else
        {
            print_json("9999", "Ocurrió un error al crear la institución.", "");
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