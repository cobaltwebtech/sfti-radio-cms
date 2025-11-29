'use client';

import { useDocumentInfo } from '@payloadcms/ui';
import type { JoinFieldClientComponent } from 'payload';
import { useEffect, useState } from 'react';

interface FileData {
	id: number;
	filename?: string | null;
	url?: string | null;
	mimeType?: string | null;
	filesize?: number | null;
}

export const DownloadFilesField: JoinFieldClientComponent = ({ field }) => {
	const { id: submissionId } = useDocumentInfo();
	const [files, setFiles] = useState<FileData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFiles = async () => {
			if (!submissionId) {
				setLoading(false);
				return;
			}

			try {
				const response = await fetch(
					`/api/file-uploads?where[formSubmission][equals]=${submissionId}&depth=0`,
				);
				const data = (await response.json()) as { docs?: FileData[] };
				if (data?.docs) {
					setFiles(data.docs);
				}
			} catch (error) {
				console.error('Error fetching files:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchFiles();
	}, [submissionId]);

	const labelText =
		typeof field.label === 'string' ? field.label : 'Uploaded Files';

	if (loading) {
		return (
			<div style={{ marginBottom: '24px' }}>
				<div
					style={{
						display: 'block',
						marginBottom: '8px',
						fontWeight: 500,
						color: 'var(--theme-elevation-800)',
					}}
				>
					{labelText}
				</div>
				<span style={{ color: 'var(--theme-elevation-500)' }}>Loading...</span>
			</div>
		);
	}

	if (files.length === 0) {
		return (
			<div style={{ marginBottom: '24px' }}>
				<div
					style={{
						display: 'block',
						marginBottom: '8px',
						fontWeight: 500,
						color: 'var(--theme-elevation-800)',
					}}
				>
					{labelText}
				</div>
				<span style={{ color: 'var(--theme-elevation-500)' }}>
					No files uploaded with this submission
				</span>
			</div>
		);
	}

	const formatFileSize = (bytes?: number | null) => {
		if (!bytes) return '';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<div style={{ marginBottom: '24px' }}>
			<div
				style={{
					display: 'block',
					marginBottom: '8px',
					fontWeight: 500,
					color: 'var(--theme-elevation-800)',
				}}
			>
				{labelText}
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
				{files.map((file) => {
					const fileUrl = file.url || `/api/file-uploads/file/${file.filename}`;
					return (
						<div
							key={file.id}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								padding: '12px 16px',
								backgroundColor: 'var(--theme-elevation-50)',
								border: '1px solid var(--theme-elevation-150)',
								borderRadius: '4px',
							}}
						>
							<div
								style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
							>
								<span style={{ fontWeight: 500 }}>
									{file.filename || `File ${file.id}`}
								</span>
								{(file.mimeType || file.filesize) && (
									<span
										style={{
											fontSize: '12px',
											color: 'var(--theme-elevation-500)',
										}}
									>
										{[file.mimeType, formatFileSize(file.filesize)]
											.filter(Boolean)
											.join(' • ')}
									</span>
								)}
							</div>
							<a
								href={fileUrl}
								download={file.filename || undefined}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: '6px',
									padding: '8px 12px',
									backgroundColor: 'var(--theme-elevation-100)',
									borderRadius: '4px',
									textDecoration: 'none',
									color: 'var(--theme-text)',
									fontSize: '13px',
									fontWeight: 500,
									transition: 'background-color 0.15s ease',
								}}
								onMouseOver={(e) => {
									e.currentTarget.style.backgroundColor =
										'var(--theme-elevation-200)';
								}}
								onMouseOut={(e) => {
									e.currentTarget.style.backgroundColor =
										'var(--theme-elevation-100)';
								}}
								onFocus={(e) => {
									e.currentTarget.style.backgroundColor =
										'var(--theme-elevation-200)';
								}}
								onBlur={(e) => {
									e.currentTarget.style.backgroundColor =
										'var(--theme-elevation-100)';
								}}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<title>Download</title>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="7 10 12 15 17 10" />
									<line x1="12" y1="15" x2="12" y2="3" />
								</svg>
								Download
							</a>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default DownloadFilesField;
