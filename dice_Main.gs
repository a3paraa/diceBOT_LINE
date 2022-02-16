function diceMain(userMessage, userId) {
  this.diceMode = PropertiesService.getScriptProperties().getProperty("diceMode");
  this.isModeUpdated = false;
  if(this.diceMode == null){
    this.diceMode = "CoC";
    this.isModeUpdated = true;
  }
  this.checkModeChange(userMessage, this);
  if(this.isModeUpdated){
    PropertiesService.getScriptProperties().setProperty("diceMode", this.diceMode);
  }
  var pushMes = "";
  if(userMessage.search(/#modecheck/i)>=0)
    pushMes = "\""+this.diceMode+"\"ルールモードです\n";

  if(userMessage.search(/#help/i) >= 0){
    pushMes = 
`このダイスボットの使い方
###基本
##ダイスを振る
<振る数>d<ダイスの面数> <+か->＜整数かダイス＞（繰り返し可能、省略可）: 
基本のダイス記述です。以下[ダイス記述]と略記します。
そのダイスを振り、値を得ることができます。
合計値と各出目の両方を確認できます。
例：2d6  1d100 5d8+3-1d6+2d15

###オプション機能
##ダイスを用いた判定を行う
<判定ラベル（省略可）><目標値 >[ダイス記述]：
指定された目標値で判定を行います。
1d100の場合:
  出目が目標値以下で成功
それ以外の場合：：
  出目が目標値以上で成功
各ルールのモードに応じて、クリティカル、ファンブルの表示も行われます。
用途：判定を明示したいとき
例：マーシャルアーツ15 1d100  難易度9 2d6  5 1d8

##ダイス/判定を繰り返す
[ダイス記述]@<繰り返す数>{,<判定終了の成功数>}
ダイスや判定を複数回繰り返すことができます。
判定の場合は、その成功数も集計されます。
判定終了の成功数が指定されている場合、その成功数で判定に終了します。
用途：複数判定の成功度を用いるルールのとき、NPCで同じ行動を繰り返し行うとき
例：難易度 7 2d6@5,3 こぶし50 1d100 @3

#スマートダイス機能（#CoCモードでのみ可能）
@sample：サンプル入力データを表示
@load [入力データ]：キャラデータの読み込み（指定外の技能は初期値になります）
@<技能名>[繰り返し記述]：その技能の判定
「@こぶし」「@目星@2」のように、技能名だけでそれぞれの技能の判定ダイスを振れます。
技能値が指定されていない技能は、初期値で判定されます。
判定を行うのが楽になり、実際に行動している気にもなるのでオススメです。

※@loadを用いてキャラデータをBotに読み込ませる必要があります。
入力データは@sampleを参考にご利用ください。
@sampleのデータは入力の寛容さを示すため、あえて形を崩して書いてあります。。

#入力データについて
一行に書く技能の数などは、全く同じ形式でなくても大丈夫です。
技能値の後ろに、技能を振った数を「目星85(+60)」のようにメモしても無視してくれます。
技能と技能値の間のコロン、スペースは全てあってもなくても処理できます。
技能値が初期値のものは書かなくても大丈夫です。
芸術や言語のように記述があるもの、既存の技能でないものを登録する場合は、
「芸術（絵画）」「汎用（ダイビング）」のように書く必要があります。
判定の際は「@芸術」「@絵画」「@芸術（絵画）」のどれでも可能です。
例：@sample  @クトゥルフ神話 @目星@2  @ダイビング

#ルールモードの確認・変更
#modecheck：ルールモードの確認
#coc：CoCモードに変更
#satspe：サタスペモードに変更
#ara：AR2Eモードに変更
ダイスのルールモードを切り替えます。
※元が身内用のため、モードは全ユーザーで共通となっています。
※スマートダイス機能は#cocモードでのみ利用可能です。

#注意事項
全角、半角や間のスペースの数などは気にしなくて大丈夫です。
一回のメッセージに複数のダイスを含めて送信できます。`;
  }

  if(userMessage.search(/@sample/i) >= 0){
    pushMes = `@load
名前（技能以外は入力時に無視されます）:サンプル太郎
職業：アスリート
STR:10 CON:8 POW:12 DEX9 APP8
SIZ15 INT 11 EDU 16
SAN 74 知識 80 幸運 55 アイデア 55
聞き耳 29  +4
回避 73（+55） 汎用 (弓) 77（+70）+6
目星 75（+50） 図書館 55（+30）応急手当 70
汎用（日本刀）76（+75）
母国語（日本語） 40
クトゥルフ神話 10
`;
  }
  var diceBot;
  switch(this.diceMode){
    case"Ara":
      diceBot = new DiceBotAra();
      break;
    case"CoC":
      diceBot = new DiceBotCoc();
      break;
    case"SatSpe":
      diceBot = new DiceBotSatspe();
      break;
    default:
      return "";
  }
  diceBot.init(userMessage, userId);
  pushMes += diceBot.execute();
  if(!pushMes || pushMes == "")
    pushMes = "現在のダイスルール：#"+ this.diceMode +"\nモード変更は「#coc,#satspe,#ara」で可能です。\n詳しい使い方は#helpで確認できます。";
  return pushMes;
}

function checkModeChange(msg, obj){
  if(msg.search(/#ara/i) >= 0){
    obj.diceMode = "Ara";
    obj.isModeUpdated = true;
    return;
  }
  if(msg.search(/#coc/i) >= 0){
    obj.diceMode = "CoC";
    obj.isModeUpdated = true;
    return;
  }
  if(msg.search(/#satspe/i) >= 0){
    obj.diceMode = "SatSpe";
    obj.isModeUpdated = true;
    return;
  }
}