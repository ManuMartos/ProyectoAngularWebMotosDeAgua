import {Component, OnInit} from '@angular/core';

import { Router, ActivatedRoute, Params} from '@angular/router';

import { UserService } from '../services/user.service';

import { Team } from '../models/team';

import { GLOBAL } from '../services/global';

import { TeamService } from '../services/team.service';

@Component ({
	selector: 'team-add',
	templateUrl: '../views/team-add.html',
	providers: [UserService, TeamService]
})

export class TeamAddComponent implements OnInit {
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
		this.titulo = 'Añadir Equipo';

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		this.url = GLOBAL.url;

		this.team = new Team('','','');
	}

	ngOnInit() {
		console.log("añadir equipos");
	}

	onSubmit() {
		console.log(this.team);

		this._teamService.addTeam(this.token, this.team).subscribe(
			response => {
				if (!response.team) {
					this.alertMessage = 'Error del Servidor';
				} else {
					this.alertMessage = 'Equipo Guardado';

					this.team = response.team; // asignamos al atributo de la clase el objeto que nos devuelve la bd

					// redirigir a la ruta de edición del equipo
					this._router.navigate(['/editar-equipo', response.team._id]);
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