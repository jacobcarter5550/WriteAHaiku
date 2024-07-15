import React, { useEffect } from "react";

const ConstraintsTable: React.FC<{ Container: any; TAccordian: any, constraints:any ,state:any, setState:any }> = ({
  Container,
  TAccordian,
  constraints,
  setState,
  state
}) => {


    useEffect(() => {

        const button = document.querySelector('.cds--accordion__title');
        
        // Define a function to handle the click event
        const handleClick = (e) => {
            console.log("clicked")
          e.stopPropagation(); // This prevents the click from being propagated
          // Optionally, you can also disable the default behavior
          e.preventDefault();
        };
    
        // Add the event listener to the button
        if (button) {
          button.addEventListener('click', handleClick);
        }
    
        // Cleanup the event listener when the component unmounts
        return () => {
          if (button) {
            button.removeEventListener('click', handleClick);
          }
        };
      }, []);



  return (
    <Container>
      {constraints?.map((key) => (
        <TAccordian
          uid={key}
          section={"factorConstraints"}
          state={state}
          setState={setState}
        />
      ))}
    </Container>
  );
};

export default ConstraintsTable;
