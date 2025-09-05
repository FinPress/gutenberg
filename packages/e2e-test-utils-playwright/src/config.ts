const {
	FP_USERNAME = 'admin',
	FP_PASSWORD = 'password',
	FP_BASE_URL = 'http://localhost:8889',
} = process.env;

const FP_ADMIN_USER = {
	username: FP_USERNAME,
	password: FP_PASSWORD,
} as const;

export { FP_ADMIN_USER, FP_USERNAME, FP_PASSWORD, FP_BASE_URL };
