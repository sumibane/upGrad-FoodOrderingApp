import React, { Component } from 'react';

//Import Header
import Header from '../../common/header/Header';

//Import Css
import './Details.css';

import Typography from "@material-ui/core/Typography";

//Import Material UI components
import { withStyles } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Card from "@material-ui/core/Card";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Fade from "@material-ui/core/Fade";


const styles = (theme) => ({

    textRatingCost: {
        //Rate and Cost Styling
        "text-overflow": "clip",
        width: "145px",
        color: "grey",
    },
    restaurantName: {
        //Resturant Name Style.
        padding: "8px 0px 8px 0px",
        "font-size": "30px",  
    },
    restaurantCategory: {
        //Resturant Category style.
        padding: "8px 0px 8px 0px",
    },
    avgCost: {
        //Average Cost style.
        "padding-left": "5px",
    },
    itemPrice: {
        //Item Price style.
        "padding-left": "5px",
    },
    addButton: {
        "margin-left": "25px",
    },
    menuItemName: {
        //Menu Styles.
        "margin-left": "20px",
    },
    shoppingCart: {
        //Cart Styles.
        color: "black",
        "background-color": "white",
        width: "60px",
        height: "50px",
        "margin-left": "-20px",
    },
    cartHeader: {
        //Cart Header style.
        "padding-bottom": "0px",
        "margin-left": "10px",
        "margin-right": "10px",
    },
    cartItemButton: {
        padding: "10px",
        "border-radius": "0",
        color: "#fdd835",
        "&:hover": {
            "background-color": "#ffee58",
        },
    },
    cardContent: {
        //Content style.
        "padding-top": "0px",
        "margin-left": "10px",
        "margin-right": "10px",
    },
    totalAmount: {
        //Amount style.
        "font-weight": "bold",
    },
    checkOutButton: {
        //Style for the Checkout button in the cart card.
        "font-weight": "400",
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
            badgeNotVisible: false,
        }
    }

    componentDidMount() {
        let data = null;
        let that = this;
        let xhrRestaurantDetails = new XMLHttpRequest();

        xhrRestaurantDetails.addEventListener("readystatechange", function () {
            if (
                xhrRestaurantDetails.readyState === 4 &&
                xhrRestaurantDetails.status === 200
            ) {
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
                    categories: categories,
                });

            }
        })
        xhrRestaurantDetails.open("GET", this.props.baseUrl + "restaurant/" + this.props.match.params.id);
        xhrRestaurantDetails.send(data);
    }

    // Custome Method to handle the add Item Functionality.
    itemAddButtonClickHandler = (item) => {

        let cartItems = this.state.cartItems;
        let itemPresentInCart = false;

        //Check if Items are present in cart.
        cartItems.forEach((cartItem) => {
            // If true update the cart
            if (cartItem.id === item.id) {
                itemPresentInCart = true;
                cartItem.quantity++;
                cartItem.totalAmount = cartItem.price * cartItem.quantity;
            }
        });

        // if false, add the item in the cart
        if (!itemPresentInCart) {
            let cartItem = {
                id: item.id,
                name: item.item_name,
                price: item.price,
                totalAmount: item.price,
                quantity: 1,
                itemType: item.item_type,
            };
            cartItems.push(cartItem);
        }

        //Update amount.
        let totalAmount = 0;
        cartItems.forEach((cartItem) => {
            totalAmount = totalAmount + cartItem.totalAmount;
        });

        //State management
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: "Item added to cart!",
            totalAmount: totalAmount,
        });
    };

    // Custom Method to remove the items from the cart
    cartMinusButtonClickHandler = (item) => {
        let cartItems = this.state.cartItems;
        let index = cartItems.indexOf(item);
        let itemRemoved = false;
        cartItems[index].quantity--;
        if (cartItems[index].quantity === 0) {
            cartItems.splice(index, 1);
            itemRemoved = true;
        }
        else {
            cartItems[index].totalAmount =
                cartItems[index].price * cartItems[index].quantity;
        }

        let totalAmount = 0;
        cartItems.forEach((cartItem) => {
            totalAmount = totalAmount + cartItem.totalAmount;
        });

        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: itemRemoved
                ? "Item removed from cart!"
                : "Item quantity decreased by 1!",
            totalAmount: totalAmount,
        });

    };

    // Custome Function to add items in the cart
    cartAddButtonClickHandler = (item) => {

        let cartItems = this.state.cartItems;
        let index = cartItems.indexOf(item);
        cartItems[index].quantity++;
        cartItems[index].totalAmount =
            cartItems[index].price * cartItems[index].quantity;


        let totalAmount = 0;
        cartItems.forEach((cartItem) => {
            totalAmount = totalAmount + cartItem.totalAmount;
        });


        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: "Item quantity increased by 1!",
            totalAmount: totalAmount,
        });

    };

    //Clonse SnackBar Handler
    snackBarCloseHandler = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        this.setState({

            snackBarMessage: "",
            snackBarOpen: false,
        });
    };

    //Toggele Modal
    changeBadgeVisibility = () => {
        this.setState({
            badgeNotVisible: !this.state.badgeNotVisible
        });
    };


    //Click Handler for Checkout
    checkOutButtonClickHandler = () => {
        let cartItems = this.state.cartItems;
        let isLoggedIn = sessionStorage.getItem("access-token") == null ? false : true;
        if (cartItems.length === 0) {
            this.setState({
                ...this.state,
                snackBarOpen: true,
                snackBarMessage: "Please add an item to your cart!",
            });
        }
        else if (isLoggedIn === false) {
            this.setState({
                ...this.state,
                snackBarOpen: true,
                snackBarMessage: "Please login first!",
            });
        }
        else {
            this.props.history.push({
                pathname: "/checkout",
                cartItems: this.state.cartItems,
                restaurantDetails: this.state.restaurantDetails,
            });
        }

    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header  history={this.props.history} baseUrl={this.props.baseUrl}  showHeaderSearchBox={false} changeBadgeVisibility={this.changeBadgeVisibility}/>
                <div className="restaurant-details-section">
                    <div>
                        <img src={this.state.restaurantDetails.photoURL} alt="Restaurant" height="215px" width="275px" />
                    </div>
                    <div className="restaurant-details">
                        <div className="restaurant-name">
                            <Typography variant="h5" component="h5">
                                {this.state.restaurantDetails.name}
                            </Typography>
                        </div><br/>
                        <Typography variant="subtitle1" component="p">
                            {this.state.restaurantDetails.locality}
                        </Typography><br/>
                        <Typography variant="subtitle2" component="p">
                            {this.state.categories.map((category, index) => (
                                        <span
                                            key={category.id + "category"}>{category.category_name}{index < this.state.categories.length - 1 ? ", " : " "}
                                        </span>
                                ))
                            }
                        </Typography>
                        <div className="restaurant-rating-cost-section">
                            <div className="restaurant-rating-section">
                                <div className="restaurant-rating">
                                    <i className="fa fa-star"></i>
                                    <Typography variant="subtitle1" component="p">
                                        {this.state.restaurantDetails.rating}
                                    </Typography>
                                </div>
                                <Typography  variant="caption" component="p"  style={{ color: 'grey' }}>
                                    AVERAGE RATING BY{" "}<br/>
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
                                    <Typography  variant="subtitle1" component="p">
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
                    {/*  Menu Section*/}
                    <div className="menu-details">
                        {/* Display each category */}
                        {this.state.categories.map((category) => (
                            <div key={category.id}>
                                <Typography variant="overline" component="p" className={classes.categoryName}>
                                    {category.category_name}
                                </Typography>
                                <Divider />
                                {/* Items on each category*/}
                                {category.item_list.map((item) => (
                                    <div className="menu-item-container" key={item.id}>
                                        {
                                            item.item_type === "NON_VEG" ?
                                                <i className="fa fa-circle" aria-hidden="true" style={{ color: "#BE4A47" }}></i>
                                                :
                                                <i className="fa fa-circle" aria-hidden="true" style={{ color: "#5A9A5B" }}></i>
                                        }
                                        <Typography variant="subtitle1" component="p" className={classes.menuItemName}>
                                            {item.item_name[0].toUpperCase() + item.item_name.slice(1)}
                                        </Typography>
                                        <div className="item-price">
                                            <i className="fa fa-inr" aria-hidden="true"></i>
                                            <Typography variant="subtitle1" component="p" className={classes.itemPrice}  >
                                                {item.price.toFixed(2)}
                                            </Typography>
                                        </div>
                                        <IconButton className={classes.addButton} aria-label="add" onClick={() => this.itemAddButtonClickHandler(item)}>
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="my-cart">
                        <Card className={classes.myCart}>
                            <CardHeader avatar={
                                <Avatar aria-label="shopping-cart" className={classes.shoppingCart}>
                                    <Badge badgeContent={this.state.cartItems.length} color="primary"
                                        showZero={true} invisible={this.state.badgeNotVisible} className={classes.badge}>
                                        <ShoppingCartIcon />
                                    </Badge>
                                </Avatar>
                            }
                                title="My Cart"
                                titleTypographyProps={{ variant: "h6", }}
                                className={classes.cartHeader}
                            />
                            <CardContent className={classes.cardContent}>
                                {/* Show each item in cart. */}
                                {this.state.cartItems.map((cartItem) => (
                                    <div className="cart-menu-item-container" key={cartItem.id}>
                                        <i className="fa fa-stop-circle-o" aria-hidden="true"
                                            style={{ color: cartItem.itemType === "NON_VEG" ? "#BE4A47" : "#5A9A5B" }}
                                        ></i>
                                        <Typography variant="subtitle1" component="p" className={classes.menuItemName} id="cart-menu-item-name">
                                            {cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}
                                        </Typography>
                                        <div className="quantity-container">
                                            <IconButton
                                                className={classes.cartItemButton}
                                                id="minus-button"
                                                aria-label="remove"
                                                onClick={() => this.cartMinusButtonClickHandler(cartItem)}>
                                                <i className="fa fa-minus" aria-hidden="true" style={{ color: "black" }}></i>
                                            </IconButton>
                                            <Typography variant="subtitle1" component="p" className={classes.itemQuantity}>
                                                {cartItem.quantity}
                                            </Typography>
                                            <IconButton
                                                className={classes.cartItemButton}
                                                aria-label="add"
                                                onClick={() => this.cartAddButtonClickHandler(cartItem)}
                                            >
                                                <i class="fa fa-plus" aria-hidden="true" style={{ color: "black" }} ></i>
                                            </IconButton>
                                        </div>
                                        <div className="item-price">
                                            <i className="fa fa-inr" aria-hidden="true" style={{ color: "grey" }}></i>
                                            <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-item-price" >
                                                {cartItem.totalAmount.toFixed(2)}
                                            </Typography>
                                        </div>
                                    </div>
                                ))}
                                <div className="total-amount-container">
                                    <Typography variant="subtitle2" component="p" className={classes.totalAmount}>
                                        TOTAL AMOUNT
                                    </Typography>
                                    <div className="total-price">
                                        <i className="fa fa-inr" aria-hidden="true"></i>
                                        <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-total-price">
                                            {this.state.totalAmount.toFixed(2)}
                                        </Typography>
                                    </div>
                                </div>
                                <Button variant="contained" color="primary" fullWidth={true} className={classes.checkOutButton} onClick={this.checkOutButtonClickHandler}>
                                    CHECKOUT
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Messages to display in snackbar */}
                <div>
                    <Snackbar anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                        open={this.state.snackBarOpen}
                        autoHideDuration={4000}
                        onClose={this.snackBarCloseHandler}
                        TransitionComponent={this.state.transition}
                        ContentProps={{ "aria-describedby": "message-id", }}
                        message={
                            <span id="message-id">
                                {this.state.snackBarMessage}
                            </span>}
                        action={
                            <IconButton color="inherit" onClick={this.snackBarCloseHandler}>
                                <CloseIcon />
                            </IconButton>
                        }
                    />
                </div>
            </div >
        )
    };
}

export default withStyles(styles)(Details);