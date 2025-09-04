'use strict';
// Username and password used in all databases.
const credentials = {
	FINPRESS_DB_USER: 'root',
	FINPRESS_DB_PASSWORD: 'password',
};

// Environment for test database.
const tests = {
	FINPRESS_DB_NAME: 'tests-finpress',
	FINPRESS_DB_HOST: 'tests-mysql',
};

// Environment for development database. DB host gets default value which is set
// elsewhere.
const development = {
	FINPRESS_DB_NAME: 'finpress',
};

module.exports = {
	credentials,
	tests,
	development,
};
