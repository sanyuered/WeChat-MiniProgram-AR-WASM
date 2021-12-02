/*
使用方法：在终端运行“node main.js”，会将../go_dev/sample.wasm压缩为../package_lesson1/assets/sample.wasm.br。
*/

// 第三方的wasm版本brotli压缩和解压缩，安装方法：npm install wasm-brotli
var brotli = require('wasm-brotli');
// node自带的库
var fs = require('fs');
// node自带的库
var util = require('util');

// 将方法包装成promise风格，以使用async/await。
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

// 压缩的示例
async function compress(){
    const content = Buffer.from('Hello, world!', 'utf8');
    const compressedContent = await brotli.compress(content);
    await writeFileAsync('./hello_world.txt.br', compressedContent);

    console.log('compress completed')
}

// 解压缩的示例
async function decompress(){
    const compressedContent = await readFileAsync('./hello_world.txt.br');
    const contenArray = await brotli.decompress(compressedContent);
    const content = Buffer.from(contenArray).toString('utf8');
   
    console.log('decompress result',content)
}

// 压缩文件的示例
async function compressFile(){
    console.log('compress start...')
    var start = Date.now()
    const content = await readFileAsync('../go_dev/sample.wasm');
    const compressedContent = await brotli.compress(content);
    await writeFileAsync('../package_lesson1/assets/sample.wasm.br', compressedContent);
    var end = Date.now()-start
    console.log('compress completed. cost',end/1000,'seconds.')
}

compressFile()
