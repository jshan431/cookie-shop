import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import Item from './Item';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

const ItemsList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No items found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(item => (
        <Item
          key={item.id}
          id={item.id}
          image={item.image}
          title={item.title}
          description={item.description}
          categoryId={item.categoryId}
          onDelete={props.onDeleteItem}
        />
      ))}
    </ul>
  );
};

export default ItemsList;
