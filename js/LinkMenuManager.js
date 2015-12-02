"use strict";
/**
* リンクオブジェクトの生成、配置、破壊を行うクラス
* @class LinkMenuManager
* @constructor
* @param {THREE.Scene} scene シーンオブジェクト,
* @param {string} resources リソースフォルダパス
* @param {CameraManager} cameraManager カメラマネージャーの参照用変数
* @param {boolean} useTween トゥイーンを使用するか判断するフラグ
*/
var LinkMenuManager = (function () {
    function LinkMenuManager(scene, resources, cameraManager, useTween) {
        this._duration = 500;
        this._useTween = true;
        this._scene = scene;
        this._resources = resources;
        this._cameraManager = cameraManager;
        this._useTween = useTween;
    }
    /**
    * トゥイーン使用時の遷移時間
    * @private
    * @property _duration
    * @type number
    * @default 500
    */
    /**
    * リソースフォルダパス
    * @private
    * @property _resources
    * @type string
    */
    /**
    * シーンオブジェクト
    * @private
    * @property _scene
    * @type THREE.Scene
    */
    /**
    * トゥイーンを使用するか判断するフラグ
    * @private
    * @property _useTween
    * @type boolean
    * @default true
    */
    /**
    * リンクオブジェクトグループ
    * @private
    * @property _linkMenuGroup
    * @type THREE.Object3D
    */
    /**
    * カメラオブジェクト参照用変数
    * @private
    * @property _cameraManager
    * @type CameraManager
    */
    /**
    * リンクオブジェクト作成メソッド
    * @public
    * @method create
    * @param {Spot} spot スポットデータ
    */
    LinkMenuManager.prototype.create = function (spot) {
        var _this = this;
        if (spot.links && spot.links.length > 0) {
            if (this._linkMenuGroup) {
                this._cameraManager.clearTargets();
                this._scene.remove(this._linkMenuGroup);
            }
            this._linkMenuGroup = new THREE.Object3D();
            this._scene.add(this._linkMenuGroup);
            new THREE.TextureLoader().load(this._resources + '/moveButtonOff.png', function (texture) {
                var mat = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.FrontSide,
                    transparent: true,
                });
                spot.links.forEach(function (element) {
                    var pivot = _this._createLinkPivot(new THREE.Vector3(0, -element.direction, 0));
                    _this._linkMenuGroup.add(pivot);
                    var geo = new THREE.PlaneBufferGeometry(50, 50, 1, 1);
                    var mesh = new LinkMesh(geo, mat, element.to);
                    mesh.position.set(0, 0, -200);
                    mesh.name = 'linkMenu';
                    pivot.add(mesh);
                    _this._cameraManager.setTarget(mesh);
                });
                _this._tween(0, 1);
            });
        }
    };
    /**
    * リンクオブジェクト破壊メソッド
    * @public
    * @method destroy
    * @param {function} [callback] 破壊後実行されるコールバック関数
    */
    LinkMenuManager.prototype.destroy = function () {
        if (this._linkMenuGroup && this._linkMenuGroup.children.length > 0) {
            this._cameraManager.clearTargets();
            this._scene.remove(this._linkMenuGroup);
            this._linkMenuGroup = null;
        }
    };
    /**
    * リンクメッシュ作成メソッド
    * @method _createLinkMesh
    * @private
    * @param {number} no 移動先スポットID
    */
    LinkMenuManager.prototype._createLinkMesh = function (pivot, no) {
        var _this = this;
        new THREE.TextureLoader().load(this._resources + '/moveButtonOff.png', function (texture) {
            var mat = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.FrontSide,
                transparent: true,
            });
            var geo = new THREE.PlaneBufferGeometry(500, 500, 1, 1);
            var mesh = new LinkMesh(geo, mat, no);
            mesh.position.set(0, 0, -200);
            mesh.name = 'linkMenu';
            console.log(mesh);
            pivot.add(mesh);
            _this._cameraManager.setTarget(mesh);
        });
    };
    /**
    * リンク回転用ピボット作成メソッド
    * @method _createLinkPivot
    * @private
    * @param {THREE.Vector3} rot 回転角
    * @return {THREE.Object3D}
    */
    LinkMenuManager.prototype._createLinkPivot = function (rot) {
        var obj = new THREE.Object3D();
        obj.position.set(0, 0, 0);
        obj.rotation.set(THREE.Math.degToRad(rot.x), THREE.Math.degToRad(rot.y), THREE.Math.degToRad(rot.z), "XYZ");
        obj.name = "pivot";
        return obj;
    };
    /**
    * トゥイーンメソッド
    * @method _tween
    * @private
    * @param {number} start 開始透明度
    * @param {number} end 終了透明度
    * @param {function} [callback] 終了後実行されるコールバック関数
    */
    LinkMenuManager.prototype._tween = function (start, end, callback) {
        var self = this;
        this._linkMenuGroup.children.forEach(function (item) {
            var child = item.children[0];
            child.material.transparent = true;
        });
        if (this._useTween) {
            var tween = new TWEEN.Tween({
                opacity: start,
            })
                .to({
                opacity: end,
            }, self._duration)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(function () {
                var _this = this;
                self._linkMenuGroup.children.forEach(function (item) {
                    var child = item.children[0];
                    child.material.opacity = _this.opacity;
                });
            })
                .onComplete(function () {
                if (callback) {
                    setTimeout(callback, 1);
                }
            })
                .start();
        }
        else {
            console.log('non branch');
            this._linkMenuGroup.children.forEach(function (item) {
                var child = item.children[0];
                child.material.opacity = end;
            });
            if (callback) {
                setTimeout(callback, 1);
            }
        }
    };
    return LinkMenuManager;
})();
