import React from "react";
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div>
            <p className="f3">
                {'Let\'s try detecting faces from your picture!'}
            </p>
            <div className="center">
                <div className=" form pa4 br3 shadow-5 center">
                    <input className='f4 center pa2 w-70' type='text' onChange={onInputChange}/>
                    <button className="grow f4 link ph3 pv2 w-30 white dib bg-light-purple" onClick={onButtonSubmit}>
                        Detect
                    </button>
                </div>
                
            </div>            
            
        </div>

    )
}

export default ImageLinkForm;