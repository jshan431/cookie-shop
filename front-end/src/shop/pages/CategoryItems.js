import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ItemsList from '../components/ItemsList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const CategoryItems = () => {
  const [loadedItems, setLoadedItems] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const categoryId = useParams().categoryId;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/items/category/${categoryId}`
        );
        setLoadedItems(responseData.items);
      } catch (err) {}
    };
    fetchItems();
  }, [sendRequest, categoryId]);

  const itemDeleteHandler = deletedItemId => {
    console.log(deletedItemId);
    setLoadedItems(prevItems =>
      prevItems.filter(item => item.id !== deletedItemId)
    );
  };
  
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedItems && (
        <ItemsList items={loadedItems} onDeleteItem={itemDeleteHandler}/>
      )}
    </React.Fragment>
  );
};

export default CategoryItems;
