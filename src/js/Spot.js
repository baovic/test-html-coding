"use strict";
/**
* スポット情報管理クラス。
* @class Spot
* @constructor
* @param {number} index 自身のスポット情報配列のインデックス
* @param {Array} spots スポット情報配列
* @param {string} dataUrl データフォルダパス
*/
var Spot = (function () {
    /**
    * スポットの一意な識別番号（重複した場合、後のものが優先される）
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
    * スポット画像ファイルのURL
    * @public
    * @property file
    * @type string
    */
    /**
    * スポットのリンクオブジェクト格納用配列
    * @public
    * @property links
    * @type Array<Link>
    */
    /**
    * 次のスポットID
    * @public
    * @property next
    * @type number
    */
    /**
    * 前のスポットID
    * @public
    * @property prev
    * @type number
    */
    function Spot(index, spots, dataUrl) {
        var _this = this;
        var item = spots[index];
        this.no = item.no;
        this.title = item.title;
        if (item.file) {
            this.useCubemap = false;
            this.file = dataUrl + item.file;
            this.alt = dataUrl + item.altFile;
        }
        if (item.cubemaps) {
            this.useCubemap = true;
            this.file = dataUrl + item.cubemaps;
            this.alt = dataUrl + item.altCubemaps;
        }
        this.rotation = new THREE.Vector3(0, 0, 0);
        if (item.rotation) {
            this.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
        }
        this.links = [];
        if (item.links && item.links.length > 0) {
            item.links.forEach(function (item) {
                _this.links.push(new Link(item.to, item.direction));
            });
        }
        if (index == 0) {
            this.prev = spots[spots.length - 1].no;
        }
        else {
            this.prev = spots[index - 1].no;
        }
        if (index == spots.length - 1) {
            this.next = spots[0].no;
        }
        else {
            this.next = spots[index + 1].no;
        }
    }
    return Spot;
})();
