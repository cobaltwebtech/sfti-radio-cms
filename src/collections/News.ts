import type { CollectionConfig } from 'payload';
import { contentCollectionAccess } from '../access';

export const News: CollectionConfig = {
	slug: 'news',
	labels: {
		singular: 'News Article',
		plural: 'News',
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'marketArea', 'publishDate', 'status'],
		description: 'Local news articles for market areas',
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
				description: 'Select the market area this news belongs to',
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
				description: 'A short summary of the news article',
			},
		},
		{
			name: 'featuredImage',
			type: 'upload',
			relationTo: 'media',
			admin: {
				description: 'Featured image for the news article',
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
