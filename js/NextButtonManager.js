"use strict";
/**
* 次に進むボタンの作成や表示/非表示を行う
* @class NextButtonManager
* @constructor
* @param {HTMLElement} container キャンバス要素を格納するコンテナ,
* @param {StreetView} parent アプリルート参照用変数,
*/
var NextButtonManager = (function () {
    function NextButtonManager(container, parent, isMobile) {
        this._parent = parent;
        this._container = container;
        this._isMobile = isMobile;
        this._element = this._createElement();
        if (this._isMobile) {
            this._element.addEventListener("touchend", this._onTouchEnd.bind(this), false);
            this._element.addEventListener("touchstart", this._onTouchStart.bind(this), false);
        }
        else {
            this._element.addEventListener("mouseup", this._onTouchEnd.bind(this), false);
        }
        this._container.appendChild(this._element);
    }
    /**
    * アプリルート参照用変数
    * @private
    * @property _parent
    * @type StreetView
    */
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
    * ボタンタッチアクション用メソッド
    * @private
    * @method _onTouchEnd
    * @return void | boolean
    */
    NextButtonManager.prototype._onTouchEnd = function () {
        this._element.className = "nextButton";
        // if(TWEEN.getAll().length > 0){
        //   return;
        // } 
        this._parent.moveSpot(this._parent.currentSpot.next);
    };
    /**
    * ボタンタッチ変化用メソッド
    * @private
    * @method _onTouchStart
    * @return void
    */
    NextButtonManager.prototype._onTouchStart = function () {
        this._element.className = "nextButton on";
    };
    /**
    * 要素作成用メソッド
    * @private
    * @method _createElement
    * @return {HTMLElement}
    */
    NextButtonManager.prototype._createElement = function () {
        var element = document.createElement('div');
        element.className = "nextButton";
        return element;
    };
    return NextButtonManager;
})();
