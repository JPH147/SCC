<?php
function print_json($status, $mensaje, $data) {
    header("HTTP/1.1 $status $mensaje");
    header("Content-Type: application/json; charset=UTF-8");
  
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
                break;//stop the process we have seen that at least 1 of the array has value so its not empty
            }
        }
        return false;
    }
  }
?>