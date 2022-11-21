import { Vaccine } from "./vaccine";

export class VaccineHistory {
    id: number;
    vaccineId: number;
    vaccine?: Vaccine;
    dosisNumber: number;
    vaccinationDate: string;

    constructor ( vaccine_id: number, dosisNumber: number, vaccinationDate: string) {
        this.id = 0;
        this.vaccineId = vaccine_id;
        this.dosisNumber = dosisNumber;
        this.vaccinationDate = vaccinationDate;
    }
}

/* export interface VaccineHistoryRepository {
    list() : Promise<VaccineHistory[]>;
    byID(id: number) : Promise<VaccineHistory | null>;
    byUserID(userId: number) : Promise<VaccineHistory | null>;

    register(vaccineHistory: VaccineHistory, userId: number) : Promise<VaccineHistory | null>;
    update(vaccineHistory: VaccineHistory) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
} */