import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const dekorGuardGuard: CanActivateFn = (route, state) => {
  const router= inject(Router)
  if(
    localStorage.getItem("logged")!=null && localStorage.getItem("type")=='dekorater'
  ) return true;
  else {
    router.navigate(['/login'])
    return false;
  }
};
