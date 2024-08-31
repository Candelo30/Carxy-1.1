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
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DesingService } from '../../service/desing/desing.service';
import { color } from 'three/webgpu';

@Component({
  selector: 'app-cars-view',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cars-view.component.html',
  styleUrls: ['./cars-view.component.css'],
})
export class CarsViewComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;
  constructor(
    private DesingService: DesingService,
    private route: ActivatedRoute
  ) {}

  loading = true; // Controla la visibilidad del indicador de carga
  progress = 0; // Progreso de la carga
  titleCar = '';
  saveDesingStatus: boolean = false;
  private carId!: any;

  // Variables para los controles de rango
  rotationX: number = 0;
  rotationY: number = 0;
  rotationZ: number = 0;
  positionX: number = 0;
  positionY: number = 0;
  positionZ: number = 0;

  // Three.js
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  public model!: THREE.Object3D;
  private controls!: OrbitControls;
  public parts: THREE.Object3D[] = [];
  private currentOutline: THREE.Mesh | null = null;
  private selectedPart: THREE.Mesh | null = null;
  private originalCameraPosition!: THREE.Vector3;
  private originalCameraTarget!: THREE.Vector3;
  private originalColors: Map<THREE.Mesh, THREE.Color> = new Map();
  private highlightLight!: THREE.PointLight;

  ngOnInit(): void {
    this.getColor();
    this.createScene();
    this.loadModel();
    this.carId = this.route.snapshot.paramMap.get('id');
  }

  colorList: any[] = [];

  getColor() {
    this.DesingService.getColors('api/colores').subscribe((data: any) => {
      this.colorList = data;
    });
  }

  getDesing() {
    // this.DesingService.getPartsByPersonalization(this.carId);
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

  private loadModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      'assets/gtrrsas.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(0.1, 0.1, 0.1);
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model);
        this.splitModelIntoParts();

        // Oculta el indicador de carga
        this.loading = false;
      },
      (xhr) => {
        // Calcula el progreso de la carga
        if (xhr.lengthComputable) {
          this.progress = (xhr.loaded / xhr.total) * 100;
        }
      },
      (error) => {
        console.error('Error loading model:', error);

        // Oculta el indicador de carga en caso de error
        this.loading = false;
      }
    );
  }

  resetCamera(): void {
    this.camera.position.copy(this.originalCameraPosition);
    this.controls.target.copy(this.originalCameraTarget);
    this.controls.update();
    this.highlightLight.visible = false; // Ocultar la luz de resaltado
    // Variables para los controles de rango
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.positionX = 0;
    this.positionY = 0;
    this.positionZ = 0;
    this.updateTransform();
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

  updateTransform(): void {
    if (this.model) {
      this.model.rotation.x = THREE.MathUtils.degToRad(this.rotationX);
      this.model.rotation.y = THREE.MathUtils.degToRad(this.rotationY);
      this.model.rotation.z = THREE.MathUtils.degToRad(this.rotationZ);
      this.model.position.x = this.positionX;
      this.model.position.y = this.positionY;
      this.model.position.z = this.positionZ;
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

  // ! Código Interación Mouse
  // -----------------------------------------

  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent): void {
  //   if (!this.model || !this.isModelMoving) return;

  //   const mouse = new THREE.Vector2();
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //   const raycaster = new THREE.Raycaster();
  //   raycaster.setFromCamera(mouse, this.camera);

  //   const intersects = raycaster.intersectObjects([this.model], true);

  //   if (intersects.length > 0) {
  //     this.isMouseOverModel = true;
  //     if (this.lastMouseX !== null && this.lastMouseY !== null) {
  //       const deltaX = event.clientX - this.lastMouseX;
  //       const deltaY = event.clientY - this.lastMouseY;

  //       this.model.rotation.y += deltaX * 0.01;
  //       this.model.rotation.x += deltaY * 0.01;
  //     }
  //   } else {
  //     this.isMouseOverModel = false;
  //   }

  //   this.lastMouseX = event.clientX;
  //   this.lastMouseY = event.clientY;
  // }

  // @HostListener('click', ['$event'])
  // onClick(event: MouseEvent): void {
  //   const mouse = new THREE.Vector2();
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //   const raycaster = new THREE.Raycaster();
  //   raycaster.setFromCamera(mouse, this.camera);

  //   const intersects = raycaster.intersectObjects([this.model], true);
  //   if (intersects.length > 0) {
  //     this.isModelMoving = !this.isModelMoving;
  //   }
  // }
}
