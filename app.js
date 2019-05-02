var camera, scene, renderer, controls;
var points;

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 40;
	camera.position.y = 20;
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls( camera );
	controls.update();
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}

var geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var cube = new THREE.Mesh( geometry, material );

const createPoints = (matrix, X=5,Y=5,Z=5,W=5)=>{
	// returns an array full of meshes of points that correspond to a specific matrix
	var geometry = new THREE.BoxBufferGeometry( 0.25, 0.25, 0.25 );
	var obj = new THREE.Group();
	for (var x=0; x<X; x++) {
		for (var y=0; y<Y; y++) {
			for (var z=0; z<Z; z++) {
				for (var w=0; w<W; w++) {
					// define vector
						let v = math.multiply(matrix, [x,y,z,w])._data;
					// define color
						var material = new THREE.MeshBasicMaterial( { color: new THREE.Color("hsl("+math.abs(v[3]*20)%100+", 100%, 50%)") } );
					// create object
						var cube = new THREE.Mesh( geometry, material );
					// define position
						cube.position.x = v[0];
						cube.position.y = v[1];
						cube.position.z = v[2];
					// add object
						obj.add( cube );
				}
			}
		}
	}
	return obj;
}

const getMatrix = ()=> {
	let m11 = math.eval(document.getElementById("m11").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m12 = math.eval(document.getElementById("m12").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m13 = math.eval(document.getElementById("m13").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m14 = math.eval(document.getElementById("m14").value, {"t":parseFloat(document.getElementById("tVal").value)});

	let m21 = math.eval(document.getElementById("m21").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m22 = math.eval(document.getElementById("m22").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m23 = math.eval(document.getElementById("m23").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m24 = math.eval(document.getElementById("m24").value, {"t":parseFloat(document.getElementById("tVal").value)});

	let m31 = math.eval(document.getElementById("m31").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m32 = math.eval(document.getElementById("m32").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m33 = math.eval(document.getElementById("m33").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m34 = math.eval(document.getElementById("m34").value, {"t":parseFloat(document.getElementById("tVal").value)});

	let m41 = math.eval(document.getElementById("m41").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m42 = math.eval(document.getElementById("m42").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m43 = math.eval(document.getElementById("m43").value, {"t":parseFloat(document.getElementById("tVal").value)});
	let m44 = math.eval(document.getElementById("m44").value, {"t":parseFloat(document.getElementById("tVal").value)});

	return math.matrix([
		[m11,m12,m13,m14],
		[m21,m22,m23,m24],
		[m31,m32,m33,m34],
		[m41,m42,m43,m44]
	]);
}

const updateMatrix = (
	matrix = getMatrix(),
	power = parseFloat(document.getElementById("power").value),
	X=parseInt(document.getElementById("pointsX").value),
	Y=parseInt(document.getElementById("pointsY").value),
	Z=parseInt(document.getElementById("pointsZ").value),
	W=parseInt(document.getElementById("pointsW").value)) => {
	scene.remove(points);
	points = createPoints(math.pow(matrix, power), X,Y,Z,W);
	scene.add(points);
	saveMatrix();
}

const saveMatrix = ()=>{
	let mat = {
		"m11": document.getElementById("m11").value,
		"m12": document.getElementById("m12").value,
		"m13": document.getElementById("m13").value,
		"m14": document.getElementById("m14").value,
		"m21": document.getElementById("m21").value,
		"m22": document.getElementById("m22").value,
		"m23": document.getElementById("m23").value,
		"m24": document.getElementById("m24").value,
		"m31": document.getElementById("m31").value,
		"m32": document.getElementById("m32").value,
		"m33": document.getElementById("m33").value,
		"m34": document.getElementById("m34").value,
		"m41": document.getElementById("m41").value,
		"m42": document.getElementById("m42").value,
		"m43": document.getElementById("m43").value,
		"m44": document.getElementById("m44").value,
	}
	document.cookie = JSON.stringify({
		"mat": mat
	});
}

const loadMatrix = ()=>{
	if( document.cookie=="" ) return;
	let data = JSON.parse(document.cookie);
	let mat = data.mat;
	setMatrix(mat);
}

const setMatrix = (mat)=>{
	document.getElementById("m11").value = mat["m11"] || 0;
	document.getElementById("m12").value = mat["m12"] || 0;
	document.getElementById("m13").value = mat["m13"] || 0;
	document.getElementById("m14").value = mat["m14"] || 0;

	document.getElementById("m21").value = mat["m21"] || 0;
	document.getElementById("m22").value = mat["m22"] || 0;
	document.getElementById("m23").value = mat["m23"] || 0;
	document.getElementById("m24").value = mat["m24"] || 0;

	document.getElementById("m31").value = mat["m31"] || 0;
	document.getElementById("m32").value = mat["m32"] || 0;
	document.getElementById("m33").value = mat["m33"] || 0;
	document.getElementById("m34").value = mat["m34"] || 0;

	document.getElementById("m41").value = mat["m41"] || 0;
	document.getElementById("m42").value = mat["m42"] || 0;
	document.getElementById("m43").value = mat["m43"] || 0;
	document.getElementById("m44").value = mat["m44"] || 0;
}

document.getElementById("menu").onmouseenter = ()=> controls.enabled = false;
document.getElementById("menu").onmouseleave = ()=> controls.enabled = true;

loadMatrix();
