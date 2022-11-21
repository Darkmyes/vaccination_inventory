


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
        let lastnameSpaceIndex = user.lastname.indexOf(" ");
        let lastnameFinalIndex = lastnameSpaceIndex !== undefined && lastnameSpaceIndex > 0 ? lastnameSpaceIndex : user.lastname.length;

        let username = `${user.name.slice(0, 2)}${user.lastname.slice(0, lastnameFinalIndex)}.${user.ci.slice(-4)}`
        let password = window.btoa( encodeURIComponent( new Date().getTime().toString() ) );

        return { username, password }
    }
    validateUser (user: User) : string[] {
        let errors: string[] = [];
        if (user.ci === null || user.ci.trim().length === 0) {
            errors.push("The CI is required");
        }
        else if (user.ci.trim().length !== 10) {
            errors.push("The CI must be 10 digits long");
        }
        if (!(/^[0-9]+$/).test(user.ci)) {
            errors.push("The CI must be only numbers");
        }

        if (user.name === null || user.name.trim().length === 0) {
            errors.push("The Name is required");
        }

        if (user.lastname === null || user.lastname.trim().length === 0) {
            errors.push("The Last Name is required");
        }

        if (
            user.email === null
            || user.email.trim().length === 0
        ) {
            errors.push("The Email is required");
        }
        else if (
            !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                .test(user.email)
        ) {
            errors.push("The Email is not valid");
        }

        return errors
    }
}