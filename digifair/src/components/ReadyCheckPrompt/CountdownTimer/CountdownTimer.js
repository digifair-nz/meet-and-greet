import React, { Component } from 'react';
import classes from './CountdownTimer.module.css';

const COUNTDOWN_TIME = 10;

class CountdownTimer extends Component {

    state = {
        seconds: COUNTDOWN_TIME,
        // isPlaying: false
    }


    startTimer = () => {

        const interval = setInterval(() => {

            if (this.state.seconds === 0) {
                clearInterval(interval);
                this.props.onTimerEnd();
            }

            this.setState(prevState => {
                return {
                    seconds: prevState.seconds - 1
                }
            });

        }, 1000);
    };


    componentDidMount(){
        this.startTimer();
    }


    render() {

        const durationStyle = {
            animationDuration: COUNTDOWN_TIME + 's'
        }

        return (
            <div className={classes.Countdown}>
                
                <div className={classes.CountdownNumber} style={durationStyle}>{this.state.seconds}</div>
                <svg>
                    <circle r="36" cx="40" cy="40" style={durationStyle}></circle>
                </svg>

            </div>
        )
    }
}

// const countdownTimer = (props) => {

//     // let countdownNumberEl = document.getElementsByClassName(classes.CountdownNumber);
//     // console.log(countdownTimer);
//     let seconds = COUNTDOWN_TIME;

//     const countdown = () => {
//         // countdownNumberEl.textContent = seconds;


//         setInterval(function () {
//             seconds = --seconds <= 0 ? COUNTDOWN_TIME : seconds;

//             // countdownNumberEl.textContent = seconds;
//         }, 1000);
//     }

//     return (
//         <div className={classes.Countdown}>
//             <div className={classes.CountdownNumber}>{props.count}</div>
//             <svg>
//                 <circle r="18" cx="20" cy="20"></circle>
//             </svg>
//         </div>
//     )
// }


// class CountdownTimer extends Component {


//   constructor(props) {
//     super(props);

//     this.milliseconds = this.props.seconds * 1000;
//     this.radius = this.props.size / 2;
//     this.circumference = this.props.size * Math.PI;

//     this.state = {
//       countdown: this.milliseconds,
//       isPlaying: false,
//     };

//     this.strokeDashoffset = () =>
//       this.circumference -
//       (this.state.countdown / this.milliseconds) * this.circumference;
//   }

//   startTimer = () => {
//     this.setState({ isPlaying: true });

//     const interval = setInterval(() => {
//       this.setState({ countdown: this.state.countdown - 10 });

//       if (this.state.countdown === 0) {
//         clearInterval(interval);
//         this.setState({
//           countdown: this.milliseconds,
//           isPlaying: false,
//         });
//       }
//     }, 10);
//   };

//   render() {
//     // const countdownSizeStyles = {
//     //   height: this.props.size,
//     //   width: this.props.size,
//     // };

//     // const textStyles = {
//     //   color: this.props.strokeColor,
//     //   fontSize: this.props.size * 0.3,
//     // };

//     const seconds = (this.state.countdown / 1000).toFixed();

//     return (
//       <div>
//         <div
//           style={{
//             pointerEvents: this.state.isPlaying ? "none" : "all",
//             opacity: this.state.isPlaying ? 0.4 : 1,
//           }}
//         >
//           {/* <button
//             style={styles.button}
//             onClick={!this.state.isPlaying ? this.startTimer : () => {}}
//           >
//             START
//           </button> */}
//         </div>
//         <div
//           className={classes.countdownContainer}
//         >
//           <p>{seconds}s</p>
//           <svg>
//             <circle
//               cx={this.radius}
//               cy={this.radius}
//               r={this.radius}
//               fill="none"
//               stroke={this.props.strokeBgColor}
//               strokeWidth={this.props.strokeWidth}
//             ></circle>
//           </svg>
//           <svg>
//             <circle
//               strokeDasharray={this.circumference}
//               strokeDashoffset={
//                 this.state.isPlaying ? this.strokeDashoffset() : 0
//               }
//               r={this.radius}
//               cx={this.radius}
//               cy={this.radius}
//               fill="none"
//               strokeLinecap="round"
//               stroke={this.props.strokeColor}
//               strokeWidth={this.props.strokeWidth}
//             ></circle>
//           </svg>
//         </div>
//       </div>
//     );
//   }
// }

export default CountdownTimer;