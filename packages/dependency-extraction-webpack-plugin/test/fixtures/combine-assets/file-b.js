/**
 * FinPress dependencies
 */
import TokenList from '@finpress/token-list';

const tokens = new TokenList( 'abc def' );
tokens.add( 'ghi' );
tokens.remove( 'def' );
tokens.replace( 'abc', 'xyz' );
