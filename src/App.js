import "./App.css";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import Nav from "./components/Navigation/Nav.js";
import Logo from "./components/logo/Logo.js";
import ImageForm from "./components/LinkForm/ImageForm";
import FaceRec from "./components/faceRec/FaceRec";
import Rank from "./components/Rank/Rank";
import Signin from "./components/signin/Signin.js";
import Register from "./components/register/Register.js";
import "tachyons";
import { Component } from "react";

const app = new Clarifai.App({
  apiKey: "ea7bc6ffae2844ae858bb38cf74fa936",
});

const particlesOption = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5,
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
    };
  }
  calculateFaceLocation = (data) => {
    const clarifaiData =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiData.left_col * width,
      topRow: clarifaiData.top_row * height,
      rightCol: width - clarifaiData.right_col * width,
      bottomRow: height - clarifaiData.bottom_row * height,
    };
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOption} />
        <Nav
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <FaceRec box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
        ) : this.state.route === "signin" ? (
          <Signin onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
