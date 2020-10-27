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
?>