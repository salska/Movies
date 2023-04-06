import React, { Component } from "react";
import './MovieList.css'

var xhr;
class GetActors extends Component {

	constructor(props) {
		super(props);
		this.state = {
			actors: []
		}
		this.sendRequest = this.sendRequest.bind(this);
		this.processRequest = this.processRequest.bind(this);
	}

	componentDidMount() {
		this.sendRequest()
	}

	sendRequest() {
		const str = window.location.pathname.split("/")
		var _url = "/actors"
		if (str[1].length>0) {
			_url = "/actors/" + str[2]
		}
		xhr = new XMLHttpRequest();
		xhr.open("GET", _url)
		xhr.send();
		xhr.addEventListener("readystatechange", this.processRequest, false);
	}

	processRequest() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			console.log(xhr.responseText)
			var response = JSON.parse(xhr.responseText);
			this.setState({
				actors: response
			})
		}
	}

	toActor(m) {
		return (<a><n className={"actors"}>{m.name}; </n></a>)
	}

	render() {
		return (
			<body>
			<br/>
			<p className={"movie-title-element"}>Actors</p>
			{this.state.actors.map(this.toActor)}
			</body>
		)
	}

}

export default GetActors;