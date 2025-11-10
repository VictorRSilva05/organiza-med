import { AtividadeMedica } from "./atividade-medica";

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  atividades: AtividadeMedica[];
}
