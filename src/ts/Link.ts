"use strict";

/**
* 各画面同士のリンク情報管理クラス。
* @class Link
* @constructor
* @param {number} to リンク先ID 
* @param {number} direction リンクボタン方角 
*/
class Link {  
  public to:number;
  public direction:number;
    
  /**
  * 移動先スポットID
  * @public
  * @property to
  * @type Number
  */
  /**
  * リンクボタンを表示する方角(0°-360°)
  * @public
  * @property direction
  * @type Number
  */

  constructor(to:number, direction:number) {
    this.to = to;
    this.direction = direction;
  };
}