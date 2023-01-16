import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Inject,
	OnInit,
	ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subject, tap } from 'rxjs';

import { DIALOG_INJECTION_TOKEN, DialogData } from '../dialogs/const';
import { BaseComponent } from '../../../shared';
import { ElectronService } from '../../services';
import { UserDataEvents, UserDataResponse } from '../../../../../app/shared';

const buildAvatarUrl = (nickname: string) =>
	`https://mc-heads.net/avatar/${nickname}`;

@Component({
	selector: 'app-user-data-dialog',
	templateUrl: './user-data-dialog.component.html',
	styleUrls: ['./user-data-dialog.component.scss'],
})
export class UserDataDialogComponent
	extends BaseComponent
	implements OnInit, AfterViewInit
{
	@ViewChild('nicknameInput') nicknameInput: ElementRef<HTMLInputElement>;

	userDataForm = new FormGroup({
		nickname: new FormControl('', {
			validators: [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(20),
			],
			updateOn: 'change',
		}),
	});

	avatarURL? = buildAvatarUrl('Steve');
	loadingAvatar = false;
	updateAvatarURL$ = new Subject<void>();

	constructor(
		@Inject(DIALOG_INJECTION_TOKEN) public data: DialogData,
		private cdr: ChangeDetectorRef,
		private electron: ElectronService,
	) {
		super();
	}

	get nickname() {
		return this.userDataForm.get('nickname');
	}

	ngOnInit() {
		this.updateAvatarURL$
			.pipe(
				tap(() => (this.loadingAvatar = true)),
				debounceTime(2000),
				tap(() => (this.loadingAvatar = false)),
			)
			.subscribe(() => {
				if (this.nickname.valid) {
					this.avatarURL = buildAvatarUrl(this.nickname.value);
				}
				this.cdr.detectChanges();
			});
	}

	ngAfterViewInit() {
		this.nicknameInput.nativeElement.focus();
	}

	submit() {
		if (this.userDataForm.invalid) {
			return;
		}

		const userData: UserDataResponse = {
			username: this.nickname.value,
		};
		this.electron.send(UserDataEvents.REPLY_ID, userData);

		this.data.close();
	}

	onChange() {
		this.nickname.markAsTouched();

		if (this.nickname.valid) {
			if (buildAvatarUrl(this.nickname.value) !== this.avatarURL) {
				this.updateAvatarURL$.next();
			}
		} else {
			this.avatarURL = undefined;
		}

		this.cdr.detectChanges();
	}
}
