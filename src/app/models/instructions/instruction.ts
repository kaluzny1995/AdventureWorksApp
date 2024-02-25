import { EAdminPannelStep } from "./e-admin-pannel-step";
import { EFirstStep } from "./e-first-step";
import { Image } from "./image";
import { Step } from "./step";

export class Instruction {
    public readonly name: string;
    public readonly value: EFirstStep | EAdminPannelStep;
    public readonly btnIcon: string;
    public readonly images: Image[];
    public readonly steps: Step[];

    constructor(
        name: string,
        value: EFirstStep | EAdminPannelStep,
        btnIcon: string,
        images: Image[],
        steps: Step[]
    ) {
        this.name = name;
        this.value = value;
        this.btnIcon = btnIcon;
        this.images = images;
        this.steps = steps;
    }

    /**
     * Returns instruction object with data from JSON object
    */
    public static fromJson(json: any, imagePathTemplate: string): Instruction {
        let value: EFirstStep | EAdminPannelStep = EFirstStep[json.value.toUpperCase() as keyof typeof EFirstStep];
        if (value === undefined) {
            value = EAdminPannelStep[json.value.toUpperCase() as keyof typeof EAdminPannelStep];
        }

        return new Instruction(
            json.name,
            value,
            json.btnIcon,
            Image.fromJsonList(json.images, imagePathTemplate),
            Step.fromJsonList(json.steps)
        );
    }

    /**
     * Returns a list of instruction objects with data from JSON objects list
    */
    public static fromJsonList(jsonList: any[], imagePathTemplate: string): Instruction[] {
        return jsonList.map((json: any) => this.fromJson(json, imagePathTemplate));
    }
}
