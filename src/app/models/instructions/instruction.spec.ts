import { EFirstStep } from './e-first-step';
import { Instruction } from './instruction';

describe('Instruction', () => {
  it('should create an instance', () => {
    expect(new Instruction('', EFirstStep.SIGNING_IN, '', [], [])).toBeTruthy();
  });
});
