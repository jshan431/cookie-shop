import React from 'react';

const Select = (props) => {

  //On the change event for the select box pass the selected value back to the parent
  const handleChange = (event) =>
  {
      let selectedValue = event.target.value;
      props.onSelectChange(selectedValue);
  }

  let arrayOfData = props.arrayOfData;
  let options = arrayOfData.map((data) => {
    return(
      <option key={data.id} value={data.id}>
        {data.categoryName || data.name}
      </option>
    );
  });
  return(
    <select name="customSearch" className="custom-search-select" onChange={handleChange}>
      <option>Select Existing Category</option>
      {options}
    </select>
  );
};

export default Select;