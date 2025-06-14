import { Routes } from '@angular/router';
import { AuthLogService } from './services/auth-log.service';
import { AuthAdminService } from './services/auth-admin.service';
import { AuthEditorService } from './services/auth-editor.service';
import { AuthUserService } from './services/auth-user.service';

import { WelcomeComponent } from './pages/welcome/welcome.component';
import { PageNotFoundComponent } from './pages/auth/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { MainComponent } from './pages/main/main.component';
import { ExampleComponent } from './pages/example/example.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AccountListComponent } from './pages/admin/account-list/account-list.component';
import { AdminDetailAccountComponent } from './pages/admin/detail-account/detail-account.component';
import { ItemListComponent } from './pages/admin/item-list/item-list.component';
import { DetailItemComponent } from './pages/admin/detail-item/detail-item.component';
import { CategoryListAdminComponent } from './pages/admin/category-list/category-list.component';

import { DetailAccountUserComponent } from './pages/user/detail-account/detail-account.component';
import { DetailItemUserComponent } from './pages/user/detail-item/detail-item.component';
import { CategoryListUserComponent } from './pages/user/category-list/category-list.component';
import { UpdateAccountComponent } from './pages/admin/update-account/update-account.component';
import { UpdateAccountUserComponent } from './pages/user/update-account-user/update-account-user.component';
import { HomeComponent } from './pages/home/home.component';
import { UpdateItemComponent } from './pages/admin/update-item/update-item.component';
import { SearchResultsComponent } from './pages/user/search-result/search-result.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'example',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'example',
        title: 'Example',
        component: ExampleComponent,
        canActivate: [AuthLogService]
      },
      {
        path: 'home',
        title: 'Home',
        component: HomeComponent,
      },
      {
        path: 'notification',
        title: 'Notification',
        component: NotificationComponent
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        component: DashboardComponent,
        canActivate: [AuthAdminService]
      },
      {
        path: 'account-list/:roleName',
        title: 'Account list admin',
        component: AccountListComponent,
        canActivate: [AuthEditorService]
      },
      { path: 'detail-account/:idCard',
        title: 'Detail account admin',
        component: AdminDetailAccountComponent,
        canActivate: [AuthEditorService]
      },
      { path: 'update-account/:idCard',
        title: 'Update account admin',
         component: UpdateAccountComponent,
         canActivate: [AuthEditorService]
      },
      {
        path: 'item-list',
        title: 'Item list Admin',
        component: ItemListComponent,
        canActivate: [AuthEditorService]
      },
      {
        path: 'item-list-all',
        title: 'All Product',
        component: ItemListComponent,
        canActivate: [AuthEditorService]
      },
      {
        path: 'detail-item/:id',
        title: 'Detail item Admin',
        component: DetailItemComponent,
        canActivate: [AuthEditorService]
      },
      {
        path: 'update-item/:id',
        title: 'Update item Admin',
        component: UpdateItemComponent,
        canActivate: [AuthEditorService]
      },
      {
        path: 'category-list',
        title: 'Category list admin',
        component: CategoryListAdminComponent,
        canActivate: [AuthAdminService]
      },


      {
        path: 'account-detail/:idCard',
        title: 'Detail account User',
        component: DetailAccountUserComponent,
        canActivate: [AuthUserService]
      },
      {
        path: 'account-update/:idCard',
        title: 'Update account User',
        component: UpdateAccountUserComponent,
        canActivate: [AuthUserService]
      },
      {
        path: 'item-detail',
        title: 'Detail item User',
        component: DetailItemUserComponent,
        canActivate: [AuthUserService]
      },
      {
        path: 'category-list-user',
        title: 'Category list User',
        component: CategoryListUserComponent,
      },
      {
        path: 'search',
        title: 'Search results',
        component: SearchResultsComponent,
      },
      {
        path: 'about-us',
        title: 'About Us',
        component: AboutUsComponent,
      },
      {
        path: 'blog',
        title: 'Welcome to blog page',
        component: BlogComponent,
      },
      {
        path: 'shopping-cart',
        title: 'Shopping Cart',
        component: ShoppingCartComponent,
        canActivate: [AuthUserService]
      },
    ]
  },
  {
    path: 'welcome',
    title: 'Welcome to Rating Management',
    component: WelcomeComponent,
  },
  {
    path: '404',
    title: '404 - Page Not Found',
    component: PageNotFoundComponent,
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
    canActivate: [AuthLogService]
  },
  {
    path: 'register',
    title: 'Register',
    component: RegisterComponent,
    canActivate: [AuthLogService]
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
