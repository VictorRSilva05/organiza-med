import { AtividadeMedica } from './atividade-medica';

export interface Medico {
  id: string;
  nome: string;
  crm: string;
  atividades: AtividadeMedica[]; // Atualizado de 'any' para o modelo correto
}
