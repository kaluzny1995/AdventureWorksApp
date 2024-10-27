export class PersonFilterParams {
    public personType: string | null;
    public lastNamePhrase: string | null;
    public firstNamePhrase: string | null;

    constructor(personType: string | null,
                lastNamePhrase: string | null,
                firstNamePhrase: string | null) {
        this.personType = personType;
        this.lastNamePhrase = lastNamePhrase;
        this.firstNamePhrase = firstNamePhrase;
    }

    public static fromDict(filtersDict: {[key: string]: string} | null): PersonFilterParams {
        if (filtersDict !== null) {
            return new PersonFilterParams(
                filtersDict['personType'] === undefined? null : filtersDict['personType'],
                filtersDict['lastNamePhrase'] === undefined? null : filtersDict['lastNamePhrase'],
                filtersDict['firstNamePhrase'] === undefined? null : filtersDict['firstNamePhrase']);
        } else {
            return new PersonFilterParams(null, null, null);
        }
    }

    public toDict(): {[key: string]: string} | null {
        if (!Object.values(this).every(v => ['', null, undefined].includes(v))) {
            return {personType: this.personType === null? '' : this.personType,
                    lastNamePhrase: this.lastNamePhrase === null? '' : this.lastNamePhrase,
                    firstNamePhrase: this.firstNamePhrase === null? '' : this.firstNamePhrase};
        } else {
            return {};
        }
    }
}
