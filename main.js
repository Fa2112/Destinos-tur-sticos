import * as THREE from 'three';
import gsap from "gsap";
import fragment from "@shaders/fragment.glsl"
import vertex from "@shaders/vertex.glsl"
import * as images from "@images/images"
import detectTrackPad from '@utils/detectTrackpad';

let scrollStrength = 0.00035;

document.addEventListener("mousewheel", (e) => detectTrackPad(e, scrollStrength), false);
document.addEventListener("DOMMouseScroll", (e) => detectTrackPad(e, scrollStrength), false);

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);



const progress = document.getElementById("progress");

const loading = document.querySelector(".loading")


document.addEventListener("wheel", detectTrackPad);
document.addEventListener("DOMMouseScroll", detectTrackPad);


loadingManager.onProgress = function (url, loaded, total) {
    progress.value = (loaded / total) * 100;
}



loadingManager.onLoad = function () {
    loading.classList.add("faded");
    progress.classList.add("faded");
}

let photos = [
    {
        title: "Cataratas de Iguazú",
        description: "lorem ipsum",
        photo: textureLoader.load(images.img1),
        link: 'https://iguazuargentina.com',
    },
    {
        title: "Ruinas de San Ignacio Mini",
        description: "lorem ipsum",
        photo: textureLoader.load(images.img2),
        link: 'https://www.iguazuturismo.com.ar/que-hacer/ruinas-san-ignacio.html'
    },
    {
        title: "Glaciar Perito Moreno",
        description: "lorem ipsum",
        photo: textureLoader.load(images.img3),
        link: 'https://www.elcalafate.tur.ar/en-glaciar-perito-moreno.htm'
    },
    {
        title: "Quebrada de Humahuaca",
        description: "lorem ipsum",
        photo: textureLoader.load(images.img4),
        link: 'https://www.quebradadehumahuaca.com/info-gral/'
    },
];
const aspectRatio = window.outerWidth / window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);


const pointLight = new THREE.PointLight(0x0000ff, 10, 50); 
pointLight.position.set(1, 1, -1);
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0x00ff00, 10, 50); 
pointLight2.position.set(0, 2, 0);
scene.add(pointLight2);
const pointLight3 = new THREE.PointLight(0xff0000, 10, 50); 
pointLight3.position.set(2, 0, -3);
scene.add(pointLight3);
const planeLight = new THREE.PointLight(0xffffff, 10, 50);
planeLight.position.set(0, 0, -2);
scene.add(planeLight);


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.outerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);

const planeMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
        time: { type: 'f', value: 0 },
        pixels: {
            type: 'v2',
            value: new THREE.Vector2(window.outerWidth, window.innerHeight)
        },
        text: {
            type: 'f'
        },
        progress: {
            type: 'f', value: 0
        },
        uvRate1: {
            value: new THREE.Vector2(1, 1)
        },
        accel: {
            value: new THREE.Vector2(0.5, 2.)
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

const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 0, -3);
scene.add(torus);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1); 
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); 
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-3, 0, -4);
scene.add(cube);

const floor = new THREE.Mesh(new THREE.BoxGeometry(5, 3), new THREE.MeshStandardMaterial({color: "black"}))
floor.rotation.x = 150;
floor.position.set(0, -2, -2)
scene.add(floor);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
camera.position.set(0, 0, 1);
scene.add(plane);
const resize = () => {
    renderer.setSize(window.outerWidth, window.innerHeight);
    camera.aspect = window.outerWidth / window.innerHeight
    planeMaterial.uniforms.uvRate1.value.y = window.innerHeight / window.outerWidth;
    let distance = camera.position.z - plane.position.z;
    let height = 1;
    camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * distance));
    plane.scale.x = (window.outerWidth / window.innerHeight)
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

const pushBackButton = document.getElementById('stepAwayButton');

let isPushedBack = false;
let isThrottled = false;

const overlay = document.getElementById('overlay');


let isDragging = false;

let previousMousePosition = {
    x: 0,
    y: 0
};

document.addEventListener('mousedown', function (e) {
    isDragging = true;
});


let targetRotationY = 0; 

document.addEventListener('mousemove', function (e) {
    if (isDragging && isPushedBack ) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        const rotationSpeed = 0.002;

        targetRotationY += deltaMove.x * rotationSpeed;

        gsap.to(plane.rotation, {
            y: targetRotationY,
            duration: 0.5, 
            ease: "power2.out" 
        });

        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    }
});

document.addEventListener('touchstart', function (e) {
    isDragging = true;

    previousMousePosition.x = e.touches[0].clientX;
    previousMousePosition.y = e.touches[0].clientY;
});

document.addEventListener('touchmove', function (e) {
    if (isDragging && isPushedBack) {
        const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y
        };

        const rotationSpeed = 0.002;

        targetRotationY += deltaMove.x * rotationSpeed;

        gsap.to(plane.rotation, {
            y: targetRotationY,
            duration: 0.5,
            ease: "power2.out"
        });

        previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
});

document.addEventListener('touchend', function () {
    isDragging = false;
});

document.addEventListener('mouseup', function (e) {
    isDragging = false;
});


pushBackButton.addEventListener('click', () => {
    if (isThrottled) return; 
    isThrottled = true;
    const distance  = 2;
    const targetZ = isPushedBack ? plane.position.z + distance : plane.position.z - distance;
    gsap.to(plane.position, {
        z: targetZ,
        duration: 1,
        ease: "easein",
        onStart: () => {
            if (isPushedBack) {
                gsap.to(overlay, { opacity: 1, duration: 0.3 });
            } else {
                gsap.to(overlay, { opacity: 0, duration: 0.3 });
            }
        },
        onComplete: () => {
            isPushedBack = !isPushedBack;

            pushBackButton.textContent = isPushedBack ? "Volver" : "Empujar";

            isThrottled = false;
        }
    });

    gsap.to(plane.rotation, {
        y: 0, 
        duration: 1,
        ease: "easein"
    });

});

pushBackButton.textContent = "Empujar";


window.addEventListener('resize', resize);
document.getElementById('menuToggle').addEventListener('click', toggleFunction)

let time = 0;
function animate() {
    time += 0.05;
    planeMaterial.uniforms.time.value = time;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}



let position = 0;
let velocity = 0;





document.addEventListener('wheel', function (e) {

    if (e.deltaY < 10 && e.deltaY > -10) {
        return
    }

    velocity += e.deltaY * scrollStrength
});


let startY;
let currentY;

document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchmove', handleTouchMove, { passive: true });
document.addEventListener('touchend', handleTouchEnd, { passive: true });


function handleTouchStart(e) {
    startY = e.touches[0].clientY;
    if (currentY === undefined) currentY = startY;
}

function handleTouchMove(e) {

    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    velocity += deltaY * 0.00100;

    startY = currentY;
}

function handleTouchEnd() {
    startY = null;
    currentY = null;
}

const timeLine = gsap.timeline();

let timingTitle = 0;

const cycle = function (value) {
    if (value >= 0) {
        return Math.abs(Math.floor(position)) % photos.length
    }
    return Math.abs(Math.abs(Math.floor(position) % photos.length) - 3);
}

const cycleNext = function (value) {
    if (value >= 0) {
        return Math.abs(Math.floor(position) + 1) % photos.length
    }
    return Math.abs(Math.abs(Math.floor(position) + 1) % photos.length - 3);
}
const curTitle = function (value) {
    if (value >= 0) {
        return Math.abs(Math.round(position)) % photos.length
    }
    return Math.abs(Math.abs(Math.round(position) % photos.length) - 3);
}

const torusAnimationRadius = 1.5; 
const speed = 0.02;

const torusTargetPosition = new THREE.Vector3();
const torusTargetRotation = new THREE.Euler();

const cubeTargetPosition = new THREE.Vector3();
const cubeTargetRotation = new THREE.Euler();

let backgroundTime = 0.0;
function raf() {
    
    timingTitle += velocity;
    position += velocity;


    velocity *= 0.7;



    let breakpoint = Math.round(position);
    let remainder = breakpoint - position;

    position += remainder * 0.03;


    planeMaterial.uniforms.progress.value = position;
    let current = cycle(position)
    let next = cycleNext(position)
    let title = curTitle(position)

    planeMaterial.uniforms.texture1.value = photos[current].photo;
    planeMaterial.uniforms.texture2.value = photos[next].photo;
    document.getElementById('title').innerHTML = photos[title].title.toUpperCase();
    document.getElementById('title').style.opacity = Math.abs(1 - 2 * (Math.abs(position - Math.floor(position))))
    document.getElementById('desc').style.opacity = Math.abs(1 - 2 * (Math.abs(position - Math.floor(position))))
    document.getElementById('direct').style.opacity = Math.abs(1 - 2 * (Math.abs(position - Math.floor(position))))
    document.getElementById('direct').setAttribute('href', photos[title].link)

    if (isPushedBack) {
        backgroundTime+= 0.05;
       torusTargetPosition.set(
            Math.sin(backgroundTime * speed) * torusAnimationRadius,
           Math.max(Math.cos(backgroundTime * speed) * torusAnimationRadius, 1),
            -3 + Math.sin(backgroundTime * speed) * 0.5
        );

        torus.position.lerp(torusTargetPosition, 0.1); 
        
       torusTargetRotation.set(
            torus.rotation.x + 0.01,
            torus.rotation.y + 0.01,
            torus.rotation.z
        );
        torus.rotation.x += (torusTargetRotation.x - torus.rotation.x) * 0.1; 
        torus.rotation.y += (torusTargetRotation.y - torus.rotation.y) * 0.1;
        
        cubeTargetPosition.set(
            -2 + Math.sin(backgroundTime * speed - Math.PI) * torusAnimationRadius, 
            Math.max(Math.cos(backgroundTime * speed + Math.PI) * torusAnimationRadius, 0),
            -3 + Math.sin(backgroundTime * speed + Math.PI) * 0.5 
        );

        console.log(cubeTargetPosition.x)
        cube.position.lerp(cubeTargetPosition, 0.1);

        cubeTargetRotation.set(
            cube.rotation.x - 0.01,
            cube.rotation.y - 0.01,
            cube.rotation.z
        );
        cube.rotation.x += (cubeTargetRotation.x - cube.rotation.x) * 0.1;
        cube.rotation.y += (cubeTargetRotation.y - cube.rotation.y) * 0.1;
    }


    window.requestAnimationFrame(raf);
}

animate();

raf();