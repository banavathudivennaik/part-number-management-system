
import React, { useState, useEffect } from "react";
import axios from "axios";

function AddDocumentPopup({
  projects,
  closePopup,
  addDocument,
  loggedUser
}) {

  const [selectedProject, setSelectedProject] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [manager, setManager] = useState("");
  const [users1, setusers1] = useState([]);

  // PART NUMBER STATES

  const [partNumberType, setPartNumberType] = useState("");

  const [showPartPopup, setShowPartPopup] = useState(false);
  const [generatedPartNumber, setGeneratedPartNumber] = useState("");

  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [customPartNumber, setCustomPartNumber] = useState("");

  const [, setConfirmedPartNumber] = useState("");


  // FETCH USERS

  useEffect(()=>{

    axios.get("/users1")

    .then((res)=>{

      setusers1(res.data);

    })

    .catch((err)=>{

      console.log(err);

    });


  },[]);



  // NEW PART NUMBER GENERATE

  const generateNewPartNumber = async()=>{


    if(!selectedProject){

      alert("Please select project first");
      return;

    }


    const res = await axios.post(

      "/generatePartNumber",

      {
        project_name:selectedProject
      }

    );


    if(res.data.success){

      setGeneratedPartNumber(
        res.data.partNumber
      );

      setShowPartPopup(true);

    }


  };

// ==============================
// CHECK SAME PART NUMBER
// ==============================

const checkSamePartNumber = async () => {

  if (!selectedProject) {
    alert("Please select project first");
    return;
  }

  try {

    const res = await axios.get(
      `/documents/${selectedProject}`
    );

    if (res.data.length === 0) {

      alert("No previous document found.\nPlease create a NEW document first.");

      setPartNumberType("");

      return;
    }

    // Previous document exists
    setPartNumberType("SAME");
    setConfirmedPartNumber("");

  } catch (err) {

    console.log(err);
    alert("Unable to fetch documents.");

  }

};

  // SAVE DOCUMENT

  const handleSubmit=()=>{


    if(
      !selectedProject ||
      !documentName ||
      !manager
    ){

      alert("Please fill all fields");
      return;

    }



    addDocument({

  project_name: selectedProject,
  document_name: documentName,
  project_manager: manager,
  taken_by: loggedUser,

  part_number_type: partNumberType,

  custom_part_number:
    partNumberType === "CUSTOM"
      ? customPartNumber
      : ""

});



    closePopup();


  };



return (

<div style={overlayStyle}>


<div style={popupStyle}>


<div style={headerStyle}>


<h3>
Add Document
</h3>


<span
style={closeIcon}
onClick={closePopup}
>
✖
</span>


</div>



<select

style={inputStyle}

value={selectedProject}

onChange={(e)=>
setSelectedProject(e.target.value)
}

>


<option value="">
Select Project
</option>


{
projects.map((p,index)=>(

<option
key={index}
value={p.name}
>

{p.name}

</option>

))

}


</select>




<input

style={inputStyle}

placeholder="Document Name"

value={documentName}

onChange={(e)=>
setDocumentName(e.target.value)
}

/>



<select

style={inputStyle}

value={manager}

onChange={(e)=>
setManager(e.target.value)
}

>


<option value="">
Select Project Manager
</option>



{
users1.map((m)=>(

<option
key={m.id}
value={m.name}
>

{m.name}

</option>


))

}


</select>





{/* PART NUMBER TYPE */}


<div style={{marginBottom:"15px"}}>


<label style={{marginRight:"15px"}}>


<input
  type="radio"
  value="NEW"
  checked={partNumberType === "NEW"}
  onChange={() => {

    setPartNumberType("NEW");

    setConfirmedPartNumber("");

    setCustomPartNumber("");

    generateNewPartNumber();

}}
/>


{" "}NEW


</label>





<label>


<input
  type="radio"
  value="SAME"
  checked={partNumberType === "SAME"}
  onChange={() => {

    checkSamePartNumber();

  }}
/>

{" "}SAME


</label>


</div>
{/* TAKEN BY */}

<input

style={inputStyle}

value={loggedUser}

readOnly

/>



<div style={{marginTop:"20px"}}>


<button

style={saveBtn}

onClick={handleSubmit}

>

Save

</button>



<button

style={backBtn}

onClick={closePopup}

>

Back

</button>



</div>


</div>





{/* GENERATED PART NUMBER POPUP */}


{

showPartPopup &&

<div style={overlayStyle}>


<div style={popupStyle}>


<h3>
Do you want to use this Part Number?
</h3>



<h4
style={{
textAlign:"center",
color:"#2980b9"
}}
>

{generatedPartNumber}

</h4>



<button

style={saveBtn}

onClick={()=>{


setConfirmedPartNumber(
generatedPartNumber
);

setPartNumberType("NEW");
setShowPartPopup(false);


}}

>

YES

</button>



<button

style={backBtn}

onClick={()=>{


setShowPartPopup(false);


setShowCustomPopup(true);


}}

>

NO

</button>



</div>


</div>


}





{/* CUSTOM PART NUMBER POPUP */}


{

showCustomPopup &&

<div style={overlayStyle}>


<div style={popupStyle}>


<h3>
Enter Custom Part No.
</h3>



<input

style={inputStyle}

placeholder="9208 116 113 26"

// value={customPartNumber}

// maxLength={12}

onChange={(e)=>{

const value=e.target.value.replace(/[^\d ]/g, "");

setCustomPartNumber(value);

}}

/>



<button

style={saveBtn}

onClick={()=>{


// if(customPartNumber.length!==12)

// {

// alert(
// "Part Number must contain 12 digits"
// );

// return;

//}
const digits = customPartNumber.replace(/\s/g, "");

if (digits.length !== 12) {
  alert("Part Number must contain 12 digits");
  return;
}


setConfirmedPartNumber(
customPartNumber
);

setPartNumberType("CUSTOM");
setShowCustomPopup(false);



}}

>

SAVE

</button>



<button

style={backBtn}

onClick={()=>{

setShowCustomPopup(false);

}}

>

BACK

</button>



</div>


</div>


}



</div>


);

}





/* ================= STYLES ================= */


const overlayStyle={

position:"fixed",

top:0,

left:0,

width:"100%",

height:"100%",

background:"rgba(0,0,0,0.5)",

display:"flex",

justifyContent:"center",

alignItems:"center"

};



const popupStyle={

background:"white",

padding:"30px",

borderRadius:"12px",

width:"320px",

boxShadow:
"0 20px 40px rgba(0,0,0,0.3)"

};



const headerStyle={

display:"flex",

justifyContent:"space-between",

alignItems:"center",

marginBottom:"20px"

};



const closeIcon={

cursor:"pointer",

fontSize:"18px",

color:"#e74c3c"

};



const inputStyle={

width:"100%",

padding:"10px",

marginBottom:"12px",

borderRadius:"6px",

border:"1px solid #ccc",
boxSizing: "border-box"
};



const saveBtn={

background:"#27ae60",

color:"white",

padding:"10px 18px",

borderRadius:"6px",

marginRight:"10px",

border:"none",

cursor:"pointer"

};



const backBtn={

background:"#e74c3c",

color:"white",

padding:"10px 18px",

borderRadius:"6px",

border:"none",

cursor:"pointer"

};



export default AddDocumentPopup;