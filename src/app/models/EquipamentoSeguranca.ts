import { ExtintorDTO } from "./ExtintorDTO";

export interface EquipamentoSegurancaDTO {
  id?: number;
  tipo_equipamentoId: number;
  empresaClienteId: number;
  localizacao_equipamento: string;
  qrCode: string;
  qrcode_data_geracao?: Date;
  dataCriacao_equipamento: Date;
  extintorDTO: ExtintorDTO;
}
