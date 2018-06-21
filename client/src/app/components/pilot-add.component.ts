import {Component, OnInit} from '@angular/core';

import { Router, ActivatedRoute, Params} from '@angular/router';

import { UserService } from '../services/user.service';

import { Pilot } from '../models/pilot';

import { GLOBAL } from '../services/global';

import { PilotService } from '../services/pilot.service';

@Component ({
	selector: 'pilot-add',
	templateUrl: '../views/pilot-add.html',
	providers: [UserService, PilotService]
})

export class PilotAddComponent implements OnInit {
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
		this.titulo = 'Añadir Piloto';

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		this.url = GLOBAL.url;

		this.pilot = new Pilot('','', 0 ,'','');
	}

	ngOnInit() {
		console.log("añadir pilotos");
	}

	onSubmit() {
		console.log(this.pilot);

		this._pilotService.addPilot(this.token, this.pilot).subscribe(
			response => {
				if (!response.pilot) {
					this.alertMessage = 'Error del Servidor';
				} else {
					this.alertMessage = 'Piloto Guardado';

					this.pilot = response.pilot; // asignamos al atributo de la clase el objeto que nos devuelve la bd

					// redirigir a la ruta de edición del equipo
					this._router.navigate(['/editar-piloto', response.pilot._id]);
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
	}
}