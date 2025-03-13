import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedGuard: CanActivateFn = (route, state) => {
  const router= inject(Router)
  let logged=localStorage.getItem('logged')
  let type=localStorage.getItem('type')
  if(
    logged!=null && type!= null && (type=='vlasnik' || type=='dekorater'|| type=='admin')
  ) return true;
  else {
    router.navigate(['/login'])
    console.log(logged,type)
    return false;
  }
};
