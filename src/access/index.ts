import type { Access, AccessArgs, FieldAccess } from 'payload';

export type UserRole = 'admin' | 'staff';

// Helper to get user role safely
const getUserRole = (user: AccessArgs['req']['user']): UserRole | undefined => {
	return (user as { role?: UserRole } | undefined)?.role;
};

// Check if user is an admin
export const isAdmin: Access = ({ req: { user } }) => {
	return getUserRole(user) === 'admin';
};

// Check if user is logged in (admin or staff)
export const isLoggedIn: Access = ({ req: { user } }) => {
	return Boolean(user);
};

// Admins have full access, staff can only read
export const isAdminOrReadOnly: Access = ({ req: { user } }) => {
	if (!user) return false;
	if (getUserRole(user) === 'admin') return true;
	return false; // Staff cannot access by default
};

// Field-level access: only admins can edit
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
	return getUserRole(user) === 'admin';
};

// Anyone can read, only logged in users can do other operations
export const publicReadAccess: Access = () => true;

// Staff can create and update, but only admins can delete
export const staffCanCreateAndUpdate: Access = ({ req: { user } }) => {
	return Boolean(user); // Any logged in user (admin or staff)
};

// Only admins can delete
export const adminOnlyDelete: Access = ({ req: { user } }) => {
	return getUserRole(user) === 'admin';
};

// Access control object for content collections (Blog, News, Sports, etc.)
// Staff can: create, read, update
// Only admins can: delete
export const contentCollectionAccess = {
	read: publicReadAccess,
	create: staffCanCreateAndUpdate,
	update: staffCanCreateAndUpdate,
	delete: adminOnlyDelete,
};

// Access control for admin-only collections (Users, MarketArea)
// Only admins have full access
export const adminOnlyCollectionAccess = {
	read: isAdmin,
	create: isAdmin,
	update: isAdmin,
	delete: isAdmin,
};

// Access control for Media collection
// Staff can: create, read, update media
// Only admins can: delete media
export const mediaCollectionAccess = {
	read: publicReadAccess,
	create: staffCanCreateAndUpdate,
	update: staffCanCreateAndUpdate,
	delete: adminOnlyDelete,
};

// Users collection access - special case
// Staff can read users (to see who created content)
// Only admins can create, update, delete users
export const usersCollectionAccess = {
	read: isLoggedIn,
	create: isAdmin,
	update: (({
		req: { user },
		id,
	}: AccessArgs<'update'> & { id?: string | number }) => {
		if (!user) return false;
		const role = getUserRole(user);
		// Admins can update anyone
		if (role === 'admin') return true;
		// Staff can only update their own profile
		return user.id === id;
	}) as Access,
	delete: isAdmin,
};
