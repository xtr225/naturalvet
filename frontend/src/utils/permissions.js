export function canAccessMenuItem(item, user) {
  const roles = item.roles ?? [];
  const permissions = item.permissions ?? [];

  if (roles.length === 0 && permissions.length === 0) {
    return true;
  }

  const userRoles = user?.roles ?? [];
  const userPermissions = user?.permissions ?? [];
  const hasRole = roles.length === 0 || roles.some((role) => userRoles.includes(role));
  const hasPermission =
    permissions.length === 0 ||
    permissions.some((permission) => userPermissions.includes(permission));

  return hasRole && hasPermission;
}

export function canAccessRoute({ roles = [], permissions = [] }, auth) {
  const hasRole = roles.length === 0 || roles.some((role) => auth.hasRole(role));
  const hasPermission =
    permissions.length === 0 ||
    permissions.some((permission) => auth.hasPermission(permission));

  return hasRole && hasPermission;
}
