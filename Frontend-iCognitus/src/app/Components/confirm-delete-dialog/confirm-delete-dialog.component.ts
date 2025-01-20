import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
	selector: 'app-confirm-delete-dialog',
	imports: [MatDialogModule],
	templateUrl: './confirm-delete-dialog.component.html',
	styleUrls: ['./confirm-delete-dialog.component.css']
})
export class ConfirmDeleteDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	onConfirm(): void {
		this.dialogRef.close(true);
	}

	onCancel(): void {
		this.dialogRef.close(false);
	}
}