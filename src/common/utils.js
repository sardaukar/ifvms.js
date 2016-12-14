/*

Common untility functions
=========================

Copyright (c) 2016 The ifvms.js team
BSD licenced
http://github.com/curiousdannii/ifvms.js

*/

'use strict';

// Utility to extend objects
function extend()
{
	var old = arguments[0], i = 1, add, name;
	while ( i < arguments.length )
	{
		add = arguments[i++];
		for ( name in add )
		{
			old[name] = add[name];
		}
	}
	return old;
}

// Simple classes
// Inspired by John Resig's class implementation
// http://ejohn.org/blog/simple-javascript-inheritance/

function Class()
{}

Class.subClass = function( props )
{
	function newClass()
	{
		if ( this.init )
		{
			this.init.apply( this, arguments );
		}
	}
	newClass.prototype = extend( Object.create( this.prototype ), props );
	newClass.subClass = this.subClass;
	newClass.super = newClass.prototype.super = this.prototype;
	return newClass;
};

// An enhanced DataView
// Accepts either an ArrayBuffer or a length number
function MemoryView( buffer, byteOffset, byteLength )
{
	if ( typeof buffer === 'number' )
	{
		buffer = new ArrayBuffer( buffer );
	}
	
	return extend( new DataView( buffer, byteOffset, byteLength ), {
		getBuffer8: function( start, length )
		{
			return new Uint8Array( this.buffer.slice( start, start + length ) );
		},
		getBuffer16: function( start, length )
		{
			return new Uint16Array( this.buffer.slice( start, start + length * 2 ) );
		},
		setBuffer8: function( start, data )
		{
			if ( data instanceof ArrayBuffer )
			{
				data = new Uint8Array( data );
			}
			( new Uint8Array( this.buffer ) ).set( data, start );
		},
		//setBuffer16
		
		// For use with IFF files
		getFourCC: function( index )
		{
			return String.fromCharCode( this.getUint8( index ), this.getUint8( index + 1 ), this.getUint8( index + 2 ), this.getUint8( index + 3 ) );
		},
		setFourCC: function( index, text )
		{
			this.setUint8( index, text.charCodeAt( 0 ) );
			this.setUint8( index + 1, text.charCodeAt( 1 ) );
			this.setUint8( index + 2, text.charCodeAt( 2 ) );
			this.setUint8( index + 3, text.charCodeAt( 3 ) );
		},
	} );
}

// Utilities for 16-bit signed arithmetic
function U2S16( value )
{
	return value << 16 >> 16;
}
function S2U16 ( value )
{
	return value & 0xFFFF;
}

// Utility to convert from byte arrays to word arrays
function byte_to_word( array )
{
	var i = 0, l = array.length,
	result = [];
	while ( i < l )
	{
		result[i / 2] = array[i++] << 8 | array[i++];
	}
	return result;
}

module.exports = {
	extend: extend,
	Class: Class,
	MemoryView: MemoryView,
	U2S16: U2S16,
	S2U16: S2U16,
	byte_to_word: byte_to_word,
};

/*// Perform some micro optimisations
function optimise( code )
{
	return code

	// Sign conversions
	.replace( /(e\.)?U2S\(([^(]+?)\)/g, '(($2)<<16>>16)' )
	.replace( /(e\.)?S2U\(([^(]+?)\)/g, '(($2)&65535)' )

	// Bytearray
	.replace( /([\w.]+)\.getUint8\(([^(]+?)\)/g, '$1[$2]' )
	.replace( /([\w.]+)\.getUint16\(([^(]+?)\)/g, '($1[$2]<<8|$1[$2+1])' );
}
// Optimise some functions of an obj, compiling several at once
function optimise_obj( obj, funcnames )
{
	var funcname, funcparts, newfuncs = [];
	for ( funcname in obj )
	{
		if ( funcnames.indexOf( funcname ) >= 0 )
		{
			funcparts = /function\s*\(([^(]*)\)\s*\{([\s\S]+)\}/.exec( '' + obj[funcname] );
			if ( DEBUG )
			{
				newfuncs.push( funcname + ':function ' + funcname + '(' + funcparts[1] + '){' + optimise( funcparts[2] ) + '}' );
			}
			else
			{
				newfuncs.push( funcname + ':function(' + funcparts[1] + '){' + optimise( funcparts[2] ) + '}' );
			}
		}
	}
	extend( obj, eval( '({' + newfuncs.join() + '})' ) );
}*/