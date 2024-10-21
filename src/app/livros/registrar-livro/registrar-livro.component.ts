import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GeneroTextual, GeneroLinguistico } from '../../models/generos.model';
import Swal from 'sweetalert2';
import { Livro } from '../../models/livros.model';
import { GeneroService } from '../../services/Genero.Service/genero.service';
import { LivrosService } from '../../services/Livros.Service/livros.service';
import { PratileiraService } from '../../services/Pratileiras.Service/pratileira.service';

@Component({
  selector: 'app-registrar-livro',
  standalone: true,
  imports: [MatSnackBarModule, CommonModule, ReactiveFormsModule,FormsModule],

  templateUrl: './registrar-livro.component.html',
  styleUrl: './registrar-livro.component.css'
})
export class RegistrarLivroComponent {
  RegistrarLivro: FormGroup;
  pratileiras: any[] = [];
  generosTextuais: GeneroTextual[] = [];
  generosLinguisticos: GeneroLinguistico[] = [];

  constructor(
    private fb: FormBuilder,
    private livrosService: LivrosService,
    private pratileiraService: PratileiraService,
    private generoService: GeneroService
  ) {
    this.RegistrarLivro = this.fb.group({
      idLivro: [null],
      nomeLivro: ['', Validators.required],
      sequencia: [{ value: 1, disabled: true }, Validators.required],
      autorLivro: ['', Validators.required],
      generoTextual: ['', Validators.required],
      quantidadeLivro: [1, [Validators.required, Validators.min(1)]],
      generoLinguistico: ['', Validators.required],
      pratileira: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPratileiras();
    this.loadGenerosTextuais();
    this.loadGenerosLinguisticos();
  }

  loadPratileiras(): void {
    this.pratileiraService.getAllPratileiras().subscribe({

      next: (data) => this.pratileiras = data,

      error: (err) => {
        Swal.fire({
          icon: 'error',
          html: `<b>Erro ao carregar prateleiras!</b><p>Tente novamente mais tarde.</p>`
        });
      }
    });
  }

  loadGenerosTextuais(): void {
    this.generoService.getGenerosTextuais().subscribe({
      next: (data) => {
        this.generosTextuais = data.map(genero => ({
          ...genero,
          id: Number(genero.id)
        }));
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          html: `<b>Erro ao carregar gêneros textuais!</b><p>Tente novamente mais tarde.</p>`
        });
      }
    });
  }

  loadGenerosLinguisticos(): void {
    this.generoService.getGenerosLinguisticos().subscribe({
      next: (data) => {
        this.generosLinguisticos = data.map(genero => ({
          ...genero,
          id: Number(genero.id)
        }));
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          html: `<b>Erro ao carregar gêneros linguísticos!</b><p>Tente novamente mais tarde.</p>`
        });
      }
    });
  }

  // Validação separada por nome e autor
  verificarLivroExistente(): Promise<boolean> {
    const nomeLivro = this.RegistrarLivro.get('nomeLivro')?.value.trim();
    const autorLivro = this.RegistrarLivro.get('autorLivro')?.value.trim();

    return new Promise((resolve) => {
      if (nomeLivro && autorLivro) {
        this.livrosService.getLivroByNome(nomeLivro).subscribe({
          next: (livros) => {
            // Verificar se existe algum livro que tem o mesmo nome e o mesmo autor
            const livroDuplicado = livros.some(livro =>
              livro.nomeLivro === nomeLivro && livro.autorLivro === autorLivro
            );

            if (livroDuplicado) {
              // Bloqueia o cadastro se nome e autor forem iguais
              Swal.fire({
                icon: 'error',
                html: `<b>Livro já cadastrado!</b><p>Um livro com o mesmo nome e autor já existe.</p>`
              });
              resolve(true);
              return;
            }

            // Verificar se o livro existe e o autor é diferente
            const autorExistente = livros.some(livro => livro.autorLivro === autorLivro);
            const livroExistente = livros.some(livro => livro.nomeLivro === nomeLivro);

            if (livroExistente && autorExistente) {
              Swal.fire({
                icon: 'error',
                html: `<b>Cadastro inválido!</b><p>Não é possível cadastrar o mesmo livro com o mesmo autor.</p>`
              });
              resolve(true);
              return;
            }

            // Permite o cadastro se o livro não existir ou se o autor for diferente
            resolve(false);
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              html: `<b>Erro ao verificar existência do livro!</b><p>Tente novamente mais tarde.</p>`
            });
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  }

  async onSubmit() {
    if (this.RegistrarLivro.invalid) {
      Swal.fire({
        icon: 'info',
        html: `<b>Formulário inválido!</b><p>Por favor, preencha todos os campos obrigatórios!</p>`,
        showConfirmButton: false,
        timer: 2500
      });
      return;
    }

    // Aguarde a verificação de existência do livro
    const livroJaExistente = await this.verificarLivroExistente();
    if (livroJaExistente) {
      return;
    }

    const livroData: Livro = {
      idLivro: null, // Para novos registros
      nomeLivro: this.RegistrarLivro.value.nomeLivro,
      sequencia: this.RegistrarLivro.value.sequencia || 1,
      autorLivro: this.RegistrarLivro.value.autorLivro,
      quantidadeLivro: this.RegistrarLivro.value.quantidadeLivro,
      generoTextual: {
        id: parseInt(this.RegistrarLivro.value.generoTextual, 10),
        tipo: this.RegistrarLivro.value.generoTextualTipo
      },
      generoLinguistico: {
        id: parseInt(this.RegistrarLivro.value.generoLinguistico, 10),
        tipo: this.RegistrarLivro.value.generoLinguisticoTipo
      },
      pratileira: {
        idPratileira: parseInt(this.RegistrarLivro.value.pratileira, 10),
        nomePratileira: this.RegistrarLivro.value.nomePratileira,
        tipoEstadoPratileira: this.RegistrarLivro.value.tipoEstadoPratileira
      }
    };

    // Enviando os dados para o backend
    this.livrosService.saveLivro(livroData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          html: `<b>Livro registrado com sucesso!</b><p>O livro foi registrado corretamente.</p>`,
          showConfirmButton: false,
          timer: 2500
        });
        this.resetarFormulario(); // Chame o método para resetar o formulário após o sucesso
      },
      error: (error) => {
        let errorMessage = 'Erro ao registrar livro!';
        if (error.status === 404) {
          errorMessage = 'Livro não encontrado.';
        } else if (error.status === 500) {
          errorMessage = 'Erro ao registrar livro!';
        }

        Swal.fire({
          html: `<b>Erro!</b><p>${errorMessage}</p>`,
          icon: "error",
          showConfirmButton: false,
          timer: 2500
        });
      }
    });
  }

  resetarFormulario() {
    this.RegistrarLivro.reset({
      idLivro: null,
      nomeLivro: '',
      sequencia: 1,
      autorLivro: '',
      generoTextual: '',
      quantidadeLivro: 1,
      generoLinguistico: '',
      pratileira: ''
    });

    this.RegistrarLivro.get('sequencia')?.enable();
  }

  capitalizeInput(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    const capitalizedValue = this.transformToCapitalize(input.value);
    this.RegistrarLivro.get(field)?.setValue(capitalizedValue);
  }

  transformToCapitalize(value: string): string {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
