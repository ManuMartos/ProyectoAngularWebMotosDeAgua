import {Component, OnInit} from '@angular/core';

import { Router, ActivatedRoute, Params} from '@angular/router';

import { UserService } from '../services/user.service';

import { Pilot } from '../models/pilot';

import { GLOBAL } from '../services/global';

import { PilotService } from '../services/pilot.service';

@Component ({
	selector: 'pilot-detail',
	templateUrl: '../views/pilot-detail.html',
	providers: [UserService, PilotService]
})

export class PilotDetailComponent implements OnInit {
	public titulo: string;

	public pilot: Pilot;

	public identity;

	public token;

	public url: string;

	public alertMessage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _pilotService: PilotService
	) {
		this.titulo = 'Detalles del Piloto';

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		this.url = GLOBAL.url;
	}

	ngOnInit() {
		// llamar al backend para traer el equipo asociado a la id que estoy buscando
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
}