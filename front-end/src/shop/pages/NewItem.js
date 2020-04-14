import React from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { useHttpClient } from '../../shared/hooks/http-hook';

const NewItem= () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      image: {
        value: '',
        isValid: false
      },
      categoryId: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      console.log("inside the try catch");
      await sendRequest(
        'http://localhost:5000/api/admin/item',
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          image: formState.inputs.image.value,
          categoryId: formState.inputs.categoryId.value
        }),
        { 'Content-Type': 'application/json' }
      );
      history.push('/shop');
    } catch (err) {}
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="image"
        element="input"
        label="Image"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid image URL."
        onInput={inputHandler}
      />
      <Input
        id="categoryId"
        element="input"
        label="Category Id"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid Category Id."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD ITEM
      </Button>
    </form>
  );
};

export default NewItem;
