import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { FullLayoutComponent } from './components/full-layout/full-layout';
import { authGuard } from './auth.guard';
import { MedicosComponent } from './components/medicos/medicos';
import { PacientesComponent } from './components/pacientes/pacientes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: FullLayoutComponent,
    canActivate: [authGuard],

    children: [
      { path: '', redirectTo: 'medicos', pathMatch: 'full' },

      { path: 'medicos', component: MedicosComponent },
      { path: 'pacientes', component: PacientesComponent },
      // { path: 'atividades', component: AtividadesComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
