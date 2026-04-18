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
			name: 'active',
			type: 'checkbox',
			defaultValue: true,
			admin: {
				description:
					'Whether this market area is active and visible on the front end website sfti-radio.net',
			},
		},
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
			name: 'facebookUrl',
			label: 'Facebook Page URL',
			type: 'text',
			admin: {
				description:
					'Optional Facebook page URL for this market area. This will be rendered as a button with the Facebook icon on the front end website sfti-radio.net',
			},
		},
		{
			name: 'programSchedule',
			type: 'textarea',
			admin: {
				description:
					'Optional program schedule for the market area. Enter each time slot on a new line',
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
		{
			name: 'customStreamUrl',
			type: 'array',
			label: 'Custom Stream URLs',
			admin: {
				description: 'Custom stream URL associated with this market area',
			},
			fields: [
				{
					name: 'title',
					type: 'text',
					required: true,
					admin: {
						description:
							'Display name for this stream (e.g. "Main Stream", "Country Channel")',
					},
				},
				{
					name: 'url',
					type: 'text',
					required: true,
					admin: {
						description: 'Custom Stream URL',
					},
				},
			],
		},
		{
			name: 'streamIds',
			type: 'array',
			label: 'Live 365 Stream IDs',
			admin: {
				description: 'Live 365 Stream IDs associated with this market area',
			},
			fields: [
				{
					name: 'title',
					type: 'text',
					required: true,
					admin: {
						description:
							'Display name for this stream (e.g. "Main Stream", "Country Channel")',
					},
				},
				{
					name: 'streamId',
					type: 'text',
					required: true,
					admin: {
						description: 'Live 365 Stream ID',
					},
				},
			],
		},
	],
};
