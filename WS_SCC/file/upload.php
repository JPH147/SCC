<?php
 
header("Access-Control-Allow-Origin: *");
 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(array('status' => false));
  exit;
}
 
$path = '../uploads/';
 
if (isset($_FILES['image'])) {
  $tipo= $_GET['tipo'];
  $numdoc = $_GET['numdoc'];
  $originalName = $_FILES['image']['name'];
  $ext = '.'.pathinfo($originalName, PATHINFO_EXTENSION);
  $generatedName = $tipo.'_'.$numdoc.$ext;
  $filePath = $path.$generatedName;
 
  if (!is_writable($path)) {
    echo json_encode(array(
      'status' => false,
      'msg'    => $path
    ));
    exit;
  }
 
  if (move_uploaded_file($_FILES['image']['tmp_name'], $filePath)) {
    echo json_encode(array(
      'status'        => true,
      'originalName'  => $originalName,
      'generatedName' => $generatedName
    ));
  }
}
else {
  echo json_encode(
    array('status' => false, 'msg' => 'No file uploaded.')
  );
  exit;
}
 
?> 