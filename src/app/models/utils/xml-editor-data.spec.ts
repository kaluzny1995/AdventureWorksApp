import { EXmlField } from './e-xml-field';
import { XmlEditorData } from './xml-editor-data';

describe('XmlEditorData', () => {
  it('should create an instance', () => {
    expect(new XmlEditorData(EXmlField.PERSON_ACI, '', '')).toBeTruthy();
  });
});
