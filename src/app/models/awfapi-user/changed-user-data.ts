export class ChangedUserData {
    public fullName: string;
    public email: string;
    public isReadonly: boolean;

    constructor(fullName: string, email: string, isReadonly: boolean) {
        this.fullName = fullName;
        this.email = email;
        this.isReadonly = isReadonly;
    }

    public equals(other: ChangedUserData): boolean {
        return this.fullName === other.fullName && this.email === other.email && this.isReadonly === other.isReadonly;
    }

    public toAPIStructure(): any {
        return {
            full_name: this.fullName,
            email: this.email,
            is_readonly: this.isReadonly
        }
    }

    public static fromAPIStructure(data: any): ChangedUserData {
        return new ChangedUserData(data.full_name, data.email, Boolean(data.is_readonly));
    }

    public static fromFormStructure(data: any): ChangedUserData {
        return new ChangedUserData(data.fullName, data.email, Boolean(data.isReadonly));
    }
}
