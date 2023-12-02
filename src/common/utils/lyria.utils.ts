const lyria = require("lyria-npm");

export class LyriaService {
    static async getCancion(cancion: String): Promise<Lyria> {
        const letra: Lyria = await lyria(cancion)
        return letra;
    }
}

export interface Lyria {
    titulo: string;
    artista: string;
    albulm: string;
    fecha: string;
    Generos: string;
    Escuchar: Escuchar[];
    otros: any[];
    letra: string[];
}

export interface Escuchar {
    nombre: string;
    link: string;
}
