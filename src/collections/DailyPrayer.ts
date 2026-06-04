import type { CollectionConfig } from 'payload';
import { contentCollectionAccess } from '../access';

const MONTH_LABELS: Record<string, string> = {
	'1': 'January',
	'2': 'February',
	'3': 'March',
	'4': 'April',
	'5': 'May',
	'6': 'June',
	'7': 'July',
	'8': 'August',
	'9': 'September',
	'10': 'October',
	'11': 'November',
	'12': 'December',
};

export const DailyPrayer: CollectionConfig = {
	slug: 'daily-prayer',
	labels: {
		singular: 'Daily Prayer',
		plural: 'Daily Prayers',
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'month', 'year', 'createdAt'],
		description:
			'Manage daily prayer entries by month. Create one entry per month and add daily prayers for each day.',
	},
	access: contentCollectionAccess,
	hooks: {
		// Create the human-readable title before every save
		beforeChange: [
			({ data }) => {
				if (data?.month && data?.year) {
					data.title = `${MONTH_LABELS[data.month]} ${data.year}`;
				}
				return data;
			},
		],
		afterRead: [
			async ({ doc }) => {
				if (!doc?.dailyPrayers) return;

				const prayersByDay: Record<string, { id: string; day: number }> = {};

				doc.dailyPrayers.forEach((prayer: { id: string; day: number }) => {
					prayersByDay[prayer.day.toString()] = {
						id: prayer.id,
						day: prayer.day,
					};
				});

				doc.prayersByDay = prayersByDay;
			},
		],
	},
	fields: [
		// Computed field used as the display title
		{
			name: 'title',
			type: 'text',
			admin: {
				hidden: true, // never shown to editors; managed entirely by the hook
			},
		},
		{
			type: 'row',
			fields: [
				{
					name: 'month',
					type: 'select',
					required: true,
					options: [
						{ label: 'January', value: '1' },
						{ label: 'February', value: '2' },
						{ label: 'March', value: '3' },
						{ label: 'April', value: '4' },
						{ label: 'May', value: '5' },
						{ label: 'June', value: '6' },
						{ label: 'July', value: '7' },
						{ label: 'August', value: '8' },
						{ label: 'September', value: '9' },
						{ label: 'October', value: '10' },
						{ label: 'November', value: '11' },
						{ label: 'December', value: '12' },
					],
					admin: {
						width: '50%',
						description: 'Select the month for this prayer collection',
					},
				},
				{
					name: 'year',
					type: 'number',
					required: true,
					admin: {
						width: '50%',
						description: 'The year for this prayer collection',
					},
				},
			],
		},
		{
			name: 'dailyPrayers',
			type: 'array',
			required: true,
			admin: {
				description: 'Add a prayer entry for each day of the month',
			},
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'day',
							type: 'number',
							required: true,
							admin: {
								width: '10%',
								description: 'Day of the month',
							},
						},
						{
							name: 'prayer',
							type: 'richText',
							required: true,
							admin: {
								width: '90%',
								description: 'Enter daily prayer text',
							},
						},
					],
				},
			],
		},
	],
};
