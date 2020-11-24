import { AbstractControl } from '@angular/forms' ;
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CobranzasService } from '../../modulo-cobranzas/cobranzas-listar/cobranzas.service' ;

export class Validadores {
  static VoucherUnicioValidador(_cobranzas : CobranzasService) {
    return (control: AbstractControl) => {
      const valor = control.value ;
      if ( valor ) {
        // Se verifica si el voucher esta repetido en la DB
        return _cobranzas.BuscarNumeroOperacion(valor)
        .pipe(
          map(resultado => {
            if (resultado) {
              return {repetido: true} ;
            } else {
              return null;
            }
          })
        )
      } else {
        return of(null) ;
      }
    }
  }
}
