export interface InspecaoDTO {
    statusInspManutId: number;
    funcionarioId: number;
    empresaClienteId: number;
    agendaInspManutId: number;
    equipamentoSegurancaId: number;
    ultimaRec_Insp: string;
    proximoRec_Insp: string;
    ultimoReteste_Insp: string;
    proximoReteste_Insp: string;
    estadoCilindro_Insp: string;
    estadoLocal_Insp: string;
    seloLacre_insp: string;
    sinalizacaoPiso_insp: string;
    sinalizacaoAcesso_insp: string;
    obs_Insp: string;
    dataInicial?: Date;
    dataFinal?: Date;
    duracao: string;
    precisaManutencao?: boolean;
    id: number;
}
