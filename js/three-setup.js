class Three {
  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.rotateSpeed = 0.1;
  }
  eventListeners() {
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
    // document.addEventListener("mousedown", () => (this.rotateSpeed = 1));
    // document.addEventListener("mouseup", () => (this.rotateSpeed = 0.2));
    document.addEventListener("mousemove", e => this.raycasterTransform(e));
    document.addEventListener("click", e => this.raycasterTransform(e));
    if (window.innerWidth > 768) {
      document.addEventListener("scroll", e => {
        new TWEEN.Tween(this.camera.rotation)
          .to(
            {
              z: Math.random() * 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onStart(() => {
            new TWEEN.Tween(this.camera.position)
              .to(
                {
                  x: Math.random() * 4 - 2,
                  y: Math.random() * 4 - 2,
                  z: Math.random() * 20
                },
                1000
              )
              .easing(TWEEN.Easing.Quartic.InOut)
              .start();
          })
          .start();
      });
    }
  }

  init() {
    // Lights
    // const spotLight_01 = this.getSpotlight(0xffffff, 1);
    // const spotLight_02 = this.getSpotlight(0xffffff, 1);
    // const spotLight_03 = this.getSpotlight(0xffffff, 1);

    // Objects
    for (let i = 0; i < 200; i++) {
      const sphere = this.getSphere((Math.random() * 10 + 2) / 20);
      sphere.position.x = Math.random() * 5 + 3;
      sphere.position.y = Math.random() * 34 - 17;
      sphere.position.z = Math.random() * 5 - 5;

      sphere.rotation.z = Math.floor(Math.random() * 2);
      this.scene.add(sphere);
    }

    // Add objects to the scene
    // this.scene.add(spotLight_01);
    // this.scene.add(spotLight_02);
    // this.scene.add(spotLight_03);

    // Transform objects
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 10;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // spotLight_01.position.set(0, 40, 40);
    // spotLight_02.position.set(0, -40, -40);
    // spotLight_03.position.set(-40, 0, 0);

    // Add to DOM
    this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor("#ffffff");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("scene").appendChild(this.renderer.domElement);

    // Render
    const render = () => {
      TWEEN.update();
      requestAnimationFrame(render);
      for (let i = 0; i < this.scene.children.length; i++) {
        this.scene.children[i].rotation.z += 0.01;
        this.rotateAboutPoint(
          this.scene.children[i],
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(1, 0, 0),
          THREE.Math.degToRad(this.rotateSpeed + i / 1000),
          true
        );
      }
      this.renderer.render(this.scene, this.camera);
    };
    render();
  }

  getSphere(radius) {
    var geo = new THREE.SphereBufferGeometry(radius, 24, 24);
    var material = new THREE.MeshBasicMaterial({
      color: 0xf1f1f1
    });
    var mesh = new THREE.Mesh(geo, material);

    //mesh.castShadow = true;
    //new THREE.Box3().setFromObject(mesh);
    return mesh;
  }
  getSquare(size) {
    var geometry = new THREE.BoxBufferGeometry(size, size, size);
    var material = new THREE.MeshLambertMaterial({ color: 0x00aeff });
    var cube = new THREE.Mesh(geometry, material);

    return cube;
  }
  getCone(size) {
    var geometry = new THREE.ConeBufferGeometry(size, size + 0.5, 3);
    var material = new THREE.MeshLambertMaterial({
      color: 0x00aeff
      //emissive: 0x004a77
    });
    var cone = new THREE.Mesh(geometry, material);

    return cone;
  }

  getSpotlight(color, intensity) {
    var light = new THREE.SpotLight(color, intensity, 200, 1, 1, 1);
    light.castShadow = true;

    light.shadow.mapSize.x = 4096;
    light.shadow.mapSize.y = 4096;

    return light;
  }

  raycasterTransform(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    const colorP = new THREE.Color("#00aeff");
    const colorG = new THREE.Color("#e3e3e3");

    for (let i = 0; i < intersects.length; i++) {
      this.t1 = new TimelineMax();
      // if (event.type === "mousemove") {
      //   this.t1.to(intersects[i].object.scale, 1, {
      //     x: 2,
      //     y: 2,
      //     z: 2,
      //     ease: Back.easeInOut
      //   });
      //   this.t1.to(intersects[i].object.scale, 1, {
      //     x: 1,
      //     y: 1,
      //     z: 1,
      //     ease: Back.easeInOut,
      //     delay: 1
      //   });
      // } else
      if (event.type === "mousemove") {
        TweenLite.to(intersects[i].object.material.color, 1, {
          r: colorP.r,
          g: colorP.g,
          b: colorP.b
        });

        this.t1.to(intersects[i].object.position, 3, {
          x: intersects[i].object.position.x + Math.random() * 10 - 20,
          ease: Quad.easeInOut
        });

        this.t1.to(intersects[i].object.position, 3, {
          x: Math.random() * 5,
          ease: Quad.easeInOut
        });
        setTimeout(() => {
          TweenLite.to(intersects[i].object.material.color, 1, {
            r: colorG.r,
            g: colorG.g,
            b: colorG.b
          });
        }, 4000);
      } else if (event.type === "click") {
        this.t1.to(intersects[i].object.scale, 1, {
          x: 2,
          y: 2,
          z: 2,
          ease: Back.easeInOut
        });
        this.t1.to(intersects[i].object.scale, 1, {
          x: 1,
          y: 1,
          z: 1,
          ease: Back.easeInOut,
          delay: 2
        });
      }
    }
  }

  rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
    pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

    if (pointIsWorld) {
      obj.parent.localToWorld(obj.position);
    }

    obj.position.sub(point);
    obj.position.applyAxisAngle(axis, theta);
    obj.position.add(point);

    if (pointIsWorld) {
      obj.parent.worldToLocal(obj.position);
    }

    obj.rotateOnAxis(axis, theta);
  }
}

const three = new Three();

three.init();
three.eventListeners();
