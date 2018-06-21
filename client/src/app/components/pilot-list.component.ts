import {Component, OnInit} from '@angular/core';

import { Router, ActivatedRoute, Params} from '@angular/router';

import { UserService } from '../services/user.service';

import { PilotService } from '../services/pilot.service';

import { Pilot } from '../models/pilot';

import { Team } from '../models/team';

import { GLOBAL } from '../services/global';

@Component ({
	selector: 'pilot-list',
	templateUrl: '../views/pilot-list.html',
	providers: [UserService, PilotService]
})

export class PilotListComponent implements OnInit {
	public titulo: string;

	public pilots: Pilot[];

	public teams: Team[];

	public identity;

	public token;

	public url: string;

	public next_page;

	public prev_page;

	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _pilotService: PilotService
	) {
		this.titulo = 'Pilotos';

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		this.url = GLOBAL.url;

		this.next_page = 1;
		this.prev_page = 1;
	}

	ngOnInit() {
		console.log("listado de pilotos");

		this.getPilots();
	}

	getPilots() {
		this._route.params.forEach((params: Params) => {
			// utilizo el símbolo + para convertir a número
			let page = +params['page'];

			if (!page) {
				page = 1;
			} else {
				this.next_page = page + 1;
				this.prev_page = page - 1;

				if (this.prev_page == 0) {
					this.prev_page = 1;
				}
			}

			this._pilotService.getPilots(this.token, page).subscribe(
				response => {
					if (!response.pilots) {
						this._router.navigate(['/']);
					} else {
						this.pilots = response.pilots;
					}
				}, error => {
					var errorMessage = <any>error;
	                if (errorMessage != null) {
	                  var body = JSON.parse(error._body);
	                  console.log(error);
	                }
				}
			);
		});
	}

	onDeleteConfirm(id) {
		this.confirmado = id;
	}

	onCancelPilot() {
		this.confirmado = null;
	}

	onDeletePilot(id) {
		this._pilotService.deletePilot(this.token, id).subscribe(
			response => {
				console.log(response.pilot);
				if (!response.pilot) {
					alert('Error del servidor');
				} else {
					this.getPilots();
				}
			}, error => {
				var errorMessage = <any>error;
                if (errorMessage != null) {
                  var body = JSON.parse(error._body);
                  console.log(error);
                }
			}
		);
	}
}