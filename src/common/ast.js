/*

Generic AST Classes
===================

Copyright (c) 2017 The ifvms.js team
MIT licenced
https://github.com/curiousdannii/ifvms.js

*/

'use strict'

/*

 - All AST nodes must use these functions, even constants
 - (An exception is made for branch addresses and text literals which remain as primitives)
 - toString() functions are used to generate JIT code

*/

// Generic/constant operand
class Operand
{
	constructor( engine, value )
	{
		this.e = engine
		this.v = value
	}
	
	toString()
	{
		return this.v
	}
	
	U2S()
	{
		return this.e.U2S( this.v )
	}
}

// Generic instruction
class Instruction
{
	init( engine, context, code, pc, next, operands )
	{
		this.e = engine
		this.context = context
		this.code = code
		this.pc = pc
		this.labels = [ this.pc + '/' + this.code ]
		this.next = next
		this.operands = operands
	}
}

module.exports = {
	Instruction: Instruction,
	Operand: Operand,
}