export class Step {
    public readonly name: string;
    public readonly title: string;
    public readonly description: string;

    constructor(
        name: string,
        title: string,
        description: string
    ) {
        this.name = name;
        this.title = title;
        this.description = description;
    }

    /**
     * Returns step object with data from JSON object
    */
    public static fromJson(json: any): Step {
        return new Step(json.name, json.title, json.description);
    }

    /**
     * Returns a list of step objects with data from JSON objects list
    */
    public static fromJsonList(jsonList: any[]): Step[] {
        return jsonList.map((json: any) => this.fromJson(json));
    }
}
