import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { QuienesSomosComponent } from './pages/quienes-somos/quienes-somos.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { PrbProductosComponent } from './pages/prb-productos/prb-productos.component';
import { RevistaComponent } from './pages/revista/revista.component';

export const routes: Routes = [
    {path: '', redirectTo: 'inicio', pathMatch: 'full'},
    {path: 'inicio', component: InicioComponent},
    {path: 'quienes-somos', component: QuienesSomosComponent},
    {path: 'catalogo', component: CatalogoComponent}, 
    {path: 'prb-productos', component: PrbProductosComponent},
    {path: 'revista', component: RevistaComponent}
];

