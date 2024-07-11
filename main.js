// Please note: this is my first time creating a 3d website, I am learning, hence the slow progress
import * as THREE from "three";

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(100, -300, 400);
scene.add(directionalLight);

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 960;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
    cameraWidth / -2,
    cameraWidth / 2,
    cameraHeight / 2,
    cameraHeight / -2,
    0,
    1000
);

camera.position.set(0, 0, 300);
camera.lookAt(0, 0, 0);

const createLines = (width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    context.fillStyle = "#546e90";
    context.fillRect(0, 0, width, height);

    context.lineWidth = 2;
    context.strokeStyle = "#e0ffff";
    context.setLineDash([10, 14]);

    context.beginPath();
    context.arc(
        width / 2,
        height / 2,
        250,
        0,
        2 * Math.PI
    );
    context.stroke();

    return new THREE.CanvasTexture(canvas);
};

const getIsland = () => {
    const island = new THREE.Shape();

    island.absarc(
        0,
        0,
        210,
        0,
        Math.PI * 2,
        false
    );

    return island
}

const getOuterField = (width, height) => {
    const field = new THREE.Shape();

    field.moveTo(-width / 2, -height / 2);
    field.lineTo(-width / 2, height / 2);

    
    field.absarc(
        0,
        0,
        210,
        0,
        Math.PI * 2,
        false
    );
}

const renderMap = (width, height) => {
    const lineMarkings = createLines(width, height);
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMaterial = new THREE.MeshLambertMaterial({ map: lineMarkings });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    // Island & rest of the map

    const island = getIsland();
    const outerField = getOuterField(width, height);
    
    const fieldGeometry = new THREE.ExtrudeGeometry([island, outerField], {
        depth: 6,
        bevelEnabled: false,
    });

    const fieldMesh = new THREE.Mesh(fieldGeometry, [
        new THREE.MeshLambertMaterial({ color: 0x67c240 }),
        new THREE.MeshLambertMaterial({ color: 0x23311c }),
    ]);
    scene.add(fieldMesh);
};

renderMap(cameraWidth, cameraHeight * 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Car
const createWheels = () => {
    const geometry = new THREE.BoxGeometry(12, 33, 12);
    const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
};

const createCar = () => {
    const car = new THREE.Group();

    const backWheel = createWheels();
    backWheel.position.z = 6;
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = createWheels();
    frontWheel.position.z = 6;
    frontWheel.position.x = 18;
    car.add(frontWheel);

    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ color: 0xa52523 })
    );
    main.position.z = 12;
    car.add(main);

    const carFrontTexture = getCarFrontTexture();

    const carBackTexture = getCarFrontTexture();

    const carRightSideTexture = getCarSideTexture();

    const carLeftSideTexture = getCarSideTexture();

    carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
    carLeftSideTexture.rotation = Math.PI;
    carLeftSideTexture.flipY = false;

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(33, 24, 12), [
        new THREE.MeshLambertMaterial({ map: carFrontTexture }),
        new THREE.MeshLambertMaterial({ map: carBackTexture }),
        new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
        new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
        new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
    ]);
    cabin.position.x = -6;
    cabin.position.z = 25.5;
    car.add(cabin);

    return car;
};

const getCarFrontTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
};

const getCarSideTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
};

// Render
const car = createCar();
scene.add(car);

renderer.render(scene, camera);
