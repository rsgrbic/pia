import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const router= inject(Router)
  if(
    localStorage.getItem("logged")!=null && localStorage.getItem("type")=='admin'
  ) return true;
  else {
    router.navigate(['/login'])
    return false;
  }
};
