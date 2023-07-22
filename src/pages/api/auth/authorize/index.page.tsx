import axios from 'axios';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@/lib/session';
import { useState } from 'react';

type SpotifyAuthApiResponse = {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
	refresh_token: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { code } = req.query;
	const accessToken = await getAccessTokenFromCode(code);
	req.session.accessToken = accessToken;
	await req.session.save();

	res.status(200).redirect('/');
};

const getAccessTokenFromCode = async (code: string | string[] | undefined) => {
	const params = new URLSearchParams();
	params.append('grant_type', 'authorization_code');
	params.append('code', code as string);
	params.append(
		'redirect_uri',
		'http://localhost:3000/api/auth/authorize' as string,
	);

	const response = await axios.post<SpotifyAuthApiResponse>(
		'https://accounts.spotify.com/api/token',
		params,
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(
					`${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SEACRET}`,
					'utf-8',
				).toString('base64')}`,
			},
		},
	);

	const accessToken = response.data.access_token;

	return accessToken;
};

export default withIronSessionApiRoute(handler, sessionOptions);
