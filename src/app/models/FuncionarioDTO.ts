import { TelefoneDTO } from './TelefoneDTO';
import { EnderecoDTO } from './EnderecoDTO';

export interface FuncionarioDTO {
    perfilId: number;
    usuarioId?: number;
    nome: string;
    cpf: string;
    email: string;
    enderecoDTOs: EnderecoDTO[];
    telefoneDTOs: TelefoneDTO[];
    id?: number;
}
