import React, { Component } from "react";
import './MovieList.css'

var xhr;
class GetAwards extends Component {

	constructor(props) {
		super(props);
		this.state = {
			awards: []
		}
		this.sendRequest = this.sendRequest.bind(this);
		this.processRequest = this.processRequest.bind(this);
	}

	componentDidMount() {
		this.sendRequest()
	}

	sendRequest() {
		const str = window.location.pathname.split("/")
		var _url = "/awards"
		if (str[1].length>0) {
			_url = "/awards/" + str[2]
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
				awards: response
			})
		}
	}

	toAward(m) {
		return (<p><n className={"award"}>{m.award}:</n> {m.category}</p>)
	}

	render() {
		return (
			<body>
			<br/>
			<p className={"movie-title-element"}>Awards</p>
			{this.state.awards.map(this.toAward)}
			</body>
		)
	}

}

export default GetAwards;