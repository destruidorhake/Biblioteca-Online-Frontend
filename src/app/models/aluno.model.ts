export interface TipoAtivo {
  idAtivo: number;
  descricao: string;
}

export interface TipoEstadoPratileira {
  idEstadoPratileira: number;
  descricao: string;
}

export interface Aluno {
  idAluno: number;
  nomeAluno: string;
  idade: number;
  tipoAtivo: TipoAtivo;
  tipoEstadoPratileira: TipoEstadoPratileira;
}
