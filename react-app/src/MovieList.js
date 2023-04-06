import React, { Component } from "react";
import './MovieList.css'

var xhr;

class MovieList extends Component {
	constructor(props) {
		super(props);
		this.toMovie = this.toMovie.bind(this);
		this.state = {
			movies: [],
			searchTerm: ''
		}
		this.sendRequest = this.sendRequest.bind(this);
		this.processRequest = this.processRequest.bind(this);
		this.editSearchTerm = this.editSearchTerm.bind(this)
		this.dynamicSearch = this.dynamicSearch.bind(this)
	}

	componentDidMount() {
		this.sendRequest()
	}

	sendRequest() {
		const str = window.location.pathname.split("/")
		var _url = "/movies"
		if (str[1].length>0) {
			_url = "/" + str[1]
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
				movies: response
			})
		}
	}

	editSearchTerm(event) {
		this.setState({searchTerm: event.target.value});
	}

	dynamicSearch(event) {
		return this.state.movies.filter(title => title.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
	}


	toMovie(m) {
		var g = "?";
		for (var i = 0; i < this.props.genres.length; i++) {
			if (m.genre.indexOf(this.props.genres[i].value)!== -1) {
				g = this.props.genres[i].label;
				break;
			}
		}

		if (this.state.searchTerm.length > 0) {
			if (m.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
				m.genre.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
				m.plot.toLowerCase().includes(this.state.searchTerm.toLowerCase())
			) {
				return (<tbody key={m.id}>
				<tr>
					<td align={"Left"}>{m.id}</td>
					{/*http://81.174.139.202:3000*/}
					{/*http://192.168.2.22:3000*/}
					<td align={"Left"} className={"title"}><a href={"http://81.174.139.202:3000/get/" + (m.id)}>{m.title}</a></td>
					<td align={"Left"}>{m.genre}</td>
					<td align={"Center"} className={"rating"}>{m.rating}</td>
					<td className={"runtime"}>{m.runtime}</td>
				</tr>
				</tbody>)
			}
		}
		if (this.state.searchTerm.length === 0) {
			return (<tbody key={m.id}>
			<tr>
				<td align={"Left"}>{m.id}</td>
				{/*http://81.174.139.202:3000*/}
				{/*http://192.168.2.22:3000*/}
				<td align={"Left"} className={"title"}><a href={"http://81.174.139.202:3000/get/" + (m.id)}>{m.title}</a></td>
				<td align={"Left"}>{m.genre}</td>
				<td align={"Center"} className={"rating"}>{m.rating}</td>
				<td className={"runtime"}>{m.runtime}</td>
			</tr>
			</tbody>)
		}
	}

	render() {
		return (
			<body>
			<div>
				<input size= '25' className="fa movie-search-element" type= 'text' value = {this.state.searchTerm} onChange = {this.editSearchTerm} placeholder="&#xf002;"/>
			</div>
			<table className="movie-list" >
				<tbody>
				<tr>
					<th>Id</th>
					<th>Title</th>
					<th>Genre</th>
					<th className={"rating"}><b>Rating</b></th>
					<th className={"runtime"}><b>Duration</b></th>
				</tr>
				</tbody>
				{this.state.movies.sort((a, b) => a.title.localeCompare(b.title)).map(this.toMovie)}
			</table>
			</body>
		)
	}
}

export default MovieList;