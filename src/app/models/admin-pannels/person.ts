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

    public static fromAPIStructure(data: any): Person {
        return new Person(data.business_entity_id, EPersonType[data.person_type.toUpperCase() as keyof typeof EPersonType],
                          data.name_style, data.title,
                          data.first_name, data.middle_name, data.last_name, data.suffix, 
                          data.email_promotion, data.additional_contact_info, data.demographics,
                          data.rowguid, new Date(data.modified_date));
    }
}
