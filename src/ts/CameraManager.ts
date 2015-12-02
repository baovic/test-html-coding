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
class CameraManager {
  public camera: THREE.PerspectiveCamera;

  private _scene: THREE.Scene;
  private _fov: number = 45;
  private _near: number = 1;
  private _far: number = 1000;
  private _renderType: RenderType;
  private _isMobile: boolean;
  private _duration = 3000;
  private _clearDuration = 50;
  private _scaleSpeed = 0.01;

  private _raycaster: THREE.Raycaster;
  private _aspect: number = 1;
  private _longLookTime: number = 0;
  private _previousUpdate: number = 0;
  private _targets: Array<THREE.Object3D>;
  private _parent: StreetView;
  private _useTween: boolean = true;
  private _pointer: THREE.Mesh;
  private _resources: string;
  private _usePointer: boolean;
  
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
  private _onWindowResize(): void {
    this._aspect = this._calcurateAspect(window.innerWidth, window.innerHeight);
    this.camera.aspect = this._aspect;
    this.camera.updateProjectionMatrix();
  }

  /**
  * アスペクト比の計算用メソッド
  * @private
  * @method _calcurateAspect
  * @param {number} width 横幅の数字
  * @param {number} height 縦幅の数字
  * @return {number}
  */
  private _calcurateAspect(width: number, height: number): number {
    return (width / 2 / height);
  }
  
  /**
  * カメラ更新用メソッド
  * @public 
  * @method update
  * @param {number} timestamp 描画タイムスタンプ
  */
  public update(timestamp: number) {
    if (this._pointer) {
      let vector = new THREE.Vector3(0, 0, -1);
      vector.applyQuaternion(this.camera.quaternion).normalize().setLength(20);
      this._pointer.position.set(vector.x, vector.y, vector.z);
      this._pointer.lookAt(this.camera.position);
    }

    if (this._targets.length > 0) {
      let intersect: LinkMesh = this._getIntersection();
      if (intersect) {
        this._zoomInObject.bind(this)(intersect, timestamp);
      } else {
        this._zoomOutObject();
      }
    }

    this._previousUpdate = timestamp;
  }

  /**
  * 視点衝突検出用メソッド
  * @private
  * @method _getIntersection
  * @return {LinkMesh} 衝突したオブジェクトがあれば返す。なければnullを返す。
  */
  private _getIntersection(): LinkMesh {
    let vector = new THREE.Vector3(0, 0, -1);
    vector.applyQuaternion(this.camera.quaternion).normalize();
    this._raycaster.set(this.camera.position, vector);
    let intersections = this._raycaster.intersectObjects(this._targets, true);

    if (intersections.length > 0) {
      return <LinkMesh>intersections[0].object;
    } else {
      return null;
    }
  }

  /**
  * ボタン拡大メソッド
  * @private
  * @method _zoomInObject
  * @param {LinkMesh} object 対象オブジェクト
  * @param {number} timestamp 描画時タイムスタンプ
  */
  private _zoomInObject(object: LinkMesh, timestamp: number): void {
    this._longLookTime += (timestamp - this._previousUpdate);
    let longLookScale = new THREE.Vector3(1, 1, 1).multiplyScalar(this._scaleSpeed);
    object.scale.add(longLookScale);

    if (this._longLookTime >= this._duration) {
      this._longLookTime = 0;
      this.clearTargets();
      this._interact(object);
    }
  }

  /**
  * ボタンインタラクトメソッド
  * @private
  * @method _interact
  * @param {LinkMesh} object 対象オブジェクト
  */
  private _interact(object: LinkMesh): void {
    if (object.name == 'linkMenu') {
      this._longLookTime = 0;
      this._parent.moveSpot(object.spotdata);
    }
  }

  /**
  * 拡大解除用メソッド
  * @private
  * @method _zoomOutObject
  * @param {number} timestamp 描画時タイムスタンプ
  */
  private _zoomOutObject(): void {
    this._longLookTime = 0;
    this._targets.forEach((item) => {
      if (Math.floor(item.scale.x * 10) / 10 > 1) {
        this._tween(item, item.scale.x, 1, this._clearDuration);
      }
    });

  }


  /**
    * トゥイーンメソッド
    * @private
    * @method _tween
    * @param {THREE.Object3D} obj 対象オブジェクト
    * @param {number} start 開始変数
    * @param {number} end 終了変数
    * @param {number} duration 遷移時間
    */
  private _tween(obj: THREE.Object3D, start: number, end: number, duration: number): void {
    if (this._useTween) {
      let tween = new TWEEN.Tween({
        scale: start,
      })
        .to({
          scale: end,
        }, duration)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
          obj.scale.set(this.scale, this.scale, this.scale);
        })
        .start();
    } else {
      obj.scale.set(end, end, end);
    }
  }


  /**
  * ターゲットセット用メソッド
  * @public
  * @method setTarget
  * @param {THREE.Object3D} obj 対象オブジェクト
  */
  public setTarget(obj: THREE.Object3D): void {
    this._targets.push(obj);
  }

  public setPointerVisible(visible: boolean): void {
    if (this._pointer) {
      this._pointer.visible = visible;
    }
  }

  /**
  * ターゲットクリア用メソッド
  * @public
  * @method clearTargets    
  */
  public clearTargets(): void {
    this._targets = [];
    this._longLookTime = 0;
  }

  constructor(scene: THREE.Scene, renderType: RenderType, isMobile: boolean, useTween: boolean, parent: StreetView, resources: string, usePointer: boolean) {
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
      new THREE.TextureLoader().load(this._resources + '/gazeCursor.png', (texture) => {
        let mat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });

        let geo = new THREE.PlaneBufferGeometry(1.5, 1.5, 1, 1);
        this._pointer = new THREE.Mesh(geo, mat);
        this._pointer.position.set(0, 0, -30);
        this._pointer.name = "pointer";
        this._pointer.visible = false;

        this._scene.add(this._pointer);
      });
    }
  }
}
