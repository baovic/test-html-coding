"use strict";
/**
* 投影球体クラス
* @class SphereManager
* @constructor
* @param {THREE.Scene} scene シーンオブジェクト
* @param {boolean} isWebgl webglが使えるかどうか
* @param {string} resources リソースフォルダの接頭辞
* @param {boolean} [useTween=true] トゥイーンを使用するかの判断フラグ
*/
var SphereManager = (function () {
    function SphereManager(scene, renderType, resources, useTween, useMask) {
        var _this = this;
        this._duration = 500;
        this._lastUpdate = 0;
        this._materials = [];
        this._scene = scene;
        this._renderType = renderType;
        this._resources = resources;
        this._useTween = useTween;
        this._useMask = useMask;
        if (this._useMask && this._renderType != RenderType.CSS3D) {
            new THREE.TextureLoader().load(this._resources + '/logo.png', function (texture) {
                var mat2 = new THREE.MeshBasicMaterial({
                    map: texture,
                    color: 0xffffff,
                    transparent: false,
                    side: THREE.FrontSide
                });
                if (_this._renderType == RenderType.CANVAS) {
                    mat2.overdraw = 1;
                }
                var geo2 = new THREE.CircleGeometry(55, 64);
                _this._logo = new THREE.Mesh(geo2, mat2);
                _this._logo.position.set(0, -60, 0);
                _this._logo.rotation.x = THREE.Math.degToRad(-90);
                _this._logo.name = "logo";
                _this._scene.add(_this._logo);
            });
        }
    }
    /**
    * トゥイーン使用時の遷移時間
    * @private
    * @property _duration
    * @type number
    * @default 1000
    */
    /**
    * 最後に画面が描画されたタイムスタンプ
    * @private
    * @property _lastUpdate
    * @type number
    * @default 0
    */
    /**
    * 球体メッシュオブジェクト
    * @private
    * @property _sphere
    * @type THREE.Mesh
    */
    /**
    * シーンオブジェクト
    * @private
    * @property _scene
    * @type THREE.Scene
    */
    /**
    * webglが使えるかどうか
    * @private
    * @property _isWebgl
    * @type boolean
    */
    /**
    * リソースフォルダの接頭辞
    * @private
    * @property _resources
    * @type string
    */
    /**
    * トゥイーンを使用するかの判断フラグ
    * @private
    * @property _useTween
    * @type boolean
    * @default true
    */
    /**
    * ロゴメッシュ
    * @private
    * @property _logo
    * @type THREE.Mesh
    */
    /**
    * マテリアル変更メソッド
    * @public
    * @method change
    * @param {Spot} spot 新しい変更先スポットデータ
    * @param {function} [callback] 変更後に呼び出されるコールバック関数
    */
    SphereManager.prototype.change = function (spot, callback) {
        var _this = this;
        if (TWEEN.getAll().length < 1) {
            if (!this._sphere) {
                this._show(spot, callback);
            }
            else {
                this._hide(function () {
                    _this._show(spot, callback);
                });
            }
        }
    };
    /**
    * 球体を表示するメソッド
    * @private
    * @method _show
    * @param {Spot} spot 新しい変更先スポットデータ
    * @param {function} [callback] 変更後に呼び出されるコールバック関数
    */
    SphereManager.prototype._show = function (spot, callback) {
        if (this._sphere)
            return;
        if (this._renderType == RenderType.CSS3D) {
            this._createCss3dCubemap(spot, callback);
        }
        else if (this._renderType == RenderType.CANVAS) {
            if (spot.useCubemap) {
                this._createCanvasCubemap(spot, callback);
            }
            else {
                this._createCanvasEquirectanglar(spot, callback);
            }
        }
        else if (this._renderType == RenderType.WEBGL) {
            if (spot.useCubemap) {
                this._createWebglCubemap(spot, callback);
            }
            else {
                this._createWebglEquirectanglar(spot, callback);
            }
        }
    };
    SphereManager.prototype._createCss3dCubemap = function (spot, callback) {
        var _this = this;
        var imgSize = 512;
        var sidesPos = [
            {
                position: [-imgSize, 0, 0],
                rotation: [0, Math.PI / 2, 0]
            },
            {
                position: [imgSize, 0, 0],
                rotation: [0, -Math.PI / 2, 0]
            },
            {
                position: [0, imgSize, 0],
                rotation: [Math.PI / 2, 0, Math.PI]
            },
            {
                position: [0, -imgSize, 0],
                rotation: [-Math.PI / 2, 0, Math.PI]
            },
            {
                position: [0, 0, imgSize],
                rotation: [0, Math.PI, 0]
            },
            {
                position: [0, 0, -imgSize],
                rotation: [0, 0, 0]
            }
        ];
        var sidesUrl = [
            spot.alt + '/posx.jpg',
            spot.alt + '/negx.jpg',
            spot.alt + '/posy.jpg',
            spot.alt + '/negy.jpg',
            spot.alt + '/posz.jpg',
            spot.alt + '/negz.jpg'
        ];
        if (this._materials[spot.no]) {
            this._createCss3dBoxMesh(this._materials[spot.no], callback, spot.rotation);
        }
        else {
            var box = new THREE.Object3D();
            new THREE.CubeTextureLoader().load(sidesUrl, function (texture) {
                texture.format = THREE.RGBFormat;
                for (var i = 0; i < 6; i++) {
                    var element = texture.image[i];
                    element.width = imgSize * 2 + 2;
                    element.style.opacity = '0';
                    var object = new THREE.CSS3DObject(element);
                    object.position.fromArray(sidesPos[i].position);
                    object.rotation.fromArray(sidesPos[i].rotation);
                    box.add(object);
                }
                _this._materials[spot.no] = box;
                _this._createCss3dBoxMesh(_this._materials[spot.no], callback, spot.rotation);
            });
        }
    };
    SphereManager.prototype._createCss3dBoxMesh = function (material, callback, rotation) {
        var _this = this;
        this._sphere = material;
        this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y), THREE.Math.degToRad(rotation.x), "XYZ");
        this._scene.add(this._sphere);
        this._tween({
            start: 0,
            end: 1,
            duration: this._duration,
            onUpdate: function (tn) {
                _this._sphere.children.forEach(function (item) {
                    item.elementL.style.opacity = tn.opacity;
                    item.elementR.style.opacity = tn.opacity;
                });
            },
            onComplete: function (tn) {
                _this._sphere.children.forEach(function (item) {
                    item.elementL.style.opacity = '1';
                    item.elementR.style.opacity = '1';
                });
            },
            callback: callback
        });
    };
    SphereManager.prototype._createCanvasCubemap = function (spot, callback) {
        var _this = this;
        var sides = [
            spot.alt + '/negx.jpg',
            spot.alt + '/posx.jpg',
            spot.alt + '/posy.jpg',
            spot.alt + '/negy.jpg',
            spot.alt + '/posz.jpg',
            spot.alt + '/negz.jpg'
        ];
        if (this._materials[spot.no]) {
            this._createCanvasBoxMesh(this._materials[spot.no], callback, spot.rotation);
        }
        else {
            new THREE.CubeTextureLoader().load(sides, function (texture) {
                texture.format = THREE.RGBFormat;
                var matArray = [];
                for (var i = 0; i < 6; i++) {
                    var tex = new THREE.Texture(texture.image[i]);
                    tex.repeat.set(-1, 1);
                    tex.offset.set(1, 0);
                    tex.needsUpdate = true;
                    var tmpmat = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0,
                        map: tex,
                        side: THREE.BackSide,
                        overdraw: 1
                    });
                    matArray.push(tmpmat);
                }
                var facemat = new THREE.MeshFaceMaterial(matArray);
                _this._materials[spot.no] = facemat;
                _this._createCanvasBoxMesh(_this._materials[spot.no], callback, spot.rotation);
            });
        }
    };
    SphereManager.prototype._createCanvasBoxMesh = function (material, callback, rotation) {
        var _this = this;
        var geo = new THREE.BoxGeometry(500, 500, 500, 16, 16, 16);
        this._sphere = new THREE.Mesh(geo, material);
        this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y), THREE.Math.degToRad(rotation.x), "XYZ");
        this._sphere.name = "sphere";
        this._scene.add(this._sphere);
        this._tween({
            start: 0,
            end: 1,
            duration: this._duration,
            onUpdate: function (tn) {
                for (var i = 0; i < 6; i++) {
                    _this._sphere.material.materials[i].opacity = tn.opacity;
                }
            },
            onComplete: function (tn) {
                for (var i = 0; i < 6; i++) {
                    _this._sphere.material.materials[i].opacity = 1;
                    _this._sphere.material.materials[i].transparent = false;
                }
            },
            callback: callback
        });
    };
    SphereManager.prototype._createCanvasEquirectanglar = function (spot, callback) {
        var _this = this;
        var url = spot.alt;
        if (this._materials[spot.no]) {
            this._createCanvasSphereMesh(this._materials[spot.no], callback, spot.rotation);
        }
        else {
            new THREE.TextureLoader().load(url, function (texture) {
                texture.repeat.set(-1, 1);
                texture.offset.set(1, 0);
                var material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: texture,
                    transparent: true,
                    opacity: 0,
                    side: THREE.BackSide,
                    overdraw: 1,
                });
                _this._materials[spot.no] = material;
                _this._createCanvasSphereMesh(_this._materials[spot.no], callback, spot.rotation);
            });
        }
    };
    SphereManager.prototype._createCanvasSphereMesh = function (material, callback, rotation) {
        var _this = this;
        var geo = new THREE.SphereGeometry(500, 64, 32);
        this._sphere = new THREE.Mesh(geo, material);
        this._sphere.name = "sphere";
        this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y - 90), THREE.Math.degToRad(rotation.x), "ZYX");
        this._scene.add(this._sphere);
        this._tween({
            start: 0,
            end: 1,
            duration: this._duration,
            onUpdate: function (tn) {
                _this._sphere.material.opacity = tn.opacity;
            },
            onComplete: function (tn) {
                _this._sphere.material.opacity = 1;
                _this._sphere.material.transparent = false;
            },
            callback: callback
        });
    };
    SphereManager.prototype._createWebglCubemap = function (spot, callback) {
        var _this = this;
        var sides = [
            spot.file + '/negx.jpg',
            spot.file + '/posx.jpg',
            spot.file + '/posy.jpg',
            spot.file + '/negy.jpg',
            spot.file + '/posz.jpg',
            spot.file + '/negz.jpg'
        ];
        if (this._materials[spot.no]) {
            this._createWebglBoxMesh(this._materials[spot.no], callback, spot.rotation);
        }
        else {
            new THREE.CubeTextureLoader().load(sides, function (texture) {
                var matArray = [];
                for (var i = 0; i < 6; i++) {
                    var tex = new THREE.Texture(texture.image[i]);
                    tex.repeat.set(-1, 1);
                    tex.offset.set(1, 0);
                    tex.needsUpdate = true;
                    var tmpmat = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        map: tex,
                        side: THREE.BackSide,
                        transparent: true,
                        opacity: 0
                    });
                    matArray.push(tmpmat);
                }
                var facemat = new THREE.MeshFaceMaterial(matArray);
                _this._materials[spot.no] = facemat;
                _this._createWebglBoxMesh(_this._materials[spot.no], callback, spot.rotation);
            });
        }
    };
    SphereManager.prototype._createWebglBoxMesh = function (material, callback, rotation) {
        var _this = this;
        var geo = new THREE.BoxGeometry(500, 500, 500, 1, 1, 1);
        this._sphere = new THREE.Mesh(geo, material);
        this._sphere.name = "sphere";
        this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y), THREE.Math.degToRad(rotation.x), "XYZ");
        this._scene.add(this._sphere);
        for (var i = 0; i < 6; i++) {
            this._sphere.material.materials[i].transparent = true;
        }
        this._tween({
            start: 0,
            end: 1,
            duration: this._duration,
            onUpdate: function (tn) {
                for (var i = 0; i < 6; i++) {
                    _this._sphere.material.materials[i].opacity = tn.opacity;
                }
            },
            onComplete: function (tn) {
                for (var i = 0; i < 6; i++) {
                    _this._sphere.material.materials[i].opacity = 1;
                    _this._sphere.material.materials[i].transparent = false;
                }
            },
            callback: callback
        });
    };
    SphereManager.prototype._createWebglEquirectanglar = function (spot, callback) {
        var _this = this;
        var url = spot.file;
        if (this._materials[spot.no]) {
            this._createWebglSphereMesh(this._materials[spot.no], callback, spot.rotation);
        }
        else {
            new THREE.TextureLoader().load(url, function (texture) {
                texture.repeat.set(-1, 1);
                texture.offset.set(1, 0);
                var material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: texture,
                    transparent: true,
                    opacity: 0,
                    side: THREE.BackSide,
                });
                _this._materials[spot.no] = material;
                _this._createWebglSphereMesh(_this._materials[spot.no], callback, spot.rotation);
            });
        }
    };
    SphereManager.prototype._createWebglSphereMesh = function (material, callback, rotation) {
        var _this = this;
        var geo = new THREE.SphereGeometry(500, 64, 32);
        this._sphere = new THREE.Mesh(geo, material);
        this._sphere.name = "sphere";
        this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y - 90), THREE.Math.degToRad(rotation.x), "ZYX");
        this._scene.add(this._sphere);
        this._tween({
            start: 0,
            end: 1,
            duration: this._duration,
            onUpdate: function (tn) {
                _this._sphere.material.opacity = tn.opacity;
            },
            onComplete: function (tn) {
                _this._sphere.material.opacity = 1;
                _this._sphere.material.transparent = false;
            },
            callback: callback
        });
    };
    /**
    * 球体を非表示にするメソッド
    * @private
    * @method _hide
    * @param {function} [callback] 変更後に呼び出されるコールバック関数
    */
    SphereManager.prototype._hide = function (callback) {
        var _this = this;
        if (!this._sphere)
            return;
        if (this._renderType == RenderType.CSS3D) {
            this._tween({
                start: 1,
                end: 0,
                duration: this._duration / 2,
                onUpdate: function (tn) {
                    _this._sphere.children.forEach(function (item) {
                        item.elementL.style.opacity = tn.opacity;
                        item.elementR.style.opacity = tn.opacity;
                    });
                },
                onComplete: function (tn) {
                    _this._sphere.children.forEach(function (item) {
                        item.dispatchEvent({ type: 'removed', target: item });
                    });
                    _this._scene.remove(_this._sphere);
                    _this._sphere = null;
                },
                callback: callback
            });
        }
        else if (this._renderType == RenderType.CANVAS) {
            if (this._sphere.material instanceof THREE.MultiMaterial) {
                for (var i = 0; i < 6; i++) {
                    this._sphere.material.materials[i].transparent = true;
                }
                this._tween({
                    start: 1,
                    end: 0,
                    duration: this._duration / 2,
                    onUpdate: function (tn) {
                        for (var i = 0; i < 6; i++) {
                            _this._sphere.material.materials[i].opacity = tn.opacity;
                        }
                    },
                    onComplete: function (tn) {
                        for (var i = 0; i < 6; i++) {
                            _this._sphere.material.materials[i].opacity = 0;
                        }
                        _this._scene.remove(_this._sphere);
                        _this._sphere = null;
                    },
                    callback: callback
                });
            }
            else {
                this._sphere.material.transparent = true;
                this._tween({
                    start: 1,
                    end: 0,
                    duration: this._duration / 2,
                    onUpdate: function (tn) {
                        _this._sphere.material.opacity = tn.opacity;
                    },
                    onComplete: function (tn) {
                        _this._sphere.material.opacity = 0;
                        _this._scene.remove(_this._sphere);
                        _this._sphere = null;
                    },
                    callback: callback
                });
            }
        }
        else if (this._renderType == RenderType.WEBGL) {
            if (this._sphere.material instanceof THREE.MultiMaterial) {
                for (var i = 0; i < 6; i++) {
                    this._sphere.material.materials[i].transparent = true;
                }
                this._tween({
                    start: 1,
                    end: 0,
                    duration: this._duration / 2,
                    onUpdate: function (tn) {
                        for (var i = 0; i < 6; i++) {
                            _this._sphere.material.materials[i].opacity = tn.opacity;
                        }
                    },
                    onComplete: function (tn) {
                        for (var i = 0; i < 6; i++) {
                            _this._sphere.material.materials[i].opacity = 0;
                        }
                        _this._scene.remove(_this._sphere);
                        _this._sphere = null;
                    },
                    callback: callback
                });
            }
            else {
                this._sphere.material.transparent = true;
                this._tween({
                    start: 1,
                    end: 0,
                    duration: this._duration / 2,
                    onUpdate: function (tn) {
                        _this._sphere.material.opacity = tn.opacity;
                    },
                    onComplete: function (tn) {
                        _this._sphere.material.opacity = 0;
                        _this._scene.remove(_this._sphere);
                        _this._sphere = null;
                    },
                    callback: callback
                });
            }
        }
    };
    /**
    * トゥイーンメソッド
    * @private
    * @method _tween
    * @param {number} start 開始透明度
    * @param {number} end 終了透明度
    * @param {function} [callback] 変更後に呼び出されるコールバック関数
    */
    SphereManager.prototype._tween = function (option) {
        // start: number, end: number, duration, update, complete?, callback?: () => any
        var _opt = {
            start: 0,
            end: 1,
            duration: this._duration,
            onUpdate: function (tn) { },
            onComplete: undefined,
            callback: undefined
        };
        if (option) {
            for (var prop in option) {
                if (option.hasOwnProperty(prop)) {
                    _opt[prop] = option[prop];
                }
            }
        }
        if (this._useTween) {
            var tween = new TWEEN.Tween({
                opacity: _opt.start,
            })
                .to({
                opacity: _opt.end,
            }, _opt.duration)
                .onUpdate(function () {
                _opt.onUpdate(this);
            })
                .onComplete(function () {
                if (_opt.onComplete)
                    _opt.onComplete(this);
                if (_opt.callback) {
                    setTimeout(_opt.callback, 1);
                }
            })
                .start();
        }
        else {
            if (_opt.onComplete)
                _opt.onComplete(this);
            if (_opt.callback) {
                setTimeout(_opt.callback, 1);
            }
        }
    };
    return SphereManager;
})();
