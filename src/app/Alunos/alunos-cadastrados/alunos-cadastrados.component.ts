import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlunosService } from '../../services/alunos-service/alunos.service';
import { Aluno } from '../../models/aluno.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alunos-cadastrados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alunos-cadastrados.component.html',
  styleUrl: './alunos-cadastrados.component.css'
})
export class AlunosCadastradosComponent {
  alunos: Aluno[] = [];
  paginatedAlunos: Aluno[] = [];
  filteredAluno: Aluno[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef;
  searchTerm: string = '';

  // Variáveis de paginação
  currentPage: number = 1;
  itemsPerPage: number = this.alunos.length = 10;

  constructor(private alunoService: AlunosService) {}

  ngOnInit(): void {
    this.loadAlunos();
  }

  loadAlunos(): void {
    this.alunoService.getAlunos().subscribe(data => {
      this.alunos = data;
      this.filteredAluno = this.alunos; // Começa sem filtro
      this.updatePaginatedAlunos();
    }, (error) => {
      Swal.fire({
        icon: "error",
        html: `
          <b>Erro</b>
          <p>Erro ao carregar alunos. Tente novamente.</p>
        `,
        showConfirmButton: false,
        timer: 2500
      });
    });
  }

  updatePaginatedAlunos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAlunos = this.filteredAluno.slice(startIndex, endIndex); // Usar alunos filtrados
  }

  deleteAluno(id: number): void {
    Swal.fire({
      html: `
        <b>Você tem certeza?</b>
        <p>Você não poderá reverter isso!</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sim, excluir!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.alunoService.deleteAluno(id).subscribe({
          next: () => {
            Swal.fire({
              html: `
                <b>Excluído!</b>
                <p>O aluno foi excluído com sucesso.</p>
              `,
              icon: "success",
              showConfirmButton: false,
              timer: 2500
            });
            this.loadAlunos(); // Carrega novamente a lista de alunos
            this.currentPage = this.currentPage; // Redefine a página atual para 1
            this.updatePaginatedAlunos(); // Atualiza os alunos paginados
          },
          error: (error) => {
            let errorMessage = '<b>Erro ao tentar apagar o aluno:</b> Tente novamente.';
            let iconType: 'error' | 'warning' | 'info' = 'error';  // Ícone padrão

            if (error.status === 404) {
              errorMessage = '<b>Aluno não encontrado:</b> O aluno especificado não foi localizado. Por favor, tente novamente.';
              iconType = 'info';
            } else if (error.status === 500) {
              errorMessage = '<b>Erro de Exclusão:</b> Ocorreu um erro ao tentar excluir o aluno. Por favor, tente novamente.';
              iconType = 'error';
            } else if (error.status === 409) {
              errorMessage = '<b>Erro de Exclusão:</b> Existem relações vinculadas que impedem a exclusão deste aluno.';
              iconType = 'warning';
            } else if (error.status === 400) {
              errorMessage = '<b>Erro de Requisição:</b> Verifique os dados enviados e tente novamente.';
              iconType = 'warning';
            }

            Swal.fire({
              html: `
                <b>Atenção!</b>
                <p>${errorMessage}</p>
              `,
              icon: iconType,
              confirmButtonText: 'Fechar'
            });
            this.loadAlunos(); // Carrega novamente a lista de alunos
          }
        });
      }
    });
  }

  applyFilter(event?: any): void {
    if (event) {
      this.searchTerm = event.target.value.trim().toLowerCase();
    }

    // Filtra com base nos critérios: Nome do Aluno, Estado da Prateleira ou Status Ativo
    this.filteredAluno = this.alunos.filter(aluno => {
      const matchesNomeAluno = aluno.nomeAluno.toLowerCase().includes(this.searchTerm);

      const matchesEstadoPrateleira = aluno.tipoEstadoPratileira?.descricao
        ? aluno.tipoEstadoPratileira.descricao.toLowerCase().includes(this.searchTerm)
        : false;

      const matchesAtivo = aluno.tipoAtivo?.descricao
        ? aluno.tipoAtivo.descricao.toLowerCase().includes(this.searchTerm)
        : false;

      return matchesNomeAluno || matchesEstadoPrateleira || matchesAtivo;
    });

    this.currentPage = 1; // Reseta para a primeira página
    this.updatePaginatedAlunos(); // Atualiza com o novo filtro
  }


  setPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedAlunos();
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedAlunos();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAlunos();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.alunos.length / this.itemsPerPage);
  }
}
