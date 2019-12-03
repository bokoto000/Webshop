import React, { Component } from "react";

import queryString from "query-string";
import ReactPaginate from "react-paginate";
import {  withRouter } from "react-router-dom";

class Pagination extends Component {
  constructor(props) {
    super(props);
  }


  handlePageClick = data => {
    let selected = data.selected;
    let values = queryString.parse(this.props.location.search);
    values["page"] = selected;
    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
    this.setState({ page: selected });
  };

  render() {
    return (
      <div>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={25}
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