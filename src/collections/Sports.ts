import type { CollectionConfig } from 'payload';
import { contentCollectionAccess } from '../access';

export const Sports: CollectionConfig = {
	slug: 'sports',
	labels: {
		singular: 'Sports Article',
		plural: 'Sports',
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'marketArea', 'publishDate', 'status'],
		description: 'Local sports news and coverage for market areas',
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
				description: 'Select the market area this sports article belongs to',
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
					'URL-friendly identifier (auto-generated with date, e.g., "2025-11-26-article-title")',
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

						// Auto-generate slug from title and date if not provided
						if (!value && data?.title && data?.publishDate) {
							const date = new Date(data.publishDate);
							const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
							return `${dateStr}-${slugify(data.title)}`;
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
			required: true,
			admin: {
				description: 'A short summary of the sports article',
			},
		},
		{
			name: 'featuredImage',
			type: 'upload',
			relationTo: 'media',
			admin: {
				description: 'Featured image for the sports article',
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
