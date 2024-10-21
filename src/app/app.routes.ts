import { Routes } from '@angular/router';
import { RegistrarAlunoComponent } from './Alunos/registrar-aluno/registrar-aluno.component';
import { RegistrarLivroComponent } from './livros/registrar-livro/registrar-livro.component';
import { AlunosCadastradosComponent } from './Alunos/alunos-cadastrados/alunos-cadastrados.component';
import { LivrosComponent } from './livros/Livros-Cadastrados/livros.component';
import { AuthGuard } from './Authentication/auth.guard';
import { InfoComponent } from './Navegacao/info/info.component';
import { ResetarSenhaComponent } from './Usuario/resetar-senha/resetar-senha.component';
import { UserLoginComponent } from './Usuario/login/user-login.component';
import { LivrosAtibuidosAlunoComponent } from './Alunos/livros-atibuidos-aluno/livros-atibuidos-aluno.component';
import { AtribuirLivroAlunoComponent } from './livros/atribuir-livro-aluno/atribuir-livro-aluno.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'resetar-senha', component: ResetarSenhaComponent },
  {
    path: 'search',
    canActivate: [AuthGuard],
    data: { allowedUserTypes: ['admin', 'professor'] },
    children: [
      { path: '', component: LivrosComponent },
      { path: 'registrar-aluno', component: RegistrarAlunoComponent },
      { path: 'registrar-livro', component: RegistrarLivroComponent },
      { path: 'alunos-cadastrados', component: AlunosCadastradosComponent },
      { path: 'livros-cadastrados', component: LivrosComponent },
      { path: 'atribuir', component: AtribuirLivroAlunoComponent },
      { path: 'atribuido', component: LivrosAtibuidosAlunoComponent },
      { path: 'informacao', component: InfoComponent },
      { path: '**', component: UserLoginComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
