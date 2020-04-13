import React, { useEffect, useState } from 'react';

import CategoriesList from '../components/CategoriesList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedCategories, setLoadedCategories] = useState();
  /*
  const CATEGORIES = [
    {
      id: 'cookies',
      name: 'Cookies',
      image:
        'https://beamingbaker.com/wp-content/uploads/2018/03/IGT1-Vegan-Chocolate-Chip-Cookies-Recipe-Gluten-Free-Dairy-Free-Refined-Sugar-Free-1.jpg',
      items: 3
    },
    {
      id: 'cupcakes',
      name: 'Cup Cakes',
      image:
        'https://thumbs.dreamstime.com/b/cupcakes-2815215.jpg',
      items: 3
    }
  ];
  */

  // fetch on load with useEffect. useEffect does not want a function that returns a promise
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try{
        const response = await fetch('http://localhost:5000/api/items/categories');
        const responseData = await response.json();
        if(!response.ok){
          throw new Error(responseData.message);
        }
        console.log(responseData.categories);
        setLoadedCategories(responseData.categories);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []) ;

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler}/>
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
