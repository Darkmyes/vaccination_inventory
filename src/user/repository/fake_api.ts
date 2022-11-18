import { User, UserRepository } from "../../domain/user";

export class UserFakeAPIRepo implements UserRepository {

    private defaultUsers: string = `[
        {
            "id": 1,
            "name": "Sputnik",
        },
    ]`

    async list() : Promise<User[]> {        
        let useres: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];        
        return useres;
    }

    async byID(id: number) : Promise<User> {        
        let users: User[] = JSON.parse(localStorage.getItem("users") || this.defaultUsers) as User[];
        
        let user = users.find( (user: User) => user.id = id) as User;
        if (user == null) {
            throw new Error("user not found");
        }
        
        return user;
    }

    async register(User: User) : Promise<User | null> {
        return null
    }

    async update(User: User) : Promise<boolean>{
        return false
    }
    
    async updateEmployeeData(User: User) : Promise<boolean>{
        return false
    }
    
    async delete(id: number) : Promise<boolean>{
        return false
    }
    
}