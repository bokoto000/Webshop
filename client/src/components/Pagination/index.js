import React, { Component } from "react";

import queryString from "query-string";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router-dom";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handlePageClick = async (data) => {
    console.log(data);
    let selected = data.selected;
    let values = await queryString.parse(this.props.location.search);
    let category = this.props.match.params.category;
    this.props.history.push({
      pathname: `/${category}/page/${selected}`,
      search: "?" + new URLSearchParams(values).toString()
    });
    this.props.refresh();
  };

  render() {
    let page = this.state.page;
    console.log(page);
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