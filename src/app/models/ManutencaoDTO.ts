export interface ManutencaoDTO {
    id?: number;
    statusInspManutId: number;
    funcionarioId: number;
    empresaClienteId: number;
    agendaInspManutId: number;
    equipamentoSegurancaId: number;
    tipoExt: string;
    capacidade: string;
    anoFabricacao: string;
    fabricanteExt: string;
    ultimoTeste: Date;
    numCilindro: string;
    seloInmetro: string;
    aprovado: boolean;
    reprovado: boolean;
    obsManut: string;
    dataRecarga: Date;
    dataReteste: Date;
    dataInicial: Date;
    dataFinal?: Date;
    duracao: string;
}
