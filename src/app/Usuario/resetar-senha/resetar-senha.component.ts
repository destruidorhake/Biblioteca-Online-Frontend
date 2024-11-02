import { Component } from '@angular/core';
import { MatIconButton, MatIconAnchor, MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Authentication/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resetar-senha',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatOptionModule,
    MatTableModule,
    MatIconModule,
    MatIconButton,
    MatIconAnchor,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './resetar-senha.component.html',
  styleUrls: ['./resetar-senha.component.css']
})
export class ResetarSenhaComponent {
  resetarForm!: FormGroup;
  isRightPanelActive: boolean = false;
  isSubmitting = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.resetarForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      numeroDocumento: ['', [Validators.required]]
    });
  }

  onResetar(): void {
    if (this.resetarForm.valid) {
      this.isSubmitting = true; // Desabilita o botão e exibe o loading
      const { email, numeroDocumento } = this.resetarForm.value;

      this.authService.resetPassword(email, numeroDocumento).subscribe(
        () => {
          this.isSubmitting = false;
          Swal.fire({
            title: 'E-mail encontrado!',
            text: 'Uma nova senha foi enviada para o seu e-mail.',
            icon: 'info',
            confirmButtonText: 'Fechar'
          });
        },
        error => {
          this.isSubmitting = false;
          if (error.status === 404) {
            Swal.fire({
              title: 'Operação Inválida',
              text: 'E-mail ou número de documento não encontrado.',
              icon: 'info',
              confirmButtonText: 'Fechar'
            });
          } else {
            Swal.fire({
              title: 'Erro!',
              text: 'Erro ao tentar resetar a senha. Tente novamente mais tarde.',
              icon: 'error',
              confirmButtonText: 'Fechar'
            });
          }
        }
      );
    }
  }
}

