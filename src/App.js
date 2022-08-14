import './App.css';
import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceDetection from './components/FaceDetection/FaceDetection';
import ParticlesComp from './components/ParticlesComp/ParticlesComp';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: '4373bc2f4120435ea075b849b8490186'
});

class App extends React.Component { 
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: ''
        }
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {        
        this.setState({imageUrl: this.state.input})
        app.models
        .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then(
            function(response){
                console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
            },
            function(err){

            }
        );
    }

    render(){
    return (
        <div className="App">
            <ParticlesComp/>
            <Navigation />
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceDetection imageUrl={this.state.imageUrl}/>
        </div>
    );
    }
}

export default App;
