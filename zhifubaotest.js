"ui";
ui.layout(
  <vertical>
    <Switch id="autoService" text="无障碍服务" checked='{{auto.service!=null}}'/>
    <button id='bt' text='开始运行'></button>
  </vertical>
);

function main(){
  launchApp("支付宝")
  var delayTime = random(1000, 2000)
  sleep(delayTime);
  var antForest = text("蚂蚁森林").findOne()
  press(antForest.bounds().centerX(), antForest.bounds().centerY(), 1)
  sleep(delayTime);
  threads.start(finished)

  threads.start(function(){
    sleep(1000);
    var beginBtn;
    if (beginBtn = classNameContains("Button").textContains("立即开始").findOne(2000)) {
       beginBtn.click();
    }
  });

  if(!requestScreenCapture()){
    toast('请求截图失败');
    exit();
  }
  sleep(delayTime)
  var counts = 0
  while(true){
    captureScreen('/sdcard/screencapture.png');
    sleep(500)
    var img = images.read('/sdcard/screencapture.png');
    var targetX = ""
    var targetY = ""
    var points = findColor(img, "#cfff0f", {
      threshold: 4
    });
    if(points==null || counts > 5){
      var points1 = findColor(img, "#f38008", {
        threshold: 4
      });
      console.log("points22222===>", points1)
      if(points1==null){
        captureScreen('/sdcard/screencapture.png');
        img = images.read('/sdcard/screencapture.png');
        points1 = findColor(img, "#f38008", {
          threshold: 4
        });
      }
      targetX = points1.x
      targetY = points1.y
      counts = 0
    }else{
      targetX = points.x
      targetY = points.y
      counts++ 
    }
    press(targetX, targetY, 1)
    sleep(delayTime)
  }
}

function finished(){
  var finishedBtn = text("返回我的森林").findOne()
  while(finishedBtn){
    toast('能量都已经偷完啦');
    exit();
    sleep(500)
  }
}


ui.bt.click(function(){
  toast('开始啦')
  threads.start(main)
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
