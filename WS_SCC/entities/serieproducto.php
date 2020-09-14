<?php 

require '../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class SerieProducto{
	private $conn;
	//private $table_name = "tipo_producto";

	public $archivo;
	public $serie;
	public $movimiento_serie;
	public $movimiento_numero;
	public $numero_pagina;
  public $total_pagina;
  
  public $path_reporte = '../uploads/reporte-movimientos-series/';

	public function __construct($db){
		$this->conn = $db;
	}

	function read(){
		$query = "CALL sp_listarhistorialserie(?,?,?)";

		$result = $this->conn->prepare($query);

        $result->bindParam(1, $this->serie);
        $result->bindParam(2, $this->numero_pagina);
        $result->bindParam(3, $this->total_pagina);

		$result->execute();

		$serieproducto_list=array();
		$serieproducto_list["series"]=array();

		$contador = $this->total_pagina*($this->numero_pagina-1);


		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
			$contador = $contador+1;
			$serieproducto_fila = array(
				"numero" => $contador,
				"movimiento_serie"=>$movimiento_serie,
				"movimiento_numero"=>$movimiento_numero,
        "fecha" => $fecha,
        "documento" => $documento,
        "transaccion" => $transaccion,
        "producto" => $producto,
				"tenedor" => $tenedor,
				"serie" => $serie . " "
			);
			array_push($serieproducto_list["series"],$serieproducto_fila);
		}

		return $serieproducto_list;
	}

	function contar(){
    $query = "CALL sp_listarhistorialseriecontar(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->serie);
    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

	function read_unlimited(){
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

		$query = "CALL sp_listarhistorialserieunlimited(?)";

		$result = $this->conn->prepare($query);

    $result->bindParam(1, $this->serie);

		$result->execute();

    $archivo = "" ;
		$serieproducto_list=array();
		$serieproducto_list["series"]=array();
    $contador = 1;

    $sheet->setCellValue('A1', 'N°');
    $sheet->setCellValue('B1', 'Fecha');
    $sheet->setCellValue('C1', 'Serie');
    $sheet->setCellValue('D1', 'Producto');
    $sheet->setCellValue('E1', 'Documento');
    $sheet->setCellValue('F1', 'Movimiento');
    $sheet->setCellValue('G1', 'Transacción');
    $sheet->setCellValue('H1', 'Referente');

		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
      extract($row);
      $contador=$contador+1;

      $sheet->setCellValue('A' . $contador, $contador-1 );
      $sheet->setCellValue('B' . $contador, $fecha );
      $sheet->setCellValue('C' . $contador, $serie );
      $sheet->setCellValue('D' . $contador, $producto );
      $sheet->setCellValue('E' . $contador, $documento );
      $sheet->setCellValue('F' . $contador, $movimiento );
      $sheet->setCellValue('G' . $contador, $transaccion );
      $sheet->setCellValue('H' . $contador, $tenedor );
		}

    $writer = new Xlsx($spreadsheet);

    $archivo = $this->path_reporte.$this->archivo.'.xlsx';

    $writer->save($archivo);
    
    if( file_exists ( $archivo ) ){
      return $archivo;
    } else {
      return false;
    };
	}

}

?>