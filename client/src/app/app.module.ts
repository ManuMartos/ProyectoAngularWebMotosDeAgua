import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { UserEditComponent } from './components/user-edit.component';

import { routing, appRoutingProviders } from './app.routing';

import { TeamListComponent } from './components/team-list.component';

import { PilotListComponent } from './components/pilot-list.component';

import { HomeComponent } from './components/home.component';

import { TeamAddComponent } from './components/team-add.component';

import { PilotAddComponent } from './components/pilot-add.component';

import { TeamEditComponent } from './components/team-edit.component';

import { PilotEditComponent } from './components/pilot-edit.component';

import { TeamDetailComponent } from './components/team-detail.component';

import { PilotDetailComponent } from './components/pilot-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    TeamListComponent,
    HomeComponent,
    TeamAddComponent,
    TeamEditComponent,
    TeamDetailComponent,
    PilotListComponent,
    PilotAddComponent,
    PilotDetailComponent,
    PilotEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
