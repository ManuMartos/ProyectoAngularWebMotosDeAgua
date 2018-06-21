// librería de inyección de dependencias
import { Injectable } from '@angular/core';

// necesarias para las peticiones http
import { Http, Response, Headers } from '@angular/http';

// librería sirve para mapear objetos
import 'rxjs/add/operator/map';

// sirve para recoger las respuestas de las peticiones ajax al servidor
import { Observable } from 'rxjs/Observable';

import { GLOBAL } from './global';

// para permitir que mediante la inyección de dependencias podamos inyectar este servicio, es decir, esta clase en otros componentes o en otras clases
@Injectable()
export class UserService {

	public url:string;

	public identity;

	public token;

	// inyectamos la dependencia http para poder hacer peticiones http
	constructor(private _http: Http) {
		this.url = GLOBAL.url;
	}

	// método para login
	// recibe el usuario que vamos a logear
	// recibe un parámetro opcional gethash
	// si tuviera algo necesitamos que el api rest nos devuelva el hash y no el objeto del usuario logueado
	public signup(user_to_login, gethash = null){
		if (gethash != null) {
			user_to_login.gethash = gethash;
		}

		// convertir a un string el objeto usuario que recibimos
		let json = JSON.stringify(user_to_login);
		let params = json;

		// configuramos los headers para la petición
		let headers = new Headers({'Content-Type':'application/json'});

		// petición al backend usando el módulo http y su método post. Con map mapeo la respuesta en formato json
		return this._http.post(this.url + 'login', params, {headers: headers}).map(res => res.json());
	}

	// devuelve el identity del localstorage
	getIdentity() {
		let identity = JSON.parse(localStorage.getItem('identity'));

		if (identity != "undefined") {
			this.identity = identity;
		} else {
			this.identity = null;
		}

		return this.identity;
	}

	// devuelve el token del localstorage
	getToken() {
		let token = localStorage.getItem('token');

		if (token != "undefined") {
			this.token = token;
		} else {
			this.token = null;
		}

		return this.token;
	}

	register(user_to_register) {
		let params = JSON.stringify(user_to_register);

		// configuramos los headers para la petición
		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url + 'register', params, {headers: headers}).map(res => res.json());
	}

	// actualizar datos del usuario
	updateUser(user_to_update) {
		// convertir a string el objeto que hemos recibido
		let params = JSON.stringify(user_to_update);

		// configuramos los headers para la petición
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': this.getToken()
		});

		// llamada http con put pasando el id del usuario a actualizar
		return this._http.put(this.url + 'update-user/' + user_to_update._id, params, {headers:headers}).map(res => res.json());
	}
}