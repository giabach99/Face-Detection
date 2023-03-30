import './App.css';
import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceDetection from './components/FaceDetection/FaceDetection';
import ParticlesBg from 'particles-bg'
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const initialState = {
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

class App extends React.Component { 
    constructor() {
        super();
        this.state = initialState;
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
        fetch('https://mybackend-phxv.onrender.com/imageUrl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response) {
                fetch('https://mybackend-phxv.onrender.com/image', {
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
                .catch(console.log)
            }
            this.setFaceBox(this.findFaceLocation(response))
        })
        .catch(err => console.log(err))
    }

    onRouteChange = (route) => {
        if (route === 'signout')
            this.setState(initialState);
        else if (route === 'home')
            this.setState({isSignedin: true}); 
        this.setState({route: route});
    }

    render(){        
        return (
            <div className="App">
                <ParticlesBg type="circle" bg={true} />
                <Navigation isSignedin={this.state.isSignedin} onRouteChange={this.onRouteChange} />
                { this.state.route === 'home' 
                ? <div>
                    <Logo />
                    <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                    <FaceDetection imageUrl={this.state.imageUrl} box={this.state.box}/>
                </div>
                : 
                    this.state.route === 'signout'
                    ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                
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
