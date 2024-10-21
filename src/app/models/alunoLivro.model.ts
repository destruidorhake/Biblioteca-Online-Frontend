import { Aluno } from "./aluno.model";
import { Livro } from "./livros.model";

export interface AlunoLivro {
  alunoId: number;
  alunoNome: string;
  livroId: number;
  livroNome: string;
  dataRegistro: string; // Formato de data que você deseja
  dataSaida?: string; // Opcional
  aluno: Aluno;
  livro: Livro;
}
