import React, { Component } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

class SendSomething extends Component {
  constructor(props) {
    super(props);

    this.onDrop = files => {
      this.setState({ files });
    };

    this.state = {
      files: [],
      email: ""
    };
  }

  onChangeHandler = e => {
    this.setState({ email: e.target.value });
  };

  onClickHandler = () => {
    const data = new FormData();

    data.append("emailaddress", this.state.email);
    this.state.files.forEach(file => {
      data.append("myimages", file, file.name);
    });

    axios.post("/api/endpoint", data, {}).then(res => {
      alert(res.data.message);

      this.setState({
        email: "",
        files: []
      });
    });
  };

  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email</label>
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.onChangeHandler}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter email"
            />
          </div>

          <div>
            <Dropzone
              onDrop={this.onDrop}
              accept="image/png, image/gif, image/jpeg"
              minSize={0}
              maxSize={5242880}
              multiple
            >
              {({ getRootProps, getInputProps }) => (
                <section className="container">
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <p>Click here or drop a file to upload!</p>
                  </div>
                  <aside>
                    <ul>{files}</ul>
                  </aside>
                </section>
              )}
            </Dropzone>
          </div>

          <button
            type="button"
            onClick={this.onClickHandler}
            className="btn btn-primary"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default SendSomething;
