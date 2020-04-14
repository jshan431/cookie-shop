import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Select from '../../shared/components/FormElements/Select';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';

const Admin = () => {
  const [isCreateMode, setIsCreateMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCategories, setLoadedCategories] = useState();
  const [selectedValue, setSelectedValue] = useState();

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/items/categories'
        );

        setLoadedCategories(responseData.categories);
      } catch (err) {}
    };
    fetchCategories();
  }, [sendRequest]);

  const history = useHistory();

  const adminSubmitHandler = async event => {
    event.preventDefault();

    if (isCreateMode){
      try {
        await sendRequest(
          'http://localhost:5000/api/admin/category',
          'POST',
          JSON.stringify({
            categoryName: formState.inputs.categoryName.value,
            categoryImageUrl: formState.inputs.categoryImageUrl.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        history.push('/');
      } catch (err) {}
      
    } else {
      try {
        await sendRequest(
          `http://localhost:5000/api/admin/category/${selectedValue.id}`,
          'PATCH',
          JSON.stringify({
            categoryName: "cookie",
            categoryImageUrl: "https://www.awickedwhisk.com/wp-content/uploads/2018/02/Green-Soft-Sugar-Cookies7-2-683x1024.jpg"
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        history.push('/');
      } catch (err) {}
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

  const switchModeHandler = async () => {
    if(!isCreateMode){
      //fetchCategories(loadedCategories);
      console.log('inside !isCreateMode');
    } else {
      console.log('inside isCreateMode');
      console.log(loadedCategories);
    }
    setIsCreateMode(prevMode => !prevMode);
  }

  const handleSelectChange = (selectedCategoryId) =>{
    // given the selected category Id store the object associated with it
    const selectedCategoryObject = loadedCategories.find(category => category.id === selectedCategoryId);
    
    setSelectedValue(selectedCategoryObject);
    // set the form
    setFormData(
      {
        categoryName: {
          value: selectedCategoryObject.categoryName,
          isValid: true
        },
        categoryImageUrl: {
          value: selectedCategoryObject.categoryImageUrl,
          isValid: true
        }
      },
      true
    )
  };

  return(
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <form onSubmit={adminSubmitHandler}>
          {!isCreateMode ? (
            <React.Fragment>
              <Select onSelectChange={handleSelectChange} arrayOfData={loadedCategories}/>

            </React.Fragment>
          ) : (
            <React.Fragment>
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
            </React.Fragment>
          )}
          <Button type="submit" disabled={!formState.isValid}>
            {isCreateMode ? 'NEW CATEGORY' : 'UPDATE CATEGORY'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isCreateMode ? 'UPDATE' : 'CREATE'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Admin;

/**
 * 
 * initialValue={selectedValue.categoryImageUrl}
            initialValid={true}
 */