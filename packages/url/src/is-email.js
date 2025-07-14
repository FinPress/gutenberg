/**
 * Regular expression to match IPv4 addresses (strict octets 0–255).
 *
 * (?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])
 *       ▲        ▲         ▲       ▲
 *       │         │          │        └─ Match 0–99: one or two digits, no leading zeros unless single zero.
 *       │         │          └─ Match 100–199.
 *       │         └─ Match 200–249.
 *       └─ Match 250–255.
 *
 * (?:\.(...)){3}
 *  ▲    ▲
 *  │    └─ Repeat this octet exactly 3 more times, separated by dots.
 *  └─ Leading dot for each additional octet.
 */
const IPV4_PATTERN =
	'(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])' +
	'(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}';

/**
 * Regular expression to match valid email addresses including domains or IPv4 addresses.
 *
 * ^(mailto:)?[a-z0-9._%+-]+@
 *  ▲       ▲            ▲
 *  │        │             └─ Local part: allowed characters before @
 *  │        └─ Optional 'mailto:' prefix.
 *  └─ Start of string.
 *
 * (
 *   [a-z0-9][a-z0-9.-]*\.[a-z]{2,63}
 *    ▲      ▲        ▲       ▲
 *    │       │         │        └─ TLD: 2 to 63 lowercase letters.
 *    │       │         └─ Subdomain labels (letters, digits, hyphens, dots).
 *    │       └─ Require at least one character before dot (cannot start with dot).
 *    └─ Require first character to be alphanumeric (not a dot or hyphen).
 *
 *   |
 *
 *   \[IPV4_PATTERN\]
 *    ▲            ▲
 *    │             └─ IP address enclosed in brackets (e.g., [192.168.1.1]).
 *    └─ Opening bracket.
 *
 *   |
 *
 *   IPV4_PATTERN
 *    ▲
 *    └─ Raw IPv4 address without brackets (non-standard but supported).
 * )
 *
 * $ → End of string.
 * i → Case-insensitive.
 */
const EMAIL_REGEXP = new RegExp(
	'^(mailto:)?[a-z0-9._%+-]+@' +
		'(' +
		'[a-z0-9][a-z0-9.-]*\\.[a-z]{2,63}' +
		'|' +
		'\\[' +
		IPV4_PATTERN +
		'\\]' +
		'|' +
		IPV4_PATTERN +
		')$',
	'i'
);

/**
 * Determines whether the given string looks like an email.
 *
 * @param {string} email The string to scrutinise.
 *
 * @example
 * ```js
 * const isEmail = isEmail( 'hello@wordpress.org' ); // true
 * ```
 *
 * @return {boolean} Whether or not it looks like an email.
 */
export function isEmail( email ) {
	return EMAIL_REGEXP.test( email );
}
