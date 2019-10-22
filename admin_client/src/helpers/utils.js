import queryString from "query-string";

function setSearchParams(props,name, value) {
    let values = queryString.parse(props.location.search);
    values[name] = value;
    props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
  }

export {setSearchParams};