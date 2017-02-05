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

function getRangeRandom(low, high){
    return Math.floor(Math.random() * (high - low) + low);
}

//获取0-30°之间的一个任意正负值
function get30DegRandom(){
  return ((Math.random() > 0.5? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
  //点击处理函数
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }


  render(){
      var styleObj = {};

      if(this.props.arrange.pos){
        styleObj = this.props.arrange.pos;
      }

      if(this.props.arrange.rotate){
        ['Moz', 'ms', 'Webkit', ''].forEach(function(value){
          styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate +'deg)';
        }.bind(this));
      }

      if(this.props.arrange.isCenter){
        styleObj['zIndex'] = 11;
      }

      var imgFigureClassName = 'img-figure';
      imgFigureClassName += this.props.arrange.isInverse? ' is-inverse' : '';

      return (
          <figure className={imgFigureClassName} style={styleObj} ref='figure' onClick={this.handleClick.bind(this)}>
              <img src={this.props.data.imageURL} alt={this.props.data.title}/>
              <figcaption>
                  <h2 className="img-title">{this.props.data.title}</h2>
                  <div className="img-back" onClick={this.handleClick.bind(this)}>
                    <p>{this.props.data.desc}</p>
                  </div>
              </figcaption>
          </figure>
      )
  }
}

class GalleryByReactApp extends React.Component {
    constructor(props){
      super(props);

      this.state = {
        imgsArrangeArr: [
          // {
          //   pos: {
          //     left: 0,
          //     right: 0
          //   },
          //   rotate: 0,
          //   isInverse: false,  
          //   isCenter: false
          // },
        ]
      };

      this.Constant = {
          centerPos: {
              left:0,
              top: 0
          },
          hPosRange: {
              leftSecX: [0, 0],
              rightSecX: [0, 0],
              y: [0, 0]
          },
          vPosRange: {
              x: [0, 0],
              topY: [0, 0]
          }
      }
    }

    /* 
     * 反转图片
     * @param index 输入当前被执行inverse操作的图片对应的index值
     * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
     */
     inverse(index){
      return function(){
        var imgsArrangeArr = this.state.imgsArrangeArr;
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
      }.bind(this);
     }


    //重新布局所有图片
    rearrange(centerIndex){
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,
            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //居中
        imgsArrangeCenterArr[0]={
          pos: centerPos,
          rotate: 0,
          isCenter: true
        }

        //取出上部分
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        imgsArrangeTopArr.forEach(function(value, index){
            imgsArrangeTopArr[index] = {
              pos: {
                  top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                  left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              },
              rotate: get30DegRandom(),
              isCenter: false
            }
        });

        //左右图片
        for(var i = 0, j=imgsArrangeArr.length, k = j / 2; i < j; i++){
            var hPosRangeLORX = null;

            if(i < k){
                hPosRangeLORX = hPosRangeLeftSecX;
            }else{
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
              pos: {
                  top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                  left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
              },
              rotate: get30DegRandom(),
              isCenter: false
            }
        }

        //把图片放回
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }

    //居中对应index
    center(index){
      return function(){
        this.rearrange(index);
      }.bind(this);
    }


    //组件加载以后，为每张图片计算其位置的范围
    componentDidMount(){
        var stageDOM = this.refs.stage,
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.floor(stageW / 2),
            halfStageH = Math.floor(stageH / 2);

        var imgFigureDOM = this.refs.imgFigure0.refs.figure,
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.floor(imgW / 2),
            halfImgH = Math.floor(imgH / 2);

        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        this.Constant.hPosRange = {
            leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
            rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
            y: [-halfImgH, stageH - halfImgH]
        }

        this.Constant.vPosRange = {
            x: [halfStageW - imgW, halfStageW],
            topY: [-halfImgH, halfStageH - halfImgH * 3]
        }

        this.rearrange(0);

    }

    render(){
        var controllerUnits=[],
            imgFigures=[];

        imageDatas.forEach(function(value, index){
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}/>)
        }.bind(this));

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">{imgFigures}</section>
                <nav className="controller-nav"></nav>
            </section>
        )
    }
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;
