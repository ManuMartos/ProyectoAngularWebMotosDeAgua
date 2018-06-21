import {Component, OnInit} from '@angular/core';

import { Router, ActivatedRoute, Params} from '@angular/router';

import { UserService } from '../services/user.service';

import { Pilot } from '../models/pilot';

import { GLOBAL } from '../services/global';

import { PilotService } from '../services/pilot.service';

import { UploadService } from '../services/upload.service';

@Component ({
	selector: 'pilot-edit',
	templateUrl: '../views/pilot-add.html',
	providers: [UserService, PilotService, UploadService]
})

export class PilotEditComponent implements OnInit {
	public titulo: string;

	public pilot: Pilot;

	public identity;

	public token;

	public url: string;

	public alertMessage;

	public is_edit;

	// array de ficheros a subir
	public filesToUpload : Array<File>;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _pilotService: PilotService,
		private _uploadService: UploadService
	) {
		this.titulo = 'Editar Piloto';

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		this.url = GLOBAL.url;

		this.pilot = new Pilot('','', 0 ,'','');

		this.is_edit = true;
	}

	ngOnInit() {
		
		this.getPilot();
	}

	getPilot() {
		// recoger el id que llega por parámetro en la url
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			this._pilotService.getPilot(this.token, id).subscribe(
				response => {
					if (!response.pilot) {
						// redirigimos al principal
						this._router.navigate(['/']);
					} else {
						this.pilot = response.pilot;
					}
				}, error => {
					var errorMessage = <any>error;
	                if (errorMessage != null) {
	                  var body = JSON.parse(error._body);
	                  this.alertMessage = body.message;
	                  console.log(error);
	                }
				}
			);
		});
	}

	onSubmit() {
		console.log(this.pilot);

		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._pilotService.editPilot(this.token, id, this.pilot).subscribe(
			response => {
				if (!response.pilot) {
					this.alertMessage = 'Error del Servidor';
				} else {
					this.alertMessage = 'Piloto Actualizado';

					// subir la imagen del equipo
					if (!this.filesToUpload) {
						this._router.navigate(['/']);
					} else {
						this._uploadService.makeFileRequest(this.url+'upload-image-pilot/'+id, [], this.filesToUpload, this.token, 'image')
							.then(
								(result: any) => {
									this._router.navigate(['/pilots/1']);
								}, (error) => {
									console.log(error);
								}
							);
					}
				}
			}, error => {
				var errorMessage = <any>error;
                if (errorMessage != null) {
                  var body = JSON.parse(error._body);
                  this.alertMessage = body.message;
                  console.log(error);
                }
			}
		);
		});
	}

	// evento que se lanza en el onChange de input file
	// recibe la información del fichero a subir
	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}