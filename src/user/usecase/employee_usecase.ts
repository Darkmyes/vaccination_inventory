


import { EmployeeUserUsecase, User, UserRepository } from "../../domain/user";

export class EmployeeUserUC implements EmployeeUserUsecase {
    userRepo: UserRepository;

    constructor(employeeuserRepo: UserRepository) {
        this.userRepo = employeeuserRepo;
    }

    async update(user: User) : Promise<boolean> {
        return this.userRepo.updateEmployeeData(user);
    }

    validateCI (ci: string) : string[] {
        let errors: string[] = [];
        if (ci === null || ci.trim().length === 0) {
            errors.push("The CI is required");
        } else {
            if (ci.trim().length !== 10) {
                errors.push("The CI must be 10 digits long");
            }
            if (!(/^[0-9]+$/).test(ci)) {
                errors.push("The CI must be only numbers");
            }
        }
        return errors
    }
    validateName (name: string) : string[] {
        let errors: string[] = [];
        if (name === null || name.trim().length === 0) {
            errors.push("The Name is required");
        }
        return errors
    }
    validateLastname (lastname: string) : string[] {
        let errors: string[] = [];
        if (lastname === null || lastname.trim().length === 0) {
            errors.push("The Last Name is required");
        }
        return errors
    }
    validateEmail (email: string) : string[] {
        let errors: string[] = [];
        if (
            email === null
            || email.trim().length === 0
        ) {
            errors.push("The Email is required");
        } else {
            if (
                !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                    .test(email)
            ) {
                errors.push("The Email is not valid");
            }
        }
        return errors
    }
    validateUser (user: User) : string[] {
        let errors: string[] = [];

        errors = errors.concat(this.validateCI(user.ci));
        errors = errors.concat(this.validateName(user.name));
        errors = errors.concat(this.validateLastname(user.lastname));
        errors = errors.concat(this.validateEmail(user.email));

        return errors
    }
}