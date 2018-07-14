<?php
Class Usuario{

    private $conn;
    private $table_name = "usuario";

    public $idusuario;
    public $usr_nombre;
    public $usr_usuario;
    public $usr_clave;
    public $usr_fechacreacion;
    public $usr_ultimologueo;
    public $usr_estado;
    public $idperfil;
    public $prf_nombre;


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "CALL sp_listarusuario(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idusuario);
        $result->bindParam(2, $this->usr_nombre);
        $result->bindParam(3, $this->usr_usuario);
        $result->bindParam(4, $this->usr_ultimologueo);
        $result->bindParam(5, $this->usr_fechacreacion);
        $result->bindParam(6, $this->usr_estado);
        $result->bindParam(7, $this->idperfil);

        $result->execute();
    
        $usuario_list=array();
        $usuario_list["usuarios"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $usuario_item = array (
                "usr_nombre"=>$row['usr_nombre'],
                "usr_usuario"=>$row['usr_usuario'],
                "usr_fechacreacion"=>$row['usr_ultimologueo'],
                "usr_ultimologueo"=>$row['usr_fechacreacion'],
                "usr_estado"=>$row['usr_estado'],
                "prf_nombre"=>$row['prf_nombre']
            );

                array_push($usuario_list["usuarios"],$usuario_item);
        }
        return $usuario_list;
    }
    
    function create()
    {
        $query = "CALL sp_crearusuario (:usr_nombre,:usr_usuario,:usr_clave,:usr_fechacreacion,:usr_ultimologueo,:usr_estado,:idperfil)"; 

        $result = $this->conn->prepare($query);

        $this->usr_nombre=htmlspecialchars(strip_tags($this->usr_nombre));
        $this->usr_usuario=htmlspecialchars(strip_tags($this->usr_usuario));
        $this->usr_clave=htmlspecialchars(strip_tags($this->usr_clave));
        $this->usr_fechacreacion=htmlspecialchars(strip_tags($this->usr_fechacreacion));
        $this->usr_ultimologueo=htmlspecialchars(strip_tags($this->usr_ultimologueo));
        $this->usr_estado=htmlspecialchars(strip_tags($this->usr_estado));
        $this->idperfil=htmlspecialchars(strip_tags($this->idperfil));

        $result->bindParam(":usr_nombre", $this->usr_nombre);
        $result->bindParam(":usr_usuario", $this->usr_usuario);
        $result->bindParam(":usr_clave", $this->usr_clave);
        $result->bindParam(":usr_fechacreacion", $this->usr_fechacreacion);
        $result->bindParam(":usr_ultimologueo", $this->usr_ultimologueo);
        $result->bindParam(":usr_estado", $this->usr_estado);
        $result->bindParam(":idperfil", $this->idperfil);

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
    function readxId()
    {
        $query ="CALL sp_listarusuarioxId (?)";
        $result = $this->conn->prepare($query);
        $result->bindParam(1, $this->idusuario);
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->usr_nombre=$row['usr_nombre'];
        $this->usr_usuario=$row['usr_usuario'];
        $this->usr_ultimologueo=$row['usr_ultimologueo'];
        $this->usr_fechacreacion=$row['usr_fechacreacion'];
        $this->usr_estado=$row['usr_estado'];
        $this->prf_nombre= $row['prf_nombre'];
    }
    function login($usr_usuario, $usr_clave)
    {
        $usr_clave_hash= password_hash($usr_clave, PASSWORD_DEFAULT);
        $query = "CALL sp_login('$usr_usuario')";

        $result = $this->conn->prepare($query);
        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->idusuario = $row['idusuario'];
        $this->usr_nombre=$row['usr_nombre'];
        $this->usr_usuario=$row['usr_usuario'];
        $this->usr_clave=$row['usr_clave'];
        $this->idperfil=$row['idperfil'];

        if(!(empty($this->usr_nombre)) && !(empty($this->usr_clave)) )
        {
            if(password_verify($usr_clave,$row['usr_clave'])){
                $query = "CALL sp_actualizafechalogueo($this->idusuario)";
                $result = $this->conn->prepare($query);
                $result->execute();
                return $this;
            }
            else{
                return null;
            }
        }
        else
        {
            return null;
        }
    }
}
?>