

## vue3加载优化
- https://blog.csdn.net/weixin_42232622/article/details/126504563

## 前端运行

```bash
# 克隆项目  724797236@qq.com   piplns@163.com
[git] (https://github.com/cc2049/eos-tms-v4.git)
[SVN](https://47.94.202.228:8443/21.TMS_ITEM/99.TMS4/06.WEBPC)

# 进入项目目录
cd EOS-TMS-V4

# 安装依赖
npm install

# 启动服务
npm run dev

# 构建测试环境 npm run  build:stage
# 构建生产环境 npm run build:prod
# 前端访问地址 http://localhost:8060
```

## 前端规范
- https://blog.csdn.net/jiang_jin3323/article/details/127655651
- https://github.com/lin-123/javascript

## 内置功能


## docker 重启 nginx

```
docker-compose restart etmsnginx
```




 ## 目录说明
  ```
 ├── dist # 打包项目部署程序
 │   ├── index.html.gz # 压缩文件
 │   ├── assets # 资源文件
 │   ├── tinymce # 富文本插件
 │   └── index # 入口文件
 ├── node_modules # 依赖包文件夹
 ├── public # 公共静态资源目录
 ├── src # 主开发目录
 │   ├── api # api接口文件目录
 │   ├── assets # 资源文件
 │   │   ├── icons # icon sprite 图标文件夹
 │   │   ├── images # 图片的文件夹
 │   │   ├── img # 放图片的文件夹
 │   │   └── styles # 公共文件夹
 │   ├── components # 公共组件库
 │   ├── config # 本地配置文档
 │   ├── layout/components # 布局文件
 │   │   ├── Settings # 界面设置，皮肤/字体等
 │   │   ├── Sidebar # 左侧导航文档
 │   │   ├── TagsView # 页签文档
 │   │   ├── TopMenu # 顶部导航文档
 │   │   └── index.js # 对外暴露组件文档
 │   ├── plugins # 自定义插件文档
 │   ├── router # 路由文件
 │   ├── store # 本地临时存储文件
 │   ├── utils # 工具包
 │   ├── views # 视图文件
 │   │   ├── component # 公共页面组件相关
 │   │   ├── login # 登录页面
 │   │   ├── register # 注册
 │   │   ├── index # 工作台
 │   │   ├── exception # 403、404、500页面
 │   │   ├── views # 页面类型的试图文件
 │   │   ├── project # 独立项目文件，其它是框架公共文件
 │   │   └── main # 首页看板页面
 │   ├── App.vue # 主体入口文档
 │   ├── main.js # 主体依赖注册文档
 │   ├── permission.js #  路由权限校验文档
 │   └── settings # 项目本地配置文档 
 ├── config.md # 平台配置说明文档
 ├── index.html # 开发时的项目入口
 ├── vit.config.js # vue配置文件
 ├── package.json # 依赖目录
 └── README.md # 项目说明文档
 
 ```

 ## 代码规范
  > 1. css、js、image等静态文件应该放在约定的目录里面。
  > 2. 在页面中尽量避免写入行内样式，即style=“”
  > 3. js语法中语句结束采用分号结尾，变量声明后必须用分号结尾
  > 4. 名称规范：项目名用中横线分割project-tms, 图片小写字母加下划线分割pic_TV.png , css和js 文件名称用小写字母加短横线分割，
  > 5. 变量：使用小驼峰，类型 + 对象描述或属性的方式
  > 6. 常量：使用全大写字母和下划线来组合
  > 7. 函数：使用小驼峰，统一使用动词或者动词 + 名词形式 getUserInfo()  
  > 8. 单行注释双斜杠后必须跟一个空格、缩进与下一行保持一致
  > 9. 行注释语句规则：对难以理解的代码段或者可能存在错误的代码段等可以采用多行注释（/* */），每一行以*开头，并且*后跟一个空格。
  > 10. 尽量减少循环嵌套层次，尽量避免大于三层的循环


  ## 登录页面配置控制 loginConfig

  ```
{
"style": "1-风格1，2-风格2",
"banner": "图片地址，先上传，再配置",
"isSMS": "1-启用短信登录，0不启用",
"isResetPassword": "1-启用，0不启用",
"isAppIcon": "1-启用，0不启用",
"Copyright": "版权信息"
}
  ```

  ## 单据设计，按钮配置新增一个规则，在自定义配置json, 实现当前按钮需要追加到表单页面

  >  描述：在列表页面中，新增按钮，打开表单，表单页面顶部按钮默认读取配置返回的BUTTON数组，如果数组为空，又需要一个保存按钮，此时为了避免需要再单独配置一个保存按的麻烦，所以设计的在自定义里面进行控制，把新增按钮追加到BUTTON数组里面，作为保存按钮显示界面。保存的接口地址使用新增按钮的接口地址

  ```
// inSave 是否需要在表单界面显示保存按钮
// sName  保存按钮的名称
{"inSave":"1","sName":"保存"}

  ```

## 表单详情数据来源于表格的单条数据时，单据设计，中的插槽配置 写入  CurrentData 即可



## 图标使用案例

```
<el-icon color="#949eb5" :size="26">
  <Icon icon="uiw:setting" />
</el-icon>
```


## 菜单功能的终端类型说明

```
菜单添加字段：TERMINALTYPE   适配终端类型 900000 第一位默认是9固定 
后面5位代表不同的终端 0-不适配 1-适配  第二位 PC第三位 APP第四位 小程序第五位 手持机

```

### OTHER  的配置  JSON化的 OTHER 只支持 url,params,relyOn,importantData,setvaue

```
{
    "url":"接口地址",
    "params":"固定条件{TYPE:1}",
    "relyOn":"依赖条件{PK_ORG:'ORGID'}",
    "linkage":"联动关系",
    "setvalue":"赋值条件{PK_ORG:'VALUE',A:'LABEL'}",
    "clear":"A,B,C",
    "calc":"计算条件",
    "importantData":"",
}

```