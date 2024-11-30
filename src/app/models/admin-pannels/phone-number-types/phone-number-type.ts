export class PhoneNumberType {
    public readonly phoneNumberTypeId: number;
    public readonly name: string;
    public readonly modifiedDate: Date;

    constructor(phoneNumberTypeId: number, name: string, modifiedDate: Date) {
        this.phoneNumberTypeId = phoneNumberTypeId;
        this.name = name;
        this.modifiedDate = modifiedDate;
    }

    public static fromAPIStructure(data: any): PhoneNumberType {
        return new PhoneNumberType(data.phone_number_type_id, data.name, new Date(data.modified_date));
    }

    public toFormStructure(): any {
        return {
            name: this.name
        }
    }
}

export class PhoneNumberTypeInput {
    public readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
    
    public static fromFormStructure(data: any): PhoneNumberTypeInput {
        return new PhoneNumberTypeInput(data.name);
    }
    
    public toAPIStructure(): any {
        return {
            name: this.name
        };
    }
}
