require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

var imageDatas = require('../data/imageDatas.json');

imageDatas=(function(imageDatasArr){
    for(var i=0,j=imageDatasArr.length;i<j;i++){
        var singleImageData=imageDatasArr[i];
        singleImageData.imageURL=require('../images/'+singleImageData.fileName);
        imageDatasArr[i]=singleImageData;
    }

    return imageDatasArr;
})(imageDatas);


// class AppComponent extends React.Component {
//   render() {
//     return (
//       <div className="index">
//         <img src={yeomanImage} alt="Yeoman Generator" />
//         <div className="notice">Please edit <code>src/components/Main.js</code> ddd to get started!</div>
//       </div>
//     );
//   }
// }

var GalleryByReactApp = React.createClass({
    render: function(){
        return (
            <section className="stage">
                <section className="img-sec"></section>
                <nav className="controller-nav"></nav>
            </section>
        )
    }
})

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
