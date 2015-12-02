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

class LinkMenuManager {
  private _duration: number = 500;
  private _resources: string;
  private _scene: THREE.Scene;
  private _useTween: boolean = true;
  private _linkMenuGroup: THREE.Object3D;
  private _cameraManager: CameraManager;

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
  public create(spot: Spot): void {
    if (spot.links && spot.links.length > 0) {
      if(this._linkMenuGroup) {
        this._cameraManager.clearTargets();
        this._scene.remove(this._linkMenuGroup);
      }
      
      this._linkMenuGroup = new THREE.Object3D();
      this._scene.add(this._linkMenuGroup);

      new THREE.TextureLoader().load(this._resources + '/moveButtonOff.png', (texture: THREE.Texture) => {
        let mat = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.FrontSide,
          transparent: true,
        });


        spot.links.forEach((element) => {
          let pivot = this._createLinkPivot(new THREE.Vector3(0, -element.direction, 0));
          this._linkMenuGroup.add(pivot);

          let geo = new THREE.PlaneBufferGeometry(50, 50, 1, 1);
          let mesh = new LinkMesh(geo, mat, element.to);
          mesh.position.set(0, 0, -200);
          mesh.name = 'linkMenu';

          pivot.add(mesh);
          this._cameraManager.setTarget(mesh);
        });
        this._tween(0, 1);
      });

    }
  }

  /**
  * リンクオブジェクト破壊メソッド
  * @public
  * @method destroy
  * @param {function} [callback] 破壊後実行されるコールバック関数
  */
  public destroy(): void {
    if (this._linkMenuGroup && this._linkMenuGroup.children.length > 0) {
      this._cameraManager.clearTargets();
      this._scene.remove(this._linkMenuGroup);
      this._linkMenuGroup = null;
    }
  }

  /**
  * リンクメッシュ作成メソッド
  * @method _createLinkMesh
  * @private
  * @param {number} no 移動先スポットID
  */
  private _createLinkMesh(pivot: THREE.Object3D, no: number): any {
    new THREE.TextureLoader().load(this._resources + '/moveButtonOff.png', (texture: THREE.Texture) => {
      let mat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.FrontSide,
        transparent: true,
      });
      let geo = new THREE.PlaneBufferGeometry(500, 500, 1, 1);
      let mesh = new LinkMesh(geo, mat, no);
      mesh.position.set(0, 0, -200);
      mesh.name = 'linkMenu';
console.log(mesh);
      pivot.add(mesh);
      this._cameraManager.setTarget(mesh);
    });
  }

  /**
  * リンク回転用ピボット作成メソッド
  * @method _createLinkPivot
  * @private
  * @param {THREE.Vector3} rot 回転角
  * @return {THREE.Object3D}
  */
  private _createLinkPivot(rot: THREE.Vector3): THREE.Object3D {
    let obj = new THREE.Object3D();
    obj.position.set(0, 0, 0);
    obj.rotation.set(THREE.Math.degToRad(rot.x), THREE.Math.degToRad(rot.y), THREE.Math.degToRad(rot.z), "XYZ");
    obj.name = "pivot";

    return obj;
  }

  /**
  * トゥイーンメソッド
  * @method _tween
  * @private
  * @param {number} start 開始透明度
  * @param {number} end 終了透明度
  * @param {function} [callback] 終了後実行されるコールバック関数
  */
  private _tween(start: number, end: number, callback?: () => any): void {
    let self = this;
    this._linkMenuGroup.children.forEach((item) => {
      let child = <THREE.Mesh>item.children[0];
      child.material.transparent = true;
    });

    if (this._useTween) {
      let tween = new TWEEN.Tween({
        opacity: start,
      })
        .to({
          opacity: end,
        }, self._duration)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
          self._linkMenuGroup.children.forEach((item) => {
            let child = <LinkMesh>item.children[0];
            child.material.opacity = this.opacity;
          });
        })
        .onComplete(function() {
          if (callback) {
            setTimeout(callback, 1);
          }
        })
        .start();
    } else {
      console.log('non branch');
      this._linkMenuGroup.children.forEach(function(item) {
        let child = <LinkMesh>item.children[0];
        child.material.opacity = end;
      });
      if (callback) {
        setTimeout(callback, 1);
      }
    }
  }

  constructor(scene: THREE.Scene, resources: string, cameraManager: CameraManager, useTween: boolean) {
    this._scene = scene;
    this._resources = resources;
    this._cameraManager = cameraManager;
    this._useTween = useTween;
  }
}
