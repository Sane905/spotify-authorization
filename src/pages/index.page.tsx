import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import { GetServerSideProps, NextPage } from 'next';
import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import queryString from 'query-string';
import randomString from 'crypto-random-string';
import { url } from 'inspector';

const inter = Inter({ subsets: ['latin'] });

type Props = {
	sessionId: string | null;
};

const Page: NextPage<Props> = ({ sessionId }) => {
	const redirect_uri = 'http://localhost:3000/api/auth/authorize';
	const randomNumber = randomString({ length: 16, type: 'url-safe' });
	const scope = 'user-read-private user-read-email';

	const url = `https://accounts.spotify.com/authorize?${queryString.stringify({
		response_type: 'code',
		client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
		scope: scope,
		redirect_uri: redirect_uri,
		state: randomNumber,
	})}`;
	return (
		<>
			{!sessionId && (
				<Stack alignItems='center' justifyContent='center'>
					<Button colorScheme="green">
						<Link href={url}>Login with Spotify</Link>
					</Button>
				</Stack>
			)}
			{!!sessionId && <Text>ログインしています。</Text>}
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	if (context.req.cookies['spotify_session']) {
		const sessionId: string = context.req.cookies['spotify_session'];
		return {
			props: { sessionId: sessionId },
		};
	}
	return {
		props: { sessionId: null },
	};
};
export default Page;
