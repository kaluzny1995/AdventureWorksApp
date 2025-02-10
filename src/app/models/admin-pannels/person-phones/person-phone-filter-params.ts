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

    private static _str2NumList(param: string): number[] {
        return param.substring(1, param.length-1).split('|').map((p: string) => +p);
    }

    private static _numList2Str(param: number[]): string {
        return `[${param.join('|')}]`
    }

    public static fromDict(filtersDict: {[key: string]: string} | null): PersonPhoneFilterParams {
        if (filtersDict !== null) {
            return new PersonPhoneFilterParams(
                filtersDict['personIds'] === undefined? null : PersonPhoneFilterParams._str2NumList(filtersDict['personIds']),
                filtersDict['phoneNumberTypeIds'] === undefined? null : PersonPhoneFilterParams._str2NumList(filtersDict['phoneNumberTypeIds'])
            );
        } else {
            return new PersonPhoneFilterParams(null, null);
        }
    }

    public toDict(): {[key: string]: string} | null {
        if (!Object.values(this).every(v => ['', null, undefined].includes(v))) {
            return {
                personIds: this.personIds === null? '' : PersonPhoneFilterParams._numList2Str(this.personIds),
                phoneNumberTypeIds: this.phoneNumberTypeIds === null? '' : PersonPhoneFilterParams._numList2Str(this.phoneNumberTypeIds)
            };
        } else {
            return {};
        }
    }
}
