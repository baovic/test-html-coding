"use strict";
/**
* カメラオブジェクトの管理や視線の衝突判定を行う。
* @class CameraManager
* @constructor
* @param {THREE.Scene} scene シーンオブジェクト,
* @param {boolean} isWebgl WebGLが使用可能かどうかの判定フラグ,
* @param {boolean} isMobile モバイル判定フラグ,
* @param {StreetView} parent アプリルートオブジェクト参照用,
*/
var CameraManager = (function () {
    function CameraManager(scene, renderType, isMobile, useTween, parent, resources, usePointer) {
        var _this = this;
        this._fov = 45;
        this._near = 1;
        this._far = 1000;
        this._duration = 3000;
        this._clearDuration = 50;
        this._scaleSpeed = 0.01;
        this._aspect = 1;
        this._longLookTime = 0;
        this._previousUpdate = 0;
        this._useTween = true;
        this._scene = scene;
        this._renderType = renderType;
        this._isMobile = isMobile;
        this._parent = parent;
        this._targets = [];
        this._useTween = useTween;
        this._resources = resources;
        this._usePointer = usePointer;
        if (this._renderType != RenderType.WEBGL) {
            this._fov = 100;
        }
        this.camera = new THREE.PerspectiveCamera(this._fov, this._aspect, this._near, this._far);
        this.camera.position.set(0, 0, 0.1);
        if (this._isMobile) {
            this.camera.position.set(0, 0, 0);
        }
        this._raycaster = new THREE.Raycaster();
        this._scene.add(this.camera);
        this._onWindowResize();
        window.addEventListener("resize", this._onWindowResize.bind(this), false);
        if (this._usePointer) {
            new THREE.TextureLoader().load(this._resources + '/gazeCursor.png', function (texture) {
                var mat = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide
                });
                var geo = new THREE.PlaneBufferGeometry(1.5, 1.5, 1, 1);
                _this._pointer = new THREE.Mesh(geo, mat);
                _this._pointer.position.set(0, 0, -30);
                _this._pointer.name = "pointer";
                _this._pointer.visible = false;
                _this._scene.add(_this._pointer);
            });
        }
    }
    /**
    * 投影に使用するCameraオブジェクト
    * @public
    * @property camera
    * @type THREE.PerspectiveCamera
    */
    /**
    * Sceneオブジェクトの参照
    * @private
    * @property _scene
    * @type THREE.Scene
    */
    /**
    * カメラ設定で使用する視野角
    * @private
    * @property _fov
    * @type number
    * @default 45
    */
    /**
    * カメラ設定で使用する最も近いクリッピング距離
    * @private
    * @property _near
    * @type number
    * @default 1
    */
    /**
    * カメラ設定で使用する最も遠いクリッピング距離
    * @private
    * @property _far
    * @type number
    * @default 1000
    */
    /**
    * ブラウザがWebGLに対応しているかを判定するフラグ
    * @private
    * @property _isWebgl
    * @type boolean
    */
    /**
    * モバイル端末かどうかを判定するフラグ
    * @private
    * @property _isMobile
    * @type boolean
    */
    /**
    * ボタンに視点を合わせた時に、タッチイベントをトリガーするまでの時間
    * @private
    * @property _duration
    * @type number
    * @default 5000
    */
    /**
    * 視点を外した時の元に戻る時間
    * @private
    * @property _clearDuration
    * @type number
    * @default 100
    */
    /**
    * ボタンに視点を合わせた時に、サイズが変わるスピード
    * @private
    * @property _scaleSpeed
    * @type number
    * @default 0.01
    */
    /**
    * カメラの視点を判定するためのraycasterオブジェクト
    * @private
    * @property _raycaster
    * @type THREE.raycaster
    */
    /**
    * カメラ設定で使用するアスペクト比
    * @private
    * @property _aspect
    * @type number
    * @default 1
    */
    /**
    * ボタンに視点を合わせた時の経過時間
    * @private
    * @property _longLookTime
    * @type number
    * @default 0
    */
    /**
    * 前回の画面が描画された時間のタイムスタンプ
    * @private
    * @property _previousUpdate
    * @type number
    * @default 0
    */
    /**
    * 視点判定に使用する衝突オブジェクトを格納する配列
    * @private
    * @property _targets
    * @type Array
    */
    /**
    * アプリルート参照用変数
    * @private
    * @property _parent
    * @type StreetView
    */
    /**
    * トゥイーン判断フラグ
    * @private
    * @property _useTween
    * @type boolean
    * @default true
    */
    /**
    * 画面サイズが変わったときにアスペクト比を再設定する
    * @private
    * @method _onWindowResize
    */
    CameraManager.prototype._onWindowResize = function () {
        this._aspect = this._calcurateAspect(window.innerWidth, window.innerHeight);
        this.camera.aspect = this._aspect;
        this.camera.updateProjectionMatrix();
    };
    /**
    * アスペクト比の計算用メソッド
    * @private
    * @method _calcurateAspect
    * @param {number} width 横幅の数字
    * @param {number} height 縦幅の数字
    * @return {number}
    */
    CameraManager.prototype._calcurateAspect = function (width, height) {
        return (width / 2 / height);
    };
    /**
    * カメラ更新用メソッド
    * @public
    * @method update
    * @param {number} timestamp 描画タイムスタンプ
    */
    CameraManager.prototype.update = function (timestamp) {
        if (this._pointer) {
            var vector = new THREE.Vector3(0, 0, -1);
            vector.applyQuaternion(this.camera.quaternion).normalize().setLength(20);
            this._pointer.position.set(vector.x, vector.y, vector.z);
            this._pointer.lookAt(this.camera.position);
        }
        if (this._targets.length > 0) {
            var intersect = this._getIntersection();
            if (intersect) {
                this._zoomInObject.bind(this)(intersect, timestamp);
            }
            else {
                this._zoomOutObject();
            }
        }
        this._previousUpdate = timestamp;
    };
    /**
    * 視点衝突検出用メソッド
    * @private
    * @method _getIntersection
    * @return {LinkMesh} 衝突したオブジェクトがあれば返す。なければnullを返す。
    */
    CameraManager.prototype._getIntersection = function () {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyQuaternion(this.camera.quaternion).normalize();
        this._raycaster.set(this.camera.position, vector);
        var intersections = this._raycaster.intersectObjects(this._targets, true);
        if (intersections.length > 0) {
            return intersections[0].object;
        }
        else {
            return null;
        }
    };
    /**
    * ボタン拡大メソッド
    * @private
    * @method _zoomInObject
    * @param {LinkMesh} object 対象オブジェクト
    * @param {number} timestamp 描画時タイムスタンプ
    */
    CameraManager.prototype._zoomInObject = function (object, timestamp) {
        this._longLookTime += (timestamp - this._previousUpdate);
        var longLookScale = new THREE.Vector3(1, 1, 1).multiplyScalar(this._scaleSpeed);
        object.scale.add(longLookScale);
        if (this._longLookTime >= this._duration) {
            this._longLookTime = 0;
            this.clearTargets();
            this._interact(object);
        }
    };
    /**
    * ボタンインタラクトメソッド
    * @private
    * @method _interact
    * @param {LinkMesh} object 対象オブジェクト
    */
    CameraManager.prototype._interact = function (object) {
        if (object.name == 'linkMenu') {
            this._longLookTime = 0;
            this._parent.moveSpot(object.spotdata);
        }
    };
    /**
    * 拡大解除用メソッド
    * @private
    * @method _zoomOutObject
    * @param {number} timestamp 描画時タイムスタンプ
    */
    CameraManager.prototype._zoomOutObject = function () {
        var _this = this;
        this._longLookTime = 0;
        this._targets.forEach(function (item) {
            if (Math.floor(item.scale.x * 10) / 10 > 1) {
                _this._tween(item, item.scale.x, 1, _this._clearDuration);
            }
        });
    };
    /**
      * トゥイーンメソッド
      * @private
      * @method _tween
      * @param {THREE.Object3D} obj 対象オブジェクト
      * @param {number} start 開始変数
      * @param {number} end 終了変数
      * @param {number} duration 遷移時間
      */
    CameraManager.prototype._tween = function (obj, start, end, duration) {
        if (this._useTween) {
            var tween = new TWEEN.Tween({
                scale: start,
            })
                .to({
                scale: end,
            }, duration)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(function () {
                obj.scale.set(this.scale, this.scale, this.scale);
            })
                .start();
        }
        else {
            obj.scale.set(end, end, end);
        }
    };
    /**
    * ターゲットセット用メソッド
    * @public
    * @method setTarget
    * @param {THREE.Object3D} obj 対象オブジェクト
    */
    CameraManager.prototype.setTarget = function (obj) {
        this._targets.push(obj);
    };
    CameraManager.prototype.setPointerVisible = function (visible) {
        if (this._pointer) {
            this._pointer.visible = visible;
        }
    };
    /**
    * ターゲットクリア用メソッド
    * @public
    * @method clearTargets
    */
    CameraManager.prototype.clearTargets = function () {
        this._targets = [];
        this._longLookTime = 0;
    };
    return CameraManager;
})();
