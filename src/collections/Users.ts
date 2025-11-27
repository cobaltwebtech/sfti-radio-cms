import type { CollectionConfig } from 'payload';
import { isAdminFieldLevel, usersCollectionAccess } from '../access';

export const Users: CollectionConfig = {
	slug: 'users',
	admin: {
		useAsTitle: 'email',
		defaultColumns: ['email', 'role', 'createdAt'],
		description: 'CMS users with role-based access control',
		// Hide Users collection from staff - only admins can see it in the sidebar
		hidden: ({ user }) => user?.role !== 'admin',
	},
	auth: true,
	access: usersCollectionAccess,
	fields: [
		{
			name: 'role',
			type: 'select',
			required: true,
			defaultValue: 'staff',
			options: [
				{ label: 'Admin', value: 'admin' },
				{ label: 'Staff', value: 'staff' },
			],
			admin: {
				description: 'User role determines access permissions in the CMS',
			},
			access: {
				// Only admins can change roles
				update: isAdminFieldLevel,
			},
		},
		{
			name: 'name',
			type: 'text',
			admin: {
				description: 'Display name for the user',
			},
		},
	],
};
