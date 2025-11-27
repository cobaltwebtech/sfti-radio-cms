import type { CollectionConfig } from 'payload';
import { contentCollectionAccess } from '../access';

export const Churches: CollectionConfig = {
	slug: 'churches',
	labels: {
		singular: 'Church',
		plural: 'Churches',
	},
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'marketArea', 'denomination', 'status'],
		description: 'Local churches and places of worship for market areas',
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
				description: 'Select the market area this church belongs to',
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
				description: 'URL-friendly identifier for the church',
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
			name: 'denomination',
			type: 'text',
			admin: {
				description:
					'Denomination or affiliation of the church. Leave blank if none or enter "non-denominational".',
			},
		},
		{
			name: 'featuredImage',
			type: 'upload',
			relationTo: 'media',
			admin: {
				description: 'Photo of the church',
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
						description: 'Contact phone number',
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
						description: 'Church website URL',
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
						description: 'Full address of the church',
					},
				},
			],
		},
		{
			name: 'serviceTimes',
			type: 'array',
			admin: {
				description: 'Regular service times',
			},
			fields: [
				{
					name: 'day',
					type: 'select',
					options: [
						{ label: 'Sunday', value: 'sunday' },
						{ label: 'Monday', value: 'monday' },
						{ label: 'Tuesday', value: 'tuesday' },
						{ label: 'Wednesday', value: 'wednesday' },
						{ label: 'Thursday', value: 'thursday' },
						{ label: 'Friday', value: 'friday' },
						{ label: 'Saturday', value: 'saturday' },
					],
				},
				{
					name: 'time',
					type: 'text',
					admin: {
						description: 'Service time (e.g., "9:00 AM")',
					},
				},
				{
					name: 'serviceName',
					type: 'text',
					admin: {
						description: 'Name of service (e.g., "Morning Worship")',
					},
				},
			],
		},
		{
			name: 'content',
			type: 'richText',
			admin: {
				description: 'Additional information about the church',
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
