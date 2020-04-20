import React, {useEffect, useState, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import CartList from '../components/CartList';

import { AuthContext } from '../../shared/context/auth-context';

const Cart = () => {
  const auth = useContext(AuthContext);
  const [loadedItems, setLoadedItems] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/items/cart/${userId}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLoadedItems(responseData.cart.cart.items);
      } catch (err) {}
    };
    fetchItems();
  }, [sendRequest, userId]);

  const itemDeleteHandler = deletedItemId => {
    console.log(deletedItemId);
    setLoadedItems(prevItems =>
      prevItems.filter(item => item.id !== deletedItemId)
    );
  };
  
  return (
    <React.Fragment>
      <h1 className="center"> Cart Page</h1>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedItems && (
        <CartList items={loadedItems} onDeleteItem={itemDeleteHandler}/>
      )}
    </React.Fragment>
  );
};

export default Cart;