/// <reference path='../../typings/threejs/three.d.ts' />
/// <reference path='../../typings/threejs/three-canvasrenderer.d.ts' />
/// <reference path='../../typings/threejs/three-css3dstereorenderer.d.ts' />
/// <reference path='../../typings/tween.js/tween.js.d.ts' />
/// <reference path='../../typings/threejs/detector.d.ts' />
/// <reference path='../../typings/threejs/three-orbitcontrols.d.ts' />
/// <reference path='../../typings/threejs/three-deviceorientationcontrols.d.ts' />
/// <reference path='../../typings/threejs/three-oculusrifteffect.d.ts' />
/// <reference path='../../typings/stats/stats.d.ts' />
var RenderType;
(function (RenderType) {
    RenderType[RenderType["WEBGL"] = 0] = "WEBGL";
    RenderType[RenderType["CANVAS"] = 1] = "CANVAS";
    RenderType[RenderType["CSS3D"] = 2] = "CSS3D";
})(RenderType || (RenderType = {}));
/**
* アプリケーション本体クラス
* @class StreetView
* @constructor
* @param {Object} [option] オプションパラメータ,
*/
var StreetView = (function () {
    /**
    * モバイル判定フラグ
    * @property isMobile
    * @type boolean
    */
    /**
    * デバッグモード判定フラグ
    * @property isDebug
    * @type boolean
    * @default false
    */
    /**
    * WebGL使用可能フラグ
    * @property isWebgl
    * @type boolean
    */
    /**
    * リソースフォルダパス
    * @property resources
    * @type string
    * @default './img'
    */
    /**
    * 遷移先URL
    * @property indexUrl
    * @type string
    * @default './dest.php'
    */
    /**
    * ユーザーネーム
    * @property username
    * @type string
    * @default 'user'
    */
    /**
    * JSONファイルパス
    * @property jsonUrl
    * @type string
    * @default './data/data.json'
    */
    /**
    * トゥイーン判定フラグ
    * @property useTween
    * @type boolean
    * @default true
    */
    /**
    * webGLを使用しない場合の代替レンダラー
    * @property altRenderer
    * @type string
    * @default css3d
    */
    /**
    * 要素格納コンテナ
    * @property container
    * @type HTMLElement
    */
    /**
    * シーンオブジェクト
    * @property scene
    * @type THREE.Scene
    */
    /**
    * 要素格納コンテナ
    * @property container
    * @type HTMLElement
    */
    /**
    * 視点操作コントロール
    * @property controls
    * @type THREE.OrbitControls | THREE.DeviceOrientationControls
    */
    /**
    * スポットデータ
    * @property spots
    * @type Array
    */
    /**
    * スポットエントリーポイント
    * @property entry
    * @type number
    */
    /**
    * 現滞在スポット
    * @property currentSpot
    * @type Spot
    */
    /**
    * ポインターマネージャー
    * @property pointerManager
    * @type PointerManager
    */
    /**
    * 球体マネージャー
    * @property sphereManager
    * @type SphereManager
    */
    /**
    * リンクメニューマネージャー
    * @property linkMenuManager
    * @type LinkMenuManager
    */
    /**
    * プリローダーマネージャー
    * @property preloaderManager
    * @type PreloaderManager
    */
    /**
    * JSONマネージャー
    * @property jsonManager
    * @type JsonManager
    */
    /**
    * レンダラーマネージャー
    * @property rendererManager
    * @type RendererManager
    */
    /**
    * 閉じるボタンマネージャー
    * @property closeButtonManager
    * @type CloseButtonManager
    */
    /**
    * 次に進むボタンマネージャー
    * @property nextButtonManager
    * @type NextButtonManager
    */
    /**
    * カメラマネージャー
    * @property cameraManager
    * @type CameraManager
    */
    /**
    * スポットタイトルマネージャー
    * @property spotTitleManager
    * @type SpotTitleManager
    */
    /**
    * パフォーマンス統計情報オブジェクト
    * @private
    * @property _stats
    * @type Stats
    */
    /**
    * ログオブジェクト
    * @private
    * @property _log
    * @type HTMLElement
    */
    /**
    * グリッドメッシュオブジェクト
    * @private
    * @property _grid
    * @type THREE.Mesh
    */
    /**
    * コンパスメッシュオブジェクト
    * @private
    * @property _compass
    * @type THREE.Mesh
    */
    function StreetView(option) {
        // Option Params
        this.isMobile = /mobile/i.test(navigator.userAgent);
        this.isDebug = false;
        this.resources = './img';
        this.indexUrl = './';
        this.username = 'user';
        this.jsonUrl = './data/data.json';
        this.renderType = RenderType.WEBGL;
        this.altRenderType = 'CSS3D';
        this.useTween = true;
        this.useMask = true;
        this.usePointer = false;
        if (option) {
            for (var prop in option) {
                if (option.hasOwnProperty(prop)) {
                    this[prop] = option[prop];
                    if (prop == 'renderType') {
                        this[prop] = RenderType[option[prop]];
                    }
                }
            }
        }
        if (!Detector.webgl) {
            this.renderType = RenderType[this.altRenderType];
        }
        this._createScenes();
        this.jsonManager = new JsonManager(this.jsonUrl, this);
    }
    ;
    StreetView.prototype._createScenes = function () {
        var container = document.getElementById('container');
        if (container) {
            document.body.removeChild(container);
        }
        this.container = document.createElement('div');
        this.container.id = "container";
        document.body.appendChild(this.container);
        this.scene = new THREE.Scene();
        if (this.isDebug) {
            this._createDebugElement();
        }
        this.cameraManager = new CameraManager(this.scene, this.renderType, this.isMobile, this.useTween, this, this.resources, this.usePointer);
        this.rendererManager = new RendererManager(this.scene, this.cameraManager.camera, this.renderType, this.isMobile, this.container);
        this.sphereManager = new SphereManager(this.scene, this.renderType, this.resources, this.useTween, this.useMask);
        this.linkMenuManager = new LinkMenuManager(this.scene, this.resources, this.cameraManager, this.useTween);
        this.preloaderManager = new PreloaderManager(this.container, this.resources, this.rendererManager);
        this.spotTitleManager = new SpotTitleManager(this.container, this.resources, this.rendererManager, this.useTween);
        this.closeButtonManager = new CloseButtonManager(this.container, this.indexUrl);
        this.nextButtonManager = new NextButtonManager(this.container, this, this.isMobile);
        if (this.isMobile) {
            this.controls = new THREE.DeviceOrientationControls(this.cameraManager.camera);
        }
        else {
            this.controls = new THREE.OrbitControls(this.cameraManager.camera, this.rendererManager.renderer.domElement);
        }
    };
    /**
    * アプリケーション開始メソッド
    * @public
    * @method init
    */
    StreetView.prototype.init = function () {
        var _this = this;
        this.jsonManager.fetch(function () {
            console.log(_this.spots);
            _this.moveSpot(_this.entry);
        });
        this._animate();
    };
    /**
    * デバッグ要素作成メソッド
    * @private
    * @method _createDebugElement
    */
    StreetView.prototype._createDebugElement = function () {
        var _this = this;
        this._log = document.createElement('div');
        this._log.id = 'log';
        this._log.style.top = '10px';
        this.container.appendChild(this._log);
        this._stats = new Stats();
        this._stats.domElement.id = "stats";
        this.container.appendChild(this._stats.domElement);
        new THREE.TextureLoader().load(this.resources + '/compassGuide.png', function (texture) {
            var mat2 = new THREE.MeshBasicMaterial({
                map: texture,
                color: 0xffffff,
                side: THREE.FrontSide
            });
            var geo2 = new THREE.CircleGeometry(35, 32);
            _this._compass = new THREE.Mesh(geo2, mat2);
            _this._compass.rotation.x = THREE.Math.degToRad(-90);
            _this._compass.position.set(0, -50, 0);
            _this._compass.name = "compass";
            _this.scene.add(_this._compass);
        });
    };
    /**
    * 描画更新メソッド
    * @private
    * @method _animate
    * @param {number} [timestamp] 描画時タイムスタンプ
    */
    StreetView.prototype._animate = function (timestamp) {
        requestAnimationFrame(this._animate.bind(this));
        this.controls.update();
        TWEEN.update();
        this.cameraManager.update(timestamp);
        this.rendererManager.update();
        if (this.isDebug) {
            this._stats.update();
        }
        // this.sphereManager._sphere.rotation.y +=0.05;
    };
    /**
    * スポット移動メソッド
    * @public
    * @method moveSpot
    * @param {number} num 移動先スポットID
    */
    StreetView.prototype.moveSpot = function (num) {
        var _this = this;
        if (TWEEN.getAll().length <= 0) {
            this.currentSpot = this.spots[num];
            this.spotTitleManager.destroy();
            this.cameraManager.setPointerVisible(false);
            this.linkMenuManager.destroy();
            this.preloaderManager.show();
            this.sphereManager.change(this.currentSpot, function () {
                _this.preloaderManager.hide();
                _this.cameraManager.setPointerVisible(true);
                _this.linkMenuManager.create(_this.currentSpot);
                _this.spotTitleManager.create(_this.currentSpot);
            });
        }
    };
    return StreetView;
})();
