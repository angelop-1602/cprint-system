// src/app/route/routes.ts

export interface RoutesType {
  HOME: string;
  DASHBOARD: string;
  REC: string;
  REC_FORM: string;
  PUB_FORM: string;
  REC_EDIT: string;
  REC_VIEW: string;
}

export const Routes: RoutesType = {
  HOME:'/',
  DASHBOARD: '/pages/dashboard',
  REC: '/pages/rec',
  REC_FORM: '/pages/rec/rec_form',
  PUB_FORM: '/pages/publication/pub_form',
  REC_EDIT: '/pages/rec/rec_edit', 
  REC_VIEW:  '/pages/rec/rec_view',
};
