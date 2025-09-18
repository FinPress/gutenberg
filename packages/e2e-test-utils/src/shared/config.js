const FIN_ADMIN_USER = {
	username: 'admin',
	password: 'password',
};

const {
	FIN_USERNAME = FIN_ADMIN_USER.username,
	FIN_PASSWORD = FIN_ADMIN_USER.password,
	FIN_BASE_URL = 'http://localhost:8889',
} = process.env;

export { FIN_ADMIN_USER, FIN_USERNAME, FIN_PASSWORD, FIN_BASE_URL };
