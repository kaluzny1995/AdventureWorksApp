export class PersonPhoneDefaults {
    public readonly idSeparator: string;
    public readonly availableColumns: string[];
    public readonly availableColumnNames: string[];
    public readonly displayedIndices: number[];
    public readonly availableFilters: string[];
    public readonly availableFilterNames: string[];

    constructor(
        idSeparator: string,
        availableColumns: string[], 
        availableColumnNames: string[], 
        displayedIndices: number[], 
        availableFilters: string[], 
        availableFilterNames: string[]
    ) {
        this.idSeparator = idSeparator;
        this.availableColumns = availableColumns;
        this.availableColumnNames = availableColumnNames;
        this.displayedIndices = displayedIndices;
        this.availableFilters = availableFilters;
        this.availableFilterNames = availableFilterNames;
    }
}
