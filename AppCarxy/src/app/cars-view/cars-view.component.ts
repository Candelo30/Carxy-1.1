import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-cars-view',
  templateUrl: './cars-view.component.html',
  styleUrls: ['./cars-view.component.css'],
})
export class CarsViewComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;

  @ViewChildren('partCanvas') partCanvases!: QueryList<ElementRef>;

  titleCar = 'Provando Carros';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Object3D;
  private controls!: OrbitControls;

  private lastMouseX: number | null = null;
  private lastMouseY: number | null = null;
  private isMouseOverModel: boolean = false;
  private isModelMoving: boolean = true;

  colorList = [
    { id: 1, bgColor: '#008080' }, // Teal
    { id: 2, bgColor: '#0000FF' }, // Blue
    { id: 3, bgColor: '#800080' }, // Purple
    { id: 4, bgColor: '#FF69B4' }, // Hot Pink
    { id: 5, bgColor: '#FF6347' }, // Tomato
    { id: 6, bgColor: '#3CB371' }, // Medium Sea Green
    { id: 7, bgColor: '#FFD700' }, // Gold
    { id: 8, bgColor: '#FF4500' }, // Orange Red
    { id: 9, bgColor: '#2E8B57' }, // Sea Green
    { id: 10, bgColor: '#4B0082' }, // Indigo
    { id: 11, bgColor: '#ADFF2F' }, // Green Yellow
    { id: 12, bgColor: '#D2691E' }, // Chocolate
    { id: 13, bgColor: '#DC143C' }, // Crimson
    { id: 14, bgColor: '#00CED1' }, // Dark Turquoise
    { id: 15, bgColor: '#FF8C00' }, // Dark Orange
  ];

  saveDesingStatus: boolean = false;

  private partRenderers: THREE.WebGLRenderer[] = [];
  private partCameras: THREE.PerspectiveCamera[] = [];
  public parts: THREE.Object3D[] = [];
  private selectedPart: THREE.Mesh | null = null;

  constructor() {}

  ngOnInit(): void {
    this.createScene();
    this.loadModel();
  }

  ngAfterViewInit(): void {
    // Espera a que las vistas estén completamente inicializadas
    if (this.partCanvases.length === 0) {
      return;
    }
    this.setupPartCanvases();
  }

  createScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      30,
      this.rendererContainer.nativeElement.offsetWidth /
        this.rendererContainer.nativeElement.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 100);

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(
      this.rendererContainer.nativeElement.offsetWidth,
      this.rendererContainer.nativeElement.offsetHeight
    );
    this.renderer.setClearColor(0x000000, 0);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
    directionalLight.position.set(100, 100, 100).normalize();
    this.scene.add(directionalLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.renderParts();
    };
    animate();
  }

  loadModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      'assets/car.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(0.1, 0.1, 0.1);
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model);
        this.splitModelIntoParts();

        if (this.parts.length > 0 && this.partCanvases.length > 0) {
          this.setupPartCanvases();
        } else {
        }
      },
      undefined,
      (error) => {}
    );
  }

  splitModelIntoParts(): void {
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material && child.geometry) {
          this.parts.push(child);
        } else {
        }
      }
    });
  }

  setupPartCanvases(): void {
    if (this.parts.length !== this.partCanvases.length) {
      console.error(
        'El número de partes no coincide con el número de canvases'
      );
      return;
    }

    this.partCanvases.forEach((partCanvas, index) => {
      if (index < this.parts.length) {
        const canvasElement = partCanvas.nativeElement as HTMLCanvasElement;
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasElement,
          alpha: true,
        });

        // Ajusta el tamaño del renderer
        renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
        renderer.setClearColor(0x000000, 0);

        const camera = new THREE.PerspectiveCamera(
          30,
          canvasElement.clientWidth / canvasElement.clientHeight,
          0.1,
          1000
        );
        camera.position.set(0, 0, 100);

        this.partRenderers.push(renderer);
        this.partCameras.push(camera);
      }
    });
  }

  renderParts(): void {
    this.parts.forEach((part, index) => {
      if (
        index < this.partRenderers.length &&
        index < this.partCameras.length
      ) {
        const renderer = this.partRenderers[index];
        const camera = this.partCameras[index];

        // Ajusta la posición de la cámara para que enfoque la parte correctamente
        camera.position.copy(part.position).add(new THREE.Vector3(0, 0, 100));
        camera.lookAt(part.position);

        renderer.render(this.scene, camera);
      }
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.model || !this.isModelMoving) return;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects([this.model], true);

    if (intersects.length > 0) {
      this.isMouseOverModel = true;
      if (this.lastMouseX !== null && this.lastMouseY !== null) {
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;

        this.model.rotation.y += deltaX * 0.01;
        this.model.rotation.x += deltaY * 0.01;
      }
    } else {
      this.isMouseOverModel = false;
    }

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects([this.model], true);
    if (intersects.length > 0) {
      this.isModelMoving = !this.isModelMoving;
    }
  }

  changeModelColor(color: string): void {
    if (this.selectedPart) {
      (this.selectedPart.material as THREE.MeshStandardMaterial).color.set(
        color
      );
    }
  }

  changeValue() {
    this.saveDesingStatus = false;
  }

  onPartClick(part: THREE.Object3D): void {
    this.selectedPart = part as THREE.Mesh;
  }
}
