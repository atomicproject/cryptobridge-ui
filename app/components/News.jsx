import React from "react";
import counterpart from "counterpart";
import steem from "steem";
import Translate from "react-translate-component";

import LoadingIndicator from "./LoadingIndicator";

const query = {tag: "bitshares.fdn",limit: 20};

const alignRight = {textAlign: "right"};
const alignLeft = {textAlign: "left"};
const rowHeight = {height: "2rem"};
const bodyCell = {
    border: "3px solid #2e343c",
    padding: "0.5rem 1rem",
    lineHeight: "2rem",
};

const leftCell = { ...alignLeft, ...bodyCell };
const rightCell = { ...alignRight, ...bodyCell };

const secondCol = { ...leftCell, width: "180px"};

const SomethingWentWrong = () => (
    <p><Translate content="news.errors.fetch" /></p>
);

const ReusableLink = ({ data, url }) => (
    <a
        href={`https://steemit.com${url}`}
        rel="noreferrer noopener"
        target="_blank"
        style={{display: "block", color: "#ffffff"}}
    >{data}</a>
);

const NewsTable = ({ data, width }) => {
    return (
        <table className="table table-hover dashboard-table" style={{fontSize: "0.85rem"}}>
            <thead>
                <tr>
                    <th style={rightCell}><Translate component="span" content="account.votes.line" /></th>
                    <th style={leftCell}><Translate component="span" content="explorer.block.date" /></th>
                    <th style={leftCell}><Translate component="span" content="news.subject" /></th>
                    <th style={leftCell}><Translate component="span" content="news.author" /></th>
                </tr>
            </thead>
            <tbody>
                {data.map((singleNews, iter) => {
                    const theAuthor = singleNews.parentAuthor ? singleNews.parentAuthor : singleNews.author
                    const formattedDate = counterpart.localize(new Date(singleNews.active));
                    const smartTitle = (singleNews.title.length * 6) > (width-450)
                        ? `${singleNews.title.slice(0, Math.floor(width-450)/6)}...`
                        : singleNews.title
                    return(
                        <tr
                            key={`${singleNews.title.slice(0,10)}${iter}`}
                        >
                            <td style={rightCell}><ReusableLink data={iter+1} url={singleNews.url}/></td>
                            <td style={secondCol}><ReusableLink data={formattedDate} url={singleNews.url}/></td>
                            <td style={leftCell}><ReusableLink data={smartTitle} url={singleNews.url}/></td>
                            <td style={leftCell}><ReusableLink data={theAuthor} url={singleNews.url}/></td>
                        </tr>

                    )
                })}
            </tbody>
            <thead>
                <tr style={rowHeight}>
                    <th style={rightCell} />
                    <th style={leftCell} />
                    <th style={leftCell} />
                    <th style={leftCell} />
                </tr>
            </thead>
        </table>
    );
};

class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isWrong: false,
            discussions: [],
            width: 1200
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions() {
        this.setState({ width: window.innerWidth });
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
        steem.api.getDiscussionsByBlog(query, (err, discussions) => {
            if (err) this.setState({isLoading: false, isWrong: true})
            this.setState({discussions, isLoading: false})
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    render() {
        const { isLoading, isWrong, discussions, width } = this.state

        return (
            <div className="grid-block page-layout">
                <div className="grid-block vertical">
                    <div className="account-tabs">
                        <div className="tab-content">
                            <div className="hide-selector">
                                <div className="inline-block">
                                    <Translate content="news.news" />
                                </div>
                            </div>
                            <div className="grid-block vertical">
                                {isWrong && <SomethingWentWrong />}
                                {isLoading ? <LoadingIndicator /> : null}
                                {!isWrong && !isLoading && <NewsTable width={width} data={discussions}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default News;
