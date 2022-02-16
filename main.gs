// LINE developersのメッセージ送受信設定に記載のアクセストークン
var ACCESS_TOKEN = '18wWfEz/WbqnKzT6j8Z7KVKDfMW+jfVNdTTHujDzEHPTdsxZSYqSCfHUb4rA/WiWusmeMWUJc+53mFjpzsFvJ+FPx1nkcefvgpwwi+YKPJc7rrSVy+dgHG56Mzb9WsXCUYjbi2o9oFBuBBOeJQMrBgdB04t89/1O/w1cDnyilFU=';
var line_endpoint_profile = 'https://api.line.me/v2/bot/profile';
function doPost(e) {
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // ユーザーのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  // ユーザーIDを取得
  var userId = JSON.parse(e.postData.contents).events[0].source.userId;
  // プッシュメッセージ用のAPI URL
  var push_url = 'https://api.line.me/v2/bot/message/push';
  // 応答メッセージ用のAPI URL
  var url = 'https://api.line.me/v2/bot/message/reply';
  
  //全角英数記号を半角に変える
  userMessage = userMessage.replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, function(s){
    return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
  });
  userMessage = userMessage.replace(/、/g,',');
  userMessage = userMessage.replace(/。/g,'.');
  userMessage = userMessage.replace(/　/g,' ');
  userMessage = userMessage.replace(/\./g,',');  

  UrlFetchApp.fetch(url, {
    'headers':{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
      'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': diceMain(userMessage,userId),
         //'quickReply': makeQuickReply()     
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function Test(){
  var userMessage = "insanl";
  Logger.log(diceMain(userMessage,0));
}