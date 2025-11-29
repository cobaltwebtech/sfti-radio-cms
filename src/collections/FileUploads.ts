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
	hooks: {
		// Auto-link file to form submission if submissionId is provided
		afterChange: [
			async ({ doc, req, operation }) => {
				// Only process on create and if we have a pending submission link
				if (operation === 'create' && doc.pendingSubmissionId) {
					try {
						// Find the form submission and update it to reference this file
						const submission = await req.payload.findByID({
							collection: 'form-submissions',
							id: doc.pendingSubmissionId,
						});

						if (submission) {
							// Add file reference to submission data
							const updatedSubmissionData = [
								...(submission.submissionData || []),
								{
									field: 'uploadedFile',
									value: String(doc.id),
								},
							];

							await req.payload.update({
								collection: 'form-submissions',
								id: doc.pendingSubmissionId,
								data: {
									submissionData: updatedSubmissionData,
								},
							});
						}
					} catch (error) {
						console.error('Error linking file to submission:', error);
					}
				}
				return doc;
			},
		],
	},
	fields: [
		{
			name: 'formSubmission',
			type: 'relationship',
			relationTo: 'form-submissions',
			hasMany: false,
			admin: {
				description: 'The form submission this file is attached to',
				readOnly: true,
			},
		},
		{
			name: 'submissionId',
			type: 'text',
			admin: {
				description:
					'Legacy text reference to form submission (use formSubmission relationship instead)',
				hidden: true,
			},
		},
		{
			name: 'pendingSubmissionId',
			type: 'text',
			admin: {
				description:
					'Temporary field to link file to submission after upload (not stored)',
				hidden: true,
			},
			hooks: {
				// Clear this field after processing - it's only used during upload
				afterRead: [() => undefined],
			},
		},
		{
			name: 'fieldName',
			type: 'text',
			admin: {
				description: 'The form field name this upload corresponds to',
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
