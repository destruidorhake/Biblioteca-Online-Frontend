import { AlunosService } from './../../services/alunos-service/alunos.service';
import { LivrosService } from './../../services/Livros.Service/livros.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LivrosAtribuidosService } from '../../services/Livros-Atribuidos-Service/livros-atribuidos.service';
import { Aluno } from '../../models/aluno.model';
import { Livro } from '../../models/livros.model';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-atribuir-livro-aluno',
  standalone: true,
  imports: [MatSnackBarModule, CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './atribuir-livro-aluno.component.html',
  styleUrl: './atribuir-livro-aluno.component.css'
})
export class AtribuirLivroAlunoComponent {
  AtribuirForm: FormGroup;
  limpaFormulario: string | null = null;
  idadeInvalida: boolean = false;
  livros: Livro[] = [];
  alunos: Aluno[] = [];
  livroSequencia: { [key: number]: number } = {}; // Inicializa como um objeto


  constructor(
    private fb: FormBuilder,
    private livrosAtribuidosService: LivrosAtribuidosService,
    private livrosService: LivrosService,
    private alunosService: AlunosService
  ) {
    this.AtribuirForm = this.fb.group({
      Aluno: ['', [Validators.required]],
      Livro: ['', [Validators.required]],
      dataRegistro: ['', [Validators.required, this.futureDateValidator]]
    });
  }

  resetarFormulario() {
    this.AtribuirForm.reset({
      Aluno: '',
      Livro: '',
      dataRegistro: '',
    });
  }

  futureDateValidator(control: AbstractControl) {
    const today = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate > today ? { 'futureDate': true } : null;
  }

  ngOnInit() {
    this.loadAlunos();
    this.loadLivros();
  }

  openDatePicker() {
    const dateInput = document.getElementById('dataRegistro') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker(); // Tenta abrir o calendário diretamente
    }
  }

  loadAlunos() {
    this.alunosService.getAlunos().subscribe({
      next: (data) => {
        this.alunos = data; // Preenche a lista de alunos
      },
      error: (error) => {
        console.error('Erro ao carregar alunos:', error);
      }
    });
  }

  loadLivros() {
    this.livrosService.getLivros().subscribe({
      next: (data) => {
        this.livros = data;
        this.livros.forEach(livro => {
          if (livro.idLivro !== null) {
            this.livroSequencia[livro.idLivro] = 1; // Inicia a sequência em 1 se idLivro for válido
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar livros:', error);
      }
    });
  }

  onSubmit() {
    const { Aluno, Livro, dataRegistro } = this.AtribuirForm.value;

    if (this.isFutureDate()) return;
    if (this.isFormInvalid()) return;
    if (!this.validateBookQuantity(Livro)) return;

    this.showSequenceMessage(Livro);
    this.assignBook(Aluno, Livro, dataRegistro);
  }

  private isFormInvalid(): boolean {
    if (this.AtribuirForm.invalid) {
      Swal.fire({
        icon: 'info',
        html: `<b>Formulário inválido!</b><p>Por favor, preencha todos os campos obrigatórios!</p>`,
        showConfirmButton: false,
        timer: 1500
      });
      return true;
    }
    return false;
  }

  private isFutureDate(): boolean {
    if (this.AtribuirForm.get('dataRegistro')?.hasError('futureDate')) {
      Swal.fire({
        icon: 'warning',
        html: `<b>Data inválida!</b><p>Não é permitido selecionar uma data futura.</p>`,
        showConfirmButton: false,
        timer: 1500
      });
      return true;
    }
    return false;
  }

  private validateBookQuantity(Livro: Livro): boolean {
    const idLivro = Livro.idLivro;

    // Verifica se o ID do livro não é nulo e se a quantidade do livro é válida
    if (idLivro !== null && Livro.quantidadeLivro !== null) {
      if (this.livroSequencia[idLivro] >= Livro.quantidadeLivro) {
        Swal.fire({
          icon: 'warning',
          html: `<b>Atenção!</b><p>Você não pode atribuir mais livros do que a quantidade disponível.</p>`,
          showConfirmButton: false,
          timer: 1500
        });
        return false;
      }
    } else {
      Swal.fire({
        icon: 'error',
        html: `<b>Erro!</b><p>A quantidade do livro é inválida.</p>`,
        showConfirmButton: false,
        timer: 1500
      });
    }

    return true;
  }

  private showSequenceMessage(Livro: Livro): void {
    const idLivro = Livro.idLivro;
    if (idLivro !== null) {
      Swal.fire({
        icon: 'info',
        html: `<b>Atenção!</b><p>A sequência atual é ${this.livroSequencia[idLivro]} de ${Livro.quantidadeLivro} disponíveis.</p>`,
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  private assignBook(Aluno: any, Livro: Livro, dataRegistro: string): void {
    const idLivro = Livro.idLivro;

    if (idLivro !== null) {
      this.livrosAtribuidosService.atribuirLivro(Aluno, Livro, dataRegistro).subscribe({
        next: (response) => {
          this.livroSequencia[idLivro]++; // Incrementa a sequência
          Swal.fire({
            icon: 'success',
            html: `<b>Livro atribuído com sucesso!</b><p>O livro foi atribuído corretamente ao aluno.</p>`,
            showConfirmButton: false,
            timer: 2000
          });
          this.resetarFormulario(); // Reseta o formulário após a atribuição
        },
        error: (error) => this.handleError(error)
      });
    } else {
      Swal.fire({
        icon: 'error',
        html: `<b>Erro!</b><p>O ID do livro é inválido.</p>`,
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  private handleError(error: any): void {
    let errorMessage = 'Ocorreu um problema ao atribuir o livro. Por favor, tente novamente.';
    let boldMessage = 'Atenção!';
    let iconType: SweetAlertIcon = "error";

    // Tratamento de erros
    if (error.message.includes('400')) {
      errorMessage = 'Cadastre mais livros para continuar.';
      boldMessage = 'Quantidade de livros esgotada!';
      iconType = "warning";
    } else if (error.message.includes('404')) {
      errorMessage = 'Verifique os dados e tente novamente.';
      boldMessage = 'Não foi possível encontrar o livro ou o aluno.';
      iconType = "warning";
    } else if (error.message.includes('409')) {
      errorMessage = 'Escolha outro livro ou aluno.';
      boldMessage = 'Este livro já está atribuído a este aluno.';
      iconType = "info";
    } else if (error.message.includes('500')) {
      errorMessage = 'Tente novamente mais tarde.';
      boldMessage = 'Houve um erro interno no servidor.';
      iconType = "error";
    }

    Swal.fire({
      html: `<b>${boldMessage}</b><p>${errorMessage}</p>`,
      icon: iconType,
      showConfirmButton: false,
      timer: 2000
    });
  }
}
