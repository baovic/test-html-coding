"use strict";

/**
* レコード情報管理クラス。
* @class Record
* @constructor
* @param {number} no スポットID
* @param {string} title スポット名
* @param {number} time 滞在時間
*/
class Record {
	public no: number;
  public title: string;
  public time: number;
  
  /**
  * スポットID
  * @public
  * @property no
  * @type number
  */	
  /**
  * スポット名
  * @public
  * @property title
  * @type string
  */	
  /**
  * 滞在時間
  * @public
  * @property time
  * @type number
  */

  constructor(no: number, title: string, time: number) { 
    this.no = no;
    this.title = title;
    this.time = time;
  }
}