import * as THREE from 'three';
import gsap from "gsap";
import fragment from "./shaders/fragment.glsl"
import vertex from "./shaders/vertex.glsl"
import img1 from "./img/img.jpg"
import img2 from "./img/img2.jpg"
// import img3 from "./img/img3.jpg"
// import img4 from "./img/img4.jpg"


const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const progress = document.getElementById("progress");

const loading = document.querySelector(".loading")


loadingManager.onProgress = function(url, loaded,total) {
    progress.value = (loaded / total) * 100 ;
}



loadingManager.onLoad = function() {
    loading.classList.add("faded");
    progress.classList.add("faded");
   
}

let photos = [
    {
        title:  "Cataratas de Iguazú",
        description: "lorem ipsum",
        photo:  textureLoader.load(img1),
        link: 'https://iguazuargentina.com',
    },
    {
        title:  "Ruinas de San Ignacio Mini",
        description: "lorem ipsum",
        photo: textureLoader.load(img2),
        link: 'https://www.iguazuturismo.com.ar/que-hacer/ruinas-san-ignacio.html'
    },
    // {
    //     title:   "Glaciar Perito Moreno",
    //     description: "lorem ipsum",
    //     photo:  textureLoader.load(img3),
    //     link: 'https://www.elcalafate.tur.ar/en-glaciar-perito-moreno.htm'
    // },
    // {
    //     title:  "Quebrada de Humahuaca",
    //     description: "lorem ipsum",
    //     photo:   textureLoader.load(img4),
    //     link: 'https://www.quebradadehumahuaca.com/info-gral/'
    // },
];
const aspectRatio = window.outerWidth / window.innerHeight;
 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.outerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);

const planeMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
        time: {type: 'f', value: 0},
        pixels: {
          type:'v2',
          value: new THREE.Vector2(window.outerWidth, window.innerHeight)  
        },
        text: {
            type: 'f'
        },
        progress: {
            type: 'f', value: 0 
        },
        uvRate1: {
            value: new THREE.Vector2(1,1)
        },
        accel: {
            value: new THREE.Vector2(0.5,2.)
        },
        texture1: {
            value: textureLoader.load('img/img.jpg')
        },
        texture2: {
            value: textureLoader.load('img/img2.jpg')
        }
    },
    vertexShader: vertex,
    fragmentShader: fragment
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
camera.position.set(0, 0, 1);
scene.add(plane);
const resize = () => {
    renderer.setSize(window.outerWidth, window.innerHeight);
    camera.aspect = window.outerWidth / window.innerHeight
    planeMaterial.uniforms.uvRate1.value.y = window.innerHeight/window.outerWidth;

    let distance = camera.position.z - plane.position.z;
    let height = 1;
    camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*distance));


    plane.scale.x =(window.outerWidth / window.innerHeight)
    
    camera.updateProjectionMatrix();
   
};

resize();
const menu = document.getElementById('nav')
const toggleFunction = () => {
    menu.classList.toggle('expanded')

    document.querySelector(".content").addEventListener("onClick", () => {
        document.
        console.log('ldskvnfn')
    menu.classList.remove('expanded')
    })

}

window.addEventListener('resize', resize);
document.getElementById('menuToggle').addEventListener('click', toggleFunction)

let time = 0;
function animate() {
    time+= 0.05;
    planeMaterial.uniforms.time.value =  time;   
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}



let position = 0;
let velocity = 0;

 
document.addEventListener('wheel', function(e) {
    if (e.deltaY < 10 && e.deltaY > -10) {
        return
    }
    
    velocity += e.deltaY * 0.00035   
});

let startY;
let currentY; 

document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchmove', handleTouchMove, { passive: true });
document.addEventListener('touchend', handleTouchEnd, { passive: true });


function handleTouchStart(e) {
  startY = e.touches[0].clientY; 
}

function handleTouchMove(e) {
  currentY = e.touches[0].clientY; 
  const deltaY = currentY - startY; 

  velocity += deltaY * 0.00080; 
  startY = currentY; 
}

function handleTouchEnd() {
  startY = null;
  currentY = null;
}

const timeLine = gsap.timeline();

let timingTitle = 0;

const cycle = function(value) {
if (value >= 0) {
    return Math.abs(Math.floor(position)) % photos.length
}
    return Math.abs(Math.abs(Math.floor(position) % photos.length) - 3);
}

const cycleNext = function(value) {
if (value >= 0) {
    return Math.abs(Math.floor(position) + 1) % photos.length
}
    return Math.abs(Math.abs(Math.floor(position) + 1) % photos.length - 3);
}
const curTitle = function(value) {
if (value >= 0) {
    return Math.abs(Math.round(position)) % photos.length
}
    return Math.abs(Math.abs(Math.round(position) % photos.length) - 3);
}
function raf() {
    timingTitle+= velocity;
    position+= velocity;    


    velocity *= 0.7;
    
    
    
    let breakpoint = Math.round(position);
    let remainder = breakpoint - position;

    position+= remainder*0.03;
    
    
    planeMaterial.uniforms.progress.value = position ;
    let current = cycle(position)
    let next = cycleNext(position)
    let title = curTitle(position)

    planeMaterial.uniforms.texture1.value = photos[current].photo;
    planeMaterial.uniforms.texture2.value = photos[next].photo;
    document.getElementById('title').innerHTML = photos[title].title.toUpperCase();
    document.getElementById('title').style.opacity = Math.abs(1- 2 * (Math.abs(position - Math.floor(position))))
    document.getElementById('desc').style.opacity = Math.abs(1- 2 * (Math.abs(position - Math.floor(position))))
    document.getElementById('direct').style.opacity = Math.abs(1- 2 * (Math.abs(position - Math.floor(position))))
    document.getElementById('direct').setAttribute('href', photos[title].link)


    window.requestAnimationFrame(raf);
}

animate();

raf();