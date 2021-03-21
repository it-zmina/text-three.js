import {
    TextGeometry,
    Shape,
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    PointLight,
    Group,
    BufferGeometry,
    Float32BufferAttribute,
    LineBasicMaterial,
    MeshPhongMaterial,
    DoubleSide,
    LineSegments,
    Mesh,
    FontLoader,
    WireframeGeometry
} from "/node_modules/three/build/three.module.js";

import { GUI } from '/node_modules/three/examples/jsm/libs/dat.gui.module.js';

import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';


const twoPi = Math.PI * 2;

// class CustomSinCurve extends Curve {
//
//     constructor( scale = 1 ) {
//
//         super();
//
//         this.scale = scale;
//
//     }
//
//     getPoint( t, optionalTarget = new Vector3() ) {
//
//         const tx = t * 3 - 1.5;
//         const ty = Math.sin( 2 * Math.PI * t );
//         const tz = 0;
//
//         return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
//
//     }
//
// }

function updateGroupGeometry( mesh, geometry ) {

    mesh.children[ 0 ].geometry.dispose();
    mesh.children[ 1 ].geometry.dispose();

    mesh.children[ 0 ].geometry = new WireframeGeometry( geometry );
    mesh.children[ 1 ].geometry = geometry;

    // these do not update nicely together if shared

}

// heart shape

const x = 0, y = 0;

const heartShape = new Shape();

heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7, x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

const guis = {
    TextGeometry: function (mesh) {

        const data = {
            text: 'Zmina-Geometry',
            size: 5,
            height: 2,
            curveSegments: 12,
            font: 'helvetiker',
            weight: 'regular',
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelOffset: 0.0,
            bevelSegments: 3
        };

        const fonts = [
            'helvetiker',
            'optimer',
            'gentilis',
            'droid/droid_serif',
            'ken-pixel'
        ];

        const weights = [
            'regular', 'bold'
        ];

        function generateGeometry() {

            const loader = new FontLoader();
            loader.load('/fonts/' + data.font + '_' + data.weight + '.typeface.json', function (font) {

                const geometry = new TextGeometry(data.text, {
                    font: font,
                    size: data.size,
                    height: data.height,
                    curveSegments: data.curveSegments,
                    bevelEnabled: data.bevelEnabled,
                    bevelThickness: data.bevelThickness,
                    bevelSize: data.bevelSize,
                    bevelOffset: data.bevelOffset,
                    bevelSegments: data.bevelSegments
                });
                geometry.center();

                updateGroupGeometry(mesh, geometry);

            });

        }

        //Hide the wireframe
        mesh.children[0].visible = true;

        const folder = gui.addFolder('THREE.TextGeometry');

        folder.add(data, 'text').onChange(generateGeometry);
        folder.add(data, 'size', 1, 30).onChange(generateGeometry);
        folder.add(data, 'height', 1, 20).onChange(generateGeometry);
        folder.add(data, 'curveSegments', 1, 20).step(1).onChange(generateGeometry);
        folder.add(data, 'font', fonts).onChange(generateGeometry);
        folder.add(data, 'weight', weights).onChange(generateGeometry);
        folder.add(data, 'bevelEnabled').onChange(generateGeometry);
        folder.add(data, 'bevelThickness', 0.1, 3).onChange(generateGeometry);
        folder.add(data, 'bevelSize', 0, 3).onChange(generateGeometry);
        folder.add(data, 'bevelOffset', -0.5, 1.5).onChange(generateGeometry);
        folder.add(data, 'bevelSegments', 0, 8).step(1).onChange(generateGeometry);

        generateGeometry();

    }
}

function chooseFromHash( mesh ) {

    const selectedGeometry = window.location.hash.substring( 1 ) || 'TextGeometry';

    if ( guis[ selectedGeometry ] !== undefined ) {

        guis[ selectedGeometry ]( mesh );

    }

    if ( selectedGeometry === 'TextGeometry' ) {

        return { fixed: true };

    }

    //No configuration options
    return {};

}

//


const gui = new GUI();

const scene = new Scene();
scene.background = new Color( 0x444444 );

const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
camera.position.z = 30;

const renderer = new WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbit = new OrbitControls( camera, renderer.domElement );
orbit.enableZoom = true;

const lights = [];
lights[ 0 ] = new PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

const group = new Group();

const geometry = new BufferGeometry();
geometry.setAttribute( 'position', new Float32BufferAttribute( [], 3 ) );

const lineMaterial = new LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
const meshMaterial = new MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: DoubleSide, flatShading: true } );

group.add( new LineSegments( geometry, lineMaterial ) );
group.add( new Mesh( geometry, meshMaterial ) );

const options = chooseFromHash( group );

scene.add( group );

function render() {

    requestAnimationFrame( render );

    if ( ! options.fixed ) {

        group.rotation.x += 0.005;
        group.rotation.y += 0.005;

    }

    renderer.render( scene, camera );

}

window.addEventListener( 'resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();