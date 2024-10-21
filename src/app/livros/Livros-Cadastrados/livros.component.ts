import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Livro } from '../../models/livros.model';
import { LivrosService } from '../../services/Livros.Service/livros.service';
import { AuthService } from '../../Authentication/auth.service';

@Component({
  selector: 'app-livros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livros.component.html',
  styleUrl: './livros.component.css'
})
export class LivrosComponent {
  livros: any[] = [];
  paginatedLivros: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  livroSelecionado: any;
  userSession: any;

  @ViewChild('searchInput') searchInput!: ElementRef;
  searchTerm: string = '';

  constructor(private livrosService: LivrosService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadLivros();
  }

  getOrdem(index: number): number {
    return index + 1 + (this.currentPage - 1) * this.itemsPerPage;
  }

  loadLivros(): void {
    this.livrosService.getLivros().subscribe(data => {
      this.livros = data;
      this.updatePaginatedLivros();
    });
  }

  updatePaginatedLivros(): void {
    const filteredLivros = this.livros.filter(livro => {
      const matchesNomeLivro = livro.nomeLivro.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesAutorLivro = livro.autorLivro.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSequencia = livro.sequencia.toString().includes(this.searchTerm); // Convertendo para string
      const matchesQuantidadeLivro = livro.quantidadeLivro.toString().includes(this.searchTerm); // Convertendo para string

      // Retorna true se algum dos campos coincidir com o termo de pesquisa
      return matchesNomeLivro || matchesAutorLivro || matchesSequencia || matchesQuantidadeLivro;
    });

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLivros = filteredLivros.slice(startIndex, endIndex);
  }

  applyFilter(event?: any): void {
    if (event) {
      // Atualiza searchTerm ao digitar
      this.searchTerm = event.target.value;
    }

    const filterValue = this.searchTerm.trim().toLowerCase();

    this.paginatedLivros = this.livros.filter(livro => {
      const matchesNomeLivro = livro.nomeLivro.toLowerCase().includes(filterValue);
      const matchesAutorLivro = livro.autorLivro.toLowerCase().includes(filterValue);
      const matchesSequencia = livro.sequencia.toString().includes(filterValue); // Convertendo a sequência para string
      const matchesQuantidadeLivro = livro.quantidadeLivro.toString().includes(filterValue); // Convertendo a quantidade para string

      // Retorna true se algum dos campos coincidir com o filtro
      return matchesNomeLivro || matchesAutorLivro || matchesSequencia || matchesQuantidadeLivro;
    });

    this.updatePaginatedLivros(); // Atualiza a tabela paginada com o resultado filtrado
  }

  deleteLivro(id: number): void {
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
        this.livrosService.deleteLivroCadastrado(id).subscribe({
          next: () => {
            Swal.fire({
              html: `
                <b>Excluído!</b>
                <p>O livro foi excluído com sucesso.</p>
              `,
              icon: "success",
              showConfirmButton: false,
              timer: 2500
            });
            this.loadLivros(); // Recarregar a lista após exclusão
          },
          error: (error) => {
            let errorMessage = 'Erro ao tentar apagar o livro. Tente novamente.';
            let iconType: 'error' | 'warning' | 'info' = 'error';  // Ícone padrão

            if (error.status === 404) {
              errorMessage = 'Livro não encontrado.';
              iconType = 'info';
            } else if (error.status === 500) {
              errorMessage = 'Erro ao tentar excluir o livro.';
              iconType = 'error';
            } else if (error.status === 409) {
              errorMessage = '<b>Erro de Exclusão:</b> Relações existentes impedem a exclusão deste livro.';
              iconType = 'warning';
            } else if (error.status === 400) {
              errorMessage = 'Erro de requisição: verifique os dados enviados.';
              iconType = 'warning';
            }

            Swal.fire({
              html: `
                <b>${iconType === 'error' ? 'Erro!' : iconType === 'warning' ? 'Aviso!' : 'Informação!'}</b>
                <p>${errorMessage}</p>
              `,
              icon: iconType,
              confirmButtonText: "Fechar"
            });
          }
        });
      }
    });
  }


  setPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedLivros();
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedLivros();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedLivros();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.livros.length / this.itemsPerPage);
  }

  openModalQuantidade(livro: any): void {
    this.livroSelecionado = livro;

    Swal.fire({
      html: `
        <b>Alterar quantidade para o livro:</b>
        <p>${livro.nomeLivro}</p>
      `,
      input: 'number',
      inputValue: livro.quantidadeLivro,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        const valorNumerico = Number(value);
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
          return 'A quantidade deve ser maior que zero.';
        }
        return undefined;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const novaQuantidade = Number(result.value);

        // Criação do livro atualizado
        const livroAtualizado: Livro = {
          quantidadeLivro: novaQuantidade,
          nomeLivro: livro.nomeLivro,
          sequencia: livro.sequencia,
          autorLivro: livro.autorLivro,
          pratileira: {
            idPratileira: livro.pratileira?.idPratileira,
            nomePratileira: livro.pratileira?.nomePratileira,
            tipoEstadoPratileira: livro.pratileira?.tipoEstadoPratileira
          },
          generoTextual: {
            id: livro.generoTextual?.id,
            tipo: livro.generoTextual?.tipo
          },
          generoLinguistico: {
            id: livro.generoLinguistico?.id,
            tipo: livro.generoLinguistico?.tipo
          },
          idLivro: livro.idLivro
        };

        // Atualização da quantidade do livro
        this.livrosService.updateQuantidadeLivro(livro.idLivro, livroAtualizado).subscribe(() => {
          Swal.fire({
            icon: "success",
            html: `
              <b>Sucesso</b>
              <p>A quantidade foi alterada com sucesso!</p>
            `,
            showConfirmButton: false,
            timer: 2500
          });
          this.loadLivros(); // Recarrega a lista de livros para refletir as mudanças
        }, (error) => {
          Swal.fire({
            icon: "error",
            html: `
              <b>Erro</b>
              <p>Houve um problema ao atualizar a quantidade!</p>
            `,
            showConfirmButton: false,
            timer: 2500
          });
        });
      }
    });
  }

}
