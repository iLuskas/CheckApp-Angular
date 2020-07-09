export interface ModeloAgendaInspManut {
    id?: number;
    funcionarioId: number;
    empresaClienteId: number;
    tipoEquipamentoId: number;
    tipoAgendamentoId: number;
    dataInicial: string;
    statusInspManutId: number;
    tipoManutencao: string;
    ocorrenciaInspecao: boolean;
}
