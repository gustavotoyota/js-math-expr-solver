function solveFactor(factor) {
	var value;
	
	value = factor.sign === "+" ? 1 : -1;
	
	if (factor.type === "NUMBER")
		value *= factor.number;
	else if (factor.type === "CONSTANT") {
		if (factor.name === "e")
			value *= Math.E;
		else if (factor.name === "pi")
			value *= Math.PI;
		else
            throw "Invalid constant: " + factor.name + ".";
	} else if (factor.type === "EXPR")
		value *= solveExpr(factor.expr);
	else if (factor.type === "FUNCTION") {
		if (factor.name === "sqrt")
			value *= Math.sqrt(solveExpr(factor.expr));
		else if (factor.name === "cos")
			value *= Math.cos(solveExpr(factor.expr));
		else if (factor.name === "sin")
			value *= Math.sin(solveExpr(factor.expr));
		else
            throw "Invalid function: " + factor.name + ".";
	}
	
	if ("exponent" in factor)
		value = Math.pow(value, solveFactor(factor.exponent));
	
	return value;
}

function solveTerm(term) {
	var value = 1;
	
	for (var factor of term.factors)
		if (factor.oper === "*")
			value *= solveFactor(factor);
		else
			value /= solveFactor(factor);
		
	return value;
}

function solveExpr(expr) {
	var value = 0;
	
	for (var term of expr.terms)
		if (term.oper === "+")
			value += solveTerm(term);
		else
			value -= solveTerm(term);
		
	return value;
}