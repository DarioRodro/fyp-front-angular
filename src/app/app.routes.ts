import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { QuienesSomosComponent } from './pages/quienes-somos/quienes-somos.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { PrbProductosComponent } from './pages/prb-productos/prb-productos.component';
import { RevistaComponent } from './pages/revista/revista.component';
import { VerFiguraComponent } from './pages/ver-figura/ver-figura.component';
import { TerminosycondicionesComponent } from './pages/terminosycondiciones/terminosycondiciones.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { ConfirmarPagoComponent } from './pages/confirmar-pago/confirmar-pago.component';

export const routes: Routes = [
    {path: '', redirectTo: 'inicio', pathMatch: 'full'},
    {path: 'inicio', component: InicioComponent},
    {path: 'quienes-somos', component: QuienesSomosComponent},
    {path: 'catalogo', component: CatalogoComponent, runGuardsAndResolvers: 'paramsOrQueryParamsChange'}, 
    {path: 'prb-productos', component: PrbProductosComponent},
    {path: 'revista', component: RevistaComponent},
    {path: 'figura/:slug', loadComponent: () => import('./pages/ver-figura/ver-figura.component').then(m => m.VerFiguraComponent)},
    {path: 'terminosycondiciones', component: TerminosycondicionesComponent},
    {path: 'carrito', component: CarritoComponent},
    {path: 'confirmar-pago', component: ConfirmarPagoComponent},

];

