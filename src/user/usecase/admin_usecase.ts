


import { AdminUserUsecase, User, UserRepository } from "../../domain/user";

export class AdminUserUC implements AdminUserUsecase {
    userRepo: UserRepository;

    constructor(adminuserRepo: UserRepository) {
        this.userRepo = adminuserRepo;
    }

    async list() : Promise<User[]> {
        return this.userRepo.list();
    }
    async listAdmins() : Promise<User[]> {
        return this.userRepo.listAdmins();
    }
    async listEmployees() : Promise<User[]> {
        return this.userRepo.listEmployees();
    }
    async byID(id: number) : Promise<User | null> {
        return this.userRepo.byID(id);
    }

    async register(user: User) : Promise<User | null> {
        return this.userRepo.register(user);
    }
    async update(user: User) : Promise<boolean> {
        return this.userRepo.update(user);
    }
    async delete(id: number) : Promise<boolean> {
        return this.userRepo.delete(id);
    }

    generateCredentials (user: User) : { username: string, password: string } {
        return { username: "", password: "" }
    }
    validateUser (user: User) : boolean {
        return false
    }
}