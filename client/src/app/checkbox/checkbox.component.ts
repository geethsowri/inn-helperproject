import {ChangeDetectionStrategy, Component, forwardRef, signal} from '@angular/core';
import {FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

export interface Language {
  name: string;
  completed: boolean;
}

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [
    FormsModule,
    MatCheckboxModule,
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }

  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CheckboxComponent {
  readonly alllanguages: Language[] = [
    {name: 'Telugu', completed: false},
    {name: 'English', completed: false},
    {name: 'Hindi', completed: false},
    {name: 'Tamil', completed: false},
    {name: 'Malayalam', completed: false},
    {name: 'Kannada', completed: false},
  ]

  onChange: any
  onTouched: any

  selectedlanguages = signal<Set<string>>(new Set());

  get allSelected(): boolean {
    return this.alllanguages.length == this.selectedlanguages().size;
  } 

  get partiallySelected(): boolean {
    const size = this.selectedlanguages().size;
    return size>0 && size<this.alllanguages.length;
  }

  toggleLanguage(name:string, checked:boolean) {
    const updated = new Set(this.selectedlanguages());
    if(checked){
      updated.add(name);
    }
    else{
      updated.delete(name);
    }
    this.selectedlanguages.set(updated);
    this.onChange(Array.from(updated));
    this.onTouched();
  }

  toggleSelectAll(checked: boolean) {
    const updated = checked ? new Set(this.alllanguages.map(l => l.name)) : new Set<string>(new Set());
    this.selectedlanguages.set(updated);
    this.onChange(Array.from(updated));
    this.onTouched();
    console.log(updated);
  }

  writeValue(value: string[]): void {
    this.selectedlanguages.set(new Set(value || []));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
