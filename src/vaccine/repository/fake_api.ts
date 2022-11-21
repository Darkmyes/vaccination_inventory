import { Vaccine, VaccineRepository } from "../../domain/vaccine";

export class VaccineFakeAPIRepo implements VaccineRepository {

    private defaultVaccines: string = '[{"id": 1, "name": "Sputnik"}, {"id": 2, "name": "AstraZeneca"}, {"id": 3, "name": "Pfizer"}, {"id": 4, "name": "Jhonson&Jhonson"}]'

    async list() : Promise<Vaccine[]> {        
        let vaccinees: Vaccine[] = JSON.parse(localStorage.getItem("vaccines") || this.defaultVaccines) as Vaccine[];        
        return vaccinees;
    }

    async byID(id: number) : Promise<Vaccine> {        
        let vaccines: Vaccine[] = JSON.parse(localStorage.getItem("vaccines") || this.defaultVaccines) as Vaccine[];
        
        let vaccine = vaccines.find( (vaccine: Vaccine) => vaccine.id = id) as Vaccine;
        if (vaccine === null) {
            throw new Error("vaccine not found");
        }
        
        return vaccine;
    }
}