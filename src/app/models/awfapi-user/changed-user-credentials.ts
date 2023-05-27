export class ChangedUserCredentials {
    public newUsername: string | null;
    public currentPassword: string;
    public newPassword: string | null;
    public repeatedPassword: string | null;

    constructor(
            newUsername: string | null,
            currentPassword: string,
            newPassword: string | null,
            repeatedPassword: string | null
        ) {
        this.newUsername = newUsername;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.repeatedPassword = repeatedPassword;
    }

    public toAPIStructure(): any {
        return {
            new_username: this.newUsername,
            current_password: this.currentPassword,
            new_password: this.newPassword,
            repeated_password: this.repeatedPassword
        };
    }

    public static fromAPIStructure(data: any): ChangedUserCredentials {
        return new ChangedUserCredentials(data.new_username, data.current_password, data.new_password, data.repeated_password);
    }
    
    public static fromFormStructure(data: any): ChangedUserCredentials {
        return new ChangedUserCredentials(data.newUsername, data.currentPassword, data.newPassword, data.repeatedPassword);
    }
}
