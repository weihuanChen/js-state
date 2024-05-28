/**
 * @description 匹配单个字符
 * 大部分字符都可以匹配，但是少部分的字符被官方用了，如果要匹配该类正则,需要加 \ 反斜杠做转义
 */
// 匹配abc正则
const abcReg = /abc/g

/**
 * @description 
 * [] 匹配单个字符 可以输入范围 是一个unicode编码
 * 也可以输入\u + 它的码点来输入 例如 \u0065 = a ,能用于a-z 0-9之外的特殊的范围
 */
const reg1 = /\u0065/
console.log('单匹配1',reg1.test('e'));

/**
 * @description 多个字符的匹配
 * 比如，要匹配9次a字符，单字符+{}，括号内携带次数
 * {5,10} 指定5-10次匹配，都能匹配到
 * {0,}代表无限次匹配
 *  *符号可以代替{0,}
 *  +符号可以代替{1,}
 *  多个不同的字符匹配，按顺序连用即可
 */
const reg2 = /a{9}/
console.log('范围1',reg2.test('aaaaaaaaa'));

/**
 * @description 分组，可以改变运算的顺序,使用() 包裹来控制
 * reg.test返回布尔值
 * reg.exec会返回匹配组
 * reg.match和exec会根据分组返回每个分组中的内容
 * 取别名，在( 后跟?<name>可以分组
 * 提级别,如果只想改变优先级,可以?:
 */
const reg3 = /(?<n1>123)(?<n2>123)(?<n3>123)/
// 也可以写成
const reg4 = /(123)*/
console.log('分组1',reg3.test('123123123'));
console.log('分组2',reg4.test('123123123'));
console.log('分组exec',reg3.exec('123123123'));

const reg5 = /^(?<p1>a)(?<p2>bc)$/
console.log('abc分组',reg5.exec('abc'));


/**
 * @description 或的关系 | 
 * 方括号的或只能是字符,｜ 的或可以用来确定结构
 */
const reg6 = /^[1-9]|[a-z]$/
console.log('或结构的关系',reg6.exec('2'));

/**
 * @description \1
 * \1 代表括号分组里第一个里匹配到的内容
 * \S\s代表任何内容
 */
const reg7 = /<([a-z]*)>[\S\s]+<\/\1>/
console.log(reg7.test('<span>112323</span>'));