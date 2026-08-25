import { XmlEditorData } from './xml-editor-data';
import { EXmlField } from './e-xml-field';

describe('XmlEditorData', () => {
  it('should create an instance', () => {
    expect(new XmlEditorData(EXmlField.PERSON_ACI, 'name', '<xml/>')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const data = new XmlEditorData(EXmlField.PERSON_DEMO, 'person', '<root/>');
    expect(data.field).toBe(EXmlField.PERSON_DEMO);
    expect(data.name).toBe('person');
    expect(data.xml).toBe('<root/>');
  });
});
