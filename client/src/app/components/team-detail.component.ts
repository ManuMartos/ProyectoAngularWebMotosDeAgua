import {Component, OnInit} from '@angular/core';

import { Router, ActivatedRoute, Params} from '@angular/router';

import { UserService } from '../services/user.service';

import { Team } from '../models/team';

import { GLOBAL } from '../services/global';

import { TeamService } from '../services/team.service';

@Component ({
	selector: 'team-detail',
	templateUrl: '../views/team-detail.html',
	providers: [UserService, TeamService]
})

export class TeamDetailComponent implements OnInit {
	public titulo: string;

	public team: Team;

	public identity;

	public token;

	public url: string;

	public alertMessage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _teamService: TeamService
	) {
		this.titulo = 'Detalles del Equipo';

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		this.url = GLOBAL.url;
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
}