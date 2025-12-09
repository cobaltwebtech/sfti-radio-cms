// storage-adapter-import-placeholder

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	type CloudflareContext,
	getCloudflareContext,
} from '@opennextjs/cloudflare';
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite';
import { resendAdapter } from '@payloadcms/email-resend';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { searchPlugin } from '@payloadcms/plugin-search';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { r2Storage } from '@payloadcms/storage-r2';
import type { Block, PayloadComponent } from 'payload';
import { buildConfig } from 'payload';
import type { GetPlatformProxyOptions } from 'wrangler';
import { isAdmin, isLoggedIn, publicReadAccess } from './access';
import { Blog } from './collections/Blog';
import { Churches } from './collections/Churches';
import { FileUploads } from './collections/FileUploads';
import { LocalEvents } from './collections/LocalEvents';
import { MarketArea } from './collections/MarketArea';
import { Media } from './collections/Media';
import { News } from './collections/News';
import { Schools } from './collections/Schools';
import { Sports } from './collections/Sports';
import { Users } from './collections/Users';

const Logo: PayloadComponent = '@/app/components/Logo';
const Icon: PayloadComponent = '@/app/components/Icon';
const DownloadFilesField: PayloadComponent =
	'@/app/components/DownloadFilesField';
const FormSubmissionView: PayloadComponent =
	'@/app/components/FormSubmissionView';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Detect if we're in a build environment (Cloudflare Pages build or local build)
// During build, we need to use local wrangler proxy without remote bindings
// CF_PAGES is set by Cloudflare Pages during build
const isCFPagesBuild = process.env.CF_PAGES === '1';
const isLocalBuild = process.argv.includes('build');
const isBuildPhase = isCFPagesBuild || isLocalBuild;
const isPayloadCommand = process.argv.find((value) =>
	value.match(/^(generate|migrate):?/),
);
const isProduction = process.env.NODE_ENV === 'production';

// Use getCloudflareContext (async) only at actual runtime in production (Worker execution)
// Not during build phase (CF Pages build or local build)
const isWorkerRuntime = isProduction && !isBuildPhase;

// For local dev, use 'dev' environment which has remote bindings for persistent D1/R2 data
// For builds (local or CF Pages), use default environment without remote bindings
const useDevEnvironment = !isBuildPhase && !isProduction;

const cloudflare =
	isPayloadCommand || !isWorkerRuntime
		? await getCloudflareContextFromWrangler({
				useDevEnvironment,
				useRemoteBindings: isProduction,
			})
		: await getCloudflareContext({ async: true });
// Custom upload field block for form builder
const UploadBlock: Block = {
	slug: 'upload',
	labels: {
		singular: 'File Upload',
		plural: 'File Uploads',
	},
	fields: [
		{
			type: 'row',
			fields: [
				{
					name: 'name',
					type: 'text',
					label: 'Name (lowercase, no special characters)',
					required: true,
					admin: {
						width: '50%',
					},
				},
				{
					name: 'label',
					type: 'text',
					label: 'Label',
					admin: {
						width: '50%',
					},
				},
			],
		},
		{
			type: 'row',
			fields: [
				{
					name: 'width',
					type: 'number',
					label: 'Field Width (percentage)',
					admin: {
						width: '50%',
					},
				},
				{
					name: 'required',
					type: 'checkbox',
					label: 'Required',
					admin: {
						width: '50%',
					},
				},
			],
		},
	],
};

export default buildConfig({
	admin: {
		user: Users.slug,
		autoRefresh: true,
		importMap: {
			baseDir: path.resolve(dirname),
		},
		meta: {
			titleSuffix: ' - SFTI Radio CMS',
			icons: [
				{
					rel: 'icon',
					type: 'image/svg',
					url: '/icons/favicon.svg',
				},
			],
		},
		components: {
			graphics: {
				Logo,
				Icon,
			},
		},
	},
	collections: [
		MarketArea,
		Users,
		Media,
		Blog,
		News,
		Sports,
		LocalEvents,
		Churches,
		Schools,
		FileUploads,
	],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || '',
	email: resendAdapter({
		apiKey: process.env.RESEND_API_KEY || '',
		defaultFromAddress: 'notify@contact.cobaltweb.tech',
		defaultFromName: 'SFTI Radio CMS',
	}),
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	db: sqliteD1Adapter({
		binding: cloudflare.env.D1,
		readReplicas: 'first-primary',
	}),
	plugins: [
		// storage-adapter-placeholder
		r2Storage({
			bucket: cloudflare.env.R2_CMS_MEDIA,
			collections: { media: true },
		}),
		r2Storage({
			bucket: cloudflare.env.R2_UPLOADS,
			collections: { 'file-uploads': true },
		}),
		formBuilderPlugin({
			fields: {
				text: true,
				textarea: true,
				email: true,
				number: true,
				checkbox: true,
				select: true,
				upload: UploadBlock,
			},
			formOverrides: {
				access: {
					read: publicReadAccess, // Public can read form schemas
					create: isAdmin,
					update: isLoggedIn,
					delete: isAdmin,
				},
			},
			formSubmissionOverrides: {
				access: {
					read: isLoggedIn, // Only logged-in users can read submissions
					create: publicReadAccess, // Public can submit forms
					update: isAdmin,
					delete: isAdmin,
				},
				hooks: {
					afterChange: [
						async ({ doc, operation, req }) => {
							// Only send email on create (new submission)
							if (operation === 'create') {
								// Get the form details
								const form = await req.payload.findByID({
									collection: 'forms',
									id: doc.form,
								});

								// Get all admin users to notify
								const adminUsers = await req.payload.find({
									collection: 'users',
									where: {
										role: {
											equals: 'admin',
										},
									},
								});

								// Format submission data for email
								const submissionData = Object.entries(doc.submissionData || {})
									.map(([key, value]) => `${key}: ${value}`)
									.join('\n');

								// Send email to each admin
								for (const admin of adminUsers.docs) {
									try {
										await req.payload.sendEmail({
											to: admin.email,
											subject: `New Form Submission: ${form.title}`,
											html: `
												<h2>New Form Submission</h2>
												<p><strong>Form:</strong> ${form.title}</p>
												<p><strong>Submitted:</strong> ${new Date(doc.createdAt).toLocaleString()}</p>
												<h3>Submission Details:</h3>
												<pre>${submissionData}</pre>
												<p><a href="https://www.sfti-radio.net/admin/collections/form-submissions/${doc.id}">View in Admin Panel</a></p>
											`,
										});
									} catch (error) {
										console.error(
											`Failed to send email to ${admin.email}:`,
											error,
										);
									}
								}
							}
						},
					],
				},
				admin: {
					components: {
						views: {
							edit: {
								default: {
									Component: FormSubmissionView,
								},
							},
						},
					},
				},
				fields: ({ defaultFields }) => [
					...defaultFields,
					{
						name: 'uploadedFiles',
						type: 'join',
						collection: 'file-uploads',
						on: 'formSubmission',
						admin: {
							description: 'Files uploaded with this form submission',
							components: {
								Field: DownloadFilesField,
							},
						},
					},
				],
			},
		}),
		searchPlugin({
			collections: [
				'blog',
				'churches',
				'local-events',
				'market-areas',
				'news',
				'schools',
				'sports',
			],
			beforeSync: ({ originalDoc, searchDoc }) => {
				// Collections that use 'name' instead of 'title'
				const collectionsWithNameField = [
					'churches',
					'schools',
					'market-areas',
				];
				const docRelation = searchDoc.doc?.relationTo;

				if (
					typeof docRelation === 'string' &&
					collectionsWithNameField.includes(docRelation) &&
					originalDoc?.name
				) {
					return {
						...searchDoc,
						title: originalDoc.name,
					};
				}

				return searchDoc;
			},
		}),
	],
});

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(options?: {
	useDevEnvironment?: boolean;
	useRemoteBindings?: boolean;
}): Promise<CloudflareContext> {
	// Use 'dev' environment for local development
	// Use CLOUDFLARE_ENV (e.g., 'prod') for production migrations
	const environment = options?.useDevEnvironment
		? 'dev'
		: process.env.CLOUDFLARE_ENV;

	return import(
		/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`
	).then(({ getPlatformProxy }) =>
		getPlatformProxy({
			environment,
			// Use remote bindings to connect to actual Cloudflare D1/R2 instead of local
			remoteBindings: options?.useRemoteBindings,
		} satisfies GetPlatformProxyOptions),
	);
}
