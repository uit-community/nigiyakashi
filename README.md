## Nigiyakashi

Nigiyakashi は、IT ミートアップで LT 大会を盛り上げたい、いつものセッションにちょっとした遊び心を入れたい。そんなスピーカーや運営者のための、賑やかしシステムです。

来場者のスマホから、リアルタイムでセッションへの「いいね」を転送。笑いや感心を、かんたんにシェアできます。

Firebase を利用した、お手軽かつ無料で始められる賑やかしを使ってみませんか？

## Demo

ここにデモ動画

## 必要環境

- ローカル環境
  - Node.js v8.x or higher
- 本番環境
  - Firebase プロジェクト(Spark or Frame or Blaze)

## 仕組みと導入方法

AppName の動作には、以下の準備が必要となります。

- 動作用の Firebase プロジェクト(無料プラン可)
- 来場者向け SPA アプリのホスティング(Firebase Hosting)
- 発表者の PC にインストールする Electron クライアント

### 1. Firebase プロジェクトの作成

https://firebase.google.com/ よりプロジェクトを作成してください。

当日の Read/Write がそれぞれ 2 万未満に収まる場合は無料の Spark プラン、それ以上の場合は従量課金の Blaze プランにて作成ください。

実績値として 60 名ほどのイベント、10 個ほどの LT で 10 万 Read / 3 万 Write 程度で Blaze プラン従量課金は￥ 60 となります。

プロジェクトを作成後、Web 向けのアプリを作成。
プロジェクトの ID と firebaseConfig キーを控えておいてください。

![](/uploads/upload_222e4fa969800b2b7c5e154748923f4c.png)

### 2. SPA アプリのホスティング

`1.` で作成したプロジェクトのホスティング環境への SPA のデプロイも併せて行います。

ソースコードを clone してきてください。

```bash
$ git clone git@github.com:uit-community/uit-meetup-nigiyakashi-client.git
$ cd uit-meetup-nigiyakashi-client
```

clone 後、 attendee-spa/src/utils/firebase.config.ts にある Firebase の設定を、先程のプロジェクトのもので書き換えます。
あとは通常の Vue.js アプリケーションと同様に、 https://firebase.google.com/docs/hosting/deploying?hl=ja の通りにデプロイしてください。

### 3. Electron クライアントの起動

最後に SPA の受け口である Electron クライアントをプレゼンテーションを行う Mac 上で起動します。[こちら](https://github.com/uit-community/nigiyakashi/releases/tag/v0.0.1)よりバイナリをダウンロードしてください。

ダウンロードが終わったあと、普段の Mac App と同じ様に起動します。

起動後、Firebase の設定の記述を求められるので設定後、「開始」をクリックするとプレゼンテーションモードが始まります。

### 4. 統合テスト

最後に SPA と Electron の設定が正しく行われているか確認します。

SPA と Electron を同時に起動し、 SPA 側でボタンを押すと、Electron 側に 👍 が表示されていたら OK です。

これで動作準備は完了です。

## 注意点

### Q. Web ページ以外を表示したい場合はどうする？

現状は Web ページ上にいいねをオーバーレイする専用のシステムとなっています。

汎用化はまだ済んでいないため、Pull Request や Feature Request を募集しています。

### Q. Windows PC 上で動作させるには？

バイナリ配布は macOS を対象にしていますが、 Electron のため Windows 向けバイナリの出力も可能です。

レポジトリソースコード内 `packages/electron-client` に全てのソースコードが格納されているため、 Windows 向けにビルドを行ってください。

## ライセンス

このシステムは Apache-2.0 ライセンスにて配布されています。
ライセンス条項に違反しない範囲で自由に改変・再配布が可能です。

## 開発者

- Kurihara Yuji (開発)
- Hanatani Takuma (企画)
