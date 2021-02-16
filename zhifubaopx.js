"ui";
ui.layout(
  <vertical marginTop="20">
    <appbar>
      <toolbar title="能量助手" />
      <tabs id="tabs"/>
    </appbar>
    <viewpager id="page">
      <vertical>
        <text title="" marginLeft="10" marginTop="10">说明：</text>
        <text title="" marginLeft="20">1、使用本软件需要开启无障碍服务权限,请在配置页面开启</text>
        <text title="" marginLeft="20">2、本软件仅供学习和交流,请勿用于商业用途</text>
        <text title="" marginLeft="20">3、如有任何问题请联系作者，公众号：“波波科技网络公众室”</text>
        <text title="" marginLeft="20">4、扫描如下小程序二维码获取激活码</text>
        <img h="*" gravity="center" src="file:///sdcard/code.jpg"/>
        </vertical>
      <vertical>
        <Switch id="autoService" text="无障碍服务" checked='{{auto.service!=null}}'/>
        <horizontal>
          <text marginRight="10" textSize="18sp" textColor="green">能量球位置1:</text>
          <text>X坐标:</text><input id='locationX1' text="223" marginRight="10" w="90" gravity="center"/>
          <text>Y坐标:</text><input id='locationY1' text="751" w="90" gravity="center"/>
        </horizontal>
        <horizontal>
          <text marginRight="10" textSize="18sp" textColor="green">能量球位置2:</text>
          <text>X坐标:</text><input id='locationX2' text="347" marginRight="10" w="90" gravity="center"/>
          <text>Y坐标:</text><input id='locationY2' text="662" w="90" gravity="center"/>
        </horizontal>
        <horizontal>
          <text marginRight="10" textSize="18sp" textColor="green">能量球位置3:</text>
          <text>X坐标:</text><input id='locationX3' text="480" marginRight="10" w="90" gravity="center"/>
          <text>Y坐标:</text><input id='locationY3' text="616" w="90" gravity="center"/>
        </horizontal>
        <horizontal>
          <text marginRight="10" textSize="18sp" textColor="green">能量球位置4:</text>
          <text>X坐标:</text><input id='locationX4' text="616" marginRight="10" w="90" gravity="center"/>
          <text>Y坐标:</text><input id='locationY4' text="616" w="90" gravity="center"/>
        </horizontal>
        <horizontal>
          <text marginRight="10" textSize="18sp" textColor="green">能量球位置5:</text>
          <text>X坐标:</text><input id='locationX5' text="735" marginRight="10" w="90" gravity="center"/>
          <text>Y坐标:</text><input id='locationY5' text="662" w="90" gravity="center"/>
        </horizontal>
        <horizontal>
          <text marginRight="10" textSize="18sp" textColor="green">能量球位置6:</text>
          <text>X坐标:</text><input id='locationX6' text="880" marginRight="10" w="90" gravity="center"/>
          <text>Y坐标:</text><input id='locationY6' text="750" w="90" gravity="center"/>
        </horizontal>
        <horizontal>
          <text marginRight="10" textSize="18sp" textColor="#f38008">切换位置(必填):</text>
          <text>X坐标:</text><input id='locationX7' text="980" marginRight="10" w="90" gravity="center"/>
          <text>Y坐标:</text><input id='locationY7' text="1570" w="90" gravity="center"/>
        </horizontal>
        <text>提示：以上参数华为P30pro的推荐参数，您可以根据你的设备调整</text>
        <button id='sureLocation' text='保存位置' w="auto" layout_gravity="right"></button>
        <button id='clearLocation' text='清除位置' w="auto" layout_gravity="right"></button>
        <button id='bt' text='开始运行'></button>
      </vertical>
    </viewpager>
  </vertical>
);

function main(){
  // 获取本地的位置数据
  let storage = storages.create("zhifubaoApp")
  var doubleArray = storage.get("locationArray")
  var nexArray = storage.get("locationNext")
  var delayTime = random(800, 1200)
  home();
  sleep(1000)
  // 打开支付宝
  descContains("支付宝").findOne().click();
  sleep(1000)
  text("首页").waitFor()
  click('首页')
  threads.start(finished)
  sleep(delayTime);
  var antForest = text("蚂蚁森林").findOne()
  press(antForest.bounds().centerX(), antForest.bounds().centerY(), 1)
  sleep(delayTime);
  getEnergy(delayTime, nexArray, doubleArray)
}

function finished(){
  var finishedBtn = text("返回我的森林").findOne()
  while(finishedBtn){
    finishedBtn.click()
    toast('能量都已经偷完啦');
    exit();
  }
}

function getEnergy(delayTime, nexArray, doubleArray){
  while(true){
    doubleArray.forEach(function(item){
      press(item[0]+random(10,20), item[1]+random(10, 20), 1)
      sleep(delayTime)
    })
    press(nexArray[0]+random(10, 20), nexArray[1]+random(10, 20), 1)
  }
}

ui.page.setTitles(["运行说明", "配置"])
ui.tabs.setupWithViewPager(ui.page)

ui.bt.click(function(){
  let storage = storages.create("zhifubaoApp")
  let doubleArray1 = storage.get("locationArray")
  let nexArray1 = storage.get("locationNext")
  if(auto.service == null){
    toast('请开启无障碍服务')
  }else if(!nexArray1 || !doubleArray1){
    toast('请保存你的能量球位置');
    return;
  }else{
    toast('请放开你的双手,接下来的都交给我吧')
    threads.start(main)
  }
})
ui.autoService.on('check', function(checked){
  if(checked && auto.service == null){
    app.startActivity({
      action: "android.settings.ACCESSIBILITY_SETTINGS"
    })
  }
  if(!checked && auto.service != null){
    auto.service.disableSelf();
  }
})
ui.emitter.on("resume", function(){
  ui.autoService.checked = auto.service !=null
})
// 获取输入框位置并保存到本地
ui.sureLocation.click(()=>{
  let resultArray = []
  for(let i=0; i<6; i++){
    let tempXId = "locationX" + (i+1)
    let tempYId = "locationY" + (i+1)
    let xValue = ui[tempXId].getText()
    let yValue = ui[tempYId].getText()
    resultArray.push([Number(xValue),Number(yValue)])
  }

  let storage = storages.create("zhifubaoApp")
  storage.put("locationArray",resultArray)
  storage.put("locationNext",[Number(ui["locationX7"].getText()), Number(ui["locationY7"].getText())])
  toast('保存成功');
})

// 清除输入框的位置数据和本地存储的数据
ui.clearLocation.click(()=>{
  storages.remove("zhifubaoApp")
})
