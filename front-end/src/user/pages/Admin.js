import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Select from '../../shared/components/FormElements/Select';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { AuthContext } from '../../shared/context/auth-context';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';

const Admin = () => {
  const auth = useContext(AuthContext);
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
        const formData = new FormData();
        formData.append('categoryName', formState.inputs.categoryName.value);
        formData.append('categoryImageUrl', formState.inputs.categoryImageUrl.value);
        const responseData = await sendRequest(
          'http://localhost:5000/api/admin/category',
          'POST',
          formData,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        history.push('/');
      } catch (err) {}
      
    } else {
      try {
        
        const formData = new FormData();
        console.log(formState.inputs.categoryName.value);
        formData.append('categoryName', formState.inputs.categoryName.value);
        formData.append('categoryImageUrl', formState.inputs.categoryImageUrl.value);
        const responseData = await sendRequest(
          `http://localhost:5000/api/admin/category/${selectedValue.id}`,
          'PATCH',
          formData,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        history.push('/');
      } catch (err) {}
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

    /*
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
    */
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
              <Input
              element="input"
              id="categoryName"
              type="text"
              label="Update Category Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
              />
              <ImageUpload center id="categoryImageUrl" onInput={inputHandler} errorText="Please provide an image."/>
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
              <ImageUpload center id="categoryImageUrl" onInput={inputHandler} errorText="Please provide an image."/>
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

/*    previous form validatation  

  <Button type="submit" disabled={!formState.isValid}>
  {isCreateMode ? 'NEW CATEGORY' : 'UPDATE CATEGORY'}
  </Button>

*/

//`http://localhost:5000/api/admin/category/${selectedValue.id}`,