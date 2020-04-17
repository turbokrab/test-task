import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-pop-up-dialog',
  templateUrl: './pop-up-dialog.component.html',
  styleUrls: ['./pop-up-dialog.component.css']
})
export class PopUpDialogComponent implements OnInit {

  public popUpDialogFormGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<PopUpDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
    //dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.popUpDialogFormGroup = this.formBuilder.group({
      BookAuthor: '',
      BookName: '',
      Price: '',
      BookReview: '',
      PhotoUrl: '',
      PhotoDescription: ''
    });

    this.popUpDialogFormGroup.controls.Price.setValidators([Validators.pattern('^[0-9]*$'), Validators.required]);
    const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.popUpDialogFormGroup.controls.PhotoUrl.setValidators([Validators.pattern(urlRegex)]);

    if (!isNullOrUndefined(this.data.bookInfo)) {
      for (const prop of Object.keys(this.popUpDialogFormGroup.controls)) {
        if (!prop.includes('Photo')) {
          if (!isNullOrUndefined(this.data.bookInfo[prop])) {
            this.popUpDialogFormGroup.controls[prop].setValue(this.data.bookInfo[prop]);
          }
        }
      }
      if (!isNullOrUndefined(this.data.bookInfo['Photo'])) {
        this.popUpDialogFormGroup.controls['PhotoUrl'].setValue(this.data.bookInfo['Photo'].Url);
        this.popUpDialogFormGroup.controls['PhotoDescription'].setValue(this.data.bookInfo['Photo'].Description);
      }
    }
  }

  okDialog() {
    this.dialogRef.close(this.popUpDialogFormGroup.value);
  }
  closeDialog() {
    this.dialogRef.close('close');
  }

}
