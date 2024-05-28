### javascript 产生式
- 表达式 literal: number string boolean reg
- + - * / % > < = ? . | || ^ !
- 关键字 let const var function if for while else try catch finally switch break continue throw new constructor super class 

### 表达式产生式
```
 <literal> := <Number> | <String> | <Boolean> | null
 <mulitiplicativeExression> ::= <primaryExpression> | <mulitiplicativeExression> * <primaryExpression>
 <expExpression> := <primaryExpression> | <expExpression> ** <primaryExpression>
 <additiveExpression> ::= <mulitiplicativeExression> | <additiveExpression> + <mulitiplicativeExression>
 <primaryExpression> ::= (<additiveExpression>) | <literal> | <identifier>  
```

### 比较运算符
```
 <compare> := > | < | === | >= | <= | !== | == | !=
 <compareExpression> := <additiveExpression> | <CcmpareExpression><compare><additiveExpression>
```

### 位移运算符
```
 <shfitOperator> := >>|<<|>>>
 <shfitExpression> := <additiveExpression>|<shfitExpression><shfitOperator><additiveExpression>
```

### 单目运算符
```
 <monocularOperator> := ++|--
 <monocularExpression> := <primaryExpression>|<monocularOperator><monocularExpression>
```

### 逻辑运算
```
 <addExpression> :=  <compareExpression> | <logicExpression> && <compareExpression>
 <logicExpression> := <andExpresion> | <orExpression> || <andExpression>
```

### 赋值
```
<assignmentExpression> := <orExpression> | <leftHandSide> = <assignmentExpression>
```
### 左值
```
<leftHandSide> = <identifier>
```

### 语句
#### 声明语句
```
<declaration> := let|const|var
<declarationStatement> := <declaration><assignmentExpression>
```
#### if
```
<ifStatement> := if(<assignmentExpression>)<statement>
<statement> := <ifStatement>
```
  
#### while for
```
<whileStatement> := while(<assignmentExpression>)<statement>
<forStatement> := for(<assignmentExpression>;;)<statement>
<BreakStatement> := break
<ContinueStatement> := continue
<circulateStatement> := <whileStatement>|<forStatement>
```

#### return
```
<returnStatement> := return <assignmentExpression>
```

#### statement
```
<expressionStatement> := <assignmentExpression>
<statement> := <ifStatement>|<declarationStatement>|<circulateStatement>|<returnStatement>|<block>|
<breakStatement>|<continueStatement>|<expressionStatement>

<statementList> := <statement>|<statementList><statement>
<block> := {<expressionStatement>}
```

#### 函数
```
<arguments> := <identifier>|<arguments>,<identifier>
<functionStatement> = function(<arguments>){<statementList>}
```

#### class
```
<method> := <identifier>(<arguments>){<statementList>}
<methodList> := <method> | <methodList><method>
<classStatement> = class{<methodList>}
```


### importedlist
```
<imported> := 'export' | 'export' 'as' <identifier> | <identifier>
<importedList> := <imported> | <importedList><imported>
```
  
### import
```
<import> := 'import' <identifier> 'from' <string>  
 | 'import' '*' 'as' <identifier> 'from' <string> 
 | 'import' {<importedlist>} 'from' <string>
```
### export
```
 <exportList> := <identifier> | <identifier> 'as' <identifier> | <identifier> 'as' 'default'
 <export> := 'export'<declarationStatement> 
 | 'export' { <exportList>} 
 | 'export' 'default'<functionStatement>
```


### script
```
 <exportOrStatement> := <statement> | <export>
 <exportOrStatementList> := <exportOrStatement> | <exportOrStatementList> <exportOrStatement>
 <script> := <statementList> 
 <module> := <importedList> <exportOrStatementList>
```

### JS两种模式
- module模式
- Script模式
- 在标签内可以通过type来声明以上两种模式类型