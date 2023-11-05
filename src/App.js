import Navigation from './components/Navigation';
import Signin from './components/SignIn/Signin';
import './App.css';
import React, { Component } from 'react';
import Logo from './components/Logo'
import ImageLinkForm from './components/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticleBg from './components/ParticlesBg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Register from './components/Register/Register';



// CLARIFAI MOVED TO BACKEND FOR SECURITY

//const returnClarifaiJSON = (imageUrl) => {
// Your PAT (Personal Access Token) can be found in the portal under Authentification
// const PAT = '01f4b9972e444a0e93872e7854f2ce56';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
//const USER_ID = '86ri3q97plqx';
// const APP_ID = 'first-test';
// Change these to whatever model and image URL you want to use

// const MODEL_ID = 'face-detection';
// const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
//const IMAGE_URL = imageUrl;

//const raw = JSON.stringify({
// "user_app_id": {
//  "user_id": USER_ID,
// "app_id": APP_ID
// },
// "inputs": [
// {
// "data": {
// "image": {
//  "url": IMAGE_URL
// }
// }
// }
// ]
// });
// const requestOptions = {
// method: 'POST',
//  headers: {
// 'Accept': 'application/json',
// 'Authorization': 'Key ' + PAT
//  },
// body: raw
// }
//return requestOptions
//  }


// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id

const initialState = {
  input: '',
  imageUrl: '',
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }


  // NOT currently working with Clarai

  /* calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
 
    if (!clarifaiFace || !width || !height) {
      throw new Error('Invalid input data or missing dimensions.');
    }
 
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
 
    }
  }
  */

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    // Moved To Backend
    //fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiJSON(this.state.input))
    fetch('http://localhost:3000/imageUrl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(
                Object.assign(this.state.user, { entries: count })
              )
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    const { isSignedIn, imageUrl, route } = this.state;
    return (
      <div className="App">
        <ParticleBg />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit} />
            <FaceRecognition imageUrl={imageUrl} />
          </div>
          : (
            route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    )
  }
};


export default App;
