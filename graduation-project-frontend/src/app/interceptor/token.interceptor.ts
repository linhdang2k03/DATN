import { HttpInterceptorFn} from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined') {
    const myToken = localStorage.getItem('access_token');
    const cloneRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${myToken}`
      }
    });
    return next(cloneRequest);
  } else {
    return next(req);
  }
};


