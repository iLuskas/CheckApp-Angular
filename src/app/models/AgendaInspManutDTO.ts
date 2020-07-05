import { InspecaoDTO } from './InspecaoDTO';

export interface AgendaInspManutDTO {
    id?: number;
    nomeFuncionario: string;
    empresa: string;
    TtipoEquipamento: string;
    tipoAgendamento: string;
    dataInicial: Date;
    dataFinal?: Date;
    duracao: string;
    statusInspManut: string;
    inspecaoDTOs: InspecaoDTO[];
}
