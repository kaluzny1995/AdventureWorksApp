export class ViewParams {
    public isColumnSetOn: boolean;
    public isFilterSetOn: boolean;
    public readonly perPageOptions: number[];
    public selectedId: string | null;
    public newId: string | null;
    public changedId: string | null;

    constructor(isColumnSetOn: boolean,
                isFilterSetOn: boolean,
                perPageOptions: number[],
                selectedId: string | null,
                newId: string | null,
                changedId: string | null) {
        this.isColumnSetOn = isColumnSetOn;
        this.isFilterSetOn = isFilterSetOn;
        this.perPageOptions = perPageOptions;
        this.selectedId = selectedId;
        this.newId = newId;
        this.changedId = changedId;
    }
}
