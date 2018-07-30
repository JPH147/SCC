<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../entities/file.php';
    include_once '../shared/utilities.php';

    try
    {
        $file = new File();

        if ($_FILES["file"]!=null)
        {
            $imagename = $file->upload();
            if($imagename!=null)
            {
                print_json("0000", "OK.", $imagename);
            }
            else
            {
                print_json("9999", "Ocurrió un error al subir el archivo.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el cliente.", $exception->getMessage());
    }

?>