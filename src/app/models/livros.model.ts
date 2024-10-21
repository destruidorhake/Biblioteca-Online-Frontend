import { GeneroLinguistico, GeneroTextual } from "./generos.model";
import { Pratileira } from "./pratileira.mode";

export interface Livro {
  idLivro: number | null;
  nomeLivro: string;
  sequencia: number | null;
  autorLivro: string;
  quantidadeLivro: number | null;
  generoTextual: GeneroTextual | null;
  generoLinguistico: GeneroLinguistico | null;
  pratileira: Pratileira | null;
}
