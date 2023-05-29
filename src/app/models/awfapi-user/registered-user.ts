export class RegisteredUser {
    public username: string;
    public password: string;
    public repeatedPassword: string;
    public fullName: string;
    public email: string;
    public isReadonly: boolean;

    constructor(
        username: string, password: string, repeatedPassword: string,
        fullName: string, email: string, isReadonly: boolean
    ) {
        this.username = username;
        this.password = password;
        this.repeatedPassword = repeatedPassword;
        this.fullName = fullName;
        this.email = email;
        this.isReadonly = isReadonly;
    }

    public toAPIStructure(): any {
        return {
            username: this.username,
            password: this.password,
            repeated_password: this.repeatedPassword,
            full_name: this.fullName,
            email: this.email,
            is_readonly: this.isReadonly
        }
    }

    public static fromFormStructure(data: any): RegisteredUser {
        return new RegisteredUser(
            data.username, data.password, data.repeatedPassword,
            data.fullName, data.email, Boolean(data.isReadonly)
        );
    }
}
