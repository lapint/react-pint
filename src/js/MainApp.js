import React from "react/lib/React";
import {HashRouter as Router, Route, Link, IndexRoute} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class MainApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.loadInitialState();
    }

    loadInitialState() {
        return {
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <Router>
                <div>
                    <Route exact path='\/' component={Home} />
                    <Route exact path="\/material" component={MaterialThemedHome} />
                </div>
            </Router>
        );
    }
}

// Example component..you can create an import your own component
const Home = () => (<div key={"home-key"}>App Collection Home</div>);

// Example component wrapped in a material-ui theme provider
const MaterialThemedHome = () => (
    <MuiThemeProvider>
        <Home/>
    </MuiThemeProvider>
);
