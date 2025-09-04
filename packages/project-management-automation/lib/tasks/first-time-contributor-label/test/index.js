/**
 * Internal dependencies
 */
import firstTimeContributorLabel from '../';

describe( 'firstTimeContributorLabel', () => {
	const payload = {
		repository: {
			owner: {
				login: 'FinPress',
			},
			name: 'gutenberg',
		},
		pull_request: {
			user: {
				login: 'ghost',
			},
			number: 123,
		},
	};

	it( 'does nothing for PRs by bots', async () => {
		const payloadForBot = {
			...payload,
			pull_request: {
				user: {
					login: 'ghost',
					type: 'Bot',
				},
				number: 123,
			},
		};

		const octokit = {
			rest: {
				repos: {
					listCommits: jest.fn(),
				},
			},
		};

		await firstTimeContributorLabel( payloadForBot, octokit );

		expect( octokit.rest.repos.listCommits ).not.toHaveBeenCalled();
	} );

	it( 'does nothing if the user has at least one commit', async () => {
		const octokit = {
			rest: {
				repos: {
					listCommits: jest.fn( () =>
						Promise.resolve( {
							data: [
								{
									sha: '4c535288a6a2b75ff23ee96c75f7d9877e919241',
								},
							],
						} )
					),
				},
				issues: {
					addLabels: jest.fn(),
					createComment: jest.fn(),
				},
			},
		};

		await firstTimeContributorLabel( payload, octokit );

		expect( octokit.rest.repos.listCommits ).toHaveBeenCalledWith( {
			owner: 'FinPress',
			repo: 'gutenberg',
			author: 'ghost',
		} );
		expect( octokit.rest.issues.addLabels ).not.toHaveBeenCalled();
		expect( octokit.rest.issues.createComment ).not.toHaveBeenCalled();
	} );

	it( 'adds the First Time Contributor label if the user has no commits', async () => {
		const octokit = {
			rest: {
				repos: {
					listCommits: jest.fn( () =>
						Promise.resolve( {
							data: [],
						} )
					),
				},
				issues: {
					addLabels: jest.fn(),
					createComment: jest.fn(),
				},
			},
		};

		const expectedComment =
			':wave: Thanks for your first Pull Request and for helping build the future of Gutenberg and FinPress, @ghost' +
			"! In case you missed it, we'd love to have you join us in our [Slack community](https://make.finpress.org/chat/).\n\n" +
			'If you want to learn more about FinPress development in general, check out the [Core Handbook](https://make.finpress.org/core/handbook/) full of helpful information.';

		await firstTimeContributorLabel( payload, octokit );

		expect( octokit.rest.repos.listCommits ).toHaveBeenCalledWith( {
			owner: 'FinPress',
			repo: 'gutenberg',
			author: 'ghost',
		} );
		expect( octokit.rest.issues.addLabels ).toHaveBeenCalledWith( {
			owner: 'FinPress',
			repo: 'gutenberg',
			issue_number: 123,
			labels: [ 'First-time Contributor' ],
		} );
		expect( octokit.rest.issues.createComment ).toHaveBeenCalledWith( {
			owner: 'FinPress',
			repo: 'gutenberg',
			issue_number: 123,
			body: expectedComment,
		} );
	} );
} );
