import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, paymentApi } from "../services/api"; // orderApi로 주문 API 호출
import "./cart.scss";

interface CartItem {
  cartItemId: number;
  merchandiseId: number;
  merchandiseName: string;
  thumbnail: string;
  price: number;
  merchandiseOptionId: number;
  merchandiseOptionName: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await cartApi.fetchCart();
        setCartItems(response.data.data);
      } catch (error) {
        console.error("Error fetching cart items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const removeCartItem = async (cartItemId: number) => {
    try {
      const response = await cartApi.removeCartItem(cartItemId);
      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cartItemId !== cartItemId)
        );
      }
    } catch (error) {
      console.error("Error removing cart item", error);
    }
  };

  const updateQuantity = async (
    cartItemId: number,
    increment: boolean,
    currentQuantity: number
  ) => {
    if (!increment && currentQuantity === 1) {
      alert("최소 수량입니다.");
      return;
    }

    try {
      const response = await cartApi.updateCartItemQuantity(
        cartItemId,
        increment ? "INCREMENT" : "DECREMENT"
      );
      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartItemId === cartItemId
              ? {
                  ...item,
                  quantity: response.data.data.updatedCartItem.quantity,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart item quantity", error);
    }
  };

  // 주문 생성 핸들러
  const handleCheckout = async () => {
    try {
      // response는 단순히 주문 테이블에 데이터를 저장. 실제 주문하는건 아님
      const response = await paymentApi.createOrder(); // 주문 생성 API 호출

      const orderId = response.data.data.orderId; // 주문 ID 추출
      navigate(`/order/${orderId}`); // 주문 상세 페이지로 이동
    } catch (error) {
      console.error("주문 생성 실패:", error);
      alert("주문을 처리하는 중 문제가 발생했습니다.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cart-container">
      <h2>My Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">Your cart is empty.</div>
      ) : (
        <div className="cart-content">
          {cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className="cart-item"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={item.thumbnail}
                alt={item.merchandiseName}
                className="thumbnail"
              />
              <div className="item-details">
                <h3>{item.merchandiseName}</h3>
                <p>Option: {item.merchandiseOptionName}</p>
                <p>Price: {item.price} 원</p>
                <div className="quantity-control">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item.cartItemId, false, item.quantity);
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item.cartItemId, true, item.quantity);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeCartItem(item.cartItemId);
                }}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ${getTotalPrice()}</h3>
            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
