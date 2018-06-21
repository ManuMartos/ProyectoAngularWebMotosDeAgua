import {Component, OnInit} from '@angular/core';

import { Router, ActivatedRoute, Params} from '@angular/router';

import { UserService } from '../services/user.service';

import { Team } from '../models/team';

import { GLOBAL } from '../services/global';

import { TeamService } from '../services/team.service';

import { UploadService } from '../services/upload.service';

@Component ({
	selector: 'team-edit',
	templateUrl: '../views/team-add.html',
	providers: [UserService, TeamService, UploadService]
})

export class TeamEditComponent implements OnInit {
	public titulo: string;

	public team: Team;

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
		private _teamService: TeamService,
		private _uploadService: UploadService
	) {
		this.titulo = 'Editar Equipo';

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		this.url = GLOBAL.url;

		this.team = new Team('','','');

		this.is_edit = true;
	}

	ngOnInit() {
		// llamar al backend para traer el equipo asociado a la id que estoy buscando
		this.getTeam();
	}

	getTeam() {
		// recoger el id que llega por parámetro en la url
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			this._teamService.getTeam(this.token, id).subscribe(
				response => {
					if (!response.team) {
						// redirigimos al principal
						this._router.navigate(['/']);
					} else {
						this.team = response.team;
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
		console.log(this.team);

		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._teamService.editTeam(this.token, id, this.team).subscribe(
			response => {
				if (!response.team) {
					this.alertMessage = 'Error del Servidor';
				} else {
					this.alertMessage = 'Equipo Actualizado';

					// subir la imagen del equipo
					if (!this.filesToUpload) {
						this._router.navigate(['/']);
					} else {
						this._uploadService.makeFileRequest(this.url+'upload-image-team/'+id, [], this.filesToUpload, this.token, 'image')
							.then(
								(result: any) => {
									this._router.navigate(['/teams/1']);
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