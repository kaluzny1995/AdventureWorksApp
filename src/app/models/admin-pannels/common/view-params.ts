export class ViewParams {
    public isColumnSetOn: boolean;
    public isFilterSetOn: boolean;
    public readonly perPageOptions: number[];
    public selectedId: number | null;
    public newId: number | null;
    public changedId: number | null;

    constructor(isColumnSetOn: boolean,
                isFilterSetOn: boolean,
                perPageOptions: number[],
                selectedId: number | null,
                newId: number | null,
                changedId: number | null) {
        this.isColumnSetOn = isColumnSetOn;
        this.isFilterSetOn = isFilterSetOn;
        this.perPageOptions = perPageOptions;
        this.selectedId = selectedId;
        this.newId = newId;
        this.changedId = changedId;
    }
}
