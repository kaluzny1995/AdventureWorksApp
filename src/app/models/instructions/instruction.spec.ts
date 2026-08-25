import { Instruction } from './instruction';
import { Image } from './image';
import { Step } from './step';
import { EFirstStep } from './e-first-step';
import { EAdminPannelStep } from './e-admin-pannel-step';
import { EDataflowDiagram } from './e-dataflow-diagram';
import { E1VAdminPannelStep } from './e-1v-admin-pannel-step';

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
      const json = {name: 'First Steps', value: 'signing_in', btnIcon: 'icon', images: [], steps: []};
      const instr = Instruction.fromJson(json, '/path/${}');
      expect(instr.name).toBe('First Steps');
      expect(instr.value).toBe(EFirstStep.SIGNING_IN);
    });

    it('should create instance from JSON with EAdminPannelStep value', () => {
      const json = {name: 'Admin Panel', value: 'view', btnIcon: 'icon', images: [], steps: []};
      const instr = Instruction.fromJson(json, '/path/${}');
      expect(instr.value).toBe(EAdminPannelStep.VIEW);
    });

    it('should create instance from JSON with EDataflowDiagram value', () => {
      const json = {name: 'Frontend', value: 'app', btnIcon: '', images: [], steps: []};
      const instr = Instruction.fromJson(json, '/path/${}');
      expect(instr.value).toBe(EDataflowDiagram.APP);
    });

    it('should create instance from JSON with E1VAdminPannelStep value', () => {
      const json = {name: 'View', value: 'view', btnIcon: 'view_list', images: [], steps: []};
      const instr = Instruction.fromJson(json, '/path/${}');
      expect(instr.value).toBe(E1VAdminPannelStep.VIEW);
    });

    it('should parse images from JSON with imagePathTemplate', () => {
      const json = {
        name: 'Test', value: 'signing_in', btnIcon: 'icon',
        images: [{title: 'Img', src: 'signing_up', label: 'Label', isHalf: true}],
        steps: []
      };
      const instr = Instruction.fromJson(json, '/assets/images/first_steps/${}.png');
      expect(instr.images.length).toBe(1);
      expect(instr.images[0].src).toBe('/assets/images/first_steps/signing_up.png');
    });

    it('should parse steps from JSON', () => {
      const json = {
        name: 'Test', value: 'signing_in', btnIcon: 'icon', images: [],
        steps: [{name: 'step1', title: 'Step 1', description: 'Desc'}]
      };
      const instr = Instruction.fromJson(json, '/path/${}');
      expect(instr.steps.length).toBe(1);
      expect(instr.steps[0].title).toBe('Step 1');
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

  describe('real JSON data patterns', () => {
    it('should parse first_steps.json structure correctly', () => {
      const template = '/assets/images/first_steps/${}.png';
      const jsonList = [
        {
          name: 'Signing up', value: 'signing_up', btnIcon: 'person_add',
          images: [
            {title: 'Signing up form', src: 'signing_up', label: 'Empty', isHalf: true},
            {title: 'Signing up filled in form', src: 'signing_up_filled', label: 'Filled in', isHalf: true}
          ],
          steps: [
            {name: 'Username', title: 'Unique username.', description: 'Must be unique.'},
            {name: 'Password', title: 'Password typed twice.', description: 'Must be repeated.'}
          ]
        },
        {
          name: 'Signing in', value: 'signing_in', btnIcon: 'person',
          images: [{title: 'Signing in form', src: 'signing_in', label: 'Empty', isHalf: true}],
          steps: [{name: 'Username', title: 'Username.', description: 'Provide username.'}]
        }
      ];
      const result = Instruction.fromJsonList(jsonList, template);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Signing up');
      expect(result[0].images.length).toBe(2);
      expect(result[0].images[0].src).toBe('/assets/images/first_steps/signing_up.png');
      expect(result[0].images[1].src).toBe('/assets/images/first_steps/signing_up_filled.png');
      expect(result[0].steps.length).toBe(2);
      expect(result[1].name).toBe('Signing in');
      expect(result[1].images[0].src).toBe('/assets/images/first_steps/signing_in.png');
    });

    it('should parse admin_pannels.json structure correctly', () => {
      const template = '/assets/images/admin_pannels/${}.png';
      const jsonList = [
        {
          name: 'View', value: 'view', btnIcon: 'view_list',
          images: [
            {title: 'Data view on start', src: 'view_start', label: 'Start up view', isHalf: true},
            {title: 'Data view with visible components', src: 'view_components', label: 'View with visible components', isHalf: true}
          ],
          steps: [{name: 'Overview', title: 'Admin pannel overview.', description: 'Overview.'}]
        }
      ];
      const result = Instruction.fromJsonList(jsonList, template);
      expect(result[0].images[0].src).toBe('/assets/images/admin_pannels/view_start.png');
      expect(result[0].images[1].src).toBe('/assets/images/admin_pannels/view_components.png');
    });

    it('should parse dataflow_diagrams.json structure correctly', () => {
      const template = '/assets/images/dataflow_diagrams/${}.png';
      const jsonList = [
        {
          name: 'Application frontend', value: 'app', btnIcon: '',
          images: [{title: 'Frontend dataflow', src: 'awma_frontend', label: '', isHalf: false}],
          steps: [{name: 'Form view', title: 'User opens form.', description: 'User opens form.'}]
        },
        {
          name: 'API backend', value: 'api', btnIcon: '',
          images: [{title: 'Backend dataflow', src: 'awma_backend', label: '', isHalf: false}],
          steps: [{name: 'HTTP request', title: 'HTTP request to API.', description: 'HTTP request.'}]
        }
      ];
      const result = Instruction.fromJsonList(jsonList, template);
      expect(result.length).toBe(2);
      expect(result[0].images[0].src).toBe('/assets/images/dataflow_diagrams/awma_frontend.png');
      expect(result[1].images[0].src).toBe('/assets/images/dataflow_diagrams/awma_backend.png');
    });

    it('should parse 1v_admin_pannels.json structure correctly', () => {
      const template = '/assets/images/1v_admin_pannels/${}.png';
      const jsonList = [
        {
          name: 'View', value: 'view', btnIcon: 'view_list',
          images: [{title: 'Data view', src: 'view', label: null, isHalf: false}],
          steps: [{name: 'Overview', title: '1v admin pannel overview.', description: 'Overview.'}]
        },
        {
          name: 'Ordering', value: 'order', btnIcon: 'sort_by_alpha',
          images: [{title: 'Ordering', src: 'order', label: null, isHalf: false}],
          steps: [{name: 'Headers', title: 'Clickable headers.', description: 'Headers.'}]
        }
      ];
      const result = Instruction.fromJsonList(jsonList, template);
      expect(result[0].images[0].src).toBe('/assets/images/1v_admin_pannels/view.png');
      expect(result[1].images[0].src).toBe('/assets/images/1v_admin_pannels/order.png');
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

    it('should handle null label', () => {
      const json = {title: 'Image', src: 'img.png', label: null, isHalf: true};
      const img = Image.fromJson(json, '/path/${}');
      expect(img.label).toBeNull();
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

    it('should return empty array for empty list', () => {
      expect(Image.fromJsonList([], '/path/${}')).toEqual([]);
    });
  });

  describe('image path resolution from real assets', () => {
    it('should resolve first_steps image paths', () => {
      const template = '/assets/images/first_steps/${}.png';
      expect(Image.fromJson({title: 't', src: 'signing_up', label: null, isHalf: false}, template).src)
        .toBe('/assets/images/first_steps/signing_up.png');
      expect(Image.fromJson({title: 't', src: 'renew_spinner_primary', label: null, isHalf: false}, template).src)
        .toBe('/assets/images/first_steps/renew_spinner_primary.png');
    });

    it('should resolve admin_pannels image paths', () => {
      const template = '/assets/images/admin_pannels/${}.png';
      expect(Image.fromJson({title: 't', src: 'add_start', label: null, isHalf: false}, template).src)
        .toBe('/assets/images/admin_pannels/add_start.png');
      expect(Image.fromJson({title: 't', src: 'delete', label: null, isHalf: false}, template).src)
        .toBe('/assets/images/admin_pannels/delete.png');
    });

    it('should resolve dataflow_diagrams image paths', () => {
      const template = '/assets/images/dataflow_diagrams/${}.png';
      expect(Image.fromJson({title: 't', src: 'awma_frontend', label: null, isHalf: false}, template).src)
        .toBe('/assets/images/dataflow_diagrams/awma_frontend.png');
      expect(Image.fromJson({title: 't', src: 'awma_backend', label: null, isHalf: false}, template).src)
        .toBe('/assets/images/dataflow_diagrams/awma_backend.png');
    });

    it('should resolve 1v_admin_pannels image paths', () => {
      const template = '/assets/images/1v_admin_pannels/${}.png';
      expect(Image.fromJson({title: 't', src: 'view', label: null, isHalf: false}, template).src)
        .toBe('/assets/images/1v_admin_pannels/view.png');
      expect(Image.fromJson({title: 't', src: 'edit', label: null, isHalf: false}, template).src)
        .toBe('/assets/images/1v_admin_pannels/edit.png');
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
