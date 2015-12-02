"use strict";
/**
* 閉じるボタンオブジェクト作成クラス
* @class CloseButtonManager
* @constructor
* @param {HTMLElement} container 要素格納用コンテナ,
*/
var CloseButtonManager = (function () {
    function CloseButtonManager(container, indexUrl) {
        /**
        * 要素作成メソッド
        * @private
        * @method _createElement
        */
        this._createElement = function () {
            var element = document.createElement('div');
            element.className = "closeButton";
            return element;
        };
        this._container = container;
        this._indexUrl = indexUrl;
        this._element = this._createElement();
        this._element.addEventListener("touchend", this._onTouchEnd.bind(this), false);
        this._element.addEventListener("mouseup", this._onTouchEnd.bind(this), false);
        this._element.addEventListener("touchstart", this._onTouchStart.bind(this), false);
        this._container.appendChild(this._element);
    }
    /**
    * 要素格納用コンテナ
    * @private
    * @property _container
    * @type HTMLElement
    */
    /**
    * ボタンオブジェクト
    * @private
    * @property _element
    * @type HTMLElement
    */
    /**
    * ボタンタッチ時アクションメソッド
    * @private
    * @method _onTouchEnd
    */
    CloseButtonManager.prototype._onTouchEnd = function () {
        this._element.className = "closeButton";
        window.location.href = this._indexUrl;
    };
    /**
    * ボタンダウン時アクションメソッド
    * @private
    * @method _onTouchStart
    */
    CloseButtonManager.prototype._onTouchStart = function () {
        this._element.className = "closeButton on";
    };
    return CloseButtonManager;
})();
