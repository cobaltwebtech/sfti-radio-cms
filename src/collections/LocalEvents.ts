import type { CollectionConfig } from 'payload';
import { contentCollectionAccess } from '../access';

export const LocalEvents: CollectionConfig = {
	slug: 'local-events',
	labels: {
		singular: 'Local Event',
		plural: 'Local Events',
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'marketArea', 'eventDate', 'status'],
		description: 'Community events and happenings for market areas',
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
				description: 'Select the market area this event belongs to',
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
					'URL-friendly identifier (auto-generated with date, e.g., "2025-12-02-event-title")',
			},
			hooks: {
				beforeValidate: [
					({ value, data }) => {
						if (!value && data?.title && data?.eventDate) {
							const date = new Date(data.eventDate);
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
				description: 'A short summary of the event',
			},
		},
		{
			name: 'featuredImage',
			type: 'upload',
			relationTo: 'media',
			admin: {
				description: 'Featured image or flyer for the event',
			},
		},
		{
			name: 'eventDate',
			type: 'date',
			required: true,
			admin: {
				date: {
					pickerAppearance: 'dayAndTime',
					displayFormat: 'MMM d, yyyy h:mm a',
				},
				description: 'Date and time of the event',
			},
		},
		{
			name: 'eventEndDate',
			type: 'date',
			admin: {
				date: {
					pickerAppearance: 'dayAndTime',
					displayFormat: 'MMM d, yyyy h:mm a',
				},
				description: 'End date and time (for multi-day events)',
			},
		},
		{
			name: 'location',
			type: 'group',
			fields: [
				{
					name: 'venueName',
					type: 'text',
					admin: {
						description: 'Name of the venue',
					},
				},
				{
					name: 'address',
					type: 'textarea',
					admin: {
						description: 'Full address of the event',
					},
				},
			],
		},
		{
			name: 'eventType',
			type: 'select',
			options: [
				{ label: 'Community', value: 'community' },
				{ label: 'Festival', value: 'festival' },
				{ label: 'Concert', value: 'concert' },
				{ label: 'Fundraiser', value: 'fundraiser' },
				{ label: 'Market', value: 'market' },
				{ label: 'Workshop', value: 'workshop' },
				{ label: 'Other', value: 'other' },
			],
			admin: {
				description: 'Type of event',
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
				{ label: 'Cancelled', value: 'cancelled' },
				{ label: 'Archived', value: 'archived' },
			],
			admin: {
				position: 'sidebar',
			},
		},
	],
};
