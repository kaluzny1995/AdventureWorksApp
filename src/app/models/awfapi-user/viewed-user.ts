export class ViewedUser {
    public username: string;
    public fullName: string;
    public email: string;
    public isReadonly: boolean;
    public dateCreated: Date;
    public dateModified: Date;

    constructor(
        username: string, fullName: string, email: string, isReadonly: boolean,
        dateCreated: Date, dateModified: Date) {
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.isReadonly = isReadonly;
        this.dateCreated = dateCreated;
        this.dateModified = dateModified;
    }
    
    public static fromAPIStructure(data: any): ViewedUser {
        return new ViewedUser(
            data.username,
            data.full_name,
            data.email,
            Boolean(data.is_readonly),
            new Date(data.date_created),
            new Date(data.date_modified)
            );
    }
}
