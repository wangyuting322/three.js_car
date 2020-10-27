<script>
import * as THREE from 'three'
const OrbitControls = require('three-orbit-controls')(THREE)
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default {
  name: 'HelloWorld',
  data() {
    return {
      activeBody: "",
      container: null,//画布容器
      scene: null,//场景
      theModel1: null,//网格模型
      camera: null,//相机
      renderer: null,//渲染器
      controls: null,//控制器
      loading: true,//场景渲染结束标志
      setting: [
        {
          name: "车把",
          includes: ['cheba', "chedeng-zhou", "????2?????????8X40"],
          color: "",
          light: '',
          vein: '',
        },
        {
          name: "车杆",
          includes: ['chegan', 'cheganwai', 'G013-20200425sldasm-Part-16-3'],
          color: "",
          light: '',
          vein: '',
        },
        {
          name: "车轮",
          includes: ['chelun', 'houchelun'],
          color: "",
          light: '',
          vein: '',
        },
        {
          name: "车板",
          includes: ['chejia', 'qianchejia', 'zuodian', "G013-20200425sldasm-Part-7-3", 'jiaoban'],
          color: "",
          light: '',
          vein: '',
        }
      ],
      color: [
        ['#ffebee', '#c62828', '#ef9a9a', '#e57373', '#f44336',],
        ['#f8bbd0', '#f8bbd0', '#f48fb1', '#c2185b', '#880e4f',],
        ['#bbdefb', '#2196f3', '#1976d2', '#1565c0', '#0d47a1',],
        ['#141414', '#f5f5f5', '#bdbdbd', '#ff7043', '#9e9d24',],
        ['#0097a7', '#ffff00', '#3e2723', '#e8eaf6'],
      ],
      vein: [
        {
          domProps: {
            src: require('../assets/logo.png'),
            title: 'logo'
          }
        },
        {
          domProps: {
            src: require('../assets/back.jpg'),
            title: 'back'
          }
        },
        {
          domProps: {
            src: require('../assets/back2.jpg'),
            title: 'back'
          }
        },
        {
          domProps: {
            src: require('../assets/back3.jpg'),
            title: 'back'
          }
        },
        {
          domProps: {
            src: require('../assets/back4.jpg'),
            title: 'back'
          }
        },
      ],
      veinCanvas: null,
      stopR: false,//停止动画旋转
      texture: null,
    }
  },
  methods: {
    /**
     * 创建场景
     */
    createScene() {
      const BACKGROUND_COLOR = 0xf1f1f1;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(BACKGROUND_COLOR);//设置背景颜色
      this.scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);
    },
    /**
     * 创建网格模型
     */
    createMesh() {
      // 加载模型路径
      const MODEL_PATH = "./index.glb";
      // Init the object loader 加载GLTF加载器用于处理 gltf与glb文件
      var loader = new GLTFLoader();
      loader.load(MODEL_PATH, (gltf) => {
        this.loading = false
        // themodel为加载的模型实例
        this.theModel1 = gltf.scene;
        this.theModel1.position.set(0, -0.5, 0);
        // Add the model to the scene 将模型加载到场景中
        this.scene.add(this.theModel1);
      }, undefined, function (error) {
        console.log(error, 'error')
      });
    },
    /**
     * 创建场景灯光
     */
    createLight() {
      // 聚光源
      var direction = new THREE.DirectionalLight(0xffffff, 0.54);
      direction.position.set(-8, 12, 8); //点光源位置
      direction.castShadow = true;
      direction.shadow.mapSize = new THREE.Vector2(1024, 1024);
      this.scene.add(direction); //点光源添加到场景中

      // 底部点光源
      var pointBottom = new THREE.PointLight(0xffffff, 0.54);
      pointBottom.position.set(400, -400, 300); //点光源位置
      this.scene.add(pointBottom); //点光源添加到场景中

      // 环境光
      //   var ambient = new THREE.AmbientLight(parseInt('#919191'.substring(1), 16));
      //   this.scene.add(ambient);

      var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
      hemiLight.position.set(0, 50, 0);
      // Add hemisphere light to scene   
      this.scene.add(hemiLight);
    },
    /**
     * 创建相机
     */
    createCamera() {
      //   var width = window.innerWidth; //窗口宽度
      //   var height = window.innerHeight; //窗口高度
      var width = this.container.clientWidth; //窗口宽度
      var height = this.container.clientHeight; //窗口高度
      var k = width / height; //窗口宽高比
      //   var s = 3; //三维场景显示范围控制系数，系数越大，显示的范围越大

      //   this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 100);//创建一个正投影相机
      //   this.camera.position.set(0, 0, -10); //设置相机位置
      //   this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)

      this.camera = new THREE.PerspectiveCamera(45, k, 0.1, 100);
      this.camera.position.set(0, 0, 3); //设置相机位置
    },
    /**
     * 创建渲染器
     */
    createRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      var width = this.container.clientWidth;
      var height = this.container.clientHeight;
      this.renderer.setSize(width, height, false);//画布与画布容器同大
      this.container.appendChild(this.renderer.domElement);
    },
    /**
    * 创建控制器
    */
    createControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      //   this.controls.enableKeys=true
      //   this.controls.enablePan=false
      //   controls.keys = {
      //     LEFT: 39, //left arrow
      //     UP: 40, // up arrow
      //     RIGHT: 37, // right arrow
      //     BOTTOM: 38 // down arrow
      //   }
      //   console.log(this.controls.mouseButtons);
      //   console.log(this.controls.touches);
      //   console.log(THREE.TOUCH);
      // this.controls.mouseButtons = {
      //   LEFT: THREE.MOUSE.ROTATE,
      //   MIDDLE: THREE.MOUSE.DOLLY,
      //   RIGHT: THREE.MOUSE.PAN
      // }
      //   this.controls.touches = {
      //     ONE: THREE.TOUCH.ROTATE,
      //     TWO: THREE.TOUCH.ROTATE,
      //   }
    },
    /**
     * 渲染器渲染
     */
    animate() {
      this.renderer.render(this.scene, this.camera);
      if (!this.stopR) {
        this.theModel1.rotateY(0.01)
      }
      //   if (this.texture) {
      //     this.texture.offset.x -= 0.06
      //     this.texture.offset.y -= 0.06
      //   }
      requestAnimationFrame(this.animate);
      this.controls.update();//配合控制器属性使用
    },
    /**
    * 创建高光材质
    */
    createMaterial(light, color, vein) {
      let material = null;
      material = new THREE.MeshPhongMaterial({
        color: (!vein) ? parseInt(color.substring(1), 16) : null,// 颜色转16进制
        specular: (light === 'light' & !vein) ? 0x4488ee : null,//高光部分颜色
        shininess: 10,//反光度
        map: vein ? vein : null,
      });
      return material
    },
    /**
    * 选中部位
    */
    handleActive(item) {
      this.activeBody = item.name
    },
    /**
    * 选中高亮
    */
    handleHeightLight(light) {
      let findIndex = this.setting.findIndex(item => item.name === this.activeBody)
      if (findIndex !== -1) {
        this.setting[findIndex].light = light
      }
    },
    /**
     * 选中颜色
     */
    handleColor(color) {
      let findIndex = this.setting.findIndex(item => item.name === this.activeBody)
      if (findIndex !== -1) {
        this.setting[findIndex].color = color
        // 选中颜色后改变材质
        this.renderMaterial(this.setting[findIndex])
      }
    },
    /**
     * 选中纹理
     */
    handleVein(vein) {
      let findIndex = this.setting.findIndex(item => item.name === this.activeBody)
      if (findIndex !== -1) {
        this.setting[findIndex].vein = vein
        // 选中颜色后改变材质
        this.renderMaterial(this.setting[findIndex])
      }
    },
    /**
     * 改变材质
     */
    renderMaterial(item) {
      let material = null;
      //   有纹理
      if (item.vein) {
        {/**方法三 */ }
        // this.veinCanvas = document.querySelector(".veinCanvas");
        // var c = this.veinCanvas.getContext('2d');
        // var myImage = new Image();
        // myImage.src = item.vein.domProps.src;
        // myImage.onload = () => {
        //   c.clearRect(0, 0, 5, 5);
        //   c.drawImage(myImage, 0, 0, 5, 5)
        //   var texture = new THREE.CanvasTexture(this.veinCanvas);
        //   // 设置阵列
        //   texture.wrapS = THREE.RepeatWrapping;
        //   texture.wrapT = THREE.RepeatWrapping;
        //   // 设置纹理的旋转中心，默认(0,0)
        //   texture.center.set(0.5, 0.5);
        //   // 两个方向纹理重复数量
        //   texture.repeat.set(100, 100);
        //   material = this.createMaterial(null, null, texture)
        //   item.includes.forEach(type => {
        //     this.initMaterial(this.theModel1, type, material)
        //   })
        // }

        {/**方法四 */ }
        // let txt = new THREE.TextureLoader().load(item.vein.domProps.src);
        // txt.wrapS = THREE.RepeatWrapping;
        // txt.wrapT = THREE.RepeatWrapping;
        // txt.repeat.set(100, 100);
        // material = this.createMaterial(null, null, txt);
        // item.includes.forEach(type => {
        //   this.initMaterial(this.theModel1, type, material)
        // })

        {/** 方法一 */ }
        // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
        var textureLoader = new THREE.TextureLoader();
        // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
        textureLoader.load(item.vein.domProps.src, (texture2) => {
          this.texture = texture2;
          // 设置阵列模式   默认ClampToEdgeWrapping  RepeatWrapping：阵列  镜像阵列：MirroredRepeatWrapping
          this.texture.wrapS = THREE.RepeatWrapping;
          this.texture.wrapT = THREE.RepeatWrapping;
          // uv两个方向纹理重复数量
          this.texture.repeat.set(4, 2);
          // 偏移效果
          //   this.texture.offset = new THREE.Vector2(0.5, 0.5)
          // 设置纹理旋转角度
          //   this.texture.rotation = Math.PI / 4;
          // 设置纹理的旋转中心，默认(0,0)
          //   this.texture.center.set(0.5, 0.5);
          material = this.createMaterial(null, null, this.texture);
          item.includes.forEach(type => {
            this.initMaterial(this.theModel1, type, material);
          })
        })

        {/** 方法二 */ }
        // 图片加载器
        // var ImageLoader = new THREE.ImageLoader();
        // // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
        // ImageLoader.load(item.vein.domProps.src, (img) => {
        //   // image对象作为参数，创建一个纹理对象Texture
        //   var texture = new THREE.Texture(img);
        //   // 下次使用纹理时触发更新
        //   texture.needsUpdate = true;
        //   texture.repeat.set(5, 5, 5);
        //   material = this.createMaterial(null, null, texture);
        //   item.includes.forEach(type => {
        //     this.initMaterial(this.theModel1, type, material);
        //   })
        // });

        // 重新进行选择填充
        item.vein = ''
      } else {
        //普通高光材质
        material = this.createMaterial(item.light, item.color);
        item.includes.forEach(type => {
          this.initMaterial(this.theModel1, type, material)
        })
      }
    },
    /**
     * 设置模型材质
     * @param {Object} parent 模型实例
     * @param {string} type 模型部位id
     * @param {Object} mtl 模型材质
     */
    initMaterial(parent, type, material) {
      parent.traverse((o) => {
        if (o.isMesh) {
          if (o.name.includes(type)) {
            o.material = material;
            o.nameID = type; // Set a new property to identify this object
          }
        }
      });
    },
    /**
     * 高光及暗沉预览切换
     */
    handlePreviews(light) {
      let material = null;
      this.setting.forEach(item => {
        item.includes.forEach(id => {
          material = this.createMaterial(light, '#344874');
          this.initMaterial(this.theModel1, id, material)
        })
      })
    },
  },
  mounted() {

    // 创建场景
    this.createScene();

    // 创建画布容器
    this.container = document.querySelector('.canvas');

    // 创建网格模型
    this.createMesh()

    // 创建相机
    this.createCamera()

    // 辅助坐标轴
    let axisHelper = new THREE.AxisHelper(250);
    this.scene.add(axisHelper);

    // 新增光源
    this.createLight();

    // 创建渲染器
    this.createRenderer()

    // 创建控制器 负责对镜头进行操作控制的
    this.createControls()

  },
  watch: {
    loading: {
      handler(newV) {
        if (!newV) {
          this.animate()
        }
      }
    }
  },
  render() {
    return <div>
      <div class="loading" v-show={this.loading}>
        <div class="simple-spinner"></div>
      </div>
      <div class="title">堂胜工贸</div>
      <div class="canvas">
      </div>
      <div>
        预览控制：
      <button class='float' onClick={() => { this.handlePreviews('light') }}>高光</button>
        <button class='float' onClick={() => { this.handlePreviews('dark') }}>暗沉</button>
        <button class='float' onClick={() => { this.stopR = !this.stopR }}>停止/旋转</button>
        <button onClick={() => { this.controls.reset(); this.theModel1.position.set(0, -0.5, 0); }}>重置位置</button>
        {/**
        
        <button onClick={() => { this.theModel1.translateY(0.1) }}>上移</button>
        <button onClick={() => { this.theModel1.translateY(-0.1) }}>下移</button>
        <button onClick={() => { this.theModel1.translateX(0.1) }}>左移</button>
        <button onClick={() => { this.theModel1.translateX(-0.1) }}>右移</button>
        
        */}
        <div>
          <canvas class='veinCanvas' width="5" height="5"></canvas>
        </div>
      </div>
      <div class="sub-title">选择着色部位:</div>
      <div class="header">
        {this.setting.map(item => {
          return <div class={`header-item ${item.name === this.activeBody ? 'active' : ''}`} onClick={() => {
            this.handleActive(item)
          }}>
            {item.name}
          </div>
        })}
      </div>
      <div class="sub-title">是否高亮:</div>
      <div class="highlight ">
        <label><input type="radio" name="highlight " value='light'
          onClick={() => { this.handleHeightLight('light') }}
        />
        高光</label>
        <label><input type="radio" name="highlight " value='dark'
          onClick={() => { this.handleHeightLight('dark') }}
          checked={true}
        />
         暗沉</label>
      </div>
      <div class="sub-title">选择颜色:</div>
      <div class="color">
        {
          this.color.map(item => {
            return item.map(c => {
              return <div class="color-item" style={`background-color:${c}`} onClick={() => { this.handleColor(c) }}></div>
            })
          })
        }
      </div>
      <div class="sub-title">选择纹理:</div>
      <div class="vein">
        {
          this.vein.map(item => {
            return <div class="vein-item" onClick={() => { this.handleVein(item) }} >
              <img class="vein-item-img" {...item} />
            </div>
          })
        }
      </div>

    </div>
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000000;
}
.simple-spinner {
  height: 48px;
  width: 48px;
  border: 5px solid rgba(150, 150, 150, 0.2);
  border-radius: 50%;
  border-top-color: rgb(150, 150, 150);
  animation: rotate 1s 0s infinite ease-in-out alternate;
}
.canvas {
  height: 50vh;
  width: 50vw;
  margin: auto;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.title {
  width: 100%;
  text-align: center;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: 500;
  background-color: #1890ff;
  color: white;
}
.sub-title {
  width: 100%;
  padding: 5px;
  font-size: 16px;
}
.color,
.vein {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 5px;
}
.color-item,
.vein-item {
  width: 60px;
  height: 60px;
  margin: 5px 0;
}
.vein-item-img {
  width: 60px;
  height: 60px;
  object-fit: content;
}
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}
.header-item {
  width: 80px;
  display: flex;
  height: 40px;
  align-items: center;
  border-radius: 5px;
  background-color: #13c2c2;
  justify-content: center;
  color: white;
}
.active {
  border: 2px solid #eb2f96;
}
</style>
