<?php
Class Cliente{

    private $conn;
    private $table_name = "cliente";

    public $idcliente;
    public $id_sede;
    public $id_institucion;
    public $id_subsede;
    public $id_cargo_estado;
    public $ssd_nombre;
    public $sd_nombre;
    public $inst_nombre;
    public $clt_codigo;
    public $clt_dni;
    public $clt_numero;
    public $clt_nombre;
    public $clt_foto;
    public $clt_cip;
    public $clt_email;
    public $clt_casilla;
    public $clt_trabajo;
    public $id_distrito;
    public $id_provincia;
    public $id_departamento;
    public $provincia;
    public $departamento;
    public $clt_cargo;
    public $capacidad_pago;
    public $maximo_descuento;
    public $clt_calificacion_personal;
    public $clt_aporte;
    public $clt_estado;
    public $clt_fecharegistro;

    public $clt_aporteinicio;
    public $clt_aportefin;
    public $prpagina;
    public $prtotalpagina;


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "CALL sp_listarcliente (?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->inst_nombre);
        $result->bindParam(2, $this->sd_nombre);
        $result->bindParam(3, $this->ssd_nombre);
        $result->bindParam(4, $this->clt_cargo);
        $result->bindParam(5, $this->clt_codigo);
        $result->bindParam(6, $this->clt_dni);
        $result->bindParam(7, $this->clt_nombre);
        $result->bindParam(8, $this->prpagina);
        $result->bindParam(9, $this->prtotalpagina);

        $result->execute();
    
        $cliente_list=array();
        $cliente_list["clientes"]=array();
        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $cliente_item = array (
                "numero"=>$contador,
                "id"=>$row['id'],
                "institucion"=>$row['institucion'],
                "sede"=>$row['sede'],
                "subsede"=>$row['subsede'],
                "id_cargo"=>$row['id_cargo'],
                "cargo"=>$row['cargo'],
                "id_cargo_estado"=>$row['id_cargo_estado'],
                "cargo_estado"=>$row['cargo_estado'],
                "codigo"=>$row['codigo'],
                "dni"=>$row['dni'],
                "nombre"=>$row['nombre'],
                "cip"=>$row['cip'],
                "email"=>$row['email'],
                "casilla"=>$row['casilla'],
                "trabajo"=>$row['trabajo'],
                "subsede"=>$row['subsede'],
                "cargo"=>$row['cargo'],
                "capacidad_pago"=>$row['capacidad_pago'],
                "id_distrito_trabajo"=>$row['id_distrito_trabajo'],
                "distrito"=>$row['distrito'],
                "id_provincia"=>$row['id_provincia'],
                "provincia"=>$row['provincia'],
                "id_departamento"=>$row['id_departamento'],
                "departamento"=>$row['departamento'],
                "capacidad_pago"=>$row['capacidad_pago'],
                "maximo_descuento"=>$row['maximo_descuento'],
                "calificacion_personal"=>$row['calificacion_personal'],
                "aporte"=>$row['aporte'],
                "fecharegistro"=>$row['fecha_registro'],
                "foto"=>$row['foto']
            );

                array_push($cliente_list["clientes"],$cliente_item);
        }
        return $cliente_list;
    }


    function contar(){

        $query = "CALL sp_listarclientecontar(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->inst_nombre);
        $result->bindParam(2, $this->sd_nombre);
        $result->bindParam(3, $this->ssd_nombre);
        $result->bindParam(4, $this->clt_cargo);
        $result->bindParam(5, $this->clt_codigo);
        $result->bindParam(6, $this->clt_dni);
        $result->bindParam(7, $this->clt_nombre);
        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function readpreciso(){
        $query = "CALL sp_listarclientepreciso(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->clt_dni);
        $result->bindParam(2, $this->clt_nombre);

        $result->execute();
    
        $cliente_list=array();
        $cliente_list["clientes"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $cliente_item = array (
                "id"=>$row['id'],
                "institucion"=>$row['institucion'],
                "sede"=>$row['sede'],
                "subsede"=>$row['subsede'],
                "cargo"=>$row['cargo'],
                "cargo_estado"=>$row['cargo_estado'],
                "codigo"=>$row['codofin'],
                "dni"=>$row['dni'],
                "nombre"=>$row['nombre'],
                "cip"=>$row['cip'],
                "email"=>$row['email'],
                "aporte"=>$row['aporte'],
            );

            array_push($cliente_list["clientes"],$cliente_item);
        }
        return $cliente_list;
    }
    
    function read_telefono(){

        $query = "CALL sp_listarclientexcelular(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->clt_numero);

        $result->execute();
    
        $cliente_list=array();
        $cliente_list["clientes"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $cliente_item = array (
                "id"=>$row['id'],
                "dni"=>$row['dni'],
                "nombre"=>$row['nombre'],
            );

            array_push($cliente_list["clientes"],$cliente_item);
        }
        return $cliente_list; 
    }

    function create()
    {
        $query = "CALL sp_crearcliente(
            :id_sub_sede,
            :id_cargo_estado,
            :clt_codigo,
            :clt_dni,
            :clt_nombre,
            :clt_foto,
            :clt_cip,
            :clt_email,
            :clt_casilla,
            :id_distrito,
            :clt_trabajo,
            :clt_capacidad_pago,
            :clt_maximo_descuento,
            :clt_calificacion_personal,
            :clt_aporte,
            :clt_fecharegistro
        )"; 

        $result = $this->conn->prepare($query);

        $this->id_sub_sede=htmlspecialchars(strip_tags($this->id_sub_sede));
        $this->id_cargo_estado=htmlspecialchars(strip_tags($this->id_cargo_estado));
        $this->clt_codigo=htmlspecialchars(strip_tags($this->clt_codigo));
        $this->clt_dni=htmlspecialchars(strip_tags($this->clt_dni));
        $this->clt_nombre=htmlspecialchars(strip_tags($this->clt_nombre));
        $this->clt_foto=htmlspecialchars(strip_tags($this->clt_foto));
        $this->clt_cip=htmlspecialchars(strip_tags($this->clt_cip));
        $this->clt_email=htmlspecialchars(strip_tags($this->clt_email));
        $this->clt_casilla=htmlspecialchars(strip_tags($this->clt_casilla));
        $this->id_distrito=htmlspecialchars(strip_tags($this->id_distrito));
        $this->clt_trabajo=htmlspecialchars(strip_tags($this->clt_trabajo));
        $this->capacidad_pago=htmlspecialchars(strip_tags($this->capacidad_pago));
        $this->clt_maximo_descuento=htmlspecialchars(strip_tags($this->clt_maximo_descuento));
        $this->clt_calificacion_personal=htmlspecialchars(strip_tags($this->clt_calificacion_personal));
        $this->clt_aporte=htmlspecialchars(strip_tags($this->clt_aporte));
        $this->clt_fecharegistro=htmlspecialchars(strip_tags($this->clt_fecharegistro));

        $result->bindParam(":id_sub_sede", $this->id_sub_sede);
        $result->bindParam(":id_cargo_estado", $this->id_cargo_estado);
        $result->bindParam(":clt_codigo", $this->clt_codigo);
        $result->bindParam(":clt_dni", $this->clt_dni);
        $result->bindParam(":clt_nombre", $this->clt_nombre);
        $result->bindParam(":clt_foto", $this->clt_foto);
        $result->bindParam(":clt_cip", $this->clt_cip);
        $result->bindParam(":clt_email", $this->clt_email);
        $result->bindParam(":clt_casilla", $this->clt_casilla);
        $result->bindParam(":id_distrito", $this->id_distrito);
        $result->bindParam(":clt_trabajo", $this->clt_trabajo);
        $result->bindParam(":clt_capacidad_pago", $this->capacidad_pago);
        $result->bindParam(":clt_maximo_descuento", $this->clt_maximo_descuento);
        $result->bindParam(":clt_calificacion_personal", $this->clt_calificacion_personal);
        $result->bindParam(":clt_aporte", $this->clt_aporte);
        $result->bindParam(":clt_fecharegistro", $this->clt_fecharegistro);
        

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
    
    function readxId(){
        
        $query ="CALL sp_listarclientexId(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idcliente);

        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $this->idcliente = $row['idcliente'];
        $this->id_institucion=$row['id_institucion'];
        $this->id_sede=$row['id_sede'];
        $this->id_subsede=$row['id_subsede'];
        $this->id_cargo=$row['id_cargo'];
        $this->id_cargo_estado=$row['id_cargo_estado'];
        $this->clt_codigo=$row['clt_codigo'];
        $this->clt_dni=$row['clt_dni'];
        $this->clt_nombre=$row['clt_nombre'];
        $this->clt_foto=$row['clt_foto'];
        $this->clt_cip= $row['clt_cip'];
        $this->clt_email=$row['clt_email'];
        $this->clt_casilla=$row['clt_casilla'];
        $this->clt_trabajo=$row['clt_trabajo'];
        $this->id_distrito_trabajo=$row['id_distrito_trabajo'];
        $this->id_provincia=$row['id_provincia'];
        $this->provincia=$row['prv_nombre'];
        $this->id_departamento=$row['id_departamento'];
        $this->departamento=$row['dpt_nombre'];
        $this->capacidad_pago=$row['clt_capacidad_pago'];
        $this->clt_maximo_descuento=$row['clt_maximo_descuento'];
        $this->clt_calificacion_personal= $row['clt_calificacion_personal'];
        $this->clt_aporte=$row['clt_aporte'];
        $this->clt_fecharegistro=$row['clt_fecharegistro'];
    }

    function update()
    {
        $query = "CALL sp_actualizarcliente (
            :idcliente,
            :id_subsede,
            :id_cargo_estado,
            :clt_codigo,
            :clt_dni,
            :clt_nombre,
            :clt_cip,
            :clt_email,
            :clt_casilla,
            :clt_trabajo,
            :id_distrito_trabajo,
            :clt_capacidad_pago,
            :clt_maximo_descuento,
            :clt_calificacion_personal,
            :clt_aporte
        )"; 

        $result = $this->conn->prepare($query);

        $this->idcliente=htmlspecialchars(strip_tags($this->idcliente));
        $this->id_subsede=htmlspecialchars(strip_tags($this->id_subsede));
        $this->id_cargo_estado=htmlspecialchars(strip_tags($this->id_cargo_estado));
        $this->clt_codigo=htmlspecialchars(strip_tags($this->clt_codigo));
        $this->clt_dni=htmlspecialchars(strip_tags($this->clt_dni));
        $this->clt_nombre=htmlspecialchars(strip_tags($this->clt_nombre));
        $this->clt_cip=htmlspecialchars(strip_tags($this->clt_cip));
        $this->clt_email=htmlspecialchars(strip_tags($this->clt_email));
        $this->clt_casilla=htmlspecialchars(strip_tags($this->clt_casilla));
        $this->clt_trabajo=htmlspecialchars(strip_tags($this->clt_trabajo));
        $this->id_distrito_trabajo=htmlspecialchars(strip_tags($this->id_distrito_trabajo));
        $this->capacidad_pago=htmlspecialchars(strip_tags($this->capacidad_pago));
        $this->maximo_descuento=htmlspecialchars(strip_tags($this->maximo_descuento));
        $this->clt_calificacion_personal=htmlspecialchars(strip_tags($this->clt_calificacion_personal));
        $this->clt_aporte=htmlspecialchars(strip_tags($this->clt_aporte));

        $result->bindParam(":idcliente", $this->idcliente);
        $result->bindParam(":id_subsede", $this->id_subsede);
        $result->bindParam(":id_cargo_estado", $this->id_cargo_estado);
        $result->bindParam(":clt_codigo", $this->clt_codigo);
        $result->bindParam(":clt_dni", $this->clt_dni);
        $result->bindParam(":clt_nombre", $this->clt_nombre);
        $result->bindParam(":clt_cip", $this->clt_cip);
        $result->bindParam(":clt_email", $this->clt_email);
        $result->bindParam(":clt_casilla", $this->clt_casilla);
        $result->bindParam(":clt_trabajo", $this->clt_trabajo);
        $result->bindParam(":id_distrito_trabajo", $this->id_distrito_trabajo);
        $result->bindParam(":clt_capacidad_pago", $this->capacidad_pago);
        $result->bindParam(":cltrmaximo_descuento", $this->maximo_descuento);
        $result->bindParam(":clt_calificacion_personal", $this->clt_calificacion_personal);
        $result->bindParam(":clt_aporte", $this->clt_aporte);
        

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
    function delete()
    {
        $query = "call sp_eliminarcliente(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idcliente);

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }
    
    function updatefoto()
    {
        $query= "CALL sp_actualizarfoto(:idcliente, :clt_foto)";

        $result = $this->conn->prepare($query);

        $this->idcliente=htmlspecialchars(strip_tags($this->idcliente));
        $this->clt_foto=htmlspecialchars(strip_tags($this->clt_foto));

        $result->bindParam(":idcliente", $this->idcliente);
        $result->bindParam(":clt_foto", $this->clt_foto);

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
}
?>