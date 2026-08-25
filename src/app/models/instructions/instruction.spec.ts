import { Instruction } from './instruction';
import { Image } from './image';
import { Step } from './step';
import { EFirstStep } from './e-first-step';
import { EAdminPannelStep } from './e-admin-pannel-step';

describe('Instruction', () => {
  it('should create an instance', () => {
    expect(new Instruction('Test', EFirstStep.SIGNING_IN, 'icon', [], [])).toBeTruthy();
  });

  it('should have correct properties', () => {
    const images = [new Image('title', 'src', null, false)];
    const steps = [new Step('name', 'title', 'desc')];
    const instr = new Instruction('Test', EFirstStep.SIGNING_IN, 'icon', images, steps);
    expect(instr.name).toBe('Test');
    expect(instr.value).toBe(EFirstStep.SIGNING_IN);
    expect(instr.btnIcon).toBe('icon');
    expect(instr.images).toBe(images);
    expect(instr.steps).toBe(steps);
  });

  describe('fromJson', () => {
    it('should create instance from JSON with EFirstStep value', () => {
      const json = {
        name: 'First Steps',
        value: 'signing_in',
        btnIcon: 'icon',
        images: [],
        steps: []
      };
      const instr = Instruction.fromJson(json, '/path/${}');
      expect(instr.name).toBe('First Steps');
      expect(instr.value).toBe(EFirstStep.SIGNING_IN);
    });

    it('should create instance from JSON with EAdminPannelStep value', () => {
      const json = {
        name: 'Admin Panel',
        value: 'view',
        btnIcon: 'icon',
        images: [],
        steps: []
      };
      const instr = Instruction.fromJson(json, '/path/${}');
      expect(instr.value).toBe(EAdminPannelStep.VIEW);
    });
  });

  describe('fromJsonList', () => {
    it('should create list from JSON list', () => {
      const jsonList = [
        {name: 'Instr1', value: 'signing_in', btnIcon: 'i1', images: [], steps: []},
        {name: 'Instr2', value: 'pagination', btnIcon: 'i2', images: [], steps: []}
      ];
      const result = Instruction.fromJsonList(jsonList, '/path/${}');
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Instr1');
      expect(result[1].name).toBe('Instr2');
    });
  });
});

describe('Image', () => {
  it('should create an instance', () => {
    expect(new Image('title', 'src', null, false)).toBeTruthy();
  });

  it('should have correct properties', () => {
    const img = new Image('My Image', '/path/img.png', 'Label', true);
    expect(img.title).toBe('My Image');
    expect(img.src).toBe('/path/img.png');
    expect(img.label).toBe('Label');
    expect(img.isHalf).toBeTrue();
  });

  describe('fromJson', () => {
    it('should create instance from JSON and replace template', () => {
      const json = {title: 'Image 1', src: 'img.png', label: 'Label', isHalf: false};
      const img = Image.fromJson(json, '/assets/${}');
      expect(img.title).toBe('Image 1');
      expect(img.src).toBe('/assets/img.png');
      expect(img.label).toBe('Label');
      expect(img.isHalf).toBeFalse();
    });
  });

  describe('fromJsonList', () => {
    it('should create list from JSON list', () => {
      const jsonList = [
        {title: 'Img1', src: 'a.png', label: null, isHalf: false},
        {title: 'Img2', src: 'b.png', label: 'L', isHalf: true}
      ];
      const result = Image.fromJsonList(jsonList, '/path/${}');
      expect(result.length).toBe(2);
      expect(result[0].src).toBe('/path/a.png');
      expect(result[1].src).toBe('/path/b.png');
    });
  });
});

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
  });
});
