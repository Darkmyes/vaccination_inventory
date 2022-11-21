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
        if (user === null) {
            throw new Error("user not found");
        }
        
        return user;
    }

    async login (username: string, password: string): Promise<User | null> {
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];
        
        let user = users.find( (user: User) => user.username === username && user.password === password) as User;
        if (user !== null) {
            return user;
        }
        return null
    }


    async register(user: User) : Promise<User | null> {
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];
        let maxId: number = 0;

        if (users.length > 0) {
            maxId = users.reduce((userInArray, maxIdUser) => {
                return userInArray.id > maxIdUser.id ? userInArray : maxIdUser;
            }, users[0]).id;
        }

        user.id = maxId + 1;
        users.push(user);

        localStorage.setItem("users", JSON.stringify(users));
        return user
    }

    async update(user: User) : Promise<boolean> {
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];
        let userIndex = users.findIndex(userInArray => userInArray.id === user.id)
        if (userIndex < 0) {
            return false;
        }

        users[userIndex] = user;
        localStorage.setItem("users", JSON.stringify(users));

        return true
    }
    
    async delete(id: number) : Promise<boolean> {
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];

        localStorage.setItem("users", JSON.stringify(users.filter( user => user.id !== id )));
        return true
    }


    async updateEmployeeData(user: User) : Promise<boolean> {
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];
        let userIndex = users.findIndex(userInArray => userInArray.id === user.id)
        if (userIndex < 0) {
            return false;
        }

        users[userIndex] = user;
        localStorage.setItem("users", JSON.stringify(users));

        return true
    }
}