# pcr-calculator
用于【蘭德索爾圖書館】的公主连结R刷图规划工具，使用Chrome extension开发

## 安装
   ~~辣鸡Google开发者注册账户要5美元，👴现在不知道怎么办了~~
   + 在Chrome应用商店中安装（推荐）
      + 目前审核还没有通过，而且因为疫情原因可能需要较长一段时间。审核通过以后才能通过此方法安装。
   + 以开发者模式安装
      1. 下载源代码，解压
      2. Chrome浏览器地址栏输入`chrome://extensions/`，进入扩展管理界面
      3. 右上角打开`开发者模式`
      4. 左上角点击`加载已解压的扩展程序`，选择源代码的根目录

## 使用方法
1. 访问[【蘭德索爾圖書館】](https://pcredivewiki.tw)的[【裝備庫】](https://pcredivewiki.tw/Armory)页面
2. 加入你想要练的角色
3. 点击右上角的`···`图标，右键点击扩展图标，选择`在工具栏中显示`
4. 点击右上角的扩展图标，按照弹出框说明操作即可
5. 如果不小心把弹出框关闭了，直接再次点击计算按钮就可以获得上次计算的结果（因为装备需求和地图数据是储存在本地的）

## Screenshot
![screenshot](https://user-images.githubusercontent.com/49602584/81465241-2e6dfb80-91fb-11ea-8e6f-f82e1839df0e.png)

## Troubleshooting
+ 点击了按钮，但是看上去好像并没有反应
   + 确保自己处于[装备库页面](https://pcredivewiki.tw/Armory)(`/Armory`)。虽然在图书馆的其他页面也能打开，但是不会有效果。
   + 可能与网络问题有关，功能在页面完全加载后才会生效，尝试等待页面加载完毕后再操作。
   + 如果重新加载了扩展，则需要刷新页面。
+ 读取地图掉落数据有问题，或前后不一致
   + 读取掉落数据前，程序会自动将单页显示设为“全部”。由于页面更新需要一定的时间，程序将等待一小段时间。如果这段时间里页面更新还没完成，则可能导致程序读取的数据不完整。尝试在等地图数据全部显示后再点击解析按钮。
+ 计算失败
   + 可能地图上限设置过低，存在现有地图中不掉落的装备，则约束条件无法满足。更改地图上限后重新解析并计算。
   + 可能未能正确解析所有地图，解决方法参加“读取地图掉落数据有问题”
+ 这里没有我的问题
   + 如果你熟悉Web开发，可以尝试按F12进入console，看看有无输出错误信息，是不是网络问题，或者哪个脚本加载失败了。
   + 你可以通过提交issue的方式来说明问题，需要说清楚能够再现问题的步骤。
   + 或者联系我的QQ：865285578 或邮箱：ljwskrskr@gmail.com
   
## TODO List
- [ ] 支持更多的算法
- [ ] 加入N2，N3等活动选项
- [ ] 弹出新标签页来显示计算结果，方便参看
- [ ] 将结果映射回原页面，方便参看