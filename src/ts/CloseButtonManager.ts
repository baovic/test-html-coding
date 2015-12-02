"use strict";
/**
* 閉じるボタンオブジェクト作成クラス
* @class CloseButtonManager
* @constructor
* @param {HTMLElement} container 要素格納用コンテナ,
*/
class CloseButtonManager {
  private _container: HTMLElement;
  private _element: HTMLElement;
  private _indexUrl:string;

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
  private _onTouchEnd(): void {
    this._element.className = "closeButton";
    window.location.href = this._indexUrl;
  }
  
  /**
  * ボタンダウン時アクションメソッド
  * @private
  * @method _onTouchStart
  */
  private _onTouchStart(): void {
    this._element.className = "closeButton on";
  }

  /**
  * 要素作成メソッド
  * @private
  * @method _createElement
  */
  private _createElement = function() {
    let element = document.createElement('div');
    element.className = "closeButton";
    return element;
  }

  constructor(container: HTMLElement, indexUrl: string) {
    this._container = container;
    this._indexUrl = indexUrl;

    this._element = this._createElement();
    this._element.addEventListener("touchend", this._onTouchEnd.bind(this), false);
    this._element.addEventListener("mouseup", this._onTouchEnd.bind(this), false);
    this._element.addEventListener("touchstart", this._onTouchStart.bind(this), false);
    this._container.appendChild(this._element);
  }
}
