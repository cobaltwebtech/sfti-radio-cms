import type { CollectionConfig } from 'payload';
import { adminOnlyDelete, isLoggedIn, publicReadAccess } from '../access';

export const FileUploads: CollectionConfig = {
	slug: 'file-uploads',
	labels: {
		singular: 'File Upload',
		plural: 'File Uploads',
	},
	upload: {
		mimeTypes: [
			'image/jpeg',
			'image/png',
			'application/pdf',
			'audio/mpeg',
			'audio/wav',
		],
	},
	access: {
		read: publicReadAccess,
		create: publicReadAccess, // Allow public uploads from forms
		update: isLoggedIn,
		delete: adminOnlyDelete,
	},
	fields: [
		{
			name: 'submissionId',
			type: 'text',
			admin: {
				description: 'Reference to the form submission this file belongs to',
			},
		},
		{
			name: 'submittedAt',
			type: 'date',
			label: 'Submitted At',
			admin: {
				readOnly: true,
				date: {
					pickerAppearance: 'dayAndTime',
					displayFormat: 'MMM d, yyyy h:mm a',
				},
				description: 'Timestamp when this file was uploaded',
			},
			defaultValue: () => new Date().toISOString(),
		},
	],
};
