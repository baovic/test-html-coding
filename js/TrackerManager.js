"use strict";
/**
* ユーザーの滞在時間を計測するクラス。
* @class TrackerManager
* @constructor
* @param {string} user ユーザー名
*/
var TrackerManager = (function () {
    function TrackerManager(user) {
        this._delay = 100;
        this._isRecording = false;
        this.data = {
            user: user,
            log: []
        };
    }
    /**
    * 時間の計測感覚（デフォルト:0.1秒）
    * @private
    * @property _delay
    * @type number
    * @default 100
    */
    /**
    * 現在計測中かどうか判断するフラグ
    * @private
    * @property _isRecording
    * @type boolean
    * @default false
    */
    /**
    * 現在計測中のレコードデータ
    * @private
    * @property _currentRecord
    * @type Record
    */
    /**
    * 計測用インターバル格納用変数
    * @private
    * @property _interval
    * @type Object
    */
    /**
    * 計測データ、ユーザー名などのユーザーログ格納用オブジェクト
    * @property data
    * @type Object
    */
    /**
    * 時間の計測を開始するメソッド
    * @public
    * @method record
    * @param {Spot} spot 計測するスポットデータ
    */
    TrackerManager.prototype.record = function (spot) {
        if (this._isRecording) {
            this.stop();
        }
        this._isRecording = true;
        this._currentRecord = new Record(spot.no, spot.title, 0);
        this._interval = setInterval(this._increment.bind(this), this._delay);
    };
    /**
    * 時間の計測を停止、ログに蓄積するメソッド
    * @public
    * @method stop
    */
    TrackerManager.prototype.stop = function () {
        if (this._isRecording) {
            this._isRecording = false;
            this.data.log.push(this._currentRecord);
            clearInterval(this._interval);
        }
    };
    /**
    * 時間の計測を一時的に停止するメソッド。ログに計測結果は蓄積されない。
    * @public
    * @method sleep
    */
    TrackerManager.prototype.sleep = function () {
        if (this._isRecording) {
            clearInterval(this._interval);
        }
    };
    /**
    * 時間の計測を再開するメソッド。
    * @public
    * @method awake
    */
    TrackerManager.prototype.awake = function () {
        if (this._isRecording) {
            this._interval = setInterval(this._increment.bind(this), this._delay);
        }
    };
    /**
    * 計測中のレコードに経過時間を代入するメソッド。
    * @private
    * @method _increment
    */
    TrackerManager.prototype._increment = function () {
        this._currentRecord.time += 0.1;
    };
    return TrackerManager;
})();
