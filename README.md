# diceBOT_LINE

# 概要
LINEで利用できるTRPG用ダイスボットです。
友人と遊ぶ時に使うために制作したものの一般公開版となっています。
LINEで実際に利用できます。
LINEID：@333zdmba

# 経緯 
大学二年生の時に作成を始め、そこから二年ほど機能の追加・リファクタリングを含む更新を行っていました。
このコードは身内用の最新版のコードを一般公開に向けて一部変更したものです。

大学に入って引っ越しした友人とオンラインでTRPGを遊ぶようになりました。
遊んでいく中で「ダイス出目の共有が大変」「結果を同時に楽しめない」という問題が表出し、オンラインでダイスを振るダイスボットを導入することにしました。
しかし、既存のものはどこか使いづらく、欲しい機能を満たしていませんでした。
そこで私から提案して、身内用のダイスボットの作成を行うことにしました。

# 開発体制
プログラミングができるのが私だけだったので、一人で制作を担当しました。
最初はベースとなる機能のみを実装し、後から機能を追加していく形で開発を進めていきました。
友人に要望や欲しい機能のヒアリングを行いつつ、機能を考えて実装を行いました。

「既存のチャットアプリで利用可能」「コードの流用が容易」「PCとスマホの両方で利用できる」という要件から、『Google Apps Script+Webhook でのLINE公式アカウントとの連携』を利用することにしました。


