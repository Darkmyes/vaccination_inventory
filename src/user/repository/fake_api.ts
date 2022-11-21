import { User, UserRepository } from "../../domain/user";

export class UserFakeAPIRepo implements UserRepository {

    private defaultUsers: string = `[{"id":1,"ci":"0000000000","name":"admin wer","lastname":"root ser","email":"admin@sis.com","rolId":1,"username":"admin","password":"root","birthDate":"1999/01/01","homeAddress":"Streeet 1 and Street 2","phoneNumber":"0000000000","vaccineState":false,"vaccineHistory":[]},{"id":2,"ci":"1111111111","name":"Jhon","lastname":"Doe","email":"jhon.doe@gmail.com","rolId":2,"username":"jhdoe.1111","password":"MTY2OTA2NTA3NTU3Nw==","birthDate":"1999-03-29","homeAddress":"Primary Street & Secondary Street","phoneNumber":"1111111111","vaccineState":true,"vaccineHistory":[{"id":1,"vaccineId":1,"vaccine":{"id":1,"name":"Sputnik"},"dosisNumber":1,"vaccinationDate":"2021-11-21"},{"id":2,"vaccineId":2,"vaccine":{"id":2,"name":"AstraZeneca"},"dosisNumber":"2","vaccinationDate":"2022-02-21"}]}]`

    constructor () {
        if (localStorage.getItem("users") == null) {
            localStorage.setItem("users", this.defaultUsers)
        }
    }

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
        if (user !== null && user !== undefined) {
            return user;
        }
        console.log(user)
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