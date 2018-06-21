import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[UserService]
})
export class AppComponent {
  public title = 'Web Campeonato Motos de Agua';

  public user: User; // usuario para el login

  public user_register : User; // usuario para el registro

  public identity; // para comprobar los datos del usuario logeado. Identificar al usuario logeado, ese usuario lo vamos a almacenar en el localstorage y se lo vamos a asignar a esta propiedad. Con esto, comprobamos si esta propiedad está rellena, entonces estamos logeados

  public token; // se utiliza para el servicio almacenando en el localstorage

  public errorMessage; // para mostrar los errores del formulario

  public alertRegister; // para mostrar los errores de registro

  public url:string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService:UserService) {
    // asignar un valor por defecto al usuario
    this.user = new User('','','','','','ROLE_USER','');

    this.user_register = new User('','','','','','ROLE_USER','');

    this.url = GLOBAL.url;
  }

  public ngOnInit(){
  	this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit() {
    //console.log(this.user);

    this._userService.signup(this.user).subscribe(
      response => {
        //console.log(response);

        this.identity = response.user; // el usuario logeado

        if (!this.identity._id) {
          alert("Usuario incorrecto");
        } else {
          // creamos una sesión en el localstorage
          // necesitamos conseguir el token para enviarlo en cada petición http
          // vamos a hacer la misma petición de login pero pasando el hash, para que el lugar de devolver el usuario, nos devuelva el token
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              this.token = response.token;
              if (this.token.length <= 0) {
                alert("El token es incorrecto");
              } else {
                // crear la sesión en el localstorage
                //console.log(this.token);

                localStorage.setItem('identity', JSON.stringify(this.identity));

                localStorage.setItem('token', this.token);

                // limipar el objeto user para que no aparezca al cerrar la sesión

                this.user = new User('','','','','','ROLE_USER','');
              }
            }, error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                  var body = JSON.parse(error._body);
                  this.errorMessage = body.message;
                  //console.log(error);
                }
            }
          );
        }
      }, error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          //console.log(error);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');

    localStorage.clear();

    this.identity = null;
    this.token = null;

    this._router.navigate(['/']); // se vaya a la página principal cuando se cierra sesión
  }

  onSubmitRegister() {
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        this.user_register = response.user;
        if (!this.user_register._id) {
          this.alertRegister = 'Error al registrar';
        } else {
          this.alertRegister = 'Usuario registrado. Identifícate con ' + this.user_register.email;

          // tenemos que volver a inicializar user_register para poder añadir nuevos usuarios
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      }, error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          //console.log(error);
        }
      }
    );
  }
}
