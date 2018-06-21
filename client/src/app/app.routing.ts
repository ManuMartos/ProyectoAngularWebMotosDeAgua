import { ModuleWithProviders } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { UserEditComponent } from './components/user-edit.component';

import { TeamListComponent } from './components/team-list.component';

import { HomeComponent } from './components/home.component';

import { TeamAddComponent } from './components/team-add.component';

import { TeamEditComponent } from './components/team-edit.component';

import { TeamDetailComponent } from './components/team-detail.component';

import { PilotListComponent } from './components/pilot-list.component';

import { PilotAddComponent } from './components/pilot-add.component';

import { PilotDetailComponent } from './components/pilot-detail.component';

import { PilotEditComponent } from './components/pilot-edit.component';

const appRoutes: Routes = [
	{path: '', component: HomeComponent },
	{path: 'teams/:page', component: TeamListComponent },
	{path: 'pilots/:page', component: PilotListComponent },
	{path: 'crear-equipo', component: TeamAddComponent },
	{path: 'crear-piloto', component: PilotAddComponent },
	{path: 'editar-team/:id', component: TeamEditComponent },
	{path: 'editar-pilot/:id', component: PilotEditComponent },
	{path: 'equipo/:id', component: TeamDetailComponent },
	{path: 'piloto/:id', component: PilotDetailComponent },
	{path: 'mis-datos', component: UserEditComponent },
	{path: '**', component: HomeComponent }
];

// exportar la configuración de las rutas
export const appRoutingProviders: any[] = [];

// exportar la configuración del modulo de rutas
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);