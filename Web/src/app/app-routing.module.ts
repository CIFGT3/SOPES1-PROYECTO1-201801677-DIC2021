import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CpuComponent } from './components/cpu/cpu.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MemoriaComponent } from './components/memoria/memoria.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'memoria', component: MemoriaComponent},
  { path: 'cpu', component: CpuComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
