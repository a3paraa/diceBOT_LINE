function DiceBotBase() {}

//継承を実現する関数
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

//初期化
DiceBotBase.prototype.init = function(msg,userid){
  this.userMessage = msg;
  this.pushMessage = "";
  this.secretMessage = "";
  this.userId = userid;
  this.secretFlag = 0;
  this.optionalDiceArray = [];
  this.sheetArray = [];
  this.dataArray = [];
  this.MAX_TIMES = 100;
  this.MAX_FACES = 1000;
  this.MAX_REPEAT = 200;
  this.DICE_MATCHER_STRING = "(?:([^0-9\\s\\*@]*) ? ?(\\d+) ? )?(- ? ?)?(\\d+)d(\\d+)(?: ? ?c ?(\\d+))?(?: ? ?(f) ?(\\d+)?)?((?: ? ?[\\+-] ? ?(?:\\d+d\\d+|\\d+))*)(?: ? ?[\\*@] ?(\\d+)(?: ?, ?(\\d+))?)?"; //技能値付きの文字列;
  this.DICE_MATCHER = new RegExp(this.DICE_MATCHER_STRING, 'i');
  this.OPTIONAL_DICE_MATCHER = / ? ?([\+-]) ? ?(?:(\d+)d(\d+)|(\d+))/gi;  
  this.matcherStringArray = [];
  this.matcherArray = [];
  
  //Satspe, CoC only
  this.SHORT_DICE_STRING = '(\\d+) ? ?(?: ? ?c ?(\\d+))?(?: ? ?(f) ?(\\d+)?)? ? ?[\\*@] ? ?(\\d+)?(?: ?, ?(\\d+))?'
  this.SHORT_DICE_MATCHER = new RegExp(this.SHORT_DICE_STRING, 'i');
  this.SHORT_DICE_TIMES = '2';
  this.SHORT_DICE_FACES = '6';
  this.SHORT_DICE_ACTIVATED = false;
  
  this.initOptional();
  this.matcherStringArray.push(this.DICE_MATCHER_STRING);
  this.matcherArray.push([this.DICE_MATCHER,this.getDice.bind(this)]);
  if(this.SHORT_DICE_ACTIVATED){
    this.matcherStringArray.push(this.SHORT_DICE_STRING);
    this.matcherArray.push([this.SHORT_DICE_MATCHER,this.getShortDice.bind(this)]);  
  }
  this.makeAllMatcher();
}
//継承先クラスで定義するメソッド
DiceBotBase.prototype.initOptional = function(){};
DiceBotBase.prototype.isCritical = function(){};
DiceBotBase.prototype.isFumble = function(){};

//ダイスボットの検索対象全てにマッチする正規表現を作る
DiceBotBase.prototype.makeAllMatcher = function(){
  var tempStr = "";
  for(var i=0; i<this.matcherStringArray.length; i++){
    tempStr += "(?:"+this.matcherStringArray[i]+")";
    if(i+1 < this.matcherStringArray.length)
      tempStr += "|"
  }
  this.allMatcher = new RegExp(tempStr, "gi");
}

//通常メッセージを追加
DiceBotBase.prototype.addPublicMessage = function(str){
  this.pushMessage += str;
  this.secretMessage += str;
}
//秘密メッセージを追加
DiceBotBase.prototype.addSecretMessage = function(str){
  this.pushMessage += str;
  this.secretMessage += str;
}
DiceBotBase.prototype.addSecretQuestion = function(level){
  if(level == undefined){
    level = 1; 
  }
  if(this.secret_flag >= level){
    this.addSecretMessage('?'); 
  }
}

//繰り替えし数が規定値以内か確認
DiceBotBase.prototype.isRepeatOutOfRange = function(){
  if(this.repeatTimes > this.MAX_REPEAT || this.repeatTimes <= 0){
    this.addPublicMessage('エラー(繰り返し数)');
    return true;
  }
  return false;
}

//ダイスの繰り替えし数などが規定値以内か確認
DiceBotBase.prototype.isDiceOutOfRange = function(times, faces){
  if(times > this.MAX_TIMES ){
    this.addPublicMessage('エラー(ダイス数)');
    return true;
  }
  if(faces > this.MAX_FACES ){
    this.addPublicMessage('エラー(ダイスの面の数)');
    return true;
  }
  return false;
}

//ダイスの出目を計算
DiceBotBase.prototype.calcDice = function(faces, isFirst){
  var num = Math.floor(Math.random() * faces) + 1;
  if(isFirst){
    this.addSecretMessage(' ');
  } else {
    this.addSecretMessage(', ');
  }
  this.addSecretMessage(String(num));
  return num;
}
//ダイスの出目を計算(配列に入れるタイプ)
DiceBotBase.prototype.calcDiceWithPush = function(faces, isFirst){
  var num = this.calcDice(faces, isFirst);
  this.resultArray.push(num);
  return num;
}

//ダイスを振る（合計値を返すタイプ）
DiceBotBase.prototype.rollDice = function(times, faces, rev){
  var section_sum = 0;
  if(this.isDiceOutOfRange(times, faces)){
    return false;
  }
  if(rev)
    this.addSecretMessage(' -');
  this.addSecretMessage(' {');
  if(times){
    section_sum += this.calcDice(faces, true);
  }
  //ダイスの出目を計算(残り)
  for(var j=1; j < times;j++){
    section_sum += this.calcDice(faces, false);
  }
  //中括弧を閉じる
  this.addSecretMessage(' } ');
  if(rev)
    section_sum *= -1;
  if(this.optionalDiceArray.length)
    this.addSecretMessage('[' + String(section_sum) + '] ');
  this.result = section_sum;
  return true;
}
//ダイスを振る　結果が配列に入って出てくるタイプ(最後の要素は合計値)
DiceBotBase.prototype.rollDiceArray = function(times, faces, rev){
  this.resultArray = [];
  var sum = 0;
  if(this.isDiceOutOfRange(faces, times)){
    return false;
  }
  if(rev)
    this.addSecretMessage(' -');
  this.addSecretMessage(' {');
  var num;
  if(times){
    sum += this.calcDiceWithPush(faces, true);
  }
  //ダイスの出目を計算(残り)
  for(var j=1; j < times;j++){ 
    sum += this.calcDiceWithPush(faces, false);
  }
  //中括弧を閉じる
  this.addSecretMessage(' } ');
  if(rev)
    sum *= -1;
  if(this.optionalDiceArray.length)
    this.addSecretMessage('[' + String(sum) + '] ');
  this.resultArray.push(sum);
  this.result = sum;
  return true;
}

// シートのメモ化を行う関数
// function getDataSheet() {
//   if (getDataSheet.memoSheet) { return getDataSheet.memoSheet; } 
//   getDataSheet.memoSheet = SpreadsheetApp.openById('##########################################');
//   return getDataSheet.memoSheet;
// }
function getCharaSheet() {
  if (getCharaSheet.memoSheet) { return getCharaSheet.memoSheet; } 
  getCharaSheet.memoSheet = SpreadsheetApp.openById('19nL67J7hLnjN-8FLA7CUW4ZLPY__yJwNpAkc46OCMLo');
  return getCharaSheet.memoSheet;
}

// 特定のシートのメモ化を行う関数
DiceBotBase.prototype.sheetInit = function(sheetName){
  this.sheetArray[sheetName] = null;
}
DiceBotBase.prototype.getSheet = function(sheetName, sheet) {
  if(sheet == undefined){
    // sheet = getDataSheet();
  }
  if (this.sheetArray[sheetName] != null) { return this.sheetArray[sheetName]; }
  
  this.sheetArray[sheetName] = sheet.getSheetByName(sheetName);
  return this.sheetArray[sheetName];
}
DiceBotBase.prototype.getData = function(label, sheetName, line, row, lineSize, rowSize){
  if(this.dataArray[label] == undefined){
    this.dataArray[label] = this.getSheet(sheetName, getDataSheet()).getRange(line, row, lineSize, rowSize).getValues();
  }
  return this.dataArray[label];
}
