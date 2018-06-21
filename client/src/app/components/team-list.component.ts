import {Component, OnInit} from '@angular/core';

import { Router, ActivatedRoute, Params} from '@angular/router';

import { UserService } from '../services/user.service';

import { TeamService } from '../services/team.service';

import { Team } from '../models/team';

import { GLOBAL } from '../services/global';

@Component ({
	selector: 'team-list',
	templateUrl: '../views/team-list.html',
	providers: [UserService, TeamService]
})

export class TeamListComponent implements OnInit {
	public titulo: string;

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
		private _teamService: TeamService
	) {
		this.titulo = 'Equipos';

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		this.url = GLOBAL.url;

		this.next_page = 1;
		this.prev_page = 1;
	}

	ngOnInit() {
		console.log("listado de equipos");

		this.getTeams();
	}

	getTeams() {
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

			this._teamService.getTeams(this.token, page).subscribe(
				response => {
					if (!response.teams) {
						this._router.navigate(['/']);
					} else {
						this.teams = response.teams;
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

	onCancelTeam() {
		this.confirmado = null;
	}

	onDeleteTeam(id) {
		this._teamService.deleteTeam(this.token, id).subscribe(
			response => {
				console.log(response.team);
				if (!response.team) {
					alert('Error del servidor');
				} else {
					this.getTeams();
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