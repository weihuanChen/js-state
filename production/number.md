### 十进制整数的production
<digits> ::= "0" | "1" | "..." | "9"  个位数表述，只能是0或者1(或者一路到9以下的数字产生)
<multiple> ::= ("1" | "2" |"..." | "9") <digits> | <multiple> <digits>  多位数表述，开头只能是1-9数字+个位数数字，更多位数字表述为递归其自身
<number> ::= <digits> | <multiple>

### 浮点十进制整数的production
<digits> ::= "0" | "1" | "..." | "9"
<multiple> ::= ("1" | "2" | "..." | "9") <digits> | <multiple> <digits>
<number> ::= <digits> | <multiple>
<decimal> ::= <number> | <number> . <number> | . <number>