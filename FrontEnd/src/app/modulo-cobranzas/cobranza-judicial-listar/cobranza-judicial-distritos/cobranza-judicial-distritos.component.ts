import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CobranzaJudicialService } from '../../cobranza-judicial/cobranza-judicial.service';

@Component({
  selector: 'app-cobranza-judicial-distritos',
  templateUrl: './cobranza-judicial-distritos.component.html',
  styleUrls: ['./cobranza-judicial-distritos.component.css'] ,
  // changeDetection : ChangeDetectionStrategy.OnPush ,
})
export class CobranzaJudicialDistritosComponent implements OnInit, OnChanges {

  @Input() distrito : any ;
  @Input() filtros : any ;
  @Output() cambio = new EventEmitter<any>() ;

  public Cargando = new BehaviorSubject<boolean>(true) ;

  public Instancias : Array<any> = [] ;
  public total_expedientes : number = 0 ;

  constructor(
    private _judicial : CobranzaJudicialService ,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChanges) {
    let cambio = changes['filtros'] ;

    if ( cambio.currentValue ) {
      this.CargarData() ;
    }
  }

  CargarData() {
    this._judicial.ListarInstancias(
      this.distrito.id_distrito ,
      '' ,
      this.filtros.expediente ,
      this.filtros.dni ,
      this.filtros.cliente ,
      this.filtros.fecha_inicio ,
      this.filtros.fecha_fin ,
      this.filtros.estado
    ).subscribe(res=>{
      this.Instancias = res['data'].instancias ;
      this.cambio.emit() ;
    })
  }

  AsignarElemento(index : number, evento : number) {
    this.Instancias[index]['total_expedientes'] = evento ;
    this.CalcularTotal() ;
  }

  CalcularTotal() {
    let incompleto = this.Instancias.every(elemento => elemento?.total_expedientes > 0 ) ;

    if ( !incompleto ) {
      this.Cargando.next(true) ;
      // this.cambio.emit() ;
    } else {
      this.Cargando.next(false) ;
      this.total_expedientes = this.Instancias.reduce((acumulado, elemento) => acumulado + elemento.total_expedientes, 0) ;
    }
    this.cambio.emit() ;

  }
}
