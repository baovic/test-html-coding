"use strict";
/**
* 画像のプリロードやロード画像の表示/非表示を行う
* @class PreloaderManager
* @constructor
* @param {HTMLElement} container キャンバス要素を格納するコンテナ,
* @param {string} resource リソースフォルダパス
* @param {RendererManager} rendererManager レンダラーマネージャー参照用変数,
*/
var PreloaderManager = (function () {
    /**
    * ローダー画像の横幅
    * @private
    * @property _width
    * @type number
    * @default 64
    */
    /**
    * ローダー画像の高さ
    * @private
    * @property _height
    * @type number
    * @default 64
    */
    /**
    * ローダー要素を配置するHTML要素コンテナ
    * @private
    * @property _container
    * @type HTMLElement
    */
    /**
    * リソースフォルダパス
    * @private
    * @property _resources
    * @type string
    */
    /**
    * イメージ要素のプリロード用格納配列
    * @private
    * @property _imgArray
    * @type Array
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
    * レンダラーマネージャー参照用変数
    * @private
    * @property _width
    * @type number
    */
    function PreloaderManager(container, resources, rendererManager) {
        this._width = 32;
        this._height = 32;
        this._container = container;
        this._resources = resources;
        this._rendererManager = rendererManager;
        this._leftObject = this._createLoaderImageElement();
        this._container.appendChild(this._leftObject);
        this._rightObject = this._createLoaderImageElement();
        this._container.appendChild(this._rightObject);
        this.hide();
        this._onWindowResize();
        window.addEventListener("resize", this._onWindowResize.bind(this), false);
    }
    /**
    * ローダー画像要素作成メソッド
    * @private
    * @method _createLoaderImageElement
    * @return {HTMLElement}
    */
    PreloaderManager.prototype._createLoaderImageElement = function () {
        var element = document.createElement('img');
        element.src = this._resources + "/loader.gif";
        element.className = "loader";
        element.style.width = this._width + "px";
        element.style.height = this._height + "px";
        element.style.position = "absolute";
        return element;
    };
    /**
    * ローダー画像再配置メソッド
    * @private
    * @method _onWindowResize
    */
    PreloaderManager.prototype._onWindowResize = function () {
        this._leftObject.style.top = this._rightObject.style.top = window.innerHeight / 2 - this._height / 2 + "px";
        this._leftObject.style.left = this._rightObject.style.right = this._rendererManager.center.x - this._width / 2 + "px";
    };
    /**
    * ローダー画像非表示メソッド
    * @public
    * @method hide
    */
    PreloaderManager.prototype.hide = function () {
        this._leftObject.style.display = this._rightObject.style.display = "none";
    };
    /**
    * ローダー画像表示メソッド
    * @public
    * @method show
    */
    PreloaderManager.prototype.show = function () {
        this._leftObject.style.display = this._rightObject.style.display = "block";
    };
    return PreloaderManager;
})();
