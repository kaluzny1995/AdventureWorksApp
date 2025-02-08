export class ColumnSettingsData {
    public readonly entityName: string;
    public readonly selectedNames: string[];
    public readonly availableColumns: string[];
    public readonly columnNameMapping: {[key: string]: string};
    public readonly defaultIndices: number[];

    constructor(
        entityName: string,
        selectedNames: string[], 
        availableColumns: string[], 
        columnNameMapping: {[key: string]: string},
        defaultIndices: number[]
    ) {
        this.entityName = entityName;
        this.selectedNames = selectedNames;
        this.availableColumns = availableColumns;
        this.columnNameMapping = columnNameMapping;
        this.defaultIndices = defaultIndices;
    }
}
