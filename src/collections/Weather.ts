import type { CollectionConfig } from 'payload';
import { contentCollectionAccess } from '../access';

export const Weather: CollectionConfig = {
	slug: 'weather',
	labels: {
		singular: 'Weather Update',
		plural: 'Weather',
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'marketArea', 'publishDate', 'status'],
		description: 'Weather updates and forecasts for market areas',
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
				description: 'Select the market area this weather update belongs to',
			},
		},
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
					'URL-friendly identifier (auto-generated with date, e.g., "2025-11-26-weather-title")',
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
				description: 'A short summary of the weather update',
			},
		},
		{
			name: 'content',
			type: 'richText',
			required: true,
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
