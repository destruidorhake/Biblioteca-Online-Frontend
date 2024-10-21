import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../Authentication/auth.service';
import { UsuariosService } from '../../services/user-service/usuarios.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, MatIconModule, CommonModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  isRightPanelActive: boolean = false;
  loginForm!: FormGroup;
  submitted = false;
  registrarForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registrarForm = this.formBuilder.group({
      usuarioProfessor: ['', [Validators.required, Validators.email]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]], // CPF/CNPJ
      senhaProfessor: ['', [Validators.required, Validators.minLength(6)]],
      isAdmin: [false],
      idAtivo: [1, Validators.required]
    });
  }

  onLogin(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.error("Formulário inválido");
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      (response: any) => {
        console.log('Resposta do login:', response);
        if (response.message === "Login bem-sucedido!") {
          // Redireciona para a rota desejada após login
          this.router.navigate(['/search']);
        } else {
          this.showError("Falha ao efetuar o login!");
        }
      },
      error => {
        console.error('Erro de autenticação', error);
        this.showError("Credenciais erradas! Favor verificar os campos!");
      }
    );
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Erro!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Fechar'
    });
  }

  onRegistrar(): void {
    this.submitted = true;
    if (this.registrarForm.invalid) {
      console.error("Formulário de registro inválido");
      return;
    }

    const professorData = this.registrarForm.value;

    this.usuariosService.registrarProfessor(professorData).subscribe(
      () => {
        Swal.fire({
          title: 'Sucesso!',
          text: 'Professor registrado com sucesso!',
          icon: 'success',
          confirmButtonText: 'Fechar'
        });
        this.router.navigate(['/search']);
      },
      (error: any) => {
        const errorMessage = error.status === 409 ? error.error.message : 'Falha ao registrar o professor!';
        Swal.fire({
          title: error.status === 409 ? 'Erro de cadastro!' : 'Erro!',
          text: errorMessage,
          icon: error.status === 409 ? 'info' : 'error',
          confirmButtonText: 'Fechar'
        });
      }
    );
  }

 // Função chamada ao clicar no botão de "Sign Up"
 signUp(): void {
  this.isRightPanelActive = true;
}

// Função chamada ao clicar no botão de "Sign In"
signIn(): void {
  this.isRightPanelActive = false;
}

// Eventos de submit (customize conforme necessário)
onSignUp(event: Event): void {
  event.preventDefault();
}

onSignIn(event: Event): void {
  event.preventDefault();
}
}
