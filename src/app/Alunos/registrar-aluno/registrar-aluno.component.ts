import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { AlunosService } from '../../services/alunos-service/alunos.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Aluno } from '../../models/aluno.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registrar-aluno',
  standalone: true,
  imports: [MatSnackBarModule, CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './registrar-aluno.component.html',
  styleUrl: './registrar-aluno.component.css'
})
export class RegistrarAlunoComponent {
  RegistrarAluno: FormGroup;
  limpaFormulario: string | null = null;
  idadeInvalida: boolean = false;

  constructor(private fb: FormBuilder, private alunosService: AlunosService) {
    this.RegistrarAluno = this.fb.group({
      nomeAluno: ['', [Validators.required]],
      sobrenomeAluno: ['', [Validators.required]],
      idadeAluno: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
  }

  onSubmit() {
    this.idadeInvalida = false;

    const idade = this.RegistrarAluno.value.idadeAluno;

    if (idade == null || idade == "") {
      Swal.fire({
        icon: "info",
        html: `
          <b>Informações incompletas.</b>
          <p style="margin-top: 3%; color: black;">Preencha todos os campos obrigatórios antes de continuar!</p>
        `,
      });
    } else
    if (idade < 1 || idade > 999) {
      this.idadeInvalida = true;
      Swal.fire({
        icon: "warning",
        html: `
          <b>Idade inválida!</b>
          <p style="margin-top: 3%; color: black;">A idade deve ser verdadeira! </p>
          <p style="margin-top: 3%; color: black;">Limite de digitos entre 1 e 999 </p>
        `,
      });
      return;
    }

    if (this.RegistrarAluno.valid) {
      const aluno: Omit<Aluno, 'idAluno'> = {
        nomeAluno: this.RegistrarAluno.value.nomeAluno + ' ' + this.RegistrarAluno.value.sobrenomeAluno,
        idade: idade,
        tipoAtivo: {
          idAtivo: 1,
          descricao: 'Ativo'
        },
        tipoEstadoPratileira: {
          idEstadoPratileira: 1,
          descricao: 'Disponível'
        }
      };

      this.alunosService.saveAluno(aluno)
        .subscribe({
          next: (response) => {
            Swal.fire({
              position: "center",
              icon: "success",
              html: `
                <b>Aluno cadastrado com sucesso!</b>
                <p style="margin-top: 3%; color: black;">O formulário será limpo em breve...</p>
              `,
              showConfirmButton: false,
              timer: 2500
            });

            // Limpar Formulário
            setTimeout(() => {
              this.RegistrarAluno.reset();
              this.limpaFormulario = '';
            }, 2000);
          },
          error: (error) => {
            Swal.fire({
              icon: "error",
              html: `
                <b>Falha ao registrar o aluno!</b>
                <p style="margin-top: 3%; color: black;">Por favor, tente novamente mais tarde.</p>
              `,
            });
          }
        });
    } else {
      Swal.fire({
        icon: "info",
        html: `
          <b>Informações incompletas.</b>
          <p style="margin-top: 3%; color: black;">Preencha todos os campos obrigatórios antes de continuar!</p>
        `,
      });
    }
  }

  formatarTexto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const textoFormatado = input.value
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
    input.value = textoFormatado;
    this.RegistrarAluno.get(input.name)?.setValue(textoFormatado); // Atualiza o valor do FormGroup
  }
}
