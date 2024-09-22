import * as THREE from 'three';
import { OrbitControls } from './addons/controls/OrbitControls.js'; 
//import { OBJLoader } from './addons/loaders/OBJLoader.js';
import { GLTFLoader } from './addons/loaders/GLTFLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

/**
 * The application. Top level class that manages everything.
 */
class App
{
    renderer;
    scene;
    camera;
    controls;

    #display_width;
    #display_height;

    #cube; // temp for testing

    constructor()
    {
        this.#display_height = 0;
        this.#display_width = 0;
    }
    
    initialise(canvas_el)
    {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0.5, 0.5, 0.5);
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.renderer = new THREE.WebGLRenderer({canvas: canvas_el});
        this.#display_width = window.innerWidth;
        this.#display_height = window.innerHeight;
        this.renderer.setSize( this.#display_width, this.#display_height );
        document.body.appendChild( this.renderer.domElement );
        let self = this;
        window.addEventListener('resize', (e) => {
            self.#display_width = window.innerWidth;
            self.#display_height = window.innerHeight;
            self.camera.aspect = self.#display_width / self.#display_height;
            self.camera.updateProjectionMatrix();
            self.renderer.setSize(self.#display_width, self.#display_height);
        });
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        let ambient = new THREE.AmbientLight( 0xffffff);
        this.scene.add(ambient);

        const light1 = new THREE.DirectionalLight( 0xffffff, 1 );
        //this.scene.add( light1 );
        const light2 = new THREE.DirectionalLight( 0xffffff, 1 );
        light2.translateY(-2);
        //this.scene.add( light2 );

        // For VR
        document.body.appendChild( VRButton.createButton( this.renderer ) );
        this.renderer.xr.enabled = true;

        //this.add_cube();
        this.load_model();
        this.camera.position.z = 5;

        this.renderer.setAnimationLoop( () => {self.animate() } );
    }

    add_cube()
    {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.#cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.#cube );
    }

    load_model()
    {
        let loader = new GLTFLoader();
        let self = this;
        // Load a glTF resource
        loader.load(
            // resource URL
            'models/cave.glb',
            // called when the resource is loaded
            function ( gltf ) {
                // gltf.scene.position.set(0, -530, -550);
                gltf.scene.position.set(2, -1, 0);
                self.scene.add( gltf.scene );

                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object

            },
            // called while loading is progressing
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened', error );

            }
        );
    }

    animate()
    {
        // this.#cube.rotation.x += 0.01;
        // this.#cube.rotation.y += 0.01;
        //if(cave !== undefined) cave.rotation.x += 0.01;
        this.renderer.render( this.scene, this.camera );
    };

}

export {App};
