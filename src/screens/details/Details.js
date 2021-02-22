import React, { Component } from 'react';

//Import Header
import Header from '../../common/header/Header';

//Import Css
import './Details.css';

import Typography from "@material-ui/core/Typography";
//Import Material UI componenets
import { withStyles } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Fade from "@material-ui/core/Fade";

const styles = (theme) => ({

    textRatingCost: {
        "text-overflow": "clip",
        width: "145px",
        color: "grey",
    },

    restaurantCategory: {
        padding: "8px 0px 8px 0px",
    },

    avgCost: {
        "padding-left": "5px",
    },

    itemPrice: {
        "padding-left": "5px",
    },

    restaurantName: {
        padding: "8px 0px 8px 0px",
        "font-size": "30px",
    },

    addButton: {
        "margin-left": "25px",
    }
});

class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurantDetails: [],
            categories: [],
            cartItems: [],
            totalAmount: 0,
            snackBarOpen: false,
            snackBarMessage: "",
            transition: Fade,
            badgeVisible: false
        }
    }

    componentDidMount() {
        let data = null;
        let that = this;
        let xhrRestaurantDetails = new XMLHttpRequest();

        xhrRestaurantDetails.addEventListener("readystatechange", function () {
            if ( xhrRestaurantDetails.readyState === 4 && xhrRestaurantDetails.status === 200 ) {

                let response = JSON.parse(xhrRestaurantDetails.responseText);
                let categoriesList = [];
                response.categories.forEach((category) => {
                    categoriesList.push(category.category_name);
                });
                let restaurantDetails = {
                    id: response.id,
                    name: response.restaurant_name,
                    photoURL: response.photo_URL,
                    avgCost: response.average_price,
                    rating: response.customer_rating,
                    noOfCustomerRated: response.number_customers_rated,
                    locality: response.address.locality,
                    categoriesName: categoriesList.toString
                };

                let categories = response.categories;
                that.setState({
                    ...this.state,
                    restaurantDetails: restaurantDetails,
                    categories: categories
                });
            }
        })
        xhrRestaurantDetails.open("GET", this.props.baseUrl + "restaurant/" + this.props.match.params.id);
        xhrRestaurantDetails.send(data);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header history={this.props.history} baseUrl={this.props.baseUrl} showHeaderSearchBox={false}/>
                <div className="restaurant-details-section">
                    <div>
                        <img src={this.state.restaurantDetails.photoURL} alt="Restaurant" height="215px" width="275px"/>
                    </div>
                    <div className="restaurant-details">
                        <div className="restaurant-name">
                            <Typography variant="h5" component="h5">
                                {this.state.restaurantDetails.name}
                            </Typography>

                        </div>
                        <Typography variant="subtitle1" component="p">
                            {this.state.restaurantDetails.locality}
                        </Typography>
                        <Typography variant="subtitle1" component="p">
                            {this.state.restaurantDetails.categoriesName}
                        </Typography>

                        <div className="restaurant-rating-cost-section">

                            <div className="restaurant-rating-section">
                                <div className="restaurant-rating">
                                    <i className="fa fa-star"></i>
                                    <Typography variant="subtitle1" component="p">
                                        {this.state.restaurantDetails.rating}
                                    </Typography>
                                </div>

                                <Typography variant="caption" component="p">
                                    AVERAGE RATING BY {" "}
                                    {
                                        <span className="restaurant-NoOfCustomerRated">
                                            {this.state.restaurantDetails.noOfCustomerRated}
                                        </span>
                                    }{" "}
                                    CUSTOMERS
                                </Typography>
                            </div>
                            <div className="restaurant-avg-cost-section">
                                <div className="restaurant-avg-cost">
                                    <i className="fa fa-inr" aria-hidden="true"></i>
                                    <Typography variant="subtitle1" component="p">
                                        {this.state.restaurantDetails.avgCost}
                                    </Typography>
                                </div>
                                <Typography variant="caption" component="p">
                                    AVERAGE COST FOR TWO PEOPLE
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="menu-details-cart-container">
                    <div className="menu-details">
                        {this.state.categories.map((category) => (
                            <div key={category.id}>
                                <Typography variant="overline" component="p" className={classes.categoryName}>
                                    {category.category_name}
                                </Typography>
                                <Divider />
                                {category.item_list.map((item) => (
                                    <div className="menu-item-container" key={item.id}>
                                        {
                                            item.item_type === "NON_VEG" ?
                                                <i class="fa fa-circle" aria-hidden="true" style={{ color: "#BE4A47" }}></i>
                                                :
                                                <i class="fa fa-circle" aria-hidden="true" style={{ color: "#5A9A5B" }}></i>

                                        }
                                        <Typography variant="subtitle1" component="p" className={classes.menuItemName}>
                                            {item.item_name[0].toUpperCase() + item.item_name.slice(1)}
                                        </Typography>

                                        <div className="item-price">
                                            <i className="fa fa-inr" aria-hidden="true"></i>
                                            <Typography variant="subtitle1" component="p" className={classes.itemPrice}>
                                                {item.price.toFixed(2)}
                                            </Typography>
                                        </div>

                                        <IconButton
                                            className={classes.addButton} aria-label="add" onClick={() => this.itemAddButtonClickHandler(item)} >
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        )
    }
}

export default withStyles(styles)(Details);