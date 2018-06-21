// librería de inyección de dependencias
import { Injectable } from '@angular/core';

// necesarias para las peticiones http
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// librería sirve para mapear objetos
import 'rxjs/add/operator/map';

// sirve para recoger las respuestas de las peticiones ajax al servidor
import { Observable } from 'rxjs/Observable';

import { GLOBAL } from './global';

import { Team } from '../models/team';

// para permitir que mediante la inyección de dependencias podamos inyectar este servicio, es decir, esta clase en otros componentes o en otras clases
@Injectable()
export class TeamService {

	public url:string;

	// inyectamos la dependencia http para poder hacer peticiones http
	constructor(private _http: Http) {
		this.url = GLOBAL.url;
	}

	addTeam(token, team: Team) {
		let params = JSON.stringify(team);

		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.post(this.url + 'team', params, {headers: headers}).map(res => res.json());
	}

	getTeam(token, id: string) {
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.get(this.url + 'team/' + id, {headers: headers}).map(res => res.json());
	}

	getTeams(token, page) {
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.get(this.url + 'teams/' + page, {headers: headers}).map(res => res.json());
	}

	editTeam(token, id: string, team: Team) {
		let params = JSON.stringify(team);

		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.put(this.url + 'team/' + id, params, {headers: headers}).map(res => res.json());
	}

	deleteTeam(token, id: string) {
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.delete(this.url + 'team/' + id, {headers: headers}).map(res => res.json());
	}
}