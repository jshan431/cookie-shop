import React from 'react';

import CategoriesList from '../components/CategoriesList';

const Home = () => {
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

  return <CategoriesList items={CATEGORIES} />;
};

export default Home;
