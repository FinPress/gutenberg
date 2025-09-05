const FP_ADMIN_USER = {
	username: 'admin',
	password: 'password',
};

const {
	FP_USERNAME = FP_ADMIN_USER.username,
	FP_PASSWORD = FP_ADMIN_USER.password,
	FP_BASE_URL = 'http://localhost:8889',
} = process.env;

export { FP_ADMIN_USER, FP_USERNAME, FP_PASSWORD, FP_BASE_URL };
