import { Rol, RolRepository } from "../../domain/rol";

export class RolFakeAPIRepo implements RolRepository {

    private defaultRoles: string = '[{"id": 1, "name": "Administrator"}, {"id": 2, "name": "Employee"}]'

    async list() : Promise<Rol[]> {        
        let roles: Rol[] = JSON.parse(localStorage.getItem("roles") || this.defaultRoles) as Rol[];        
        return roles;
    }

    async byID(id: number) : Promise<Rol> {        
        let roles: Rol[] = JSON.parse(localStorage.getItem("roles") || this.defaultRoles) as Rol[];

        let rol = roles.find( (rol: Rol) => rol.id = id) as Rol;
        if (rol == null) {
            throw new Error("rol not found");
        }
        
        return rol;
    }
}