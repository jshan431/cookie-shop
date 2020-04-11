import React from 'react';
import { useParams } from 'react-router-dom';

import ItemsList from '../components/ItemsList';

const DUMMY_ITEMS = [
  {
    id: 'p1',
    title: 'Chocolate Chip cookies',
    description: 'Soft cookie with bits of chocolate',
    imageUrl:
      'https://divascancook.com/wp-content/uploads/2015/06/gluten-free-chocolate-chip-cookies-recipe-chewy.jpg',
    category: 'cookies'
  },
  {
    id: 'p2',
    title: 'Red Velvet',
    description: 'Red Relvet Cupcake with vanilla frosting',
    imageUrl:
      'https://image.shutterstock.com/image-photo/red-velvet-cupcakes-260nw-76892959.jpg',
    category: 'cupcakes'
  }
];

const CategoryItems = () => {
  const categoryId = useParams().categoryId;
  const loadedItems = DUMMY_ITEMS.filter(item => item.category === categoryId);
  return <ItemsList items={loadedItems} />;
};

export default CategoryItems;
