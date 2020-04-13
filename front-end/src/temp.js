/**
 * Example of a post request
 * 
 * setIsLoading(true);

    if (isLoginMode){
      try {
        
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        });

        const responseData = await response.json();
        if(!response.ok){        // if we dont get a 200 ish status code 
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        auth.login();
      } catch (err) {
        setIsLoading(false);
        setError(err.message ||  'Something went wrong, please try again');
      }
    } else {
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
    }
 * 
 */

 // how to make a get requests
 /*
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try{
        const response = await fetch('http://localhost:5000/api/items/categories');
        const responseData = await response.json();
        if(!response.ok){
          throw new Error(responseData.message);
        }
        console.log(responseData.categories);
        setLoadedCategories(responseData.categories);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []) ;
  */
 