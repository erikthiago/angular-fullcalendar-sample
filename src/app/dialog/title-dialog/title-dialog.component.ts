import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-title-dialog',
  templateUrl: './title-dialog.component.html',
  styleUrls: ['./title-dialog.component.sass']
})
export class TitleDialogComponent implements OnInit {

  title: any;
  showHours: boolean = false;

  // Segui esse tutorial para colocar o tema: https://indepth.dev/tutorials/angular/angular-material-theming-system-complete-guide
  // Ou seja, vai no arquivo angular.json, na seção styles e coloque o css que desejar
  constructor(private dialogRef: MatDialogRef<TitleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // Link usado como base: https://stackoverflow.com/questions/6629728/check-if-a-string-has-a-certain-piece-of-text
    // Aqui verificamos se a data enviada contém : que é usado nas horas. Ou seja, se a data enviada contém horas também
    this.showHours = this.data.date.includes(':');
  }

  authorize() {
    this.dialogRef.close(this.title);
  }

  unauthorize(){
    this.dialogRef.close();
  }
}
