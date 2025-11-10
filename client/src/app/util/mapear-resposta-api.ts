export function mapearRespostaApi<T>(resposta: RespostaApiModel): T {
  if (!resposta.sucesso && resposta.erros) throw new Error(resposta.erros.join('. '));

  return resposta.dados as T;
}

export interface RespostaApiModel {
  sucesso: boolean;
  dados?: Object;
  erros?: string[];
}
