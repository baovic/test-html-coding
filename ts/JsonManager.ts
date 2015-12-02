"use strict";
/**
* JSON取得とデータオブジェクト作成クラス
* @class JsonManager
* @constructor
* @param {string} url 取得するJSONデータURL,
* @param {StreetView} [parent] StreetViewオブジェクト,
*/
class JsonManager {
  private _spots: Array<Spot>;
  private _entry: number;
  private _url: string;
  private _dataUrl: string;
  private _parent: StreetView;
  private _cubemapUrl: string;
  /**
  * スポット情報オブジェクト格納配列
  * @private
  * @property _spots
  * @type Array
  */
  /**
  * エントリーポイントID
  * @private
  * @property _entry
  * @type number
  */
  /**
  * JSONファイルURL
  * @private
  * @property _url
  * @type string
  */
  /**
  * データフォルダURL
  * @private
  * @property _dataUrl
  * @type string
  */
  /**
  * StreetViewオブジェクト参照用変数
  * @private
  * @property _parent
  * @type StreetView
  */
  /**
  * cubemapデータフォルダURL
  * @private
  * @property _cubemapUrl
  * @type string
  */

  /**
  * JSON取得メソッド
  * @public
  * @method fetch
  * @param {function} callback 取得後に呼び出されるコールバック関数
  */
  public fetch(callback: () => any): void {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState == 4 && request.status == 200) {
        let json = JSON.parse(request.responseText);

        this._entry = json.entryPoint;
        this._spots = [];
        this._dataUrl = this._url.substring(0, this._url.lastIndexOf('/') + 1);
        this._cubemapUrl = json.cubemaps;

        json.spots.forEach((item: any, index: number) => {
          this._spots[item.no] = (new Spot(index, json.spots, this._dataUrl));
        });
         
        if (this._parent) {
          this._parent.spots = this._spots;
          this._parent.entry = this._entry;
        }

        callback();
      }
    }
    request.open("GET", this._url, true);
    request.send();
  }

  constructor(url: string, parent?: StreetView) {
    this._url = url;
    this._parent = parent ? parent : undefined;
  }
}
