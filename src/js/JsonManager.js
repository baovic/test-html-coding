"use strict";
/**
* JSON取得とデータオブジェクト作成クラス
* @class JsonManager
* @constructor
* @param {string} url 取得するJSONデータURL,
* @param {StreetView} [parent] StreetViewオブジェクト,
*/
var JsonManager = (function () {
    function JsonManager(url, parent) {
        this._url = url;
        this._parent = parent ? parent : undefined;
    }
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
    JsonManager.prototype.fetch = function (callback) {
        var _this = this;
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var json = JSON.parse(request.responseText);
                _this._entry = json.entryPoint;
                _this._spots = [];
                _this._dataUrl = _this._url.substring(0, _this._url.lastIndexOf('/') + 1);
                _this._cubemapUrl = json.cubemaps;
                json.spots.forEach(function (item, index) {
                    _this._spots[item.no] = (new Spot(index, json.spots, _this._dataUrl));
                });
                if (_this._parent) {
                    _this._parent.spots = _this._spots;
                    _this._parent.entry = _this._entry;
                }
                callback();
            }
        };
        request.open("GET", this._url, true);
        request.send();
    };
    return JsonManager;
})();
