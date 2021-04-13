import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DbService } from 'src/app/core/servicios/db.service';
import { CobranzaJudicialService } from '../../cobranza-judicial/cobranza-judicial.service';

@Component({
  selector: 'app-cobranza-judicial-distritos',
  templateUrl: './cobranza-judicial-distritos.component.html',
  styleUrls: ['./cobranza-judicial-distritos.component.css'] ,
})
export class CobranzaJudicialDistritosComponent implements OnInit {

  @Input() distrito : any ;
  @Input() InstanciasCompletas : Array<any> = [] ;
  @Input() ProcesosCompletos : Array<any> = [] ;
  @Output() cambio = new EventEmitter<any>() ;

  public Cargando = new BehaviorSubject<boolean>(true) ;

  public total_expedientes : number = 0 ;
  public Instancias : Array<any> = [] ;
  // public Procesos : Array<any> = [] ;

  constructor(
    private _db : DbService ,
  ) { }

  ngOnInit(): void {
    this.CargarData() ;
  }

  CargarData() {
    this._db.ListarInstanciasxDistrito(this.distrito.id_distrito)
    .then(resultado => {
      // console.log(resultado) 
      this.Instancias = resultado ;
    })
    // this.Instancias = this.InstanciasCompletas.filter(elemento => elemento.id_distrito === this.distrito.id_distrito) ;
    // this.Procesos = this.ProcesosCompletos.filter(elemento => elemento.id_distrito === this.distrito.id_distrito) ;
    this._db.ContarProcesosxDistrito(this.distrito.id_distrito)
    .then(resultado => {
      this.total_expedientes = resultado ;
    })
    // this.total_expedientes = this.Procesos.length ;
  }

  // AsignarElemento(index : number, evento : number) {
  //   this.Instancias[index]['total_expedientes'] = evento ;
  //   this.CalcularTotal() ;
  // }

  // CalcularTotal() {
  //   let incompleto = this.Instancias.every(elemento => elemento?.total_expedientes > 0 ) ;

  //   if ( !incompleto ) {
  //     this.Cargando.next(true) ;
  //     // this.cambio.emit() ;
  //   } else {
  //     this.Cargando.next(false) ;
  //     this.total_expedientes = this.Instancias.reduce((acumulado, elemento) => acumulado + elemento.total_expedientes, 0) ;
  //   }
  //   this.cambio.emit() ;
  // }
}
