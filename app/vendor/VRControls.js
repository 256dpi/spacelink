/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 */

THREE.VRControls = function ( object, onError ) {

	var scope = this;

	var vrInputs = [];

	function filterInvalidDevices( devices ) {

		// Exclude Cardboard position sensor if Oculus exists.

		var oculusDevices = devices.filter( function ( device ) {

			return device.deviceName.toLowerCase().indexOf( 'oculus' ) !== - 1;

		} );

		if ( oculusDevices.length >= 1 ) {

			return devices.filter( function ( device ) {

				return device.deviceName.toLowerCase().indexOf( 'cardboard' ) === - 1;

			} );

		} else {

			return devices;

		}

	}

	function gotVRDevices( devices ) {

		devices = filterInvalidDevices( devices );

		for ( var i = 0; i < devices.length; i ++ ) {

			if ( devices[ i ] instanceof PositionSensorVRDevice ) {

				vrInputs.push( devices[ i ] );

			}

		}

		if ( onError ) onError( 'HMD not available' );

	}

	if ( navigator.getVRDevices ) {

		navigator.getVRDevices().then( gotVRDevices );

	}

	// the Rift SDK returns the position in meters
	// this scale factor allows the user to define how meters
	// are converted to scene units.

	this.scale = 1;

	this.update = function () {
		// BEGIN HACK
		var changed_position = false;
		// END HACK
		for ( var i = 0; i < vrInputs.length; i ++ ) {

			var vrInput = vrInputs[ i ];

			var state = vrInput.getState();

			if ( state.orientation !== null ) {

				object.quaternion.copy( state.orientation );

			}

			if ( state.position !== null ) {
				// BEGIN HACK
				changed_position = true;
				// END HACK
				object.position.copy( state.position ).multiplyScalar( scope.scale );

			}

		}

		// BEGIN HACK
		return changed_position;
		// END HACK
	};

	this.resetSensor = function () {

		for ( var i = 0; i < vrInputs.length; i ++ ) {

			var vrInput = vrInputs[ i ];

			if ( vrInput.resetSensor !== undefined ) {

				vrInput.resetSensor();

			} else if ( vrInput.zeroSensor !== undefined ) {

				vrInput.zeroSensor();

			}

		}

	};

	this.zeroSensor = function () {

		console.warn( 'THREE.VRControls: .zeroSensor() is now .resetSensor().' );
		this.resetSensor();

	};

	this.dispose = function () {

		vrInputs = [];

	};

};
