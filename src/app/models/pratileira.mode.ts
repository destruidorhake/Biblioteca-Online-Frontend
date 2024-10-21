import { TipoEstadoPratileira } from "./aluno.model";

export interface Pratileira {
  idPratileira: number; // ID da prateleira
  nomePratileira: string; // Nome da prateleira
  tipoEstadoPratileira: TipoEstadoPratileira; // Relacionamento com TipoEstadoPratileira
}
