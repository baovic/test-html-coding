/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function (object) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder("YXZ");
	this.isOrientationEventEnabled = false;

	this.enabled = true;
	this.isFirefox;

	this.deviceOrientation = {};
	this.screenOrientation = 0;
	this.deviceMotion = {};
	this.useOrientation = false;

	var onDeviceOrientationChangeEvent = function (event) {
		if (!scope.useOrientation) {
			scope.useOrientation = true;
		}

		scope.deviceOrientation.alpha = event.alpha +90;
		scope.deviceOrientation.beta = event.beta;
		scope.deviceOrientation.gamma = event.gamma;
	};

	var onDeviceMotionChangeEvent = function (event) {
		scope.deviceMotion = event;

		if (!scope.useOrientation) {
			if (scope.isFirefox) {
				scope.deviceOrientation.alpha = (scope.deviceOrientation.alpha + event.rotationRate.alpha / 20) % 360;

				var newRate = -event.rotationRate.beta / 20;
				var nextGamma = scope.deviceOrientation.gamma + newRate;

				if (nextGamma > 180) {
					scope.deviceOrientation.gamma = -360 + nextGamma;
				} else if (nextGamma < -180) {
					scope.deviceOrientation.gamma = 360 - nextGamma;
				} else {
					scope.deviceOrientation.gamma = nextGamma;
				}
			} else {
				scope.deviceOrientation.alpha = (scope.deviceOrientation.alpha + event.rotationRate.alpha * 20) % 360;

				var nextGamma = scope.deviceOrientation.gamma + event.rotationRate.beta * 2;
				if (nextGamma > 180) {
					scope.deviceOrientation.gamma = -360 + nextGamma;
				} else if (nextGamma < -180) {
					scope.deviceOrientation.gamma = 360 - nextGamma;
				} else {
					scope.deviceOrientation.gamma = nextGamma;
				}
			}
		}
	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new THREE.Vector3(0, 0, 1);

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

		return function (quaternion, alpha, beta, gamma, orient) {

			if (scope.isFirefox) {
				euler.set(gamma, alpha, - beta, 'YXZ');                       // 'ZXY' for the device, but 'YXZ' for us
			} else {
				euler.set(beta, alpha, - gamma, 'YXZ');                       // 'ZXY' for the device, but 'YXZ' for us
			}

			quaternion.setFromEuler(euler);                               // orient the device

			quaternion.multiply(q1);                                      // camera looks out the back of the device, not the top

			quaternion.multiply(q0.setFromAxisAngle(zee, - orient));    // adjust for screen orientation

		}

	} ();

	this.connect = function () {

		scope.isFirefox = /FireFox/i.test(navigator.userAgent);

		onScreenOrientationChangeEvent(); // run once on load
		window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);

		if (!scope.isFirefox) {
			this.deviceOrientation = { alpha: -90, beta: 180, gamma: 90 };
			window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
		} else {
			this.deviceOrientation = { alpha: 0, beta: 0, gamma: 90 };
		}

		window.addEventListener("devicemotion", onDeviceMotionChangeEvent, false);

		scope.enabled = true;

	};

	this.disconnect = function () {

		window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
		if (!scope.isFirefox) {
			window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
		}
		window.removeEventListener("devicemotion", onDeviceMotionChangeEvent, false);

		scope.enabled = false;

	};

	this.update = function () {
		if (scope.enabled === false) return;

		var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad(scope.deviceOrientation.alpha) : 0; // Z
		var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad(scope.deviceOrientation.beta) : 0; // X'
		var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad(scope.deviceOrientation.gamma) : 0; // Y''
		var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0; // O

		setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient);
	};

	this.connect();

};
