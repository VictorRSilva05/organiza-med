import { Medico } from './medico';
import { Paciente } from './paciente';

export type TipoAtividade = 'Consulta' | 'Cirurgia';

export interface AtividadeMedica {
  id: string;
  inicio: Date;
  termino: Date;
  tipoAtividade: TipoAtividade;

  paciente: Paciente;
  medicos: Medico[];
}
