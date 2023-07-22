import { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
	password: 'complex_password_at_least_32_characters_long',
	cookieName: 'spotify_session',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
};

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
	interface IronSessionData {
		accessToken: string;
	}
}
