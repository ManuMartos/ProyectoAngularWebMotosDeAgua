// librería de inyección de dependencias
import { Injectable } from '@angular/core';

// necesarias para las peticiones http
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// librería sirve para mapear objetos
import 'rxjs/add/operator/map';

// sirve para recoger las respuestas de las peticiones ajax al servidor
import { Observable } from 'rxjs/Observable';

import { GLOBAL } from './global';

import { Pilot } from '../models/pilot';

// para permitir que mediante la inyección de dependencias podamos inyectar este servicio, es decir, esta clase en otros componentes o en otras clases
@Injectable()
export class PilotService {

	public url:string;

	// inyectamos la dependencia http para poder hacer peticiones http
	constructor(private _http: Http) {
		this.url = GLOBAL.url;
	}

	addPilot(token, pilot: Pilot) {
		let params = JSON.stringify(pilot);

		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.post(this.url + 'pilot', params, {headers: headers}).map(res => res.json());
	}

	getPilot(token, id: string) {
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.get(this.url + 'pilot/' + id, {headers: headers}).map(res => res.json());
	}

	getPilots(token, page) {
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.get(this.url + 'pilots/' + page, {headers: headers}).map(res => res.json());
	}

	editPilot(token, id: string, pilot: Pilot) {
		let params = JSON.stringify(pilot);

		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.put(this.url + 'pilot/' + id, params, {headers: headers}).map(res => res.json());
	}

	deletePilot(token, id: string) {
		let headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': token
		});

		return this._http.delete(this.url + 'pilot/' + id, {headers: headers}).map(res => res.json());
	}
}