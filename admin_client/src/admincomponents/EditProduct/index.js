import React from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import {
  Grid,
  Form,
  Modal,
  Segment,
  Divider,
  Header,
  Label,
  Button,
  Search
} from "semantic-ui-react";
import "./index.css";

const post = require("../../helpers/fetch").post;

const initialState = { isLoading: false, results: [], value: "" };
const resultRenderer = ({ name }) => <Label as="a" tag content={name} />;

export default withRouter(
  class EditProduct extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        image: "",
        name: "",
        description: "",
        price: 0,
        stock: 0,
        tags: []
      };
    }

    handleResultSelect = (e, { result }) => {
      let updatedTags = this.state.tags;
      updatedTags.push(result);
      this.setState({ tags: updatedTags });
    };

    handleSearchChange = (e, { value }) => {
      this.setState({ isLoading: true, value });

      setTimeout(() => {
        if (this.state.value.length < 1) return this.setState(initialState);

        const re = new RegExp(_.escapeRegExp(this.state.value), "i");
        const isMatch = result => re.test(result.name);

        this.setState({
          isLoading: false,
          results: _.filter(this.props.tags, isMatch)
        });
      }, 300);
    };

    onChange = event => {
      this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit = async () => {
      const res = await post("/product/update-product", {
        image: this.state.image,
        name: this.state.name,
        description: this.state.description,
        price: this.state.price,
        id: this.props.product.id,
        tags: this.state.tags
      });
      if (res.ok) {
        window.location.reload();
      }
    };

    componentDidMount() {
      const product = this.props.product;
      this.setState({
        image: product.image,
        name: product.name,
        description: product.description,
        price: product.price,
        tags:product.tags
      });
    }

    render() {
      const { isLoading, value, results } = this.state;
      console.log(this.state.tags)
      return (
        <Modal trigger={<Button>Edit</Button>}>
          <div style={{ minWidth: "400px" }}>
            <Grid verticalAlign="middle" columns={4} centered>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Segment textAlign="center" className="login-form">
                    <Header>Промени продукт</Header>
                    <Divider />
                    <Segment basic textAlign="left">
                      <Form.Input
                        fluid
                        label="Image"
                        value={this.state.image}
                        name="image"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Name"
                        value={this.state.name}
                        name="name"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Description"
                        value={this.state.description}
                        name="description"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Price"
                        value={this.state.price}
                        name="price"
                        onChange={this.onChange}
                      />
                      Add Tag:
                      <Search
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(
                          this.handleSearchChange,
                          500,
                          {
                            leading: true
                          }
                        )}
                        results={results}
                        value={value}
                        resultRenderer={resultRenderer}
                        {...this.props}
                      />
                      Tags:
                      <Segment>
                        {this.state.tags
                          ? this.state.tags.map(tag => {
                              return (
                                <Label as="a" tag>
                                  {tag.name}
                                </Label>
                              );
                            })
                          : null}
                      </Segment>
                      <Button onClick={this.onSubmit}>Update</Button>
                    </Segment>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Modal>
      );
    }
  }
);
