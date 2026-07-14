import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ListagemComponent } from './pages/listagem/listagem.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'listagem', component: ListagemComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: '**', redirectTo: 'login' }
];
