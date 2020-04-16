import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  // establish connection to a DOM element
  const filePickerRef = useRef();

  // Executes when file changes ( when a image file is picked )
  useEffect(() => {
    // return on intial component render since file is initially undefined
    if(!file){
      return;
    }
    //FileReader() is a built in JS method and helps us read files
    const fileReader = new FileReader(); 
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  //event.target.files is a default JS property that holds the file the user selected
  const pickedHandler = event => {
    let pickedFile;
    // We create fileIsValid here so that we can pass it to onInput with the immediate change to state
    let fileIsValid = isValid;   
    //Check if we have a single file selected
    if(event.target.files || event.target.files.length === 1){
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);     //Note: does not immediately update this state value instead it schedules it
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    //past data to surrounding component via onInput prop
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  // Open built in file picker, to simulate this we reference the 'input' in  
  // the return and then call its click() method (html DOM method)
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  // Initially hide the file picker using style property until we click button
  // onChange will be called when image is selected
  return(
    <div className="form-control">
      <input id={props.id}
        ref={filePickerRef}
        style={{display: 'none'}} 
        type="file" accept=".jpg, .png, .jpeg" 
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;