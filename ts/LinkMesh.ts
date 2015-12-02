"use strict";

/**
* リンクオブジェクト用メッシュクラス
* @class LinkMesh
* @extends THREE.Mesh
* @constructor 
* @param {THREE.BufferGeometry} geometry ジオメトリ
* @param {THREE.Material} material マテリアル
* @param {number} spotdata 移動先スポットID
*/
class LinkMesh extends THREE.Mesh {
	public spotdata: number;
	 
	/**
	* 移動先スポットID
	* @public
	* @property spotdata
	* @type number
	*/
	
	constructor(geometry: THREE.BufferGeometry, material: THREE.Material, spotdata) {
		super(geometry, material);
		this.spotdata = spotdata;
	}
}