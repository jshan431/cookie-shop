import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
//import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';

const Item = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /*
  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);
  */
 
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/admin/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      console.log('inside the try. with item id: ' + props.id);
      props.onDelete(props.id);
    } catch (err) {}
  };

  const addItemToCartHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/items/cart/${auth.userId}`,
        'POST',
        JSON.stringify({
          itemId: props.id
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );

    } catch (err) {}
  }

  const clearItemFromCart = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/items/cart/${auth.userId}`,
        'DELETE',
        JSON.stringify({
          itemId: props.id
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
    } catch (err) {}
  }

  return (
    <React.Fragment>
    {/*
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
    */}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this item? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
            <Link to={`/item/${props.id}`}>
              <div className="place-item__image">
                <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
              </div>
            </Link>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.price}</h3>
              <p>{props.description}</p>
              <p>${props.price}</p>
            </div>
            <div className="place-item__actions">
              <Button inverse onClick={addItemToCartHandler}>
                Add to Cart
              </Button>
              <Button danger onClick={clearItemFromCart}>
                Clear Cart Item
              </Button>
              {auth.isAdmin && (
                <Button to={`/items/${props.id}`}>EDIT</Button>
              )}
              {auth.isAdmin && (
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              )}
            </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default Item;

/**
 
              {auth.isLoggedIn && (
                <Button to={`/places/${props.id}`}>EDIT</Button>
              )}

              {auth.isLoggedIn && (
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              )}

 */