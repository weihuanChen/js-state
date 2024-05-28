### 四则运算产生式
 四则运算 带括号  整数  词法产生式
 <number> ::= 0-9 | 1-9 //0-9或1-9
 <number1> ::: = 1-9 | <number1> <number>
 <number3> ::= <number> | <number2>
 <operator> ::= + | - | * | / | ( | )      有优先级
 <token> ::= <number3> | <operator>
 <expression> ::= <token>|<expression><token>

求closure 将产生式里以｜或关系进行分割
closure有几个，代码就有几个if
乘法,单个数字也视为一个乘法
 <mulitiplicativeExression> ::= <primaryExpression> | <mulitiplicativeExression> * <primaryExpression>
   <mulitiplicativeExression> * <primaryExpression>  


加法,单个乘法也视为一个加法(mulitip  reduce成addtive)
 <additiveExpression> ::= <mulitiplicativeExression> | <additiveExpression> + <mulitiplicativeExression>
   <mulitiplicativeExression>   -- if
   <additiveExpression> + <mulitiplicativeExression> --if
   <primaryExpression>  -- if
   <mulitiplicativeExression> * <primaryExpression>  --if
   <number3> -- if
   ( <additiveExpression> )  --if


括号，提升优先级
 <primaryExpression> ::= (<additiveExpression>) | <number3>  括号 最高级

 语言
 <lang> ::= <additiveExpression> <EOF>