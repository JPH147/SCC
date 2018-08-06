<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

function print_json($status, $mensaje, $data) {
 
    $response['codigo'] = $status;
    $response['mensaje'] = $mensaje;
    $response['data'] = $data;
  
    echo json_encode($response, JSON_NUMERIC_CHECK| JSON_PRETTY_PRINT);
   }
   function is_array_empty($arr){
    if(is_array($arr)){     
        foreach($arr as $key => $value){
            if(!empty($value) || $value != NULL || $value != ""){
                return true;
                break;
            }
        }
        return false;
    }
  }
  /*function uploadfile($tipodoc,$nro_referencia,$file_ruta)
  {
    if(is_uploaded_file($_FILES["clt_foto"]["tmp_name"]))
        {
            $tmp_file = $_FILES["clt_foto"]["tmp_name"];
            $file_nombre_tmp = $_FILES["clt_foto"]["name"];
            $tmp = explode('.', $file_nombre_tmp);
            $file_extension = end($tmp);
            $file_nombre = trim($tipodoc)."_".trim($nro_referencia).".".$file_extension;
            $ruta = trim($file_ruta).'/'.$file_nombre;

            if(move_uploaded_file($tmp_file,$ruta))
            {
                return $file_nombre;
            }
            else
            {
                return null;
            }
        }
        else {
            return null;
        }


  }*/
?>