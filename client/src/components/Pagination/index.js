import React, { Component } from "react";

import queryString from "query-string";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router-dom";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages:25
    };
  }

  async componentDidMount(){
    this.setState({pages:this.props.pagesCount?this.props.pagesCount:this.state.pages});
  }

  async componentDidUpdate(prevProps){
    if(this.props.pagesCount!==prevProps.pagesCount)
    this.setState({pages:this.props.pagesCount?this.props.pagesCount:this.state.pages});
  }

  handlePageClick = async (data) => {
    let selected = data.selected;
    let values = await queryString.parse(this.props.location.search);
    let category = this.props.match.params.category;
    this.props.history.push({
      pathname: `/${category}/page/${selected}`,
      search: "?" + new URLSearchParams(values).toString()
    });
  };

  render() {
    return (
      <div>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.state.pages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pagination-item"}
          activeClassName={"active"}
        />
      </div>
    );
  }
}

export default withRouter(Pagination);