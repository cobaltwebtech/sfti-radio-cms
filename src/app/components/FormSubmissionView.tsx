'use client';

import { useAuth, useDocumentInfo } from '@payloadcms/ui';
import { useEffect, useState } from 'react';

interface SubmissionData {
	field: string;
	value: string;
	id: string;
}

interface FileData {
	id: number;
	filename?: string | null;
	url?: string | null;
	mimeType?: string | null;
	filesize?: number | null;
}

interface FormSubmission {
	id: number;
	form: {
		id: number;
		title: string;
	};
	submissionData: SubmissionData[];
	createdAt: string;
	updatedAt: string;
}

interface UserWithRole {
	role?: 'admin' | 'staff';
}

const ReadOnlySubmissionView: React.FC<{ isAdmin?: boolean }> = ({
	isAdmin = false,
}) => {
	const { id: submissionId } = useDocumentInfo();
	const [submission, setSubmission] = useState<FormSubmission | null>(null);
	const [files, setFiles] = useState<FileData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (!submissionId) {
				setLoading(false);
				return;
			}

			try {
				// Fetch submission data
				const submissionRes = await fetch(
					`/api/form-submissions/${submissionId}?depth=1`,
				);
				const submissionData = (await submissionRes.json()) as FormSubmission;
				setSubmission(submissionData);

				// Fetch associated files
				const filesRes = await fetch(
					`/api/file-uploads?where[formSubmission][equals]=${submissionId}&depth=0`,
				);
				const filesData = (await filesRes.json()) as { docs?: FileData[] };
				if (filesData?.docs) {
					setFiles(filesData.docs);
				}
			} catch (error) {
				console.error('Error fetching submission:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [submissionId]);

	const formatFileSize = (bytes?: number | null) => {
		if (!bytes) return '';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	const formatFieldName = (fieldName: string) => {
		return fieldName
			.replace(/[-_]/g, ' ')
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	if (loading) {
		return (
			<div className="gutter--left gutter--right" style={{ padding: '24px 0' }}>
				<div
					style={{ color: 'var(--theme-elevation-500)', textAlign: 'center' }}
				>
					Loading submission...
				</div>
			</div>
		);
	}

	if (!submission) {
		return (
			<div className="gutter--left gutter--right" style={{ padding: '24px 0' }}>
				<div
					style={{ color: 'var(--theme-elevation-500)', textAlign: 'center' }}
				>
					Submission not found
				</div>
			</div>
		);
	}

	return (
		<div className="document-fields__edit gutter--left gutter--right">
			{/* Header */}
			<div
				style={{
					marginBottom: '32px',
					paddingBottom: '16px',
					borderBottom: '1px solid var(--theme-elevation-100)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
				}}
			>
				<div>
					<h1
						style={{
							fontSize: '24px',
							fontWeight: 600,
							margin: '0 0 8px 0',
							color: 'var(--theme-text)',
						}}
					>
						Form Submission
					</h1>
					<div
						style={{
							display: 'flex',
							gap: '24px',
							fontSize: '14px',
							color: 'var(--theme-elevation-500)',
						}}
					>
						<span>
							<strong>Form:</strong> {submission.form?.title || 'Unknown Form'}
						</span>
						<span>
							<strong>Submitted:</strong> {formatDate(submission.createdAt)}
						</span>
					</div>
				</div>

				{/* Admin Actions */}
				{isAdmin && (
					<div style={{ display: 'flex', gap: '8px' }}>
						<button
							type="button"
							onClick={async () => {
								if (
									window.confirm(
										'Are you sure you want to delete this submission?',
									)
								) {
									try {
										const res = await fetch(
											`/api/form-submissions/${submissionId}`,
											{
												method: 'DELETE',
											},
										);
										if (res.ok) {
											window.location.href =
												'/admin/collections/form-submissions';
										} else {
											alert('Failed to delete submission');
										}
									} catch {
										alert('Error deleting submission');
									}
								}
							}}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '6px',
								padding: '8px 16px',
								backgroundColor: 'var(--theme-error-500)',
								border: 'none',
								borderRadius: '4px',
								color: 'white',
								fontSize: '13px',
								fontWeight: 500,
								cursor: 'pointer',
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
								<title>Delete</title>
								<polyline points="3 6 5 6 21 6" />
								<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
							</svg>
							Delete
						</button>
					</div>
				)}
			</div>

			{/* Submission Data */}
			<div style={{ marginBottom: '32px' }}>
				<h2
					style={{
						fontSize: '16px',
						fontWeight: 600,
						margin: '0 0 16px 0',
						color: 'var(--theme-text)',
					}}
				>
					Submission Data
				</h2>
				<div
					style={{
						backgroundColor: 'var(--theme-elevation-50)',
						borderRadius: '8px',
						border: '1px solid var(--theme-elevation-100)',
						overflow: 'hidden',
					}}
				>
					{submission.submissionData
						?.filter((item) => item.value && item.value.trim() !== '')
						.map((item, index, filteredArray) => (
							<div
								key={item.id}
								style={{
									display: 'flex',
									padding: '16px 20px',
									borderBottom:
										index < filteredArray.length - 1
											? '1px solid var(--theme-elevation-100)'
											: 'none',
									gap: '20px',
								}}
							>
								<div
									style={{
										flex: '0 0 200px',
										fontWeight: 500,
										color: 'var(--theme-elevation-600)',
										fontSize: '14px',
									}}
								>
									{formatFieldName(item.field)}
								</div>
								<div
									style={{
										flex: 1,
										color: 'var(--theme-text)',
										fontSize: '14px',
										wordBreak: 'break-word',
									}}
								>
									{item.value}
								</div>
							</div>
						))}
				</div>
			</div>

			{/* Uploaded Files */}
			{files.length > 0 && (
				<div>
					<h2
						style={{
							fontSize: '16px',
							fontWeight: 600,
							margin: '0 0 16px 0',
							color: 'var(--theme-text)',
						}}
					>
						Uploaded Files
					</h2>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						{files.map((file) => {
							const fileUrl =
								file.url || `/api/file-uploads/file/${file.filename}`;
							return (
								<div
									key={file.id}
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										padding: '12px 16px',
										backgroundColor: 'var(--theme-elevation-50)',
										border: '1px solid var(--theme-elevation-100)',
										borderRadius: '8px',
									}}
								>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '2px',
										}}
									>
										<span style={{ fontWeight: 500, fontSize: '14px' }}>
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
											padding: '8px 16px',
											backgroundColor: 'var(--theme-success-500)',
											borderRadius: '4px',
											textDecoration: 'none',
											color: 'white',
											fontSize: '13px',
											fontWeight: 500,
											transition: 'background-color 0.15s ease',
										}}
										onMouseOver={(e) => {
											e.currentTarget.style.backgroundColor =
												'var(--theme-success-600)';
										}}
										onMouseOut={(e) => {
											e.currentTarget.style.backgroundColor =
												'var(--theme-success-500)';
										}}
										onFocus={(e) => {
											e.currentTarget.style.backgroundColor =
												'var(--theme-success-600)';
										}}
										onBlur={(e) => {
											e.currentTarget.style.backgroundColor =
												'var(--theme-success-500)';
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
			)}

			{/* Back link */}
			<div style={{ marginTop: '32px' }}>
				<a
					href="/admin/collections/form-submissions"
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '6px',
						color: 'var(--theme-elevation-500)',
						textDecoration: 'none',
						fontSize: '14px',
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
					>
						<title>Back</title>
						<polyline points="15 18 9 12 15 6" />
					</svg>
					Back to all submissions
				</a>
			</div>
		</div>
	);
};

// Main component that checks user role and passes isAdmin prop
export const FormSubmissionView: React.FC = () => {
	const { user } = useAuth<UserWithRole>();
	const isAdmin = user?.role === 'admin';

	return <ReadOnlySubmissionView isAdmin={isAdmin} />;
};

export default FormSubmissionView;
