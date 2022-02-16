function DiceBotAra() {}
//継承
inherits(DiceBotAra, DiceBotBase);

//初期化
DiceBotAra.prototype.initOptional = function(){
  this.userMessage = this.userMessage.replace(/(\d+)d(?!\d)/gi,'$1d6');
};

//クリティカルの基準
DiceBotAra.prototype.isCritical = function(){
  if(this.faces != 6)
      return false;
  var count = 0;
  this.resultArray.some(function(r){
    if(r==6)
      count++;
    if(count>=2)
      return true;
  });
  if(count>=2 && this.times >= 2){
    this.addSecretMessage(' (クリティカル!)', 1, 2);
    return true;
  }
  return false;
};
//ファンブルの基準
DiceBotAra.prototype.isFumble = function(){
  if(this.faces != 6)
      return false;
  var count = 0;
  this.resultArray.forEach(function(r){
      if(r==1)
        count++;
  });
  if(count>=this.times){
    this.addSecretMessage(' (ファンブル!)', 1, 2);
    return true;
  }
  return false;
};