function parseFactor(lexer, first) {
	var factor = {};
	
	factor.oper = "*";
	if (!first) {
		factor.oper = lexer.check("MULTIPLY") ? "*" : "/";
		lexer.expect("FACTOR_OPER");
	}
	
	factor.sign = "+";
	if (lexer.check("SIGN")) {
		factor.sign = lexer.check("PLUS") ? "+" : "-";
		lexer.nextToken();
	}
	
	if (lexer.check("NUMBER")) {
		factor.type = "NUMBER";
		factor.number = parseFloat(lexer.lexeme);
		lexer.nextToken();
	} else {
		if (lexer.check("IDENTIFIER")) {
			factor.type = "CONSTANT";
			factor.name = lexer.lexeme;
			lexer.nextToken();
		}
		if (lexer.accept("LPAREN")) {
			factor.type = "name" in factor ? "FUNCTION" : "EXPR";
			factor.expr = parseExpr(lexer);
			lexer.expect("RPAREN");
		}
	}
	
	if (!("type" in factor))
		lexer.error("Factor expected.");
	
	if (lexer.accept("CIRCUMFLEX"))
		factor.exponent = parseFactor(lexer, true);
	
	return factor;
}

function parseTerm(lexer, first) {
	var term = {};
	
	term.oper = "+";
	if (!first) {
		term.oper = lexer.check("PLUS") ? "+" : "-";
		lexer.expect("TERM_OPER");
	}
	
	term.factors = [parseFactor(lexer, true)];
	while (lexer.check("FACTOR_OPER"))
		term.factors.push(parseFactor(lexer, false));
	
	return term;
}

function parseExpr(lexer) {
	var expr = {};
	
	expr.terms = [parseTerm(lexer, true)];
	while (lexer.check("TERM_OPER"))
		expr.terms.push(parseTerm(lexer, false));
	
	return expr;
}