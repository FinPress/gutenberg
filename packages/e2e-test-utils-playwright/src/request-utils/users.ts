/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

export interface User {
	id: number;
	name: string;
	email: string;
}

export interface UserData {
	username: string;
	email: string;
	firstName?: string;
	lastName?: string;
	password?: string;
	roles?: string[];
}

export interface UserRequestData {
	username: string;
	email: string;
	first_name?: string;
	last_name?: string;
	password?: string;
	roles?: string[];
}

/**
 * List all users.
 *
 * @see https://developer.wordpress.org/rest-api/reference/users/#list-users
 * @param this
 * @param restOptions Optional REST options to override default settings.
 */
async function listUsers(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	const response = await this.rest< User[] >( {
		...restOptions,
		method: 'GET',
		path: '/wp/v2/users',
		params: {
			per_page: 100,
		},
	} );

	return response;
}

/**
 * Add a test user.
 *
 * @see https://developer.wordpress.org/rest-api/reference/users/#create-a-user
 * @param this
 * @param user        User data to create.
 * @param restOptions Optional REST options to override default settings.
 */
async function createUser(
	this: RequestUtils,
	user: UserData,
	restOptions?: Partial< RestOptions >
) {
	const userData: UserRequestData = {
		username: user.username,
		email: user.email,
	};

	if ( user.firstName ) {
		userData.first_name = user.firstName;
	}

	if ( user.lastName ) {
		userData.last_name = user.lastName;
	}

	if ( user.password ) {
		userData.password = user.password;
	}

	if ( user.roles ) {
		userData.roles = user.roles;
	}

	const response = await this.rest< User >( {
		...restOptions,
		method: 'POST',
		path: '/wp/v2/users',
		data: userData,
	} );

	return response;
}

/**
 * Delete a user.
 *
 * @see https://developer.wordpress.org/rest-api/reference/users/#delete-a-user
 * @param this
 * @param userId      The ID of the user.
 * @param restOptions Optional REST options to override default settings.
 */
async function deleteUser(
	this: RequestUtils,
	userId: number,
	restOptions?: Partial< RestOptions >
) {
	const response = await this.rest( {
		...restOptions,
		method: 'DELETE',
		path: `/wp/v2/users/${ userId }`,
		params: { force: true, reassign: 1 },
	} );

	return response;
}

/**
 * Delete all users except main root user.
 *
 * @param this
 * @param restOptions Optional REST options to override default settings.
 */
async function deleteAllUsers(
	this: RequestUtils,
	restOptions?: Partial< RestOptions >
) {
	const users = await listUsers.bind( this )( restOptions );

	// The users endpoint doesn't support batch request yet.
	const responses = await Promise.all(
		users
			// Do not delete neither root user nor the current user.
			.filter(
				( user: User ) =>
					user.id !== 1 && user.name !== this.user.username
			)
			.map( ( user: User ) =>
				deleteUser.bind( this )( user.id, restOptions )
			)
	);

	return responses;
}

export { createUser, deleteAllUsers };
