import React, { useEffect, useState } from 'react';

import CategoriesList from '../components/CategoriesList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Home = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCategories, setLoadedCategories] = useState();

  // fetch on load with useEffect. useEffect does not want a function that returns a promise
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/items/categories'
        );

        setLoadedCategories(responseData.categories);
      } catch (err) {}
    };
    fetchCategories();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>)}
      {!isLoading && loadedCategories && 
        <CategoriesList items={loadedCategories} />} 
    </React.Fragment>
  );
};

export default Home;
