# deno 初探

### **deno是什么？**

用Rust编程，基于V8引擎，一种原生支持JS或TS的运行时

### **特征：**

1. Use JS / TS 
2. ES Modules
3. Secure by Default
4. Top Level / First Class Await

    单独使用 `await` 关键字

5. De-centralized Packages：
    
    去中心化的模块化导入，直接引入 package, 不必像 `npm` 一样下载到本地, 也不需要`package.json`文件

    ```js
    import { App } from 'https://deno.lang/x/oak/mod.ts'
    ```

6. Built In Testing

    直接集成了测试模块, 类似前端的BDD测试，基本的运行命令为 `deno test <filename>.test.js`

7. Standard Library
8. Browser Compatible API

    直接使用浏览器的api例如`window`,`setTimeout`,`fetch`等API, 见[例子](https://github.com/ys558/tech-blog-code/tree/master/2021/03-deno/browserApi.js)
9. Morden JS
10. Execute wasm binaries

    直接运行二进制文件，效率更高

### **运行文件时使用的中间件参数**

**！！deno运行的文件如何涉及网络通讯、对文件的io操作等，都需要加入参数进行运行，否则报错无法运行：**

| 安全参数 | 作用 |
| --- | --- | 
| `--allow-write`| 允许写入 |
| `--allow-read` | 允许读取 |
| `--allow-net` | 允许运行于网络 |
| `--allow-env` | 运行环境 |
| `--allow-plugin` | 读取插件 |
| `--allow-hrtime` | allow high resolution time measurement |
| `--allow-run` | 运行 |
| `-A` | 所有权限 |

### 常规实操：

+ 安装 

    我用window powershell, 运行以下命令, linux命令可见[官网](https://deno.land/#runtime-documentation)
    ```shell
    iwr https://deno.land/x/install/install.ps1 -useb | iex
    ```
    安装完成后，须要配置系统环境变量，将`C:\Users\<用户名>\.deno\bin`加入系统和用户环境变量

+ REPL, 安装完成后直接输入：`deno`可进入，如下：

```bash
yuyi@dell-laptop MINGW64 ~/Documents/study/tech-blog-code/2021/03-deno (master)
$ deno
Deno 1.7.4
exit using ctrl+d or close()
> const a = 1
undefined
>
```

+ [标准库](https://deno.land/std@0.87.0)

复制 `https://deno.land/std@0.87.0/examples/welcome.ts` 并执行如下，可见:

```bash
yuyi@dell-laptop MINGW64 ~/Documents/study/tech-blog-code/2021/03-deno (master)
$ deno run https://deno.land/std@0.87.0/examples/welcome.ts
Welcome to Deno!

yuyi@dell-laptop MINGW64 ~/Documents/study/tech-blog-code/2021/03-deno (master)
$ curl https://deno.land/std@0.87.0/examples/welcome.ts
console.log("Welcome to Deno!");
```

+ 标准库的应用，建立一个文件读取服务器：

方法1：直接运行标准库里的内容：

`deno run --allow-net --allow-read https://deno.land/std@0.87.0/http/file_server.ts`

会见到服务拉起跑在4507端口：

```bash
yuyi@dell-laptop MINGW64 ~/Documents/study/tech-blog-code/2021/03-deno (master)
$ deno run --allow-net --allow-read https://deno.land/std@0.87.0/http/file_server.ts
HTTP server listening on http://0.0.0.0:4507/
```

浏览器打开本地4507端口可见到如下：

![文件服务器](https://github.com/ys558/tech-blog-code/tree/master/2021/03-deno/img/file-server.png)

方法2：可以将标准库`file_server.ts`下载到本地运行

执行`install`命令如下：

```bash
yuyi@dell-laptop MINGW64 ~/Documents/study/tech-blog-code/2021/03-deno (master)
$ deno install https://deno.land/std@0.87.0/http/file_server.ts
✅ Successfully installed file_server
C:\Users\yuyi\.deno\bin\file_server.cmd
C:\Users\yuyi\.deno\bin\file_server (shell)
```
根据上面的提示，已经安装到deno的文件夹，可以打开deno所在的bin目录可以查看到:

![deno install 到本地](https://github.com/ys558/tech-blog-code/tree/master/2021/03-deno/img/deno-install.png)

+ 运行本地文件：`deno run <filename>.js`

可分别运行以下命令查看效果： 

`deno run 01-dateTime.ts` 终端打印出年份的序号

`deno run --allow-write 02-createFile.ts` 生成 `02-greet.txt`文件

`deno run --allow-read 03-readFile.ts` 终端打印出`02-greet.txt`里的内容

`deno run --allow-net 04-simpleServer.ts` 可以运行一个简单的服务器，浏览器里打开`http://localhost:8000`可以访问对应服务

### **rest api 应用**

见 [`restt-api`](https://github.com/ys558/tech-blog-code/tree/master/2021/03-deno/rest-api) 文件夹

### 标准库---二维码工具:

[demo](https://github.com/ys558/tech-blog-code/tree/master/2021/03-deno/qrcode.js)，运行`deno run --allow-write 05-qrcode.js test`，会随机生成一个`05-qrcode.html`的二维码文件，`test`为试生成一随机二维码

### 标准库---测试: 
[demo](https://github.com/ys558/tech-blog-code/tree/master/2021/03-deno/qrcode.js), 运行如下：

```bash
yuyi@dell-laptop MINGW64 ~/Documents/study/tech-blog-code/2021/03-deno (master)
$ deno test testSample.test.js
Check file:///C:/Users/yuyi/Documents/study/tech-blog-code/2021/03-deno/$deno$test.ts
running 1 tests
test Testing sum ... ok (3ms)

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (6ms)
```

### 项目缓存化机制 -- 重要！！！

import导入模块时，可以发现url经常带着版本号，如：`import { assertEquals } from 'https://deno.land/std@0.87.0/testing/asserts.ts'`的`@0.87.0`，但如远程版本号更新，则会影响项目运行，解决这一问题需要将版本号锁定在缓存里, 以上一个测试小项目为例，如下操作：


将我们原来的 [`testSample.test.js`](https://github.com/ys558/tech-blog-code/tree/master/2021/03-deno/testSample.test.js) 进行 import 模块化改造

1. `06-testSample.test.js` 改写如下：
```js
import { sum } from './06-testSample.js'
- import { assertEquals } from 'https://deno.land/std@0.87.0/testing/asserts.ts'
+ import { assertEquals } from './06-deps.js'

Deno.test('Testing sum', () => {
    assertEquals(sum(1,2), 3)
})
```

2. `touch 06-deps.js` 并写下：
```js
export { assertEquals } from 'https://deno.land/std@0.87.0/testing/asserts.ts'
```

3. 此时，运行`deno cache --lock=lock.json --lock-write 06-testSample.test.js`，会生成`lock.json`文件，内容如下：
```json
{
  "https://deno.land/std@0.87.0/fmt/colors.ts": "db22b314a2ae9430ae7460ce005e0a7130e23ae1c999157e3bb77cf55800f7e4",
  "https://deno.land/std@0.87.0/testing/_diff.ts": "961eaf6d9f5b0a8556c9d835bbc6fa74f5addd7d3b02728ba7936ff93364f7a3",
  "https://deno.land/std@0.87.0/testing/asserts.ts": "de942b2e1cb6dac1c1c4a7b698be017337e2e2cc2252ae0a6d215c5befde1e82"
}
```
！该文件类似于npm的 `package-lock.json` 文件，将版本锁定在缓存里，后面一连串的值为hash值

4. 运行缓存的模块，只需运行`deno cache --lock=lock.json sample.js` 即可，
运行 `deno cache --reload --lock=lock.json testSample.test.js`, 类似于npm的 `npm ci`, 则会重新下载所有依赖, 如下图：

```bash
yuyi@dell-laptop MINGW64 ~/Documents/study/tech-blog-code/2021/03-deno (master)
$ deno cache --reload --lock=lock.json testSample.test.js
Download https://deno.land/std@0.87.0/testing/asserts.ts
Download https://deno.land/std@0.87.0/fmt/colors.ts
Download https://deno.land/std@0.87.0/testing/_diff.ts
Check file:///C:/Users/yuyi/Documents/study/tech-blog-code/2021/03-deno/testSample.test.js
```