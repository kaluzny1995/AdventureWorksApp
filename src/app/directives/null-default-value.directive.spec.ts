import { NullDefaultValueDirective } from './null-default-value.directive';

describe('NullDefaultValueDirective', () => {
  it('should create an instance', () => {
    const elementRef = { nativeElement: document.createElement('input') };
    const ngControl = { reset: jasmine.createSpy('reset') };
    const directive = new NullDefaultValueDirective(elementRef as any, ngControl as any);
    expect(directive).toBeTruthy();
  });

  it('should reset control to null when input value is empty string', () => {
    const elementRef = { nativeElement: document.createElement('input') };
    const ngControl = { reset: jasmine.createSpy('reset') };
    const directive = new NullDefaultValueDirective(elementRef as any, ngControl as any);

    directive.onElementEmpty({value: ''} as HTMLInputElement);
    expect(ngControl.reset).toHaveBeenCalledWith(null);
  });

  it('should reset control to null when input value is whitespace only', () => {
    const elementRef = { nativeElement: document.createElement('input') };
    const ngControl = { reset: jasmine.createSpy('reset') };
    const directive = new NullDefaultValueDirective(elementRef as any, ngControl as any);

    directive.onElementEmpty({value: '   '} as HTMLInputElement);
    expect(ngControl.reset).toHaveBeenCalledWith(null);
  });

  it('should NOT reset control when input has non-empty value', () => {
    const elementRef = { nativeElement: document.createElement('input') };
    const ngControl = { reset: jasmine.createSpy('reset') };
    const directive = new NullDefaultValueDirective(elementRef as any, ngControl as any);

    directive.onElementEmpty({value: 'hello'} as HTMLInputElement);
    expect(ngControl.reset).not.toHaveBeenCalled();
  });
});
