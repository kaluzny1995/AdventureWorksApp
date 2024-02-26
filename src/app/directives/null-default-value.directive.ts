import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector: 'input[nullDefault], mat-select[nullDefault], textarea[nullDefault]'
})
export class NullDefaultValueDirective {
    constructor(private _element: ElementRef, private _control: NgControl) {}

    @HostListener('input', ['$event.target'])
    onElementEmpty(target: HTMLInputElement): void {
        if (target.value.trim() === '') {
            this._control.reset(null);
        }
    }
}