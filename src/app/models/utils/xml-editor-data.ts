import { EXmlField } from "./e-xml-field";

export class XmlEditorData {
    public readonly field: EXmlField;
    public readonly name: string;
    public readonly xml: string;

    constructor(field: EXmlField, name: string, xml: string) {
        this.field = field;
        this.name = name;
        this.xml = xml;
    }
}
