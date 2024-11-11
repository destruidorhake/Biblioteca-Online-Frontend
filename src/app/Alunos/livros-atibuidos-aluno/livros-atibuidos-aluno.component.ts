import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LivrosAtribuidosService } from '../../services/Livros-Atribuidos-Service/livros-atribuidos.service';
import { AlunoLivro } from '../../models/alunoLivro.model';
import { RouterModule } from '@angular/router';
import { LivrosService } from '../../services/Livros.Service/livros.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-livros-atibuidos-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './livros-atibuidos-aluno.component.html',
  styleUrl: './livros-atibuidos-aluno.component.css'
})
export class LivrosAtibuidosAlunoComponent {
  alunoLivros: AlunoLivro[] = [];
  paginatedAlunoLivros: AlunoLivro[] = [];
  filteredAlunoLivros: AlunoLivro[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isMobile: boolean = false;

  @ViewChild('searchInput') searchInput!: ElementRef;
  searchTerm: string = '';

  constructor(
    private livrosAtribuidosService: LivrosAtribuidosService,
    private livrosService: LivrosService,
  ) {}

  ngOnInit(): void {
    this.loadAlunoLivros();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  applyFilter(event?: any): void {
    if (event) {
      // Atualiza searchTerm ao digitar
      this.searchTerm = event.target.value;
    }

    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.filteredAlunoLivros = this.alunoLivros.filter(alunoLivro => {
      const matchesAlunoNome = alunoLivro.alunoNome.toLowerCase().includes(filterValue);
      const matchesLivroNome = alunoLivro.livroNome.toLowerCase().includes(filterValue);
      const matchesDataRegistro = new Date(alunoLivro.dataRegistro).toLocaleDateString().includes(filterValue);

      return matchesAlunoNome || matchesLivroNome || matchesDataRegistro;
    });
    this.currentPage = 1; // Reseta para a primeira página ao pesquisar
    this.updatePaginatedAlunoLivros(); // Atualiza a tabela com os resultados filtrados
  }

  loadAlunoLivros(): void {
    this.livrosAtribuidosService.getAllAlunoLivros().subscribe(data => {
      this.alunoLivros = data;
      this.filteredAlunoLivros = data; // Inicializa com todos os livros
      this.updatePaginatedAlunoLivros(); // Atualiza os livros atribuídos paginados
    }, (error) => {
      Swal.fire({
        icon: "error",
        html: `
          <b>Erro</b>
          <p>Erro ao carregar livros atribuídos. Tente novamente.</p>
        `,
        showConfirmButton: false,
        timer: 2500
      });
    });
  }

  updatePaginatedAlunoLivros(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAlunoLivros = this.alunoLivros.slice(startIndex, endIndex);
    this.paginatedAlunoLivros = this.filteredAlunoLivros.slice(startIndex, endIndex);
  }

  desatribuir(alunoLivro: AlunoLivro): void {
    if (!alunoLivro.aluno?.idAluno || !alunoLivro.livro?.idLivro) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Aluno ID ou Livro ID não definidos.',
      });
      return;
    }

    const livroId = alunoLivro.livro.idLivro!;

    this.livrosAtribuidosService.deleteLivro(alunoLivro.aluno.idAluno, livroId).subscribe({
      next: () => {
        this.livrosService.getSequenciaLivros(livroId).subscribe({
          next: sequencia => {
            let sequenciaAtualizada = Math.max(sequencia.sequencia - 1, 1); // Garante que a sequência seja no mínimo 1

            // Validação para a nova sequência
            if (sequenciaAtualizada < 0) {
              Swal.fire({
                icon: 'info',
                title: 'Erro',
                text: 'A sequência não pode ser negativa.',
                timer: 2500
              });
              return;
            }
            // Atualiza a sequência do livro
            this.livrosService.updateSequenciaLivro(livroId, sequenciaAtualizada).subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  html: `<b>Operação Concluída</b><p>Livro desatribuído com sucesso!</p>`,
                  showConfirmButton: false,
                  timer: 2500
                });
                this.loadAlunoLivros(); // Atualiza a lista de livros
              },
              error: (error) => {
                Swal.fire({
                  icon: 'error',
                  html: `<b>Operação Não Executada</b><p>Erro ao atualizar sequência do livro.</p>`,
                  showConfirmButton: false,
                  timer: 2500
                });
              }
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'warning',
              html: `<b>Operação Não Executada</b><p>Erro ao obter sequência do livro.</p>`,
              showConfirmButton: false,
              timer: 2500
            });
          }
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          html: `<b>Operação Não Executada</b><p>Erro ao desatribuir livro.</p>`,
          showConfirmButton: false,
          timer: 2500
        });
      }
    });
  }


  focusInput() {
    this.searchInput.nativeElement.focus();
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedAlunoLivros();
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedAlunoLivros();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAlunoLivros();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.alunoLivros.length / this.itemsPerPage);
  }
}
