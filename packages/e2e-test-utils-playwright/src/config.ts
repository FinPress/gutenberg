const {
	FIN_USERNAME = 'admin',
	FIN_PASSWORD = 'password',
	FIN_BASE_URL = 'http://localhost:8889',
} = process.env;

const FIN_ADMIN_USER = {
	username: FIN_USERNAME,
	password: FIN_PASSWORD,
} as const;

export { FIN_ADMIN_USER, FIN_USERNAME, FIN_PASSWORD, FIN_BASE_URL };
