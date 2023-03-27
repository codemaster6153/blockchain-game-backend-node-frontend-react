import React, {Component} from 'react';
import "./Page.css";

export default class Page extends Component {
    state = {
        content: this.props.content
    }

    // this will update state when props change
    static getDerivedStateFromProps(props) {
        return {
            content: props.content
        };
    }

    render() {
        return (
            <section className="page">
                <div className="container">
                    <div className="content" dangerouslySetInnerHTML={{__html: this.state.content}}/>
                </div>
            </section>
        );
    }
}
