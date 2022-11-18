export class Rol {
    id: number;
    name: string;

    constructor (name: string) {
        this.id = 0;
        this.name = name;
    }
}

export interface RolRepository {
    list() : Promise<Rol[]>;
    byID(id: number) : Promise<Rol | null>;

    /*register(Rol: Rol) : Promise<Rol | null>;
    update(Rol: Rol) : Promise<boolean>;
    delete(id: number) : Promise<boolean>; */
}