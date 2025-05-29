// Remove the import for UserDetailsComponent
// Remove the route for user details

const routes: Routes = [
  // Other routes remain
  { path: 'user-management', component: UserManagementComponent },
  // Remove this route:
  // { path: 'user-management/user/:id', component: UserDetailsComponent },
];