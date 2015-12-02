"use strict";
/**
* スポット名を画面表示するUIクラス。
* @class SpotTitleManager
* @constructor
* @param {HTMLElement} container DOMエレメントを配置するコンテナ要素
* @param {string} resources リソース画像パスの接頭辞
* @param {RendererManager} rendererManager レンダラーマネージャー参照用変数
* @param {boolean} [useTween=true] トゥイーンを使用するかどうかの判断フラグ
*/
var SpotTitleManager = (function () {
    function SpotTitleManager(container, resources, rendererManager, useTween) {
        this._bottom = 20;
        this._duration = 100;
        this._useTween = true;
        this._container = container;
        this._resources = resources;
        this._rendererManager = rendererManager;
        this._useTween = useTween;
        this._leftObject = this._createElement();
        this._container.appendChild(this._leftObject);
        this._rightObject = this._createElement();
        this._container.appendChild(this._rightObject);
        this._onWindowResize();
        window.addEventListener("resize", this._onWindowResize.bind(this), false);
    }
    /**
    * 画面垂直方向の配置場所（画面下基準）
    * @private
    * @property _bottom
    * @type number
    * @default 20
    */
    /**
    * タイトル要素の横幅
    * @private
    * @property _width
    * @type number
    * @default 256
    */
    /**
    * タイトル要素の高さ
    * @private
    * @property _height
    * @type number
    * @default 32
    */
    /**
    * トゥイーン使用時の遷移時間
    * @private
    * @property _duration
    * @type number
    * @default 100
    */
    /**
    * 左目用オブジェクト
    * @private
    * @property _leftObject
    * @type HTMLElement
    */
    /**
    * 右目用オブジェクト
    * @private
    * @property _rightObject
    * @type HTMLElement
    */
    /**
    * DOMエレメントを配置するコンテナ要素
    * @private
    * @property _container
    * @type HTMLElement
    */
    /**
    * リソース画像パスの接頭辞
    * @private
    * @property _resources
    * @type string
    */
    /**
    * レンダラーマネージャー参照用変数
    * @private
    * @property _rendererManager
    * @type RendererManager
    */
    /**
    * トゥイーンを使用するかどうかの判断フラグ
    * @private
    * @property _useTween
    * @type boolean
    * @default true
    */
    /**
    * タイトル作成メソッド
    * @public
    * @method create
    * @param {Spot} spot スポットデータ
    */
    SpotTitleManager.prototype.create = function (spot) {
        this._leftObject.innerHTML = spot.title;
        this._rightObject.innerHTML = spot.title;
    };
    /**
    * タイトル破壊メソッド
    * @public
    * @method destroy
    */
    SpotTitleManager.prototype.destroy = function () {
        this._leftObject.innerHTML = "&nbsp;";
        this._rightObject.innerHTML = "&nbsp;";
    };
    /**
    * 画面サイズ変更時の再配置メソッド
    * @private
    * @method _onWindowResize
    */
    SpotTitleManager.prototype._onWindowResize = function () {
        var width = window.innerWidth / 3;
        this._leftObject.style.width = this._rightObject.style.width = width + "px";
        this._leftObject.style.bottom = this._rightObject.style.bottom = this._bottom + "px";
        this._leftObject.style.left = this._rightObject.style.right = this._rendererManager.center.x - width / 2 + "px";
    };
    /**
    * DOM要素作成メソッド
    * @private
    * @method _createElement
    * @param {string} text タイトル文字列
    * @return {HTMLElement}
    */
    SpotTitleManager.prototype._createElement = function () {
        var element = document.createElement('div');
        element.className = "title";
        element.innerHTML = "&nbsp;";
        return element;
    };
    return SpotTitleManager;
})();
