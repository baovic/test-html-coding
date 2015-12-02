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
class SphereManager {
  private _duration: number = 500;
  private _lastUpdate: number = 0;
  public _sphere: any;

  private _scene;
  private _renderType: RenderType;
  private _resources;
  private _useTween;
  private _logo;
  private _useMask;
  private _materials = []; 

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
  public change(spot: Spot, callback?: () => any): void {

    if (TWEEN.getAll().length < 1) {
      if (!this._sphere) {
        this._show(spot, callback);
      } else {
        this._hide(() => {
          this._show(spot, callback);
        });
      }
    }
  }

  /**
  * 球体を表示するメソッド
  * @private
  * @method _show
  * @param {Spot} spot 新しい変更先スポットデータ
  * @param {function} [callback] 変更後に呼び出されるコールバック関数
  */
  private _show(spot: Spot, callback?: () => any): void {
    if (this._sphere) return;

    if (this._renderType == RenderType.CSS3D) {
      this._createCss3dCubemap(spot, callback);

    } else if (this._renderType == RenderType.CANVAS) {
      if (spot.useCubemap) {
        this._createCanvasCubemap(spot, callback);
      } else {
        this._createCanvasEquirectanglar(spot, callback);
      }

    } else if (this._renderType == RenderType.WEBGL) {
      if (spot.useCubemap) {
        this._createWebglCubemap(spot, callback);
      } else {
        this._createWebglEquirectanglar(spot, callback);
      }

    }
  }

  private _createCss3dCubemap(spot, callback) {
    let imgSize = 512;
    let sidesPos = [
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
        rotation: [- Math.PI / 2, 0, Math.PI]
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
    let sidesUrl = [
      spot.alt + '/posx.jpg',
      spot.alt + '/negx.jpg',
      spot.alt + '/posy.jpg',
      spot.alt + '/negy.jpg',
      spot.alt + '/posz.jpg',
      spot.alt + '/negz.jpg'
    ];

    if (this._materials[spot.no]) {
      this._createCss3dBoxMesh(this._materials[spot.no], callback, spot.rotation);
    } else {
      let box = new THREE.Object3D();
      new THREE.CubeTextureLoader().load(sidesUrl, (texture) => {
        texture.format = THREE.RGBFormat;
        for (let i = 0; i < 6; i++) {
          let element = texture.image[i];
          element.width = imgSize * 2 + 2;
          element.style.opacity = '0';

          let object = new THREE.CSS3DObject(element);
          object.position.fromArray(sidesPos[i].position);
          object.rotation.fromArray(sidesPos[i].rotation);
          box.add(object);
        }

        this._materials[spot.no] = box;
        this._createCss3dBoxMesh(this._materials[spot.no], callback, spot.rotation);
      });
    }
  }

  private _createCss3dBoxMesh(material, callback, rotation) {
    this._sphere = material;
        this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y), THREE.Math.degToRad(rotation.x), "XYZ");
    this._scene.add(this._sphere);

    this._tween({
      start: 0,
      end: 1,
      duration: this._duration,
      onUpdate: (tn) => {
        this._sphere.children.forEach((item: THREE.CSS3DObject) => {
          item.elementL.style.opacity = tn.opacity;
          item.elementR.style.opacity = tn.opacity;
        });
      },
      onComplete: (tn) => {
        this._sphere.children.forEach((item: THREE.CSS3DObject) => {
          item.elementL.style.opacity = '1';
          item.elementR.style.opacity = '1';
        });
      },
      callback: callback
    });
  }

  private _createCanvasCubemap(spot, callback) {
    let sides = [
      spot.alt + '/negx.jpg',
      spot.alt + '/posx.jpg',
      spot.alt + '/posy.jpg',
      spot.alt + '/negy.jpg',
      spot.alt + '/posz.jpg',
      spot.alt + '/negz.jpg'
    ];

    if (this._materials[spot.no]) {
      this._createCanvasBoxMesh(this._materials[spot.no], callback, spot.rotation);
    } else {
      new THREE.CubeTextureLoader().load(sides, (texture) => {
        texture.format = THREE.RGBFormat;

        let matArray = [];
        for (let i = 0; i < 6; i++) {
          let tex = new THREE.Texture(texture.image[i]);
          tex.repeat.set(-1, 1);
          tex.offset.set(1, 0);
          tex.needsUpdate = true;
          let tmpmat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            map: tex,
            side: THREE.BackSide,
            overdraw: 1
          });
          matArray.push(tmpmat);
        }
        let facemat = new THREE.MeshFaceMaterial(matArray);
        this._materials[spot.no] = facemat;

        this._createCanvasBoxMesh(this._materials[spot.no], callback, spot.rotation);
      });
    }


  }

  private _createCanvasBoxMesh(material, callback, rotation) {
    let geo = new THREE.BoxGeometry(500, 500, 500, 16, 16, 16);
    this._sphere = new THREE.Mesh(geo, material);
            this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y), THREE.Math.degToRad(rotation.x), "XYZ");

    this._sphere.name = "sphere";
    this._scene.add(this._sphere);

    this._tween({
      start: 0,
      end: 1,
      duration: this._duration,
      onUpdate: (tn) => {
        for (let i = 0; i < 6; i++) {
          this._sphere.material.materials[i].opacity = tn.opacity;
        }
      },
      onComplete: (tn) => {
        for (let i = 0; i < 6; i++) {
          this._sphere.material.materials[i].opacity = 1;
          this._sphere.material.materials[i].transparent = false;
        }
      },
      callback: callback
    });
  }

  private _createCanvasEquirectanglar(spot, callback) {
    let url = spot.alt;

    if (this._materials[spot.no]) {
      this._createCanvasSphereMesh(this._materials[spot.no], callback, spot.rotation);
    } else {
      new THREE.TextureLoader().load(url, (texture) => {
        texture.repeat.set(-1, 1);
        texture.offset.set(1, 0);
        let material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: texture,
          transparent: true,
          opacity: 0,
          side: THREE.BackSide,
          overdraw: 1,
        });

        this._materials[spot.no] = material;
        this._createCanvasSphereMesh(this._materials[spot.no], callback, spot.rotation);
      });
    }
  }

  private _createCanvasSphereMesh(material, callback, rotation) {
    let geo = new THREE.SphereGeometry(500, 64, 32);
    this._sphere = new THREE.Mesh(geo, material);
    this._sphere.name = "sphere";
                this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y - 90), THREE.Math.degToRad(rotation.x), "ZYX");
    this._scene.add(this._sphere);
    this._tween({
      start: 0,
      end: 1,
      duration: this._duration,
      onUpdate: (tn) => {
        this._sphere.material.opacity = tn.opacity;
      },
      onComplete: (tn) => {
        this._sphere.material.opacity = 1;
        this._sphere.material.transparent = false;
      },
      callback: callback
    });
  }

  private _createWebglCubemap(spot, callback) {
    let sides = [
      spot.file + '/negx.jpg',
      spot.file + '/posx.jpg',
      spot.file + '/posy.jpg',
      spot.file + '/negy.jpg',
      spot.file + '/posz.jpg',
      spot.file + '/negz.jpg'
    ];

    if (this._materials[spot.no]) {
      this._createWebglBoxMesh(this._materials[spot.no], callback, spot.rotation);
    } else {
      new THREE.CubeTextureLoader().load(sides, (texture) => {
        let matArray = [];
        for (let i = 0; i < 6; i++) {
          let tex = new THREE.Texture(texture.image[i]);
          tex.repeat.set(-1, 1);
          tex.offset.set(1, 0);
          tex.needsUpdate = true;
          let tmpmat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: tex,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
          });
          matArray.push(tmpmat);
        }
        let facemat = new THREE.MeshFaceMaterial(matArray);
        this._materials[spot.no] = facemat;
        this._createWebglBoxMesh(this._materials[spot.no], callback, spot.rotation);
      });
    }
  }

  private _createWebglBoxMesh(material, callback, rotation) {
    let geo = new THREE.BoxGeometry(500, 500, 500, 1, 1, 1);
    this._sphere = new THREE.Mesh(geo, material);
    this._sphere.name = "sphere";
    this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y), THREE.Math.degToRad(rotation.x), "XYZ");
    this._scene.add(this._sphere);

    for (let i = 0; i < 6; i++) {
      this._sphere.material.materials[i].transparent = true;
    }
    this._tween({
      start: 0,
      end: 1,
      duration: this._duration,
      onUpdate: (tn) => {
        for (let i = 0; i < 6; i++) {
          this._sphere.material.materials[i].opacity = tn.opacity;
        }
      },
      onComplete: (tn) => {
        for (let i = 0; i < 6; i++) {
          this._sphere.material.materials[i].opacity = 1;
          this._sphere.material.materials[i].transparent = false;
        }
      },
      callback: callback
    });
  }

  private _createWebglEquirectanglar(spot, callback) {
    let url = spot.file;

    if (this._materials[spot.no]) {
      this._createWebglSphereMesh(this._materials[spot.no], callback, spot.rotation);
    } else {
      new THREE.TextureLoader().load(url, (texture) => {
        texture.repeat.set(-1, 1);
        texture.offset.set(1, 0);
        let material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: texture,
          transparent: true,
          opacity: 0,
          side: THREE.BackSide,
        });
        this._materials[spot.no] = material;
        this._createWebglSphereMesh(this._materials[spot.no], callback, spot.rotation);
      });
    }
  }

  private _createWebglSphereMesh(material, callback, rotation) {
    let geo = new THREE.SphereGeometry(500, 64, 32);
    this._sphere = new THREE.Mesh(geo, material);
    this._sphere.name = "sphere";
                this._sphere.rotation.set(THREE.Math.degToRad(rotation.z), THREE.Math.degToRad(rotation.y - 90), THREE.Math.degToRad(rotation.x), "ZYX");
    this._scene.add(this._sphere);
    this._tween({
      start: 0,
      end: 1,
      duration: this._duration,
      onUpdate: (tn) => {
        this._sphere.material.opacity = tn.opacity;
      },
      onComplete: (tn) => {
        this._sphere.material.opacity = 1;
        this._sphere.material.transparent = false;
      },
      callback: callback
    });
  }

  /**
  * 球体を非表示にするメソッド
  * @private
  * @method _hide
  * @param {function} [callback] 変更後に呼び出されるコールバック関数
  */
  private _hide(callback?: () => any): void {
    if (!this._sphere) return;

    if (this._renderType == RenderType.CSS3D) {
      this._tween({
        start: 1,
        end: 0,
        duration: this._duration / 2,
        onUpdate: (tn) => {
          this._sphere.children.forEach((item: THREE.CSS3DObject) => {
            item.elementL.style.opacity = tn.opacity;
            item.elementR.style.opacity = tn.opacity;
          });
        },
        onComplete: (tn) => {
          this._sphere.children.forEach((item: THREE.CSS3DObject) => {
            item.dispatchEvent({ type: 'removed', target: item });
          });
          this._scene.remove(this._sphere);
          this._sphere = null;
        },
        callback: callback
      });

    } else if (this._renderType == RenderType.CANVAS) {
      if (this._sphere.material instanceof THREE.MultiMaterial) {
        for (let i = 0; i < 6; i++) {
          this._sphere.material.materials[i].transparent = true;
        }

        this._tween({
          start: 1,
          end: 0,
          duration: this._duration / 2,
          onUpdate: (tn) => {
            for (let i = 0; i < 6; i++) {
              this._sphere.material.materials[i].opacity = tn.opacity;
            }
          },
          onComplete: (tn) => {
            for (let i = 0; i < 6; i++) {
              this._sphere.material.materials[i].opacity = 0;
            }
            this._scene.remove(this._sphere);
            this._sphere = null;
          },
          callback: callback
        });

      } else {
        this._sphere.material.transparent = true;

        this._tween({
          start: 1,
          end: 0,
          duration: this._duration / 2,
          onUpdate: (tn) => {
            this._sphere.material.opacity = tn.opacity;
          },
          onComplete: (tn) => {
            this._sphere.material.opacity = 0;
            this._scene.remove(this._sphere);
            this._sphere = null;
          },
          callback: callback
        });

      }
    } else if (this._renderType == RenderType.WEBGL) {
      if (this._sphere.material instanceof THREE.MultiMaterial) {
        for (let i = 0; i < 6; i++) {
          this._sphere.material.materials[i].transparent = true;
        }

        this._tween({
          start: 1,
          end: 0,
          duration: this._duration / 2,
          onUpdate: (tn) => {
            for (let i = 0; i < 6; i++) {
              this._sphere.material.materials[i].opacity = tn.opacity;
            }
          },
          onComplete: (tn) => {
            for (let i = 0; i < 6; i++) {
              this._sphere.material.materials[i].opacity = 0;
            }
            this._scene.remove(this._sphere);
            this._sphere = null;
          },
          callback: callback
        });

      } else {
        this._sphere.material.transparent = true;
        this._tween({
          start: 1,
          end: 0,
          duration: this._duration / 2,
          onUpdate: (tn) => {
            this._sphere.material.opacity = tn.opacity;
          },
          onComplete: (tn) => {
            this._sphere.material.opacity = 0;
            this._scene.remove(this._sphere);
            this._sphere = null;
          },
          callback: callback
        });

      }
    }
  }
  
  /**
  * トゥイーンメソッド
  * @private
  * @method _tween
  * @param {number} start 開始透明度
  * @param {number} end 終了透明度
  * @param {function} [callback] 変更後に呼び出されるコールバック関数
  */
  private _tween(option): void {
    // start: number, end: number, duration, update, complete?, callback?: () => any
    let _opt = {
      start: 0,
      end: 1,
      duration: this._duration,
      onUpdate: (tn) => { },
      onComplete: undefined,
      callback: undefined
    }

    if (option) {
      for (var prop in option) {
        if (option.hasOwnProperty(prop)) {
          _opt[prop] = option[prop];
        }
      }
    }

    if (this._useTween) {
      let tween = new TWEEN.Tween({
        opacity: _opt.start,
      })
        .to({
          opacity: _opt.end,
        }, _opt.duration)
        .onUpdate(function() {
          _opt.onUpdate(this);
        })
        .onComplete(function() {
          if (_opt.onComplete) _opt.onComplete(this);
          if (_opt.callback) {
            setTimeout(_opt.callback, 1);
          }
        })
        .start();
    } else {
      if (_opt.onComplete) _opt.onComplete(this);
      if (_opt.callback) {
        setTimeout(_opt.callback, 1);
      }
    }
  }

  constructor(scene: THREE.Scene, renderType: RenderType, resources: string, useTween: boolean, useMask: boolean) {
    this._scene = scene;
    this._renderType = renderType;
    this._resources = resources;
    this._useTween = useTween;
    this._useMask = useMask;

    if (this._useMask && this._renderType != RenderType.CSS3D) {
      new THREE.TextureLoader().load(this._resources + '/logo.png', (texture) => {
        let mat2 = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff,
          transparent: false,
          side: THREE.FrontSide
        });

        if (this._renderType == RenderType.CANVAS) {
          mat2.overdraw = 1;
        }

        let geo2 = new THREE.CircleGeometry(55, 64);
        this._logo = new THREE.Mesh(geo2, mat2);
        this._logo.position.set(0, -60, 0);
        this._logo.rotation.x = THREE.Math.degToRad(-90);
        this._logo.name = "logo";
        this._scene.add(this._logo);
      });
    }
  }
}
