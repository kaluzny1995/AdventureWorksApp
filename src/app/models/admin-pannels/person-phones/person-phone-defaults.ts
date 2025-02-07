export class PersonPhoneDefaults {
    public readonly availableColumns: string[];
    public readonly availableColumnNames: string[];
    public readonly displayedIndices: number[];
    public readonly availableFilters: string[];
    public readonly availableFilterNames: string[];

    constructor(
        availableColumns: string[], 
        availableColumnNames: string[], 
        displayedIndices: number[], 
        availableFilters: string[], 
        availableFilterNames: string[]
    ) {
        this.availableColumns = availableColumns;
        this.availableColumnNames = availableColumnNames;
        this.displayedIndices = displayedIndices;
        this.availableFilters = availableFilters;
        this.availableFilterNames = availableFilterNames;
    }
}
