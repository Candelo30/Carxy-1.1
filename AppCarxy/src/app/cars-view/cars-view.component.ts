import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-cars-view',
  standalone: true,
  imports: [],
  templateUrl: './cars-view.component.html',
  styleUrl: './cars-view.component.css',
})
export class CarsViewComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;

  private cube!: THREE.Mesh;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  titleCar: string = '';
  imgCar: string = '';

  colorList = [
    { id: 1, bgColor: '#008080' },
    { id: 2, bgColor: '#0000FF' },
    { id: 3, bgColor: '#800080' },
    { id: 4, bgColor: '#FF69B4' },
  ];

  saveDesingStatus: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.createScene();
  }

  createScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.rendererContainer.nativeElement.offsetWidth /
        this.rendererContainer.nativeElement.offsetHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true }); // Fondo transparente
    this.renderer.setSize(
      this.rendererContainer.nativeElement.offsetWidth,
      this.rendererContainer.nativeElement.offsetHeight
    );
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rotationX = (event.clientX / window.innerWidth) * 2 - 1;
    const rotationY = (event.clientY / window.innerHeight) * 2 - 1;

    this.cube.rotation.x = rotationY * Math.PI;
    this.cube.rotation.y = rotationX * Math.PI;
  }

  changeCubeColor(color: string): void {
    (this.cube.material as THREE.MeshBasicMaterial).color.set(color);
  }

  changeValue() {
    this.saveDesingStatus = false;
  } // Three.js
}
