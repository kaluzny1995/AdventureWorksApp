import { Step } from './step';

describe('Step', () => {
  it('should create an instance', () => {
    expect(new Step('name', 'title', 'desc')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const step = new Step('step1', 'Step One', 'Description of step one');
    expect(step.name).toBe('step1');
    expect(step.title).toBe('Step One');
    expect(step.description).toBe('Description of step one');
  });

  describe('fromJson', () => {
    it('should create instance from JSON', () => {
      const json = {name: 'step1', title: 'Step One', description: 'Description'};
      const step = Step.fromJson(json);
      expect(step.name).toBe('step1');
      expect(step.title).toBe('Step One');
      expect(step.description).toBe('Description');
    });
  });

  describe('fromJsonList', () => {
    it('should create list from JSON list', () => {
      const jsonList = [
        {name: 'step1', title: 'Step 1', description: 'Desc 1'},
        {name: 'step2', title: 'Step 2', description: 'Desc 2'}
      ];
      const result = Step.fromJsonList(jsonList);
      expect(result.length).toBe(2);
      expect(result[0].title).toBe('Step 1');
      expect(result[1].title).toBe('Step 2');
    });

    it('should return empty array for empty list', () => {
      expect(Step.fromJsonList([])).toEqual([]);
    });
  });
});
