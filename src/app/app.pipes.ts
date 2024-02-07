import { Pipe, PipeTransform } from "@angular/core";
import xmlFormat from 'xml-formatter';

@Pipe({
    name:'xml'
})
export class XmlPipe implements PipeTransform {
    transform(xmlString: string | null): string | null {
        return xmlString === null? null : xmlFormat(xmlString, {
            indentation: '  ', 
            filter: (node) => node.type !== 'Comment', 
            collapseContent: true, 
            lineSeparator: '\n'
        });
    }
}