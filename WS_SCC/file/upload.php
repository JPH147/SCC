<?php
  
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../shared/utilities.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    print_json("9999", "La petici[on debe ser POST.","0");
  }
   
  $path = '../uploads/';
   
  if ( isset($_FILES['image']) ) {
    $originalName = $_FILES['image']['name'];
    $ext = '.'.pathinfo($originalName, PATHINFO_EXTENSION);
    $generatedName = md5($_FILES['image']['tmp_name']).$ext;
    $filePath = $path.$generatedName;
   
    if (!is_writable($path)) {
      print_json("9999", "No se puede escribir en la carpeta.","0");
    }
   
    if (move_uploaded_file($_FILES['image']['tmp_name'], $filePath)) {
      ob_start();
      echo $filePath ;
      error_log(ob_get_clean(), 4) ;
      print_json("0000", $generatedName,$filePath);
    }
  }
  else {
    print_json("9999", "No se ha subido nincuna imagen.", $_FILES);
  }
 

?>