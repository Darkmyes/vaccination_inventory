import { AuthUserUsecase, User, UserRepository } from "../../domain/user";

export class AuthUserUC implements AuthUserUsecase {
    userRepo: UserRepository;

    constructor(authuserRepo: UserRepository) {
        this.userRepo = authuserRepo;
    }

    async login (username: string, password: string): Promise<User | null> {
        const user = await this.userRepo.login(username, password)
        if (user !== null && user !== undefined) {
            console.log(user)
            localStorage.setItem("user_token", user.id.toString())
        }
        return user
    }

    async logout (): Promise<boolean> {
        localStorage.removeItem("user_token")
        return true
    }

    async getUserByToken (): Promise<User | null> {
        const savedToken = localStorage.getItem("user_token") || null
        if (savedToken === null) {
            return null
        }

        const user = await this.userRepo.byID(parseInt(savedToken))
        if (user !== null && user !== undefined) {
            return user
        }

        return null
    }
}