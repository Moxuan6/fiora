// 敏感词过滤插件
// 从 JSON 文件加载初始敏感词列表
let words: string[] = [];
let cachedRegex: RegExp | null = null;
try {
    // 从 config/SensitiveLexicon.json 加载词库
    // @ts-ignore
    const lexicon: { words: string[] } = require('../config/SensitiveLexicon.json');
    words.push(...lexicon.words);
} catch (error) {
    console.error('Failed to load SensitiveLexicon.json:', error);
}

/** 注册敏感词列表，可多次调用追加 */
export function registerSensitiveWords(list: string[]) {
    words.push(...list);
    cachedRegex = new RegExp(words.map(w => escapeRegExp(w)).join('|'), 'gi');
}

// 转义正则特殊字符
function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\\]\\]/g, '$&');
}

/** 对文本进行敏感词替换，替换为指定占位符 */
export function sanitize(content: string, placeholderChar = '*'): string {
    if (!words.length) return content;
    if (!cachedRegex) {
        cachedRegex = new RegExp(words.map(w => escapeRegExp(w)).join('|'), 'gi');
    }
    return content.replace(cachedRegex, match => placeholderChar.repeat(match.length));
}
