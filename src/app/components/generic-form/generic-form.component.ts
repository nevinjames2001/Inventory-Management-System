import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, DropdownModule,CommonModule],
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.css']
})
export class GenericFormComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() formData: any = null;
  @Input() fields: any[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();
  form!: FormGroup;
  value: any;

  constructor(private fb: FormBuilder) { }


  ngOnInit() {
  if (this.fields.length) {
        this.buildForm();
      } else {
        this.form = this.fb.group({});
      }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields']) {
      this.buildForm();
    }
    if (changes['fields'] && this.formData) {
      this.form.patchValue(this.formData);
    }
  }

  buildForm() {
    const controls: any = {};
    this.fields.forEach(field => {
      controls[field.name]=[this.formData?.[field.name] || '', field.required ? Validators.required : []];
    });
    this.form = this.fb.group(controls);
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
      this.closeDialog();
    }
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
