"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
* リンクオブジェクト用メッシュクラス
* @class LinkMesh
* @extends THREE.Mesh
* @constructor
* @param {THREE.BufferGeometry} geometry ジオメトリ
* @param {THREE.Material} material マテリアル
* @param {number} spotdata 移動先スポットID
*/
var LinkMesh = (function (_super) {
    __extends(LinkMesh, _super);
    /**
    * 移動先スポットID
    * @public
    * @property spotdata
    * @type number
    */
    function LinkMesh(geometry, material, spotdata) {
        _super.call(this, geometry, material);
        this.spotdata = spotdata;
    }
    return LinkMesh;
})(THREE.Mesh);
