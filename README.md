# Shimo 表格获取工具 / Shimo form capturing tool

该项目为石墨表格获取工具，使用用户名密码验证，并获取特定表格所有内容，返回指定 json 格式。
Shimo form capturing tool takes in user name and password for user verification and returns the content of a form being queried in json format.

## 安装 / Installation

`npm install -s shimo-sheet2json`

## 使用 / Usage

``` typescript
const client = new ShimoSheetFetcher({
  username: 'username',
  password: 'password',
  clientId: 'clientId',
  clientSecret: 'clientSecret'
});
const fileContent = await client.getFileData({
  guid: 'sheetId',
  sheetName: '工作表1',
  skipHead: 1,
  columns: [{
    name: 'name'
  }, {
    name: 'area'
  }, {
    name: 'time'
  }, {
    name: 'link'
  }, {
    name: 'remark'
  }]
});
```
## License

[MIT](./LICENSE)
