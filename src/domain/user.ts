import { Rol } from "./rol";
import { VaccineHistory } from "./vaccine_history";

export class User {
    id: number;
    ci: string;
    name: string;
    lastname: string;
    email: string;
    rolId: number;
    rol?: Rol;
    
    // Auth Data
    username: string;
    password: string;

    // Employee Only
    birthDate: string;
    homeAddress: string;
    phoneNumber: string;
    vaccineState: boolean;
    vaccineHistory: VaccineHistory[];

    constructor (ci: string, name: string, lastname: string, email: string, rolId: number) {
        this.id = 0;
        this.ci = ci;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.rolId = rolId;

        this.username = "";
        this.password = "";

        this.birthDate = "";
        this.homeAddress = "";
        this.phoneNumber = "";
        this.vaccineState = false;
        this.vaccineHistory = [];
    }
}

export interface UserRepository {
    list() : Promise<User[]>;
    listAdmins() : Promise<User[]>;
    listEmployees() : Promise<User[]>;
    byID(id: number) : Promise<User | null>;
    login(username: string, password: string) : Promise<User | null>;
    
    /* byVaccineState (state: boolean) : Promise<User[]>; */

    register(user: User) : Promise<User | null>;
    update(user: User) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;

    updateEmployeeData(User: User) : Promise<boolean>;
}

export interface AuthUserUsecase {
    login (username: string, password: string): Promise<User | null>;
    logout (): Promise<boolean>;
    getUserByToken (): Promise<User | null>;
}

export interface AdminUserUsecase {
    list() : Promise<User[]>;
    listAdmins() : Promise<User[]>;
    listEmployees() : Promise<User[]>;
    byID(id: number) : Promise<User | null>;

    /* byVaccineState (state: boolean) : Promise<User[]>;
    byVaccineType (state: boolean) : Promise<User[]>;
    byVaccineDate (state: boolean) : Promise<User[]>; */

    register(user: User) : Promise<User | null>;
    update(user: User) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;

    generateCredentials (user: User) : { username: string, password: string };
    validateUser (user: User) : boolean;
}

export interface EmployeeUserUsecase {
    update(user: User) : Promise<boolean>;
}