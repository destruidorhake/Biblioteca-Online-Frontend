export interface ProfessorDTO {
  usuarioProfessor: string;
  senhaProfessor: string;
  isAdmin: boolean;
  idAtivo: number;
  numeroDocumento: string; // CPF ou CNPJ
}

export interface UserSession {
  userType: string;
  // outros campos que você precisa
}
