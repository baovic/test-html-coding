"use strict";
/**
* ポインタの作成や表示/非表示を行う
* @class PointerManager
* @constructor
* @param {HTMLElement} container キャンバス要素を格納するコンテナ,
* @param {string} resource リソースフォルダパス
* @param {RendererManager} rendererManager レンダラーマネージャー参照用変数,
*/
var PointerManager = (function () {
    function PointerManager(container, resources, rendererManager) {
        this._width = 20;
        this._height = 20;
        this._container = container;
        this._resources = resources;
        this._rendererManager = rendererManager;
        this._leftObject = this._createElement();
        this._container.appendChild(this._leftObject);
        this._rightObject = this._createElement();
        this._container.appendChild(this._rightObject);
        this.hide();
        this._onWindowResize();
        window.addEventListener("resize", this._onWindowResize.bind(this), false);
    }
    /**
    * キャンバス要素格納用コンテナ
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
    * ポインタの横幅
    * @private
    * @property _width
    * @type number
    * @default 20
    */
    /**
    * ポインタの高さ
    * @private
    * @property _height
    * @type number
    * @default 20
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
    * @property _rendererManager
    * @type RendererManager
    */
    /**
    * ポインタ非表示メソッド
    * @public
    * @method hide
    */
    PointerManager.prototype.hide = function () {
        if (this._leftObject) {
            this._leftObject.style.display = this._rightObject.style.display = "none";
        }
    };
    /**
    * ポインタ表示メソッド
    * @public
    * @method show
    */
    PointerManager.prototype.show = function () {
        if (this._leftObject) {
            this._leftObject.style.display = this._rightObject.style.display = "block";
        }
    };
    /**
    * ポインタ再配置メソッド
    * @private
    * @method _onWindowResize
    */
    PointerManager.prototype._onWindowResize = function () {
        if (this._leftObject) {
            this._leftObject.style.top = this._rightObject.style.top = this._rendererManager.center.y - this._height / 2 + "px";
            this._leftObject.style.left = this._rightObject.style.right = this._rendererManager.center.x - this._width / 2 + "px";
        }
    };
    /**
    * HTML要素作成メソッド
    * @private
    * @method _createElement
    * @return {HTMLElement}
    */
    PointerManager.prototype._createElement = function () {
        var element = document.createElement('img');
        element.src = this._resources + "/gazeCursor.png";
        element.className = "pointer";
        element.style.width = this._width + "px";
        element.style.height = this._height + "px";
        element.style.position = "absolute";
        return element;
    };
    return PointerManager;
})();
