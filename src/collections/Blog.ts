import type { CollectionConfig } from 'payload';
import { contentCollectionAccess, isAdminFieldLevel } from '../access';

export const Blog: CollectionConfig = {
	slug: 'blog',
	labels: {
		singular: 'Blog',
		plural: 'Blog',
	},
	admin: {
		useAsTitle: 'title',
	},
	access: contentCollectionAccess,
	versions: {
		drafts: {
			autosave: true,
		},
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			admin: {
				description:
					'URL-friendly identifier (auto-generated with date, e.g., "2025-11-26-blog-title")',
			},
			hooks: {
				beforeValidate: [
					({ value, data }) => {
						if (!value && data?.title && data?.publishDate) {
							const date = new Date(data.publishDate);
							const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
							const titleSlug = data.title
								.toLowerCase()
								.replace(/[^a-z0-9]+/g, '-')
								.replace(/^-|-$/g, '');
							return `${dateStr}-${titleSlug}`;
						}
						return value;
					},
				],
			},
		},
		{
			name: 'description',
			type: 'textarea',
			required: true,
			admin: {
				description: 'A short description of the blog post',
			},
		},
		{
			name: 'author',
			type: 'relationship',
			relationTo: 'users',
			required: true,
			admin: {
				description:
					'Author of the blog post (automatically set to the creator)',
				// Make field read-only in the UI for staff
				readOnly: true,
			},
			access: {
				// Only admins can update the author field
				update: isAdminFieldLevel,
			},
			hooks: {
				beforeValidate: [
					({ value, req, operation }) => {
						// Auto-set author to current user on create
						if (operation === 'create' && !value && req.user) {
							return req.user.id;
						}
						return value;
					},
				],
			},
		},
		{
			name: 'publishDate',
			type: 'date',
			required: true,
			defaultValue: () => new Date().toISOString(),
			admin: {
				date: {
					pickerAppearance: 'dayOnly',
					displayFormat: 'MMM d, yyyy',
				},
			},
		},
		{
			name: 'content',
			type: 'richText',
			required: true,
		},
	],
};
