import React, {useState, useEffect } from 'react';
//import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
//import Card from '../../shared/components/UIElements/Card';
//import Item from '../components/Item';
//import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ItemsList from '../../shop/components/ItemsList';
import '../components/PlaceList.css';

const Shop = () => {

  const [loadedItems, setLoadedItems] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/items`
        );
        setLoadedItems(responseData.items);
      } catch (err) {}
    };
    fetchItems();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedItems && (
        <ItemsList items={loadedItems} />
      )}
    </React.Fragment>
  );
};

export default Shop;