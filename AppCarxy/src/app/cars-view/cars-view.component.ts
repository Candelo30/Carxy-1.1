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

  titleCar = 'Provando Carros';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  public model!: THREE.Object3D;
  private controls!: OrbitControls;

  private lastMouseX: number | null = null;
  private lastMouseY: number | null = null;
  private isMouseOverModel: boolean = false;
  private isModelMoving: boolean = true;

  private highlightLight!: THREE.PointLight;

  colorList = [
    { id: 1, bgColor: '#FFFFFF' }, // Blanco
    { id: 2, bgColor: '#000000' }, // Negro
    { id: 3, bgColor: '#808080' }, // Gris
    { id: 4, bgColor: '#C0C0C0' }, // Plata
    { id: 5, bgColor: '#FFD700' }, // Oro
    { id: 6, bgColor: '#F5F5DC' }, // Beige
    { id: 7, bgColor: '#A52A2A' }, // Marrón
    { id: 8, bgColor: '#D2B48C' }, // Tan
    { id: 9, bgColor: '#696969' }, // Gris Oscuro
    { id: 10, bgColor: '#BEBEBE' }, // Gris Claro
    { id: 11, bgColor: '#F0E68C' }, // Khaki
    { id: 12, bgColor: '#FFF8DC' }, // Cornsilk
    { id: 13, bgColor: '#8B4513' }, // Marrón Oscuro
    { id: 14, bgColor: '#CD7F32' }, // Bronce
    { id: 15, bgColor: '#B8860B' }, // Oro Oscuro
  ];

  saveDesingStatus: boolean = false;

  public parts: THREE.Object3D[] = [];
  private currentOutline: THREE.Mesh | null = null;
  private selectedPart: THREE.Mesh | null = null;
  private originalCameraPosition!: THREE.Vector3;
  private originalCameraTarget!: THREE.Vector3;
  private originalColors: Map<THREE.Mesh, THREE.Color> = new Map();

  constructor() {}

  ngOnInit(): void {
    this.createScene();
    this.loadModel();
  }

  ngAfterViewInit(): void {
    // Esta función permanece para cualquier configuración que necesite ser hecha
    // después de que las vistas hayan sido completamente inicializadas.
  }

  createScene(): void {
    this.scene = new THREE.Scene();

    // Configuración de la cámara
    this.camera = new THREE.PerspectiveCamera(
      30,
      this.rendererContainer.nativeElement.offsetWidth /
        this.rendererContainer.nativeElement.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 100);

    // Guardar la posición y el objetivo originales de la cámara
    this.originalCameraPosition = this.camera.position.clone();
    this.originalCameraTarget = new THREE.Vector3(0, 0, 0);

    // Configuración del renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(
      this.rendererContainer.nativeElement.offsetWidth,
      this.rendererContainer.nativeElement.offsetHeight
    );
    this.renderer.setClearColor(0x000000, 0);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 50); // Suave y general
    this.scene.add(ambientLight);

    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Menor intensidad
    directionalLight.position.set(100, 100, 100).normalize();
    this.scene.add(directionalLight);

    // Luz puntual para resaltar elementos seleccionados
    this.highlightLight = new THREE.PointLight(0xffffff, 2, 50);
    this.scene.add(this.highlightLight);
    this.highlightLight.visible = false; // Inicialmente la luz no es visible

    // Configuración de los controles
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  resetCamera(): void {
    this.camera.position.copy(this.originalCameraPosition);
    this.controls.target.copy(this.originalCameraTarget);
    this.controls.update();
    this.highlightLight.visible = false; // Ocultar la luz de resaltado
  }

  resetPartColor(): void {
    if (this.selectedPart) {
      const originalColor = this.originalColors.get(this.selectedPart);
      if (originalColor) {
        (this.selectedPart.material as THREE.MeshStandardMaterial).color.copy(
          originalColor
        );
      }
    }
  }

  loadModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      'assets/gtrrsas.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(0.1, 0.1, 0.1);
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model);
        this.splitModelIntoParts();
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  }

  splitModelIntoParts(): void {
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material && child.geometry) {
          const originalColor = new THREE.Color(
            (child.material as THREE.MeshStandardMaterial).color.getHex()
          );
          this.originalColors.set(child, originalColor);
          child.name = child.name || `Part ${this.parts.length + 1}`;
          this.parts.push(child);
        }
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

    this.focusOnPart(part);
  }

  focusOnPart(part: THREE.Object3D): void {
    // Si ya hay un borde, eliminarlo
    if (this.currentOutline) {
      this.currentOutline.parent?.remove(this.currentOutline);
      this.currentOutline = null;
    }

    const box = new THREE.Box3().setFromObject(part);
    const center = box.getCenter(new THREE.Vector3());

    // Cambiar el objetivo de la cámara para centrar en la parte seleccionada sin hacer zoom
    this.controls.target.copy(center);
    this.controls.update();

    // Posicionar la luz puntual en la parte seleccionada
    this.highlightLight.position.copy(center);
    this.highlightLight.visible = true;

    // Agregar un borde brillante alrededor de la parte seleccionada
    this.currentOutline = this.addOutline(part);
  }

  addOutline(part: THREE.Object3D): THREE.Mesh {
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.BackSide,
    });
    const outlineMesh = new THREE.Mesh(
      (part as THREE.Mesh).geometry.clone(),
      outlineMaterial
    );
    outlineMesh.scale.multiplyScalar(1.05); // Aumentar ligeramente el tamaño para que el borde sea visible
    part.add(outlineMesh);

    return outlineMesh;
  }
}
