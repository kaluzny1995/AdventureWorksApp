export class PersonPhoneFilterParams {
    public personIds: number[] | null;
    public phoneNumberTypeIds: number[] | null;

    constructor(
        personIds: number[] | null,
        phoneNumberTypeIds: number[] | null
    ) {
        this.personIds = personIds;
        this.phoneNumberTypeIds = phoneNumberTypeIds;
    }

    private static _str2NumList(param: string, separator: string): number[] {
        return param.substring(1, param.length-1).split(separator).map((p: string) => +p);
    }

    private static _numList2Str(param: number[], separator: string): string {
        return `[${param.join(separator)}]`
    }

    public static fromDict(filtersDict: {[key: string]: string} | null, separator: string): PersonPhoneFilterParams {
        if (filtersDict !== null) {
            return new PersonPhoneFilterParams(
                filtersDict['personIds'] === undefined? null : PersonPhoneFilterParams._str2NumList(filtersDict['personIds'], separator),
                filtersDict['phoneNumberTypeIds'] === undefined? null : PersonPhoneFilterParams._str2NumList(filtersDict['phoneNumberTypeIds'], separator)
            );
        } else {
            return new PersonPhoneFilterParams(null, null);
        }
    }

    public toDict(separator: string): {[key: string]: string} | null {
        if (!Object.values(this).every(v => ['', null, undefined].includes(v))) {
            return {
                personIds: this.personIds === null? '' : PersonPhoneFilterParams._numList2Str(this.personIds, separator),
                phoneNumberTypeIds: this.phoneNumberTypeIds === null? '' : PersonPhoneFilterParams._numList2Str(this.phoneNumberTypeIds, separator)
            };
        } else {
            return {};
        }
    }
}
