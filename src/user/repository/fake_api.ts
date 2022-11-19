import { User, UserRepository } from "../../domain/user";

export class UserFakeAPIRepo implements UserRepository {

    private defaultUsers: string = `[
        {
            "id": 1,
            "ci": "0000000000",
            "name" : "admin",
            "lastname" : "root",
            "email" : "admin@sis.com",
            "rolId" : 1,

            "username": "admin",
            "password": "root",

            "birthDate": "1999/01/01",
            "homeAddress": "Streeet 1 and Street 2",
            "phoneNumber": "0000000000",
            "vaccineState": false,
            "vaccineHistory": []
        }
    ]`

    async list() : Promise<User[]> {        
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];        
        return users;
    }

    async listAdmins() : Promise<User[]> {        
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];        
        return users.filter( (user: User) => user.rolId === 1);
    }

    async listEmployees() : Promise<User[]> {        
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];        
        return users.filter( (user: User) => user.rolId === 2);
    }

    async byID(id: number) : Promise<User> {        
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];
        
        let user = users.find( (user: User) => user.id === id) as User;
        if (user == null) {
            throw new Error("user not found");
        }
        
        return user;
    }

    async login (username: string, password: string): Promise<User | null> {
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];
        
        let user = users.find( (user: User) => user.username === username && user.password === password) as User;
        if (user != null) {
            return user;
        }
        return null
    }


    async register(User: User) : Promise<User | null> {
        return null
    }

    async update(User: User) : Promise<boolean>{
        return false
    }
    
    async delete(id: number) : Promise<boolean>{
        return false
    }


    async updateEmployeeData(User: User) : Promise<boolean>{
        return false
    }
}