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
export class UploadService {

	public url:string;

	// inyectamos la dependencia http para poder hacer peticiones http
	constructor(private _http: Http) {
		this.url = GLOBAL.url;
	}

	// método para subir el fichero
	makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string)
	{
		return new Promise(function(resolve, reject) {
			// crear un objeto formData para simular el comportamiento de un formulario
			var formData:any = new FormData();

			// variable para hacer la petición a la api
			var xhr = new XMLHttpRequest();

			// recorrer los ficheros del array y los voy a añadir al formData
			for(var i=0; i<files.length; i++) {
				formData.append('image', files[i], files[i].name);
			}

			// comprobar si la petición está lista para poder realizarse
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(xhr.response);
					}
				}
			}

			// lanzamos la petición
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);
		});
	}
}