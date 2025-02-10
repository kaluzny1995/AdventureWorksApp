export class PersonPhone {
    public readonly personId: number;
    public readonly phoneNumber: string;
    public readonly phoneNumberTypeId: number;
    public readonly modifiedDate: Date;
    public readonly separator: string;

    constructor(personId: number, phoneNumber: string, phoneNumberTypeId: number, modifiedDate: Date, separator: string) {
        this.personId = personId;
        this.phoneNumber = phoneNumber;
        this.phoneNumberTypeId = phoneNumberTypeId;
        this.modifiedDate = modifiedDate;
        this.separator = separator;
    }

    public get personPhoneId(): [number, string, number] {
        return [this.personId, this.phoneNumber, this.phoneNumberTypeId];
    }

    public get personPhoneIdString(): string {
        return `${this.personId}${this.separator}${this.phoneNumber}${this.separator}${this.phoneNumberTypeId}`;
    }

    public static fromAPIStructure(data: any, separator: string): PersonPhone {
        return new PersonPhone(data.business_entity_id, data.phone_number, data.phone_number_type_id, new Date(data.modified_date), separator)
    }

    public toFormStructure(): any {
        return {
            personId: this.personId,
            phoneNumber: this.phoneNumber,
            phoneNumberTypeId: this.phoneNumberTypeId,
            modifiedDate: this.modifiedDate
        }
    }
}

export class PersonPhoneInput {
    public readonly personId: number;
    public readonly phoneNumber: string;
    public readonly phoneNumberTypeId: number;

    constructor(personId: number, phoneNumber: string, phoneNumberTypeId: number) {
        this.personId = personId;
        this.phoneNumber = phoneNumber;
        this.phoneNumberTypeId = phoneNumberTypeId;
    }

    public static fromFormStructure(data: any): PersonPhoneInput {
        return new PersonPhoneInput(data.personId, data.phoneNumber, data.phoneNumberTypeId)
    }

    public toAPIStructure(): any {
        return {
            business_entity_id: this.personId,
            phone_number: this.phoneNumber,
            phone_number_type_id: this.phoneNumberTypeId
        }
    }
}
