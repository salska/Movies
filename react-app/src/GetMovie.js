import React, { Component } from "react";
import { Multiselect } from 'multiselect-react-dropdown';

import './MovieList.css'
import './MovieForm.css'

var xhr;
class GetMovie extends Component {
	genre;

	constructor(props) {
		super(props);
		this.state = {
			options: [],
			selectedValues: [],
			movies: [],
			id: '',
			title: '',
			rating: '',
			genre: '',
			director: '',
			plot: '',
			runtime: '',
			release: ''
		}
		this.sendRequest = this.sendRequest.bind(this);
		this.processRequest = this.processRequest.bind(this);
		this.handleChangeTitle = this.handleChangeTitle.bind(this);
		this.handleChangeRating = this.handleChangeRating.bind(this);
		this.handleChangePlot = this.handleChangePlot.bind(this);
		this.handleChangeRelease = this.handleChangeRelease.bind(this);
		this.handleChangeDirector = this.handleChangeDirector.bind(this);
		this.handleChangeRuntime = this.handleChangeRuntime.bind(this);
		this.changeState = this.changeState.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.onRemove = this.onRemove.bind(this);
		this.tryDeleteMovie = this.tryDeleteMovie.bind(this);
		this.tryUpdateMovie = this.tryUpdateMovie.bind(this);
		this.processUpdateRequest = this.processUpdateRequest.bind(this);
		this.state.options = this.props.genres;

		this.style = {
			chips: {
				background: "orangered"
			},
			option: {
				color: "black"
			},
			searchBox: {
				border: "none",
				"border-bottom": "1px dashed orangered",
				"border-radius": "0px",
				"font-size": "14px"
			},
			multiselectContainer: {
				color: "orangered",
				fontweight: "light",
				width: "20%"

			}
		};
	}

	componentDidMount() {
		this.sendRequest();
	}

	onSelect(event) {
		this.changeState( { genre: '' } )
		for (var i = 0; i < event.length; i++) {
			if (i === 0) {
				this.changeState( { genre: event[i].label } );
			} else {
				this.changeState( { genre: this.state.genre + ", " + event[i].label } );
			}
		}
	}

	onRemove(event) {
		this.changeState( { genre: '' } )
		for (var i = 0; i < event.length; i++) {
			if (i === 0) {
				this.changeState( { genre: event[i].label } );
			} else {
				this.changeState( { genre: this.state.genre + ", " + event[i].label } );
			}
		}
	}

	handleChangeTitle(event) {
		this.changeState( { title: event.target.value } );
	}

	handleChangeRating(event) {
		this.changeState( { rating: event.target.value } );
	}

	handleChangePlot(event) {
		this.changeState( { plot: event.target.value } );
	}

	handleChangeRelease(event) {
		this.changeState( { release: event.target.value } );
	}

	handleChangeRuntime(event) {
		this.changeState( { runtime: event.target.value } );
	}

	handleChangeDirector(event) {
		this.changeState( { director: event.target.value } );
	}

	changeState(keyVal) {
		this.setState( Object.assign({}, this.state, keyVal) )
	}

	sendRequest() {
		const str = window.location.pathname.split("/")
		var _url = "/movies"
		if (str[1].length>0) {
			_url = "/movies/" + str[2]
			this.setState( { id: str[2] } )
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
			this.setState({movies: response})
			this.setState({id: this.state.movies.id})
			this.setState({title: this.state.movies.title})
			this.setState({rating: this.state.movies.rating})
			this.setState({genre: this.state.movies.genre})
			this.setState({director: this.state.movies.director})
			this.setState({release: this.state.movies.release})
			this.setState({plot: this.state.movies.plot})
			this.setState({runtime: this.state.movies.runtime})
		}
	}

	tryDeleteMovie() {
		var _url = "/movies/" + this.state.id;
		xhr = new XMLHttpRequest();
		xhr.open("DELETE", _url);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(JSON.stringify({ "title": this.state.title, "rating": this.state.rating, "plot": this.state.plot, "director": this.state.director, "runtime": this.state.runtime, "release": this.state.release, "genre": this.state.genre }));
		xhr.addEventListener("readystatechange", this.processUpdateRequest, false);
	}

	tryUpdateMovie() {
		var _url = "/movies/" + this.state.id;
		xhr = new XMLHttpRequest();
		xhr.open("PUT", _url);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(JSON.stringify({ "title": this.state.title, "rating": this.state.rating, "plot": this.state.plot, "director": this.state.director, "runtime": this.state.runtime, "release": this.state.release, "genre": this.state.genre }));
		xhr.addEventListener("readystatechange", this.processUpdateRequest, false);
	}

	processUpdateRequest() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			this.changeState( { title: "" } )
			this.changeState( { rating: "" } )
			this.changeState( { plot: "" } )
			this.changeState( { runtime: "" } )
			this.changeState( { release: "" } )
			this.changeState( { director: "" } )
			this.changeState( { genre: "" } )
		}
	}


	render() {
		const {selectedValues} = this.state;
		return (
			<body>
			<span className="saveButton" onClick={this.tryUpdateMovie}>
				&nbsp;&nbsp;Save&nbsp;&nbsp;
			</span>
			<span className="deleteButton" onClick={this.tryDeleteMovie}>
				Delete
			</span>
			<input size= '50' className="movie-title-element" type="text" value={this.state.title} onChange={this.handleChangeTitle} />
			<p><b>imdb Rating:</b> <input className="movie-rating-element" type="text" value={this.state.rating} onChange={this.handleChangeRating} /></p>
			<Multiselect
				options={this.state.options} // Options to display in the dropdown
				displayValue="label" // Property name to display in the dropdown options
				selectedValues={selectedValues}
				selectionLimit="4"
				placeholder="genre"
				onSelect={this.onSelect} // Function will trigger on select event
				onRemove={this.onRemove} // Function will trigger on remove event
				avoidHighlightFirstOption="true"
				style={this.style}
			/>
			<h2>{this.state.genre}</h2>
			<h3>Directed by <input className="movie-single-element" type="text" value={this.state.director} onChange={this.handleChangeDirector} /></h3>
			<textarea rows='3' className="plot" onChange={this.handleChangePlot} value={this.state.plot} />
			<h4>Released: <input className="movie-single-element" type="text" value={this.state.release} onChange={this.handleChangeRelease} /></h4>
			<h4>Duration: <input className="movie-single-element" type="text" value={this.state.runtime} onChange={this.handleChangeRuntime} /></h4>
			</body>
		)
	}

}

export default GetMovie;