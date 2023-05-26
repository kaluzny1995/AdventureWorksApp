export class ChangedUserCredentials {
    public newUsername: string | null;
    public currentPassword: string;
    public newPassword: string | null;
    public repeatedPassword: string | null;

    constructor(data: any) {
        this.newUsername = data.newUsername;
        this.currentPassword = data.currentPassword;
        this.newPassword = data.newPassword;
        this.repeatedPassword = data.repeatedPassword;
    }
}
