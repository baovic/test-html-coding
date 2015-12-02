"use strict";

/**
* THREE.Rendererオブジェクトの生成や管理を行う
* @class RendererManager
* @constructor
* @param {THREE.Scene} scene レンダリング対象のシーンオブジェクト,
* @param {THREE.camera} camera レンダリングに使用するカメラオブジェクト,
* @param {boolean} isWebgl ブラウザがwebglを使用できるか判断するフラグ,
* @param {boolean} isMobile モバイル端末かどうか判断するフラグ,
* @param {HTMLElement} container キャンバス要素を格納するコンテナ,
*/
class RendererManager {
  public renderer: any;
  public renderer2: THREE.CanvasRenderer;
  public center: THREE.Vector2 = new THREE.Vector2(0, 0);

  private _renderType: RenderType;
  private _scene: THREE.Scene;
  private _camera: THREE.Camera;
  private _isMobile: boolean;
  private _container: HTMLElement;
  private _effect: THREE.OculusRiftEffect;
  private _width: number;
  private _height: number;
  private _scrollInterval: any;

  /**
  * 主にレンダリングに使用するレンダラーオブジェクト
  * @public
  * @property renderer
  * @type THREE.WebGLRenderer | THREE.CanvasRenderer | THREE.CSS3DStereoRenderer;THREE.WebGLRenderer | THREE.CanvasRenderer
  */
  /**
  * CanvasRenderer時に右側レンダリングに使用するレンダラーオブジェクト
  * @public
  * @property renderer2
  * @type THREE.CanvasRenderer
  */
  /**
  * カメラ視点の中心位置
  * @public
  * @property center
  * @type THREE.Vector2
  * @default (0,0)
  */
  
  /**
  * ブラウザがwebGLを使用できるか判断するフラグ
  * @private
  * @property _isWebgl
  * @type boolean
  */
  /**
  * レンダリングに使用するシーンオブジェクト
  * @private
  * @property _scene
  * @type THREE.Scene
  */
  /**
  * レンダリングに使用するカメラオブジェクト
  * @private
  * @property _camera
  * @type THREE.Camera
  */
  /**
  * モバイル判定フラグ
  * @private
  * @property _isMobile
  * @type boolean
  */
  /**
  * キャンバス要素格納コンテナ
  * @private
  * @property _container
  * @type HTMLElement
  */
  /**
  * レンダラー用ポストエフェクト
  * @private
  * @property _effect
  * @type THREE.OculusRiftEffect
  */
  /**
  * 画面の横幅
  * @private
  * @property _width
  * @type number
  */
  /**
  * 画面の縦幅
  * @private
  * @property _height
  * @type number
  */
  /**
  * スクロール防止用インターバル格納変数
  * @private
  * @property _scrollInterval
  * @type Object
  */
  /**
  * webGLを使用しない場合の代替レンダラー
  * @private
  * @property _altRenderer
  * @type string
  */
  /**
  * デバイス別HMDプリセット設定
  * @private
  * @property _devicePreset
  * @type Object
  */

  /**
  * 画面サイズが変わったときにレンダラーのサイズを変更する
  * @private
  * @method _onWindowResize
  */
  private _onWindowResize(): void {
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    if (this._renderType == RenderType.WEBGL) {
      this._effect.setHMD(this._selectDevicePreset(this._width, this._height));
      this._effect.setSize(this._width, this._height);
      let distScale = this._effect.getDistScale();
      let deltaMargin = (this._width * distScale) / 4 / 4;
      this.center.x = this._width / 4 + deltaMargin;
      this.center.y = this._height / 2;
    } else if (this._renderType == RenderType.CANVAS) {
      this._width /= 2;
      this.renderer.setSize(this._width, this._height);
      this.renderer2.setSize(this._width, this._height);
      this.center.x = this._width / 2;
      this.center.y = this._height / 2;
    } else {
      this.renderer.setSize(this._width, this._height);
      this.center.x = this._width / 4;
      this.center.y = this._height / 2;
    }
  }

  /**
  * デバイス判定およびHMDプリセットの選択
  * @private
  * @method _selectDevicePreset
  * @return {Object}
  */
  private _selectDevicePreset(width: number, height: number): any {
    let device = {
      hScreenSize: 0.14976,
      vScreenSize: 0.0936,
      interpupillaryDistance: 0.064,
      lensSeparationDistance: 0.064,

      hResolution: width,
      vResolution: height,
      eyeToScreenDistance: 0.041,
      distortionK: [1.0, 0.22, 0.24, 0.0],
      chromaAbParameter: [0.996, -0.004, 1.014, 0.0]
    };

    return device;
  }

  /**
  * レンダラーの作成メソッド
  * @private
  * @method _createRenderer
  */
  private _createRenderer(): void {
    if (this._renderType == RenderType.WEBGL) {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.autoClear = false;
      this.renderer.setClearColor(0x000000);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.domElement.id = "webglRenderer";
      this._container.appendChild(this.renderer.domElement);
      this._effect = new THREE.OculusRiftEffect(this.renderer, {
        worldScale: 100
      });
    } else if (this._renderType == RenderType.CANVAS) {
      this.renderer = new THREE.CanvasRenderer();
      this.renderer.setClearColor(0x000000);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.domElement.id = "canvasLeftRenderer";
      this._container.appendChild(this.renderer.domElement);

      this.renderer2 = new THREE.CanvasRenderer();
      this.renderer2.setClearColor(0x000000);
      this.renderer2.setPixelRatio(window.devicePixelRatio);
      this.renderer2.domElement.id = "canvasRightRenderer";
      this._container.appendChild(this.renderer2.domElement);
    } else {
      this.renderer = new THREE.CSS3DStereoRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.id = "css3dRenderer";
      this.renderer.domElement.style.position = 'absolute';
      this._container.appendChild(this.renderer.domElement);
    }
  }

  /**
  * レンダラー更新メソッド
  * @public
  * @method update
  */
  public update(): void {
    if (this._renderType == RenderType.WEBGL) {
      this._effect.render(this._scene, this._camera);
    } else if (this._renderType == RenderType.CANVAS) {
      this.renderer.setViewport(0, 0, this._width, this._height);
      this.renderer.render(this._scene, this._camera);
      this.renderer2.setViewport(0, 0, this._width, this._height);
      this.renderer2.render(this._scene, this._camera);
    } else {
      this.renderer.render(this._scene, this._camera);
    }
  }


  /**
  * モバイル端末のスクロール機能抑制メソッド
  * @private
  * @method _disableMobileScroll
  */
  private _disableMobileScroll(): void {
    this._scrollInterval = setInterval(() => {
      window.scrollTo(0, 0);
    }, 50);

    // document.addEventListener('touchmove', (event) => {
    //   event.preventDefault();
    // }, false);
    // document.addEventListener('drag', (event) => {
    //   event.preventDefault();
    // }, false);
  }


  constructor(scene: THREE.Scene, camera: THREE.Camera, renderType: RenderType, isMobile: boolean, container: HTMLElement) {
    this._renderType = renderType;
    this._scene = scene;
    this._camera = camera;
    this._isMobile = isMobile;
    this._container = container;

    this._createRenderer();
    this._onWindowResize();
    window.addEventListener("resize", this._onWindowResize.bind(this), false);
    
    window.addEventListener("touchend", ()=>{window.scrollTo(0, 0);}, false);
    // if(this._isMobile){
    //   this._disableMobileScroll();
    // }
  }
}
