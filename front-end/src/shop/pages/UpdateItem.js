import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

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

const UpdateItem = () => {
  const [isLoading, setIsLoading] = useState(true);
  const itemId = useParams().itemId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      price: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const identifiedItem = DUMMY_ITEMS.find(p => p.id === itemId);

  useEffect(() => {
    if (identifiedItem) {
      setFormData(
        {
          title: {
            value: identifiedItem.title,
            isValid: true
          },
          description: {
            value: identifiedItem.description,
            isValid: true
          },
          price: {
            value: identifiedItem.price,
            isValid: true
          }
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedItem]);

  const itemUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedItem) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find item!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={itemUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdateItem;
