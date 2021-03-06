/*
 * Service to convert a group of 
 * controls (fields) to a form.
*/
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidatorService } from './custom-validators.service';
import { BaseControl } from '../ui-controls/base-control';
import { BeaconReferenceService } from './beacon-reference.service';

@Injectable()
export class FormFieldService {
    constructor(private customValidatorService: CustomValidatorService, private beaconReferenceService: BeaconReferenceService) { }

    // get form out of controls
    toFormGroup(controls: BaseControl<any>[]) {
        let group: any = {};

        controls.forEach(item => {
            // get validators if any
            var validators = [];
            if (item.required) {
                validators.push(Validators.required);
            }
            if (item.pattern) {
                validators.push(Validators.pattern(item.pattern));
            }
            if (item.isUniqueBeaconRef) {
                validators.push(this.customValidatorService.beaconreferenceUniqueValidator(this.beaconReferenceService, item.value));
            }
            // generate form control
            if (validators.length > 0) {
                group[item.key] = new FormControl({ value: item.value || '', disabled: item.disabled ? true : false }, Validators.compose(validators));
            } else {
                group[item.key] = new FormControl({ value: item.value, disabled: item.disabled ? true : false });
            }
        });
        return new FormGroup(group);
    }
}