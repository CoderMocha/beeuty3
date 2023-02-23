import cpy from 'cpy'
import {dirname, resolve } from 'path'
import {promises as fs} from 'fs'
import less from 'less'
import glob from 'fast-glob'

const sourceDir = resolve(__dirname, '../src')
// Lib文件
const targetLib = resolve(__dirname, '../lib')
// Es文件
const targetEs = resolve(__dirname, '../es')
const srcDir = resolve(__dirname, '../src')
const buildLess = async () => {
  // 直接将less文件复制到打包后的目录
  await cpy(`${sourceDir}/**/*.less`, targetLib)
  await cpy(`${sourceDir}/**/*.less`, targetEs)
  //获取打包后.less文件目录(lib和es一样)
  const lessFiles = await glob('**/*.less', { cwd: srcDir, onlyFiles: true })

  for (let path in lessFiles) {
    const filePath = `${srcDir}/${lessFiles[path]}`
    //获取less文件字符串
    const lessCode = await fs.readFile(filePath, 'utf-8')
    //将less解析成css
    const code = await less.render(lessCode, {
      paths: [srcDir, dirname(filePath)]
    })
    //拿到.css后缀path
    const cssPath = lessFiles[path].replace('.less', '.css')

    await fs.writeFile(resolve(targetLib, cssPath), code.css)
    await fs.writeFile(resolve(targetEs, cssPath), code.css)
  }
}
buildLess()
