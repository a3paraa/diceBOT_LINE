function DiceBotCoc() {}
//継承
inherits(DiceBotCoc, DiceBotBase);

//初期化
DiceBotCoc.prototype.initOptional = function(){
  this.SHORT_DICE_TIMES = '1';
  this.SHORT_DICE_FACES = '100';
  this.SHORT_DICE_ACTIVATED = true;
  
  this.LOADER_MATCHER = /@load/gi;
  this.matcherStringArray.push(this.SHORTCUT_MATCHER_STRING = "@([^\\d\\s;:,\\/\\?\\*\\+\\-^=\\(\\.\\)&%$#\"@!'<>]+(?:\\([^\\(\\)]+\\))?) *((?:(?:\\+ *\\d+)|(?:- *\\d+)|(?:[@\\*] *\\d+)|(?:\\/ *\\d+))*)");
  // this.matcherStringArray.push(this.INSANS_MATCHER_STRING = "insans ?(?:[\\*@](\\d+))?");
  // this.matcherStringArray.push(this.INSANL_MATCHER_STRING = "insanl ?(?:[\\*@](\\d+))?");

  // this.matcherArray.push([this.INSANS_MATCHER = new RegExp(this.INSANS_MATCHER_STRING,'i'),this.getInsanS.bind(this)]);
  // this.matcherArray.push([this.INSANL_MATCHER = new RegExp(this.INSANL_MATCHER_STRING,'i'),this.getInsanL.bind(this)]);
  this.matcherArray.push([this.SHORTCUT_MATCHER = new RegExp(this.SHORTCUT_MATCHER_STRING,'i'),this.shortcutDice.bind(this)]);
};

//ダイスボットの実装
DiceBotCoc.prototype.execute = function(){
  if(this.userMessage.search(this.LOADER_MATCHER)>=0){Logger.log("***");
    this.loadCharacterData(this.userMessage.replace(this.LOADER_MATCHER, ""));
    return this.pushMessage;
  }
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

//クリティカルの基準
DiceBotCoc.prototype.isCritical = function(){
  if(!this.targetValue || this.times != 1 || this.faces != 100)
    return false;
  if(Math.floor(this.targetValue/5) >= this.finalResult){
    this.addSecretMessage(' スペシャル!', 1, 2);
    return true;
  }
  return false;
}
//ファンブルの基準
DiceBotCoc.prototype.isFumble = function(){
  if(!this.targetValue || this.times != 1 || this.faces != 100)
      return false;
  if(96 <= this.finalResult && this.targetValue < this.finalResult){
    this.addSecretMessage(' ファンブル!', 1, 2);
    return true;  
  }
  return false;
}

//新しいキャラシを作る
DiceBotCoc.prototype.createNewCharaSheet =  function(){
  if(this.getSheet("chara\"" + this.userId + "\"",getCharaSheet()) == null){
    this.sheetArray["chara\"" + this.userId + "\""] = this.getSheet('skill_default',getCharaSheet()).copyTo(getCharaSheet()).setName("chara\"" + this.userId + "\"");
  }
  else{
    getCharaSheet().deleteSheet(this.getSheet("chara\"" + this.userId + "\"",getCharaSheet()));
    this.sheetInit("chara\"" + this.userId + "\"");
    this.sheetArray["chara\"" + this.userId + "\""] = this.getSheet('skill_default',getCharaSheet()).copyTo(getCharaSheet()).setName("chara\"" + this.userId + "\"");
  }
}
//キャラデータのロード
DiceBotCoc.prototype.loadCharacterData = function(msg){
  this.createNewCharaSheet();
  var userSheet = this.getSheet("chara\"" + this.userId + "\"", getCharaSheet());
  var skillDataSheet = this.getSheet('skill_default', getCharaSheet());
  var baseData = skillDataSheet.getRange( 2, 2, 12, 1 ).getValues();
  for(var i = 0; i < baseData.length; i++){
    var matcher = new RegExp(baseData[i][0] + "(?: *:)? *\\(?(\\d+)\\)?", "i");
    if(msg.match(matcher) != null){
      baseData[i][0] = msg.match(matcher)[1];
    }
    else{
      baseData[i][0] = null;
      if(i==3){
        if(baseData[10][0] != null){
          baseData[i][0] = Number(baseData[2][0]) * 5;
        }
      }
      if(i==11){
        if(baseData[10][0] != null){
          baseData[i][0] = Number(baseData[10][0]) * 5;
        }
      }
    }
    msg = msg.replace(matcher,"");
  }
  userSheet.getRange( 2, 3, 12, 1 ).setValues(baseData);
  
  var skillData = skillDataSheet.getRange( 2, 5, 62, 3 ).getValues();
  var lastRow = 62;
  var addedRows = 0;
  for(var i = 0; i < skillData.length; i++){
    var matcher = new RegExp(skillData[i][1] + "(?: *\\(([^\\d\\(\\)]+)\\))?(?: *:)? *" + "(?:\\(?(\\d+)\\)?(?!(?:\\d* *\\+))" + "|[^@\\n$]*= *(\\d+))", "gi");
    var mes;
    var skillName = skillData[i][0];
    var skillNameSearch = skillData[i][1];
    var skillAddedLabel;
    var addedCount = 0;
    while((mes = matcher.exec(msg)) != null){
      if(mes[3] != null){
        mes[2] = mes[3] 
      }
      if(addedCount == 0){
        skillData[i][2] = mes[2];
        skillAddedLabel = mes[1];
      }
      if(mes[1] != null){
        if(addedCount == 0){
          skillData[i][0] = skillName + "(" + mes[1] + ")";
          skillData[i][1] = "(?:" + skillNameSearch + "|" + mes[1] + "|" + skillNameSearch + "\\( *" + mes[1] + " *\\)" + ")";
        }
        else{
          if(addedCount == 1){
            skillData[i][1] = "(?:" + skillNameSearch + "(?=(?:\\( *" + skillAddedLabel  + " *\\)|\\s|$))" + "|" + skillAddedLabel + "|" + skillNameSearch + "\\( *" + skillAddedLabel + " *\\)" + ")";
          }
          skillData[lastRow+addedRows] = [skillName + "(" + mes[1] + ")", "(?:" + mes[1] + "|" + skillNameSearch + "\\( *" + mes[1] + " *\\)" + ")", mes[2]];
          addedRows++;
        }
      }
      addedCount++;
    }
    if(addedCount==0){
      //初期値
      if(i==5){
        if(baseData[1] != null){
          skillData[i][2] = Number(baseData[1][0]) * 2;
        }
      }
      if(i==48){
        if(baseData[10] != null){
          skillData[i][2] = Number(baseData[10][0]) * 2;
        }
      }
    }
    msg = msg.replace(matcher,"");
  }
  userSheet.getRange( 2, 5, 62 + addedRows, 3 ).setValues(skillData);
  userSheet.getRange( 2, 10).setValue(addedRows);
  this.addPublicMessage("キャラデータの読み込みが完了しました。\nuserid= \"" + this.userId + "\"\n" + getCharaSheet().getUrl());
}
//スマートダイスの実装
DiceBotCoc.prototype.shortcutDice = function(msg){
  Logger.log(msg);
  if(msg == null)
    return;
  if(this.getSheet("chara\"" + this.userId + "\"", getCharaSheet()) == null){
    this.addPublicMessage("キャラデータが登録されていません");
    return;
  }
  var addSkillNum = this.getSheet("chara\"" + this.userId + "\"", getCharaSheet()).getRange( 2, 10 ).getValue();
  var data = this.getSheet("chara\"" + this.userId + "\"", getCharaSheet()).getRange( 2, 5, 62+addSkillNum, 3 ).getValues();
  Array.prototype.push.apply(data, this.getSheet("chara\"" + this.userId + "\"", getCharaSheet()).getRange(2, 1, 12, 3).getValues());
    for(var j = 0; j < data.length; j++){  
      var matcher = new RegExp(data[j][1], "i");
      if(msg[1].search(matcher) != -1){
        if(data[j][2] == null || data[j][2]  == "***"){
          this.addPublicMessage("は正しく登録されていません(登録値無し)");
          break;
        }      
        var addString="";
        while(msg[2] != null){
          var index = -1;
          var tempStr;
          var tempVal = null;
          var tempMatcher = null;
          
          if((tempStr = msg[2].match(/\+ *(\d+)/)) != null){
            index = tempStr["index"];
            tempVal = data[j][2] + Number(tempStr[1]);
            tempMatcher = /\+ *(\d+)/;
            addString +="+" + tempStr[1];
          }
          if((tempStr = msg[2].match(/- *(\d+)/)) != null){
            if(index > tempStr["index"] || index == -1){
              index = tempStr["index"];
              tempVal = data[j][2] - Number(tempStr[1]);
              tempMatcher = /- *(\d+)/;
              addString +=　"-" + tempStr[1];
            }
          }
          if((tempStr = msg[2].match(/[@\*] *(\d+)/)) != null){
            if(index > tempStr["index"] || index == -1){
              index = tempStr["index"];
              tempVal = data[j][2] * Number(tempStr[1]);
              tempMatcher = /[@\*] *(\d+)/;
              addString +=　"*" + tempStr[1];
            }
          }
          if((tempStr = msg[2].match(/\/ *(\d+)/)) != null){
            if(index > tempStr["index"] || index == -1){
              index = tempStr["index"];
              tempVal = data[j][2] / Number(tempStr[1]);
              tempMatcher = /\/ *(\d+)/;
              addString +=　"/" + tempStr[1];
            }
          }
          if(tempVal == null || tempMatcher == null){
            break; 
          }
          msg[2] = msg[2].replace(tempMatcher, "");
          data[j][2] = tempVal;
        }
        var dMsg;
        if (data[j][2] >= 1){
          dMsg = data[j][0]+ " " + String(Math.floor(data[j][2])) + " 1d100";
        }
        else{
          data[j][2] = 1;
          dMsg = '※'+data[j][0]+ " " + String(Math.floor(data[j][2])) + " 1d100";
        }
        var dObj = dMsg.match(this.DICE_MATCHER);
        dObj[1] += addString;
        this.getDice(dObj);
        break;
      }
    }
  return;
}

//短期の一時的狂気を得る
// DiceBotCoc.prototype.getInsanS = function(Message){
//   if(Message[1]!=null)
//     this.repeatTimes = Number(Message[1]);
//   var label = '短期の一時的狂気';
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
//   var data = this.getData('CoC_狂気_短期', 'CoC_狂気', 2, 2, 10, 1);
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDice(1,10);
//     this.addSecretMessage('\n'+data[this.result-1]+'\n');
//     if(this.repeatTimes<=1){
//       this.addSecretMessage('持続 1d10+4:');
//     }
//     else{
//       this.addSecretMessage('持続:');
//     }
//     this.rollDice(1,10);
//     this.addSecretMessage('+ 4 = '+ (this.result+4) + 'ラウンド');
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }

//長期の一時的狂気を得る
// DiceBotCoc.prototype.getInsanL = function(Message){
//   if(Message[1]!=null)
//     this.repeatTimes = Number(Message[1]);
//   var label = '長期の一時的狂気';
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
//   var data = this.getData('CoC_狂気_長期', 'CoC_狂気', 2, 3, 10, 1);
//   for(var i=0;i<this.repeatTimes;i++){
//     this.rollDice(1,10);
//     this.addSecretMessage('\n'+data[this.result-1]+'\n');
//     if(this.repeatTimes<=1){
//       this.addSecretMessage('持続 1d10*10:');
//     }
//     else{
//       this.addSecretMessage('持続:');
//     }
//     this.rollDice(1,10);
//     this.addSecretMessage('* 10 = ' + (this.result*10) + '時間');
//     if((i+1)!=this.repeatTimes){
//       this.addSecretMessage('\n');
//     }
//   }
// }