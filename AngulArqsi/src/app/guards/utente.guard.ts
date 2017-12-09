import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class UtenteGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate() {
        if (this.authenticationService.userInfo)
            if (this.authenticationService.userInfo.utente)
                return true;

        this.router.navigate(['/Login', { u: 'no' }]);
        return false;
    }
}