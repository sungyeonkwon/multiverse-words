import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'
import Layout from './components/Layout';
import './App.css';


// global variables
const skyboxPath = process.env.PUBLIC_URL + '/skybox/';

const testData = {
  a: {
    a: 'c',
    b: 'f',
    c: 'd'
  },
  b: {
    a: 'c',
    b: 'f',
    c: 'd'
  },
  c: {
    a: 'c',
    b: 'f',
    c: {
      a: 'c',
      b: 'f',
      c: 'd'
    }
  },
  d: {
    e: 'f'
  },
  f: {
    a: 'c',
    b: 'f',
  }
}

class App extends Component{

  state = {
    userInput: '',
    userAnswer: '',
    letterSeq: [],
    wordObj: testData,
  }

  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    //ADD SCENE
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('lightblue')

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 10

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    //ADD controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    //ADD SKYBOX
    var skyGeom = new THREE.CubeGeometry( 1000, 1000, 1000 );
    var skyMaterials =
    [
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( `${skyboxPath}city_ft.png` ), side: THREE.DoubleSide } ), // Right side
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( `${skyboxPath}city_bk.png` ), side: THREE.DoubleSide } ), // Left side
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( `${skyboxPath}city_up.png` ), side: THREE.DoubleSide } ), // Top side
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( `${skyboxPath}city_dn.png` ), side: THREE.DoubleSide } ), // Bottom side
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( `${skyboxPath}city_rt.png` ), side: THREE.DoubleSide } ), // Front side
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader( ).load( `${skyboxPath}city_lf.png` ), side: THREE.DoubleSide } ) // Back side
    ];
    // Create a MeshFaceMaterial, which allows the cube to have different materials on each face
    var skyMat = new THREE.MeshFaceMaterial( skyMaterials );
    var sky = new THREE.Mesh( skyGeom, skyMat );
    this.scene.add( sky );

    //ADD CUBE
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: '#433F81' })
    for (let i = 0; i < 10 ; i++){
      let cube = 'cube' + i
      this[cube] = new THREE.Mesh(geometry, material)
      this[cube].position.set(
        THREE.Math.randInt( -5, 5),
        THREE.Math.randInt( -5, 5),
        THREE.Math.randInt( -5, 5)
      )
      this.scene.add(this[cube])
    }

    // add star
    let radius = 2;
    let widthSegments =1;
    let heightSegments = 1;
    var geom= new THREE.SphereGeometry( radius, widthSegments, heightSegments );
    var mat = new THREE.MeshStandardMaterial( {color: 0xff0000} );
    this.sphere = new THREE.Mesh( geom, mat );
    this.edges = new THREE.EdgesGeometry( geom );
    this.line = new THREE.LineSegments( this.edges, new THREE.LineBasicMaterial( { color: 0x0000ff } ) );
    this.scene.add( this.sphere );
    this.scene.add( this.line );
    console.log(this.sphere)

    //ADD LIGHT
    this.light = new THREE.AmbientLight( 0xffffff, 5.0 );
    this.light.position.set( 10, 10, 10 ); // move the light back and up a bit
    this.scene.add( this.light );

    this.start()
  }

  componentWillUnmount(){
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
    }

  start = () => {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.animate)
      }
    }

  stop = () => {
      cancelAnimationFrame(this.frameId)
    }

  animate = () => {

    // for (let i = 0; i < 10 ; i++){
    //   let cube = 'cube' + i
    //   this[cube].rotation.x += 0.01
    //   this[cube].rotation.y += 0.01
    // }
    //
    // this.sphere.position.x += 0.01
    // this.line.position.x += 0.01

     this.renderScene()
     this.frameId = window.requestAnimationFrame(this.animate)
   }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  inputChangedHandler = (event) => {
    this.setState({userInput: event.target.value})
  }

  keyPressedHandler = (event) => {
    let key = event.keyCode || event.which;

    // if key is a letter... fire another function which handles the input
    if ((key >= 97 && key <= 122) || (key >= 65 && key <= 90)){
      this.dicFinder(key)
    } else {
      console.log("TO DO: implement error message")
    }

    if (key === 13){
      let userAnswer = event.target.value.toLowerCase();
      this.setState({
        userAnswer:userAnswer,
        userInput:''
      }, function(){
        console.log("entered useranswer", this.state.userAnswer)
      })
    }
  }

  dicFinder = (keycode) => {
    let letter = String.fromCharCode(keycode)

    if (this.state.wordObj[letter]){
      this.setState({
        letterSeq: [...this.state.letterSeq, letter],
        wordObj: this.state.wordObj[letter],
      }, function(){
        console.log("[dicFinder] wordObj is: ", this.state.wordObj)
      })
    } else {
      console.log("TODO: [dicFinder] there is no word further")
    }
  }

  render(){
    return(
      <div className="App">
        <Layout>
        <div
          className="universe"
          ref={(mount) => { this.mount = mount }}
        />
        <input
          type="text"
          onChange={this.inputChangedHandler}
          onKeyPress={this.keyPressedHandler}
          value={this.state.userInput}
          autoFocus="autofocus" />
        </Layout>
      </div>
    )
    }
}

export default App
