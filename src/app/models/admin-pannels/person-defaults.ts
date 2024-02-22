export class PersonDefaults {
    public readonly availableColumns: string[];
    public readonly availableColumnNames: string[];
    public readonly displayedIndices: number[];
    public readonly availableFilters: string[];
    public readonly availableFilterNames: string[];
    public readonly types: {[key: string]: string};
    public readonly nameStyles: {[key: string]: string};
    public readonly titles: string[];
    public readonly suffixes: string[];
    public readonly emailPromotions: {[key: string]: string};
    public readonly aciTemplate: string;
    public readonly demoTemplate: string;

    constructor(availableColumns: string[], availableColumnNames: string[], displayedIndices: number[],
                availableFilters: string[], availableFilterNames: string[], types: {[key: string]: string},
                nameStyles: {[key: string]: string}, titles: string[], suffixes: string[],
                emailPromotions: {[key: string]: string}, aciTemplate: string, demoTemplate: string) {
                    this.availableColumns = availableColumns;
                    this.availableColumnNames = availableColumnNames;
                    this.displayedIndices = displayedIndices;
                    this.availableFilters = availableFilters;
                    this.availableFilterNames = availableFilterNames;
                    this.types = types;
                    this.nameStyles = nameStyles;
                    this.titles = titles;
                    this.suffixes = suffixes;
                    this.emailPromotions = emailPromotions;
                    this.aciTemplate = aciTemplate;
                    this.demoTemplate = demoTemplate;
                }
}