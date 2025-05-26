import { RolePermissions } from "./roles-permission";
import { PermissionTypes } from "../enums/role.enum";
import { UnauthorisedExpection } from "./appError";

export const roleGuard = (
  role: keyof typeof RolePermissions,
  requiredPermissions: PermissionTypes[]
) => {
  const permissions = RolePermissions[role];
  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );

  if (!hasPermission) {
    throw new UnauthorisedExpection(
      "You do not have the necessary permission to perform this opreation"
    );
  }
};
