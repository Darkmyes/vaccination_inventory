export class UserValidator {
    static validateCI (ci: string) : string[] {
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

    static validateName (name: string) : string[] {
        let errors: string[] = [];
        if (name === null || name.trim().length === 0) {
            errors.push("The Name is required");
        }
        return errors
    }

    static validateLastname (lastname: string) : string[] {
        let errors: string[] = [];
        if (lastname === null || lastname.trim().length === 0) {
            errors.push("The Last Name is required");
        }
        return errors
    }

    static validateEmail (email: string) : string[] {
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

    static validatePhoneNumber (phoneNumber: string) : string[] {
        let errors: string[] = [];
        if (phoneNumber === null || phoneNumber.trim().length === 0) {
            errors.push("The Phone Number is required");
        } else {
            if (phoneNumber.trim().length !== 10) {
                errors.push("The Phone Number must be 10 digits long");
            }
            if (!(/^[0-9]+$/).test(phoneNumber)) {
                errors.push("The Phone Number must be only numbers");
            }
        }
        return errors
    }

    static validateBirthDate (birthDate: string) : string[] {
        let errors: string[] = [];
        if (birthDate === null || birthDate.trim().length === 0) {
            errors.push("The Birth Date is required");
        } else {
            if (!(
                (/^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/).test(birthDate)
                || (/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/).test(birthDate)
            )) {
                errors.push("The Birth Date must be valid");
            }
        }
        return errors
    }

    static validateDate (dateString: string) : string[] {
        let errors: string[] = [];
        if (dateString === null || dateString.trim().length === 0) {
            errors.push("The Vacccination Date is required");
        } else {
            if (!(
                (/^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/).test(dateString)
                || (/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/).test(dateString)
            )) {
                errors.push("The Vacccination Date must be valid");
            }
        }
        return errors
    }

    static validateHomeAddress (homeAddress: string) : string[] {
        let errors: string[] = [];
        if (homeAddress === null || homeAddress.trim().length === 0) {
            errors.push("The Home Address is required");
        } 
        return errors
    }
}