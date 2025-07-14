// File copied as is from the y-webrtc package.

/**
 * External dependencies
 */
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as promise from 'lib0/promise';
import * as error from 'lib0/error';
import * as string from 'lib0/string';

/**
 * @param {string} secret
 * @param {string} roomName
 * @return {PromiseLike<CryptoKey>} the derived key
 */
export const deriveKey = (
	secret: string,
	roomName: string
): PromiseLike< CryptoKey > => {
	const secretBuffer = string.encodeUtf8( secret ).buffer;
	const salt = string.encodeUtf8( roomName ).buffer;
	return (
		crypto.subtle
			// @ts-ignore - need to figure out why raw is not recognized
			.importKey( 'raw', secretBuffer, 'PBKDF2', false, [ 'deriveKey' ] )
			.then( ( keyMaterial ) =>
				crypto.subtle.deriveKey(
					{
						name: 'PBKDF2',
						// @ts-ignore - need to figure out why salt is not allowed
						salt,
						iterations: 100000,
						hash: 'SHA-256',
					},
					keyMaterial,
					{
						name: 'AES-GCM',
						length: 256,
					},
					true,
					[ 'encrypt', 'decrypt' ]
				)
			)
	);
};

/**
 * @param {Uint8Array} data data to be encrypted
 * @param {CryptoKey?} key
 * @return {PromiseLike<Uint8Array>} encrypted, base64 encoded message
 */
export const encrypt = (
	data: Uint8Array,
	key: CryptoKey | null
): Promise< void | Uint8Array< ArrayBufferLike > > => {
	if ( ! key ) {
		return promise.resolve( data );
	}
	const iv = crypto.getRandomValues( new Uint8Array( 12 ) );
	return crypto.subtle
		.encrypt(
			{
				name: 'AES-GCM',
				iv,
			},
			key,
			data
		)
		.then( ( cipher ) => {
			const encryptedDataEncoder = encoding.createEncoder();
			encoding.writeVarString( encryptedDataEncoder, 'AES-GCM' );
			encoding.writeVarUint8Array( encryptedDataEncoder, iv );
			encoding.writeVarUint8Array(
				encryptedDataEncoder,
				new Uint8Array( cipher )
			);
			return encoding.toUint8Array( encryptedDataEncoder );
		} );
};

/**
 * @param {Object}     data data to be encrypted
 * @param {CryptoKey?} key
 * @return {PromiseLike<Uint8Array>} encrypted data, if key is provided
 */
export const encryptJson = (
	data: object,
	key: CryptoKey | null
): Promise< void | Uint8Array< ArrayBufferLike > > => {
	const dataEncoder = encoding.createEncoder();
	encoding.writeAny( dataEncoder, data );
	return encrypt( encoding.toUint8Array( dataEncoder ), key );
};

/**
 * @param {Uint8Array} data
 * @param {CryptoKey?} key
 * @return {PromiseLike<Uint8Array>} decrypted buffer
 */
export const decrypt = (
	data: Uint8Array,
	key: CryptoKey | null
): Promise< void | Uint8Array< ArrayBufferLike > > => {
	if ( ! key ) {
		return promise.resolve( data );
	}
	const dataDecoder = decoding.createDecoder( data );
	const algorithm = decoding.readVarString( dataDecoder );
	if ( algorithm !== 'AES-GCM' ) {
		promise.reject( error.create( 'Unknown encryption algorithm' ) );
	}
	const iv = decoding.readVarUint8Array( dataDecoder );
	const cipher = decoding.readVarUint8Array( dataDecoder );
	return crypto.subtle
		.decrypt(
			{
				name: 'AES-GCM',
				iv,
			},
			key,
			cipher
		)
		.then( ( decryptedData ) => new Uint8Array( decryptedData ) );
};

/**
 * @param {Uint8Array} data
 * @param {CryptoKey?} key
 * @return {PromiseLike<Object>} decrypted object
 */
export const decryptJson = (
	data: Uint8Array,
	key: CryptoKey | null
): PromiseLike< object > =>
	decrypt( data, key ).then( ( decryptedValue ) =>
		decoding.readAny(
			// @ts-ignore - need to figure out why this type is a problem
			decoding.createDecoder( new Uint8Array( decryptedValue ) )
		)
	);
