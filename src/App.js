import React, { Component } from 'react';
import * as THREE from 'three';

import Layout from './components/Layout';

import './App.css';


class App extends Component{

  state = {
    userInput: '',
    userAnswer: '',
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
    this.camera.position.z = 4

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    //ADD CUBE
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: '#433F81' })
    this.cube = new THREE.Mesh(geometry, material)
    // console.log("cube", this.cube)
    // console.log("geometry", geometry)
    this.scene.add(this.cube)


    // ADD starsGeometry

    //This will add a starfield to the background of a scene
    this.starsGeometry = new THREE.Geometry();

    for ( var i = 0; i < 10000; i ++ ) {
    	let star = new THREE.Vector3();
    	star.x = THREE.Math.randFloatSpread( 100 );
    	star.y = THREE.Math.randFloatSpread( 100 );
    	star.z = THREE.Math.randFloatSpread( 100 );
    	this.starsGeometry.vertices.push( star );

    }

    this.starsMaterial = new THREE.PointsMaterial( { color: 0x195910 } );
    this.starField = new THREE.Points( this.starsGeometry, this.starsMaterial );
    this.scene.add( this.starField );



    //ADD LIGHT
    this.light = new THREE.DirectionalLight( 0xffffff, 5.0 );
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
     this.cube.rotation.x += 0.01
     this.cube.rotation.y += 0.01
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






// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }
//
// export default App;
