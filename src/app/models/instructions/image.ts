export class Image {
    public readonly title: string;
    public readonly src: string;
    public readonly label: string | null;
    public readonly isHalf: boolean;

    constructor(
        title: string,
        src: string,
        label: string | null,
        isHalf: boolean
    ) {
        this.title = title;
        this.src = src;
        this.label = label;
        this.isHalf = isHalf;
    }

    /**
     * Returns image object with data from JSON object
    */
    public static fromJson(json: any, imagePathTemplate: string): Image {
        const src = imagePathTemplate.replace('${}', json.src);
        return new Image(json.title, src, json.label, json.isHalf);
    }

    /**
     * Returns a list of image objects with data from JSON objects list
    */
    public static fromJsonList(jsonList: any[], imagePathTemplate: string): Image[] {
        return jsonList.map((json: any) => this.fromJson(json, imagePathTemplate));
    }
}
