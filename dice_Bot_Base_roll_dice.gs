//ダイスボットの実装
DiceBotBase.prototype.execute = function(){
  var tempStr;
  var isFirst = true;
  while(tempStr = this.allMatcher.exec(this.userMessage)){
    if(!isFirst)    
      this.addPublicMessage("\n");
    else
      isFirst = false;
    this.getNext(tempStr);
  }
  return this.pushMessage;
}

DiceBotBase.prototype.getNext = function(tempStr){
  if(!tempStr)
    return null;
  var s;
  for(var i=0; i<this.matcherArray.length; i++)
    if(s = tempStr[0].match(this.matcherArray[i][0])){
      this.initCalc();
      return this.matcherArray[i][1](s);
    }
  return null;
}

//通常ダイスを得る
DiceBotBase.prototype.getDice = function(msg){
  if(!this.calcDiceCoefficient(msg))
    return;
  this.showDice();
  this.execDice();
};

//ダイス計算に関する変数を初期化
DiceBotBase.prototype.initCalc = function(){
  this.changeValue = 0;
  this.times = null;
  this.faces = null; 
  
  this.skillName = "";
  this.targetValue = null;
  this.targetSuccess = null;
  this.successTimes = 0;
  
  this.finalResult = null;
  this.resultArray = [];
  this.result = null;
  this.repeatTimes = 1;
  this.targetSuccess = 0;
  
  this.isReversed = false;
  this.isReversedStr = "";
  this.criticalValue = null;
  this.criticaled = false;
  this.fumbleValue = null;
  this.fumbled = false;
  
  this.optionalDiceArray = [];
}

//ダイスの内容を求める
DiceBotBase.prototype.calcDiceCoefficient = function(str){
  if(str == null)
    return false;
  
  if(str[2] != null){
    if(str[1] != null){
      this.skillName = str[1];
    }
    this.targetValue = Number(str[2]);
  }
  if(str[3] != null){
    this.isReversed = true;
    this.isReversedStr = "-";
  }  
  this.times = Number(str[4]);
  this.faces = Number(str[5]);
  if(str[6] != null){
    this.criticalValue = Number(str[6]);
  }
  if(str[7] != null || str[8] != null){
    if(str[8] != null)
      this.fumbleValue = Number(str[8]);
    else
      this.fumbleValue = 2;    
  }
  if(str[9]!= null){//整数の足し引き算orダイスの足し引き算
    var tempmes = str[9];
    var culcmes;
    while((culcmes = this.OPTIONAL_DICE_MATCHER.exec(tempmes)) !== null){
      this.optionalDiceArray.push(culcmes);
    }
  }
  if(str[10] != null){
    this.repeatTimes = Number(str[10]);
    if(str[11] != null){
      this.targetSuccess = Number(str[11]);
    }
  }
  return true;
}

//ダイスの内容を表示
DiceBotBase.prototype.showDice = function(){
  if(this.targetValue)
    this.addPublicMessage(this.skillName+"("+this.targetValue+") ");
  this.addPublicMessage(this.isReversedStr+this.times+"d"+this.faces);
  if(this.criticalValue)
    this.addPublicMessage("c"+this.criticalValue);
  if(this.fumbleValue)
    this.addPublicMessage("f"+this.fumbleValue);
  for(var i=0; i<this.optionalDiceArray.length;i++){
    if(this.optionalDiceArray[i][4] != null)
      this.addPublicMessage(this.optionalDiceArray[i][1]+this.optionalDiceArray[i][4]);
    else{
      this.addPublicMessage(this.optionalDiceArray[i][1]+this.optionalDiceArray[i][2]+"d"+this.optionalDiceArray[i][3]);
    }
  }
  if(this.repeatTimes > 1){
    this.addPublicMessage("*"+this.repeatTimes);
    if(this.targetSuccess > 0)
      this.addPublicMessage(","+this.targetSuccess);
  }
  if(this.repeatTimes > 1)
    this.addPublicMessage("\n");
}

//ダイスの結果を計算＆表示
DiceBotBase.prototype.execDice  = function(){
  if(this.isRepeatOutOfRange())
    return;
  for(var i=0; i<this.repeatTimes; i++){
    if(!this.rollDiceArray(this.times, this.faces, this.isReversed))
      return;
    this.finalResult = this.result;
    for(var j=0; j<this.optionalDiceArray.length;j++){ 
      var coef = 1;
      if(this.optionalDiceArray[j][1] == "-")
        coef = -1;
      var result_tmp; 
      if(this.optionalDiceArray[j][4] != null){
        this.addSecretMessage(' ' + this.optionalDiceArray[j][1]);
        result_tmp = this.optionalDiceArray[j][4] * coef;
        this.addSecretMessage(' [' + String(result_tmp) +'] ');
      } else{
        if(this.optionalDiceArray[j][1] == "+")
          this.addSecretMessage(' ' + this.optionalDiceArray[j][1]);
        this.rollDice(this.optionalDiceArray[j][2],this.optionalDiceArray[j][3], this.optionalDiceArray[j][1] == "-");
        result_tmp = this.result;
      }
      this.finalResult += result_tmp;
    }
    this.addPublicMessage("= "+this.finalResult);
    if(this.targetValue)
      this.judge();
    this.criticaled = this.criticaled | this.isCritical();
    this.fumbled = this.fumbled | this.isFumble();
    if(this.targetSuccess != 0 && this.targetSuccess <= this.successTimes)
      break;
    if(this.repeatTimes - i > 1)
      this.addPublicMessage("\n");
  }
  if(this.repeatTimes > 1){  
    if(this.targetValue){
      this.addSecretMessage('\n');
      this.addSecretMessage('成功度'+ this.successTimes, 1, 2);  
      if(this.criticaled){
        this.addSecretMessage(' (クリティカル)', 1, 2);
      }
      if(this.fumbled){
        this.addSecretMessage(' (ファンブル)', 1, 2);
      }
    }
  }
}

//成功失敗の判定
DiceBotBase.prototype.judge = function(){
  if(this.times==1 && this.faces==100){
    if(this.targetValue >= this.finalResult){
      this.successTimes++;
      this.addSecretMessage(' 成功', 1, 2);
    } else if(this.repeatTimes == 1)
      this.addSecretMessage(' 失敗', 1, 2);
  } else{
    if(this.targetValue <= this.finalResult){
        this.successTimes++;
        this.addSecretMessage(' 成功', 1, 2);
      } else if(this.repeatTimes == 1)
        this.addSecretMessage(' 失敗', 1, 2);
  }
}

// Satspe, Coc only
DiceBotBase.prototype.getShortDice = function(str){
  var ary = Array(12);
  for (var i = 0; i < 12; i++) {
    ary[i] = null;
  }
  ary[2] = str[1];
  ary[4] = this.SHORT_DICE_TIMES;
  ary[5] = this.SHORT_DICE_FACES;
  ary[6] = str[2];
  ary[7] = str[3];
  ary[8] = str[4];
  ary[10] = str[5] ?  str[5]: '1';
  ary[11] = str[6];
  this.getDice(ary);
}
