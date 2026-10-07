import { createContext, useEffect, useState } from "react";
import { food_list as default_food_list, menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = import.meta.env.VITE_BACKEND_URL || "https://full-stack-food-website.onrender.com";
    const [food_list, setFoodList] = useState(default_food_list);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            } catch (err) {
                console.error("Error adding to cart:", err);
            }
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            } catch (err) {
                console.error("Error removing from cart:", err);
            }
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
                if (cartItems[item] > 0) {
                    let itemInfo = food_list.find((product) => String(product._id) === String(item));
                    if (itemInfo && itemInfo.price) {
                        totalAmount += itemInfo.price * cartItems[item];
                    }
                }  
            } catch (error) {
                console.error(error);
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data && response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
                setFoodList(response.data.data);
            }
        } catch (error) {
            console.error("Could not fetch remote food list, using default list:", error.message);
        }
    }

    const loadCartData = async (tokenObj) => {
        try {
            const tokenValue = typeof tokenObj === "string" ? tokenObj : (tokenObj?.token || token);
            if (!tokenValue) return;
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: tokenValue } });
            if (response.data && response.data.cartData) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error("Could not load cart data:", error.message);
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, [])

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;