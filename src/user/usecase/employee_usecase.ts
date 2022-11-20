


import { EmployeeUserUsecase, User, UserRepository } from "../../domain/user";

export class EmployeeUserUC implements EmployeeUserUsecase {
    userRepo: UserRepository;

    constructor(employeeuserRepo: UserRepository) {
        this.userRepo = employeeuserRepo;
    }

    async update(user: User) : Promise<boolean> {
        return this.userRepo.updateEmployeeData(user);
    }
}