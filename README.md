# diceBOT_LINE

<img width="487" alt="image" src="https://user-images.githubusercontent.com/96525250/162102994-4f20521a-e140-4b6a-8045-68317d86ce6e.png">

# 概要
LINEで利用できるTRPG用ダイスボットです。
友人と遊ぶ時に使うために制作したものの一般公開版となっています。
LINEで実際に利用できます。
LINEID：@333zdmba

# 更新・経緯 
大学二年生の時に作成を始め、そこから不定期で機能の追加・リファクタリングを含む更新を行っていました。
このコードは身内用の最新版のコードを一般公開に向けて一部変更したものです。

大学に入って引っ越しした友人とオンラインでTRPGを遊ぶようになりました。
遊んでいく中で「ダイス出目の共有が大変」「結果を同時に楽しめない」という問題が表出し、オンラインでダイスを振るダイスボットを導入することにしました。
しかし、既存のものはどこか使いづらく、欲しい機能を満たしていませんでした。
そこで私から提案して、身内用のダイスボットの作成を行うことにしました。

# 開発体制・技術選定
プログラミングができるのが私だけだったので、一人で制作を担当しました。
最初はベースとなる機能のみを実装し、後から機能を追加していく形で開発を進めていきました。
友人に要望や欲しい機能のヒアリングを行いつつ、機能を考えて実装を行いました。

「既存のチャットアプリで利用可能」「コードの流用が容易」「PCとスマホの両方で利用できる」という要件から、『Google Apps Script+Webhook でのLINE公式アカウントとの連携』を利用することにしました。

# 特徴
- 入力に対して非常に寛容：
全半角やスペースの数、足し引きできるダイスの数など、細かい制約を意識せず利用できます。
- 同じダイスの繰り返しなど独自の便利機能の搭載：友人にヒアリングを行いながら、独自の便利機能を実装しました。
- Googleスプレッドシートとの連携による新たなダイスの実装：ユーザがキャラデータを登録することで、行動を指定するだけでそのデータに基づいてダイスを振れるという新たな体験を創造

# 課題
- クラス構造などは機能追加に伴う後付けで考えたため、洗練されていないこと
- マッチングの正規表現パターンが、正規表現を学び始めた初期制作のままでリファクタリングできていないこと

