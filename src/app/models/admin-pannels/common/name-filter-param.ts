export class NameFilterParam {
    public namePhrase: string | null;

    constructor(namePhrase: string | null) {
        this.namePhrase = namePhrase;
    }

    public static fromDict(filtersDict: {[key: string]: string} | null): NameFilterParam {
        if (filtersDict !== null) {
            return new NameFilterParam(filtersDict['namePhrase'] === undefined? null : filtersDict['namePhrase']);
        } else {
            return new NameFilterParam(null);
        }
    }

    public toDict(): {[key: string]: string} | null {
        if (!Object.values(this).every(v => ['', null, undefined].includes(v))) {
            return {namePhrase: this.namePhrase === null? '' : this.namePhrase};
        } else {
            return {};
        }
    }
}
