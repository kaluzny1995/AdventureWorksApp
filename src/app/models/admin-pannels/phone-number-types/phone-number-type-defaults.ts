export class PhoneNumberTypeDefaults {
    public readonly availableFilters: string[];
    public readonly availableFilterNames: string[];
    public readonly newId: number;
    public readonly perPage: number;

    constructor(availableFilters: string[], availableFilterNames: string[], newId: number, perPage: number) {
        this.availableFilters = availableFilters;
        this.availableFilterNames = availableFilterNames;
        this.newId = newId;
        this.perPage = perPage;
    }
}