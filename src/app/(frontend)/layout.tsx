import type React from 'react';
import './styles.css';

export const metadata = {
	description: 'Payload CMS for TSFTI Radio',
	title: 'TSFTI Radio CMS',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props;

	return (
		<html lang="en">
			<body>
				<main>{children}</main>
			</body>
		</html>
	);
}
