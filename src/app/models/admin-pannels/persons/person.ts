import { MSListItem } from "../../utils/types";
import { EPersonType } from "./e-person-type";

export class Person {
    public readonly personId: number;
    public readonly personType: EPersonType;
    public readonly nameStyle: string;
    public readonly title: string | null;
    public readonly firstName: string;
    public readonly middleName: string | null;
    public readonly lastName: string;
    public readonly suffix: string | null;
    public readonly emailPromotion: number;
    public readonly additionalContactInfo: string | null;
    public readonly demographics: string | null;
    public readonly rowguid: string;
    public readonly modifiedDate: Date;

    constructor(personId: number, personType: EPersonType, nameStyle: string, title: string | null,
                firstName: string, middleName: string | null, lastName: string, suffix: string | null,
                emailPromotion: number, additionalContactInfo: string | null, demographics: string | null,
                rowguid: string, modifiedDate: Date) {
                    this.personId = personId;
                    this.personType = personType;
                    this.nameStyle = nameStyle;
                    this.title = title;
                    this.firstName = firstName;
                    this.middleName = middleName;
                    this.lastName = lastName;
                    this.suffix = suffix;
                    this.emailPromotion = emailPromotion;
                    this.additionalContactInfo = additionalContactInfo;
                    this.demographics = demographics;
                    this.rowguid = rowguid;
                    this.modifiedDate = modifiedDate;
                }
    
    public get personIdString(): string {
        return String(this.personId);
    }

    public static fromAPIStructure(data: any): Person {
        return new Person(data.business_entity_id, EPersonType[data.person_type.toUpperCase() as keyof typeof EPersonType],
                          data.name_style, data.title,
                          data.first_name, data.middle_name, data.last_name, data.suffix, 
                          data.email_promotion, data.additional_contact_info, data.demographics,
                          data.rowguid, new Date(data.modified_date));
    }

    public toMSListItem(): MSListItem {
        return {
            id: this.personId,
            itemName: `${this.lastName} ${this.firstName}${this.middleName !== null? ` ${this.middleName}` : ''}${this.suffix !== null? ` ${this.suffix}` : ''}${this.title !== null? ` (${this.title})` : ''} - [${this.personId}]`
        };
    }

    public toFormStructure(): any {
        return {
            personType: this.personType,
            nameStyle: this.nameStyle,
            title: this.title,
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            suffix: this.suffix,
            emailPromotion: this.emailPromotion,
            additionalContactInfo: this.additionalContactInfo,
            demographics: this.demographics
        }
    }
}

export class PersonInput {
    public readonly personType: EPersonType;
    public readonly nameStyle: string;
    public readonly title: string | null;
    public readonly firstName: string;
    public readonly middleName: string | null;
    public readonly lastName: string;
    public readonly suffix: string | null;
    public readonly emailPromotion: number;
    public readonly additionalContactInfo: string | null;
    public readonly demographics: string | null;

    constructor(personType: EPersonType, nameStyle: string, title: string | null,
                firstName: string, middleName: string | null, lastName: string, suffix: string | null,
                emailPromotion: number, additionalContactInfo: string | null, demographics: string | null) {
                    this.personType = personType;
                    this.nameStyle = nameStyle;
                    this.title = title;
                    this.firstName = firstName;
                    this.middleName = middleName;
                    this.lastName = lastName;
                    this.suffix = suffix;
                    this.emailPromotion = emailPromotion;
                    this.additionalContactInfo = additionalContactInfo;
                    this.demographics = demographics;
                }
    
    public static fromFormStructure(data: any): PersonInput {
        return new PersonInput(
            data.personType, data.nameStyle, data.title,
            data.firstName, data.middleName, data.lastName,
            data.suffix, data.emailPromotion,
            data.additionalContactInfo, data.demographics
        );
    }
    
    public toAPIStructure(): any {
        return {
            person_type: this.personType,
            name_style: this.nameStyle,
            title: this.title,
            first_name: this.firstName,
            middle_name: this.middleName,
            last_name: this.lastName,
            suffix: this.suffix,
            email_promotion: this.emailPromotion,
            additional_contact_info: this.additionalContactInfo,
            demographics: this.demographics
        };
    }
}
