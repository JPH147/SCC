<?php
Class File
{
    //public $img_nombre;
    //public $img_ruta;

    function upload()
    {
        if(is_uploaded_file($_FILES["file"]["tmp_name"]) && !empty(trim($_POST["file_ruta"])) 
        && !empty(trim($_POST["tipodoc"])) && !empty(trim($_POST["nro_referencia"])))
        {
            $tmp_file = $_FILES["file"]["tmp_name"];
            $file_nombre_tmp = $_FILES["file"]["name"];

            $tmp = explode('.', $file_nombre_tmp);
            $file_extension = end($tmp);
            $file_nombre = trim($_POST["tipodoc"])."_".trim($_POST["nro_referencia"]).".".$file_extension;
            $file_ruta = trim($_POST["file_ruta"]).'/'.$file_nombre;

            if(move_uploaded_file($tmp_file,$file_ruta))
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
    }

}
?>