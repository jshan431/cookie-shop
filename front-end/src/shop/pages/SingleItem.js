import React, {useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Card from '../../shared/components/UIElements/Card';
import Item from '../components/Item';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import '../components/PlaceList.css';

const SingleItem = () => {

  const [loadedItem, setLoadedItem] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const itemId = useParams().itemId;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/items/${itemId}`
        );
        setLoadedItem(responseData.item);
      } catch (err) {}
    };
    fetchItem();
  }, [sendRequest, itemId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedItem && (
        <div className="place-list">
        <Item
          key={loadedItem.id}
          id={loadedItem.id}
          image={loadedItem.image}
          title={loadedItem.title}
          description={loadedItem.description}
          categoryId={loadedItem.categoryId}
        />
        </div>
      )}
    </React.Fragment>
  );
};

export default SingleItem;