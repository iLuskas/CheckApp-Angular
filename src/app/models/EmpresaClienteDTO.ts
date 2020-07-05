import { TelefoneDTO } from './TelefoneDTO';
import { EnderecoDTO } from './EnderecoDTO';
import { EquipamentoSegurancaDTO } from './EquipamentoSeguranca';

export interface EmpresaClienteDTO {
    razaoSocial: string;
    cnpj: string;
    inscricao_estadual: string;
    imagemUrl: string;
    imagemUrlBase64: string;
    emial: string;
    enderecoDTOs: EnderecoDTO[];
    telefoneDTOs: TelefoneDTO[];
    equipamentoDTOs?: EquipamentoSegurancaDTO[];
    id?: number;
}