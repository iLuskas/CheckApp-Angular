import { InspecaoDTO } from './InspecaoDTO';

export interface AgendaInspManutDTO {
    id?: number;
    nomeFuncionario: string;
    empresa: string;
    TtipoEquipamento: string;
    tipoAgendamento: string;
    dataInicial: Date;
    statusInspManut: string;
    inspecaoDTOs: InspecaoDTO[];
}
