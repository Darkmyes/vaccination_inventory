export class Vaccine {
    id: number;
    name: string;

    constructor ( name: string) {
        this.id = 0;
        this.name = name;
    }
}

export interface VaccineRepository {
    list() : Promise<Vaccine[]>;
    byID(id: number) : Promise<Vaccine | null>;

    /* register(Vaccine: Vaccine) : Promise<Vaccine | null>;
    update(Vaccine: Vaccine) : Promise<boolean>;
    delete(id: number) : Promise<boolean>; */
}