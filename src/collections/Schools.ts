import type { CollectionConfig } from 'payload';
import { contentCollectionAccess } from '../access';

export const Schools: CollectionConfig = {
	slug: 'schools',
	labels: {
		singular: 'School',
		plural: 'Schools',
	},
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'marketArea', 'schoolType', 'status'],
		description: 'Local schools and educational institutions for market areas',
	},
	access: contentCollectionAccess,
	versions: {
		drafts: {
			autosave: true,
		},
	},
	fields: [
		{
			name: 'marketArea',
			type: 'relationship',
			relationTo: 'market-areas',
			required: true,
			admin: {
				description: 'Select the market area this school belongs to',
			},
		},
		{
			name: 'name',
			type: 'text',
			required: true,
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			admin: {
				description: 'URL-friendly identifier for the school',
			},
			hooks: {
				beforeValidate: [
					({ value, data }) => {
						if (!value && data?.name) {
							return data.name
								.toLowerCase()
								.replace(/[^a-z0-9]+/g, '-')
								.replace(/^-|-$/g, '');
						}
						return value;
					},
				],
			},
		},
		{
			name: 'description',
			type: 'textarea',
			admin: {
				description: 'A brief description of the school',
			},
		},
		{
			name: 'featuredImage',
			type: 'upload',
			relationTo: 'media',
			admin: {
				description: 'Photo of the school',
			},
		},
		{
			name: 'district',
			type: 'text',
			admin: {
				description: 'School district name',
			},
		},
		{
			name: 'contact',
			type: 'group',
			fields: [
				{
					name: 'phone',
					type: 'text',
					admin: {
						description: 'Main phone number',
					},
				},
				{
					name: 'email',
					type: 'email',
					admin: {
						description: 'Contact email address',
					},
				},
				{
					name: 'website',
					type: 'text',
					admin: {
						description: 'School website URL',
					},
				},
			],
		},
		{
			name: 'location',
			type: 'group',
			fields: [
				{
					name: 'address',
					type: 'textarea',
					admin: {
						description: 'Full address of the school',
					},
				},
			],
		},
		{
			name: 'grades',
			type: 'text',
			admin: {
				description: 'Grade levels served (e.g., "K-5", "9-12")',
			},
		},
		{
			name: 'content',
			type: 'richText',
			admin: {
				description: 'Additional information about the school',
			},
		},
		{
			name: 'status',
			type: 'select',
			defaultValue: 'draft',
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Published', value: 'published' },
				{ label: 'Archived', value: 'archived' },
			],
			admin: {
				position: 'sidebar',
			},
		},
	],
};
