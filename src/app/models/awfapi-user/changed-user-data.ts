export class ChangedUserData {
    public fullName: string;
    public email: string;
    public isReadonly: boolean;

    constructor(data: any) {
        this.fullName = data.fullName;
        this.email = data.email;
        this.isReadonly = data.isReadonly;
    }

    equals(other: ChangedUserData): boolean {
        return this.fullName === other.fullName && this.email === other.email && this.isReadonly === other.isReadonly;
    }
}
