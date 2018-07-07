<?php
function print_json($status, $mensaje, $data) {
    header("HTTP/1.1 $status $mensaje");
    header("Content-Type: application/json; charset=UTF-8");
  
    $response['codigo'] = $status;
    $response['mensaje'] = $mensaje;
    $response['data'] = $data;
  
    echo json_encode($response, JSON_PRETTY_PRINT);
   }
?>