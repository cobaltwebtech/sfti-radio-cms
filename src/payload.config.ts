// storage-adapter-import-placeholder

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	type CloudflareContext,
	getCloudflareContext,
} from '@opennextjs/cloudflare';
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
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
const cloudflareRemoteBindings = process.env.NODE_ENV === 'production';
const cloudflare =
	process.argv.find((value) => value.match(/^(generate|migrate):?/)) ||
	!cloudflareRemoteBindings
		? await getCloudflareContextFromWrangler()
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
			titleSuffix: ' - TSFTI Radio CMS',
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
	],
});

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
	return import(
		/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`
	).then(({ getPlatformProxy }) =>
		getPlatformProxy({
			environment: process.env.CLOUDFLARE_ENV,
		} satisfies GetPlatformProxyOptions),
	);
}
