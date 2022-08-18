import './App.css';
import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceDetection from './components/FaceDetection/FaceDetection';
import ParticlesComp from './components/ParticlesComp/ParticlesComp';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Clarifai, { FACE_DETECT_MODEL } from 'clarifai';

const app = new Clarifai.App({
    apiKey: '4373bc2f4120435ea075b849b8490186'
});

class App extends React.Component { 
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedin: false,
            user: {
                id: '',
                name: '',
                email: '',                
                entries: 0,
                joined: ''
            }
        }
    }

    loadUser = (data) => {
        this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,                
            entries: data.entries,
            joined: data.joined
        }})
    }
   
    findFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }
    
    setFaceBox = (box) => {
        this.setState({box: box});
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {               
        this.setState({imageUrl: this.state.input})
        app.models
        .predict(FACE_DETECT_MODEL, this.state.input)
        .then(response => {
            if (response) {
                fetch('http://localhost:3000/image', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: this.state.user.id
                    })
                })
                .then(response => response.json())
                .then(count => {
                     this.setState(Object.assign(this.state.user, {entries: count}));                    
                })
            }
            this.setFaceBox(this.findFaceLocation(response))
        })
        .catch(err => console.log(err))
    }

    onRouteChange = (route) => {
        if (route === 'signout')
            this.setState({isSignedin: false});
        else if (route === 'home')
            this.setState({isSignedin: true}); 
        this.setState({route: route});
    }

    render(){
        return (
            <div className="App">
                <ParticlesComp/>
                <Navigation isSignedin={this.state.isSignedin} onRouteChange={this.onRouteChange} />
                { this.state.route === 'home' 
                ? <div>
                    <Logo />
                    <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                    <FaceDetection imageUrl={this.state.imageUrl} box={this.state.box}/>
                </div>
                : (
                    this.state.route === 'signin'
                    ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                )
                }
            </div>
        );
    }
}

export default App;
