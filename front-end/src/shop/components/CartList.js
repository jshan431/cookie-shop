import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import Item from './Item';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

const CartList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No items in cart found. Maybe add one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(item => (
        <Item
          key={item.itemId.id}
          id={item.itemId.id}
          image={item.itemId.image}
          title={item.itemId.title}
          price={item.itemId.price}
          description={item.itemId.description}
          categoryId={item.itemId.categoryId}
          onDelete={props.onDeleteItem}
        />
      ))}
    </ul>
  );
};

export default CartList;