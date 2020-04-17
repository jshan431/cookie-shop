import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';

import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Auth from '../../user/pages/Auth';

const NewItem= () => {
  const auth = useContext(AuthContext);
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
      },
      price: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const itemSubmitHandler = async event => {
    event.preventDefault();
    try {
      // Create FormData object which can hold text and binary data
      const formData = new FormData();
      // first argument of append is the identifier and the second is the value
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('categoryId', formState.inputs.categoryId.value);
      formData.append('price', formState.inputs.price.value);
      await sendRequest(
        'http://localhost:5000/api/admin/item',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token
        } //backend accepts token in the authorization property of the header
      );
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={itemSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
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
        <ImageUpload id="image" onInput={inputHandler} errorText={"Please provide an image."}/>
        <Input
          id="categoryId"
          element="input"
          label="Category Id"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Category Id."
          onInput={inputHandler}
        />
        <Input
          id="price"
          element="input"
          label="Price"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Price."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD ITEM
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewItem;
