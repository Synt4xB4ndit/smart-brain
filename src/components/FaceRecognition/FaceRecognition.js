import React from 'react';

const FaceRecognition = ({ imageUrl, box }) => {
    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img alt="" src={imageUrl} id="inputimage" width='500px' height='auto' />
            </div>
        </div>
    )
}

export default FaceRecognition

