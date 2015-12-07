Streetview
====

360°パノラマビューアーアプリケーション

## 説明

WebGLを使用したブラウザ型360°パノラマビューアーアプリケーションです。

## デモページ

[スポット目次ページ](./src/index.html)

## ディレクトリ構造
以下のディレクトリで構成され、各施設データはdata配下に格納します。

* css/ - # css格納ディレクトリ
* data/ - # 各施設データディレクトリ
* img/ - # アプリケーションリソース格納ディレクトリ
* js/ - # アプリケーションスクリプト格納ディレクトリ

## dataディレクトリについて
データディレクトリの中は各施設ごとに別れています。

HTMLのオプションでjsonデータを記述できるようになっており、各施設の画像ファイル/フォルダなどを指定することができるようになっています。

各施設画像にはそれぞれWebGLに対応ブラウザ向けの高解像度データと、WebGL非対応ブラウザ向け（古い端末）の低解像度データがあります。画像はパフォーマンス対策の一環として専用スクリプトによってキューブマップ方式に変換、6分割されて格納されています。

また投影マスクのロゴは既に結合されたものを使用するため、ロゴを変更したい場合は画像ファイルを直接変更する必要があるので注意が必要です。

後述の組み込み手順にて施設データをjson形式で記述していますが、撮影方法によっては画像を回転し、初期位置指定や水平線の傾きを補正する必要がある時があります。その時は各施設画像に対し「rotation」というパラメータでx軸、y軸,z軸の回転補正を指定します。
記述しない場合は自動的に補正無しとして扱われます。

```
{
	"altCubemaps": "data/stcatalina/02_01alt",
	"cubemaps": "data/stcatalina/02_01",
	"title": "02_01",
	"no": 1,
	"rotation": { "x": 5.5, "y": 8, "z": 0 }
}
```

## デモ組み込み手順

* css/, img/, js/, data/を参照可能な公開ディレクトリに配置します。基本的に納品物をコピーすれば問題ありませんが、ファイル名等の変更をする場合HTML内のjsonに記述されているファイル名も修正する必要があります。

* viewportの設定を行います。

```
<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">`
```

* ヘッダーへcss/スクリプトをインポートします。

```
<link href="css/style.css" rel="stylesheet" type="text/css" />
<script src="js/min/main.min.js"></script>
```

* json形式で施設データを記述します。

```
<script>
    var data = {
      "entryPoint": 1,
      "spots": [
        {
          "altCubemaps": "data/kauichapel/04_01alt",
          "cubemaps": "data/kauichapel/04_01",
          "title": "04_01",
          "no": 1
        },
        {
          "altCubemaps": "data/kauichapel/04_02alt",
          "cubemaps": "data/kauichapel/04_02",
          "title": "04_02",
          "no": 2
        },
        ...
      ]
    };
</script>
```

* body下部に初期化スクリプトを追加します。必要に応じて起動オプションをjson形式で指定します。（※**jsonパラメータは必須**です。 前手順の施設データを指定します。）

```
<script>
    var app = new StreetView({
	  resources: './img',
	  indexUrl: './',
	  json: data
    });
    app.init();
</script>
```
