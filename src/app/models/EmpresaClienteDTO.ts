import { TelefoneDTO } from './TelefoneDTO';
import { EnderecoDTO } from './EnderecoDTO';

export interface EmpresaClienteDTO {
    razaoSocial: string;
    cnpj: string;
    inscricao_estadual: string;
    enderecoDTOs: EnderecoDTO[];
    telefoneDTOs: TelefoneDTO[];
    id?: number;
}