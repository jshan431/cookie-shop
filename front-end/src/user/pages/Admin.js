import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';

const Admin = () => {
  const [isCategoryMode, setIsCategoryMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      categoryName: {
        value: '',
        isValid: false
      },
      categoryImageUrl: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const adminSubmitHandler = async event => {
    event.preventDefault();

    setIsLoading(true);

    if (isCategoryMode){
      try {
        
        const response = await fetch('http://localhost:5000/api/admin/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            categoryName: formState.inputs.categoryName.value,
            categoryImageUrl: formState.inputs.categoryImageUrl.value
          })
        });

        const responseData = await response.json();
        if(!response.ok){        // if we dont get a 200 ish status code 
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        history.push('/');
      } catch (err) {
        setIsLoading(false);
        setError(err.message ||  'Something went wrong, please try again');
      }
    } else {
      
      /*
      try {
        
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        });

        const responseData = await response.json();
        if(!response.ok){        // if we dont get a 200 ish status code 
          throw new Error(responseData.message);
        }
        console.log(responseData);
        setIsLoading(false);
        auth.login();
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError(err.message ||  'Something went wrong, please try again');
      }
      */
    }

  };

  const errorHandler = () => {
    setError(null);     // clear the error
  }

  return(
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <form onSubmit={adminSubmitHandler}>
          <Input
            element="input"
            id="categoryName"
            type="text"
            label="Category Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="categoryImageUrl"
            type="text"
            label="Category Image Url"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid image Url"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isCategoryMode ? 'NEW CATEGORY' : 'SIGNUP'}
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Admin;