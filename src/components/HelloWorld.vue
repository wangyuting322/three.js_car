<script>
import * as THREE from 'three'
const OrbitControls = require('three-orbit-controls')(THREE)
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
export default {
  name: 'HelloWorld',
  data() {
    return {
      color: [
        ['#ffebee', '#c62828', '#ef9a9a', '#e57373', '#f44336',],
        ['#f8bbd0', '#f8bbd0', '#f48fb1', '#c2185b', '#880e4f',],
        ['#bbdefb', '#2196f3', '#1976d2', '#1565c0', '#0d47a1',],
        ['#141414', '#f5f5f5', '#bdbdbd', '#ff7043', '#9e9d24',],
        ['#0097a7', '#ffff00', '#3e2723', '#e8eaf6'],
      ],
      activeBody: "",
      animate: null,
      theModel: null,
      loading: true,
      setting: [
        {
          name: "车把",
          includes: ['cheba'],
          color: ""
        },
        {
          name: "车杆",
          includes: ['chegan', 'cheganwai', 'zuodian'],
          color: ""
        },
        {
          name: "车轮",
          includes: ['chelun', 'houchelun'],
          color: ""
        },
        {
          name: "车板",
          includes: ['cheba', 'qianchejia'],
          color: ""
        }
      ]
    }
  },
  methods: {
    handleActive(item) {
      this.activeBody = item.name
    },
    handleColor(color) {
      let findIndex = this.setting.findIndex(item => item.name === this.activeBody)
      if (findIndex !== -1) {
        this.setting[findIndex].color = color

        this.renderModel(this.setting[findIndex])
        this.animate()
      }
    },
    renderModel(item) {
      item.includes.forEach(id => {
          // 创建模型材质
        let color = new THREE.MeshPhongMaterial({ color: parseInt(item.color.substring(1), 16), shininess: 10 });
        this.initColor(this.theModel, id, color)
      })
    },
    /**
     * 设置模型材质
     * @param {Object} parent 模型实例
     * @param {string} type 模型部位id
     * @param {Object} mtl 模型材质
     */
    initColor(parent, type, mtl) {
      parent.traverse((o) => {
        if (o.isMesh) {
          if (o.name.includes(type)) {
            o.material = mtl;
            o.nameID = type; // Set a new property to identify this object
          }
        }
      });
    }
  },
  mounted() {

    var cameraFar = 5;
    var theModel;
    // 加载模型路径
    const MODEL_PATH = "./index.glb";
    const BACKGROUND_COLOR = 0xf1f1f1;
    // Init the scene 创建场景
    const scene = new THREE.Scene();
    // Set background 设置背景颜色
    scene.background = new THREE.Color(BACKGROUND_COLOR);
    scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

    const canvas = document.querySelector('#c');

    // Init the renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    document.querySelector('.canvas').appendChild(renderer.domElement);

    // Add a camerra 新增镜头
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = cameraFar;
    camera.position.x = 0;

    // Init the object loader 加载GLTF加载器用于处理 gltf与glb文件
    var loader = new GLTFLoader();

    loader.load(MODEL_PATH, (gltf) => {
      this.loading = false
      // themodel为加载的模型实例
      theModel = gltf.scene;
      // Set the models initial scale   
      theModel.scale.set(2, 2, 2);

      // Offset the y position a bit
      theModel.position.y = -1;

      theModel.scale.set(2, 2, 2);

      this.theModel = theModel
      // Add the model to the scene 将模型加载到场景中
      scene.add(theModel);
    }, undefined, function (error) {
      console.log(error, 'error')
    });

    // Add lights 新增灯光
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene 将灯光放入场景中  
    scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    // Add directional Light to scene    
    scene.add(dirLight);
    // Add controls 新增控制器 负责对镜头进行操作控制的
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 1;
    controls.minPolarAngle = -Math.PI / 1;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.1;
    controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    controls.autoRotateSpeed = 0.2; // 30
    //按屏幕刷新率进行更新
    this.animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(this.animate);
      controls.update();
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
    }

    this.animate();
    //动态控制画布内大小,使画布分辨率与屏幕一致
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      var width = window.innerWidth;
      var height = window.innerHeight;
      var canvasPixelWidth = canvas.width / window.devicePixelRatio;
      var canvasPixelHeight = canvas.height / window.devicePixelRatio;

      const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
  },
  render() {
    return <div>
      <div class="loading" v-show={this.loading}>
        <div class="simple-spinner"></div>

      </div>
      <canvas id="c"></canvas>
      <div class="title">堂胜工贸</div>
      <div class="canvas">
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
#c {
  width: 100vw;
  height: 300px;
  border: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.color {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 5px;
}
.color-item {
  width: 60px;
  height: 60px;
  margin: 5px 0;
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
