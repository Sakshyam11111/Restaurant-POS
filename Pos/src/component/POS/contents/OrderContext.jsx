import React, { createContext, useContext, useState, useCallback } from 'react';

const OrderContext = createContext(null);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [newOrderNotification, setNewOrderNotification] = useState(null);
  const [shouldRefreshOrders, setShouldRefreshOrders] = useState(false);
  const [shouldRefreshKOT, setShouldRefreshKOT] = useState(false);

  const notifyNewOrder = useCallback((order) => {
    setNewOrderNotification(order);
    setShouldRefreshOrders(true);
    setShouldRefreshKOT(true);

    setTimeout(() => {
      setNewOrderNotification(null);
    }, 3000);
  }, []);

  const resetRefreshFlags = useCallback(() => {
    setShouldRefreshOrders(false);
    setShouldRefreshKOT(false);
  }, []);

  const value = {
    newOrderNotification,
    shouldRefreshOrders,
    shouldRefreshKOT,
    notifyNewOrder,
    resetRefreshFlags
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};