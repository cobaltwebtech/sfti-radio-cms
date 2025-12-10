import { headers as getHeaders } from 'next/headers.js';
import { getPayload } from 'payload';

import config from '@/payload.config';
import './styles.css';

export default async function HomePage() {
	const headers = await getHeaders();
	const payloadConfig = await config;
	const payload = await getPayload({ config: payloadConfig });
	const { user } = await payload.auth({ headers });

	return (
		<div className="home">
			<div className="content">
				{!user && <h1>SFTI Radio CMS</h1>}
				{user && <h1>Welcome back, {user.email}</h1>}
				<div className="links">
					<a className="admin" href={payloadConfig.routes.admin}>
						Go to CMS Dashboard
					</a>
					<a className="docs" href="/" rel="noopener noreferrer">
						Docs Coming Soon
					</a>
				</div>
			</div>
			<div className="footer">
				<p>
					CMS and infrastructure by{' '}
					<a
						href="https://www.cobaltweb.tech/"
						rel="noopener noreferrer"
						target="_blank"
					>
						Cobalt Web Technologies
					</a>
					.
				</p>
			</div>
		</div>
	);
}
