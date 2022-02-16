function DiceBotSatspe() {}
//継承
inherits(DiceBotSatspe, DiceBotBase);

//初期化
DiceBotSatspe.prototype.initOptional = function(){
  this.SHORT_DICE_TIMES = '2';
  this.SHORT_DICE_FACES = '6';
  this.SHORT_DICE_ACTIVATED = true;

  // this.matcherStringArray.push(this.TAG_MATCHER_STRING = "tags? ?(?:[\\*@](\\d+))?");
  // this.matcherStringArray.push(this.GET_MATCHER_STRING = "get([a-z]) ?(?:[\\*@](\\d+))?");
  // this.matcherStringArray.push(this.JEVE_MATCHER_STRING = "jeve([a-z]) ?(?:[\\*@](\\d+))?");
  // this.matcherStringArray.push(this.JHAP_MATCHER_STRING = "jhap([a-z]) ?(?:[\\*@](\\d+))?");
  // this.matcherStringArray.push(this.FATAL_MATCHER_STRING = "fatal ?(?:\\*[\\*@](\\d+))?");
  // this.matcherStringArray.push(this.FAV_MATCHER_STRING = "fav ?(?:[\\*@](\\d+))?");
  // this.matcherStringArray.push(this.SEIGOU_MATCHER_STRING = "seigou ?(?:[\\*@](\\d+))?");
  // this.matcherStringArray.push(this.UMARE_MATCHER_STRING = "umare ?(?:[\\*@](\\d+))?");
  // this.matcherStringArray.push(this.ENCOUNTER_MATCHER_STRING = "(?:souguu|encounter|s) ? ? ?\\/ ? ? ?((?:minami|m)|(?:chuukagai|tyuukagai|chukagai|chuka|chuuka|tyuuka|tyuka|c)|(?:gunkanjima|gunkan|g)|(?:kanchogai|kantyogai|k)|(?:juusou|jusou|juso|juuso|j)|(?:syaokin|s)) ?(?:[\\*@](\\d+))?");
  // this.matcherArray.push([this.TAG_MATCHER = new RegExp(this.TAG_MATCHER_STRING,'i'),this.getTag.bind(this)]);
  // this.matcherArray.push([this.GET_MATCHER = new RegExp(this.GET_MATCHER_STRING,'i'),this.getDrop.bind(this)]);
  // this.matcherArray.push([this.JEVE_MATCHER = new RegExp(this.JEVE_MATCHER_STRING,'i'),this.getJeve.bind(this)]);
  // this.matcherArray.push([this.JHAP_MATCHER = new RegExp(this.JHAP_MATCHER_STRING,'i'),this.getJhap.bind(this)]);
  // this.matcherArray.push([this.FATAL_MATCHER = new RegExp(this.FATAL_MATCHER_STRING,'i'),this.getFatal.bind(this)]);
  // this.matcherArray.push([this.FAV_MATCHER = new RegExp(this.FAV_MATCHER_STRING,'i'),this.getFav.bind(this)]);
  // this.matcherArray.push([this.SEIGOU_MATCHER = new RegExp(this.SEIGOU_MATCHER_STRING,'i'),this.getSeigou.bind(this)]);
  // this.matcherArray.push([this.UMARE_MATCHER = new RegExp(this.UMARE_MATCHER_STRING,'i'),this.getUmare.bind(this)]);
  // this.matcherArray.push([this.ENCOUNTER_MATCHER = new RegExp(this.ENCOUNTER_MATCHER_STRING,'i'),this.getEncounter.bind(this)]);  
 
};

//クリティカルの基準
DiceBotSatspe.prototype.isCritical = function(){
  if(!this.targetValue || this.times != 2 || this.faces != 6 || this.criticalValue == null)
      return false;
  if(this.criticalValue <= this.finalResult){
    this.addSecretMessage(' 必殺!', 1, 2);
    return true;
  }
  return false;
};
//ファンブルの基準
DiceBotSatspe.prototype.isFumble = function(){
  if (this.fumbleValue == null)
    this.fumbleValue = 1
  if(!this.targetValue || this.times != 2 || this.faces != 6)
      return false;
  if(this.resultArray[0] == this.resultArray[1] && this.fumbleValue >= this.resultArray[0]){
    this.addSecretMessage(' ファンブル!', 1, 2);
    return true;
  }
  return false;
};
//タグを得る
// DiceBotSatspe.prototype.getTag = function(Message){
//   if(Message[1]!=null)
//     this.repeatTimes = Number(Message[1]);
//   var label = 'タグ';
//   this.addPublicMessage(label);
//   if(this.repeatTimes!=1){
//     this.addPublicMessage('*'+this.repeatTimes);
//   }
//   this.addPublicMessage(':');
//   if(this.isRepeatOutOfRange())
//     return; 
//   if(this.repeatTimes>1){
//     this.addSecretMessage('\n');
//   }
//   var data = this.getData('タグ', 'タグ', 1, 3, 36, 1);
//   this.addSecretQuestion();
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDiceArray(2,6);
//     var value = (this.resultArray[0]-1)*6 + this.resultArray[1];
//     this.addSecretMessage(data[value-1]);
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }
// //致命傷表を得る
// DiceBotSatspe.prototype.getFatal = function(Message){
//   if(Message[1]!=null)
//     this.repeatTimes = Number(Message[1]);
//   var label = '致命傷表';
//   this.addPublicMessage(label);
//   if(this.repeatTimes!=1){
//     this.addPublicMessage('*'+this.repeatTimes);
//   }
//   this.addPublicMessage(':');
//   if(this.isRepeatOutOfRange())
//     return;
//   if(this.repeatTimes>1){
//     this.addSecretMessage('\n');
//   }
//   var data = this.getData('致命傷', '致命傷表', 1, 2, 11, 1);
//   this.addSecretQuestion();
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDice(2,6);
//     this.addSecretMessage('= '+ this.result +'\n'+ String(data[this.result-2]));
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }
// //ドロップ品を振る
// DiceBotSatspe.prototype.getDrop = function(Message){
//   if(Message[2]!=null)
//     this.repeatTimes = Number(Message[2]);
//   var type = Message[1].toLowerCase();
//   var sheet;
//   var label;
//   switch(type){
//     case"g":
//       sheet = this.getSheet('ガラクタ表');
//       label = 'ガラクタ表';
//       break;
//     case"j":
//     case"z":
//       sheet = this.getSheet('実用品表');
//       label = '実用品表';
//       break;
//     case"n":
//       sheet = this.getSheet('値打ちもの表');
//       label = '値打ちもの表';
//       break;
//     case"k":
//       sheet = this.getSheet('奇天烈表');
//       label = '奇天烈表';
//       break;
//     default:
//       label = 'エラー';
//       break;
//   }
//   this.addPublicMessage(label);
//   if(this.repeatTimes!=1){
//     this.addPublicMessage('*'+this.repeatTimes);
//   }
//   this.addPublicMessage(':');
//   if(this.isRepeatOutOfRange())
//     return;
//   if(this.repeatTimes>1){
//     this.addSecretMessage('\n');
//   }
//   this.addSecretQuestion();
//   var data = this.getData(label, label, 1, 2, 11, 1);
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDice(2,6);
//     this.addSecretMessage( '= '+ this.result +'\n'+ String(data[this.result-2]));
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }
// //情報イベントを得る
// DiceBotSatspe.prototype.getJeve = function(Message){
//   var type = Message[1].toLowerCase();
//   if(Message[2]!=null)
//     this.repeatTimes = Number(Message[2]);
//   var label = '情報イベント[';
//   var row = 1;
//   switch(type){
//     case"h"://犯罪
//     case"c":
//       row = 2;
//       label+='犯罪';
//       break;
//     case"s"://生活
//     case"l":
//       row = 3;
//       label+='生活';
//       break;
//     case"r"://恋愛
//       row = 4;
//       label+='恋愛';
//       break;
//     case"k"://教養
//     case"e":
//       row = 5;
//       label+='教養';
//       break;
//     default:
//       label+='エラー';
//       label+=']';
//       this.addPublicMessage(label);
//       return;
//   }
//   label+=']';
//   this.addPublicMessage(label);
//   if(this.repeatTimes!=1){
//     this.addPublicMessage('*'+this.repeatTimes);
//   }
//   this.addPublicMessage(':');
//   if(this.isRepeatOutOfRange())
//     return;
//   if(this.repeatTimes>1){
//     this.addSecretMessage('\n');
//   }
//   this.addSecretQuestion();
//   var data = this.getData(label, '情報イベント', 2, row, 11, 1);
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDice(2,6);
//     this.addSecretMessage( '= '+ this.result +'\n'+String(data[this.result-2]));
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }
// //情報ハプニングを得る
// DiceBotSatspe.prototype.getJhap = function(Message){
//   var type = Message[1].toLowerCase();
//   if(Message[2]!=null)
//     this.repeatTimes = Number(Message[2]);
//   var label = '情報ハプニング[';
//   var row = "A";
//   switch(type){
//     case"h"://犯罪
//     case"c":
//       row = 2;
//       label+='犯罪';
//       break;
//     case"s"://生活
//     case"l":
//       row = 3;
//       label+='生活';
//       break;
//     case"r"://恋愛
//       row = 4;
//       label+='恋愛';
//       break;
//     case"k"://教養
//     case"e":
//       row = 5;
//       label+='教養';
//       break;
//     default:
//       label+='エラー';
//       label+=']';
//       this.addPublicMessage(label);
//       return;
//   }
//   label+=']';
//   this.addPublicMessage(label);
//   if(this.repeatTimes!=1){
//     this.addPublicMessage('*'+this.repeatTimes);
//   }
//   this.addPublicMessage(':');
//   if(this.isRepeatOutOfRange())
//     return;
//   if(this.repeatTimes>1){
//     this.addSecretMessage('\n');
//   }
//   var data = this.getData(label, '情報ハプニング', 2, row, 11, 1);
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDice(2,6);
//     this.addSecretMessage( '= '+ this.result +'\n'+String(data[this.result-2]));
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }
// //好みを得る
// DiceBotSatspe.prototype.getFav = function(Message){
//   if(Message[1]!=null)
//     this.repeatTimes = Number(Message[1]);
//   var label = '好み';
//   this.addPublicMessage(label);
//   if(this.repeatTimes!=1){
//     this.addPublicMessage('*'+this.repeatTimes);
//   }
//   this.addPublicMessage(':');
//   if(this.isRepeatOutOfRange())
//     return;
//   if(this.repeatTimes>1){
//     this.addSecretMessage('\n');
//   }
//   this.addSecretQuestion();
//   var data = this.getData('好み', '好み', 1, 3, 18, 1);
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDiceArray(2,6);
//     this.addSecretMessage(data[(3*(this.resultArray[0]-1)+ Math.floor((this.resultArray[1]-1)/2))]);
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }
// //性業値を得る
// DiceBotSatspe.prototype.getSeigou = function(Message){
//   if(Message[1]!=null)
//     this.repeatTimes = Number(Message[1]);
//   var label = '性業値';
//   this.addPublicMessage(label);
//   if(this.repeatTimes!=1){
//     this.addPublicMessage('*'+this.repeatTimes);
//   }
//   this.addPublicMessage(':');
//   if(this.isRepeatOutOfRange())
//     return;
//   if(this.repeatTimes>1){
//     this.addSecretMessage('\n');
//   }
//   this.addSecretQuestion();
//   var data = this.getData('性業値', '性業値', 1, 2, 11, 1);
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDice(2,6);
//     this.addSecretMessage('= '+ this.result +'  性業値'+data[this.result-2]);
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }
// //生まれ表を得る
// DiceBotSatspe.prototype.getUmare = function(Message){
//   if(Message[1]!=null)
//     this.repeatTimes = Number(Message[1]);
//   var label = '生まれ表';
//   this.addPublicMessage(label);
//   if(this.repeatTimes!=1){
//     this.addPublicMessage('*'+this.repeatTimes);
//   }
//   this.addPublicMessage(':');
//   if(this.isRepeatOutOfRange())
//     return;
//   if(this.repeatTimes>1){
//     this.addSecretMessage('\n');
//   }
//   this.addSecretQuestion();
//   var data = this.getData('生まれ表', '生まれ表', 1, 2, 21, 1);
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDiceArray(2,6); 
//     //d66の出目計算
//     var val_min = Math.min(this.resultArray[0],this.resultArray[1]);
//     var val_max = Math.max(this.resultArray[0],this.resultArray[1]);
//     var dice_value = 0;
//     for(var j = 0; j < val_min - 1; j++){
//       for(var k = 0; k < 6-j; k++){
//         dice_value++;
//       }
//     }
//     dice_value += val_max - (val_min-1);
//     //ここまで
//     this.addSecretMessage(' → ' + val_min + val_max + '\n');
//     this.addSecretMessage(data[dice_value-1]);
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }
// //遭遇表を得る　
// DiceBotSatspe.prototype.getEncounter = function(Message){
//   var type = Message[1][0].toLowerCase();
//   if(Message[2]!=null)
//     this.repeatTimes = Number(Message[2]);
//   var label = '遭遇表[';
//   var row = 1;
//   switch(type){
//     case"m"://ミナミ
//       row = 2;
//       label+='ミナミ';
//       break;
//     case"c"://中華街
//       row = 3;
//       label+='中華街';
//       break;
//     case"g"://軍艦島
//       row = 4;
//       label+='軍艦島';
//       break;
//     case"k"://官庁街
//       row = 5;
//       label+='官庁街';
//       break;
//     case"j"://十三
//       row = 6;
//       label+='十三';
//       break;
//     case"s"://沙京
//       row = 7;
//       label+='沙京';
//       break;
//     default:
//       label+='エラー';
//       label+=']';
//       this.addPublicMessage(label);
//       return;
//   }
//   label+=']';
//   this.addPublicMessage(label);
//   if(this.repeatTimes!=1){
//     this.addPublicMessage('*'+this.repeatTimes);
//   }
//   this.addPublicMessage(':');
//   if(this.isRepeatOutOfRange())
//     return;
//   if(this.repeatTimes>1){
//     this.addSecretMessage('\n');
//   }
//   var data = this.getData(label, '遭遇表', 2, row, 11, 1);
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDice(2,6);
//     this.addSecretMessage( '= '+ this.result +'\n'+String(data[this.result-2]));
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }