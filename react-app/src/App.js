import React from 'react';

import './App.css';
import { NavLink, Switch, Route } from 'react-router-dom';

import MovieList from "./MovieList";
import GetMovie from "./GetMovie";
import GetAwards from "./GetAwards";
import GetActors from "./GetActors";
import AddMovie from "./AddMovie";

const genres = [
    {value: 'Action', label: 'Action'},
    {value: 'Animation', label: 'Animation'},
    {value: 'Adventure', label: 'Adventure'},
    {value: 'Biography', label: 'Biography'},
    {value: 'Comedy', label: 'Comedy'},
    {value: 'Crime', label: 'Crime'},
    {value: 'Documentary', label: 'Documentary'},
    {value: 'Drama', label: 'Drama'},
    {value: 'Family', label: 'Family'},
    {value: 'Fantasy', label: 'Fantasy'},
    {value: 'History', label: 'History'},
    {value: 'Music', label: 'Music'},
    {value: 'Musical', label: 'Musical'},
    {value: 'Mystery', label: 'Mystery'},
    {value: 'Reality-TV', label: 'Reality TV'},
    {value: 'Romance', label: 'Romance'},
    {value: 'Sci-Fi', label: 'Sci Fi'},
    {value: 'Short', label: 'Short'},
    {value: 'Sport', label: 'Sport'},
    {value: 'Thriller', label: 'Thriller'},
    {value: 'TV-Show', label: 'TV Show'},
    {value: 'War', label: 'War'},
    {value: 'Western', label: 'Western'}
]

const App = () => (
     <div className='app'>
        {<Navigation />}
        {<Main />}
    </div>
);

const Navigation = () => (
    <nav>
        <ul>
            <li><NavLink exact activeClassName="current" to='/'><i className="fas fa-film"></i> &nbsp;Listings</NavLink></li>
            <li><NavLink exact activeClassName="current" to='/add'><i className="far fa-plus-square"></i> &nbsp;Add Movie</NavLink></li>
            <li><NavLink exact activeClassName="current" to='/about'><i className="fas fa-concierge-bell"></i> &nbsp;About</NavLink></li>
            <li><NavLink exact activeClassName="current" to='/contact'><i className="far fa-envelope-open"></i> &nbsp;Contact</NavLink></li>
        </ul>
    </nav>
);

const Home = () => (
    <div className='home'>
            <h1>
                <i className="fas fa-cat"></i>&nbsp;Milo Movies
           </h1>
            <div>
                <MovieList genres={genres} />
            </div>
    </div>
);

const About = () => (
    <div className='about'>
        <h1>About Milo Movies</h1>
        <h2>A showcase of banging movies</h2>
        <p></p>
        <p>Milo Movies showcases some of the greatest movies ever created and have received worldwide acclaim.</p>
        <p>This custom built application is implemented as a full stack reactJS user interface which accesses a MySQL database of movie data using a Java backend via REST API calls.</p>
    </div>
);

const Contact = () => (
    <div className='contact'>
        <h1>Contact Me</h1>
        <span>You can reach me via email </span><a href="mailto:sal@emetrix.biz"><strong>sal@emetrix.biz</strong></a>
    </div>
);

const Add = () => (
    <div className='add'>
        <h1>Add New Movie</h1>
        <AddMovie genres={genres} />
    </div>
);

const Get = () => (
    <div className='get'>
        <p>Search > Movie Details</p>
        <GetMovie genres={genres} />
        <GetActors genres={genres} />
        <GetAwards genres={genres} />
    </div>
);

const Main = () => (
    <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/about' component={About}></Route>
        <Route exact path='/add' component={Add}></Route>
        <Route exact path='/get/*' component={Get}></Route>
        <Route exact path='/contact' component={Contact}></Route>
        <Route exact path='/movies/*' component={Home}></Route>
        <Route exact path='/refresh' component={Home}></Route>
    </Switch>
);


export default App;