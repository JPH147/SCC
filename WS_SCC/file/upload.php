<?php
  header("Access-Control-Allow-Origin: *");
  include_once '../shared/utilities.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // echo json_encode(array('status' => false));
    exit;
  }
   
  $path = '../uploads/';
   
  if (isset($_FILES['image'])) {
    $originalName = $_FILES['image']['name'];
    $ext = '.'.pathinfo($originalName, PATHINFO_EXTENSION);
    $generatedName = md5($_FILES['image']['tmp_name']).$ext;
    $filePath = $path.$generatedName;
   
    if (!is_writable($path)) {
      // echo json_encode(array(
      //   'status' => false,
      //   'msg'    => $path
      // ));
      print_json("9999", "No se puede escribir en la carpeta.","0");
      // exit;
    }
   
    if (move_uploaded_file($_FILES['image']['tmp_name'], $filePath)) {
      // echo json_encode(array(
      //   'status' => true,
      //   'msg'    => $filePath
      // ));
      print_json("0000", $generatedName,$filePath);
      // exit;
    }
  }
  else {
    // echo json_encode(
    //   array('status' => false, 'msg' => 'No file uploaded.')
    // );
    print_json("9999", "No se ha subido nincuna imagen.", "1");
    // exit;
  }
 
?>