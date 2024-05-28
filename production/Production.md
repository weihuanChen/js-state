## 产生式学习

##
外星语 -> 单词
## 基本发音
pa gu
## 单词
<单词> ::= "pa" | "gu"  语音本身就有，更接近字符串
## 外星语
<外星语> ::= <单词>| <外星语> + <单词> 

### bnf 巴克斯诺尔范式 用于描述语法结构
规定所有的非终端符用 < >,所有的终端符用"",产生式用::=



### Symbol 语法结构
具备表意的单元 
Symbol
Teminal Symbol终端符 || 终结符
Non-Terminal Symbol 非终端符 自然语法中不存在，用于描述语法

gu gu pa
pa gu gu gu
pa

<pa单词> ::= "pa" | "gu gu pa" | "pa gu gu gu"
<pa外星语> ::= <pa单词> | <pa外星语> <pa单词>

### 汉语
<汉语> ::= <句子> | <句子> <汉语>
<句子> ::= <主语> <谓语> <宾语> "."
<主语> ::= <名词> | <代词>
<名词> ::= "花" |"鸟" ...
<代词> ::= "你" | "我" | "他"

### 新的规则1
pa不能连续的出现
<single-pa> ::= "pa"
<double-gu> ::= "gu gu pa"
<three-gu> ::= "pa gu gu gu"
<dobule-gu-list> ::= <double-gu> <dobule-gu-list>
<three-gu-list> ::= <three-gu> <three-gu-list>
<pa-first-list> ::= <single-pa>  
"pa"不能连续出现，所以single-pa 无法组成list (都是pa); double-gu后边不能跟single-pa和three-gu
<pa-word> ::=  <dobule-gu-list> | <three-gu-list> | <three-gu-list> <double-gu> | <signa-pa>
<pa-language> ::= <pa-word> | <pa-language> <pa-word>

### 新的规则2
<ggp-list> ::= "gu gu pa" | <ggp-list>
<pggg-list> ::= "pa gu gu gu" | <pggg-list>
<pa> ::= "pa"
<pa-lang> ::= <pa><ggp-list> | <pggg-list> <ggp-list> | <pggg-list><pa>|<pa> | <ggp-list> | <pggg-list> | <pggg-list><pa><ggp-list>

pggg ggp相等
<ufo-lang> ::= <ggp-list><ufo-lang><pggg-list> | <ggp-list><pggg-list> | <pa>

### 作业 产生式
`能让{} () [] 互相匹配 ,所有的终端符是三种括号`


