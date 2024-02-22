export class DeletionConfirmationData {
    public readonly title: string;
    public readonly description: string;
    public readonly errorMessage: string;

    constructor(title: string, description: string, errorMessage: string) {
        this.title = title;
        this.description = description;
        this.errorMessage = errorMessage;
    }
}
