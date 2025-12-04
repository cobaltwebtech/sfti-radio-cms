import type { CollectionConfig } from 'payload';
import { adminOnlyCollectionAccess, publicReadAccess } from '../access';

export const MarketArea: CollectionConfig = {
	slug: 'market-areas',
	labels: {
		singular: 'Market Area',
		plural: 'Market Areas',
	},
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'type', 'slug', 'createdAt'],
		description: 'Geographic areas for organizing local content',
	},
	access: {
		...adminOnlyCollectionAccess,
		read: publicReadAccess, // Allow public read access for market areas
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			admin: {
				description: 'Market Area name (e.g. Dublin, Erath County, or 76446)',
			},
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			admin: {
				description:
					'URL-friendly identifier. Leave this blank when creating a new market area since it will be auto-generated from the Name.',
			},
			hooks: {
				beforeValidate: [
					({ value, data }) => {
						// Helper function to slugify a string
						const slugify = (str: string) =>
							str
								.toLowerCase()
								.trim()
								.replace(/[^a-z0-9]+/g, '-')
								.replace(/^-|-$/g, '');

						// Auto-generate slug from name if not provided
						if (!value && data?.name) {
							return slugify(data.name);
						}

						// Always slugify the value if provided (clean up spaces, special chars)
						if (value) {
							return slugify(value);
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
				description: 'Optional description of the market area',
			},
		},
		{
			name: 'active',
			type: 'checkbox',
			defaultValue: true,
			admin: {
				description:
					'Whether this market area is active and visible on the front end',
			},
		},
		{
			name: 'surroundingAreas',
			type: 'array',
			label: 'Surrounding Areas',
			admin: {
				description:
					'Add nearby towns, suburbs, or communities that are part of this market area. These will be used for search functionality.',
			},
			fields: [
				{
					name: 'name',
					type: 'text',
					required: true,
					admin: {
						description: 'Name of the surrounding town, suburb, or community',
					},
				},
			],
		},
	],
};
