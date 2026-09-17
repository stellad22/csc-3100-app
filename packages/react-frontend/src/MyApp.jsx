import Table from "./Table";
import Form from "./Form";
import React, { useState, useEffect } from "react";



function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  function removeOneCharacter(index) {
    const character = characters[index]; 

    deleteUser(character.id)
    .then((response) => {
      if (response.status === 204){
        const newList = characters.filter((c, i) => i !== index); 
        setCharacters(newList);
      }else if (response.status === 404){
        console.log("User not found")
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

 function updateList(person) {
  postUser(person)
    .then((response) => {
      if (response.status !== 201){
        throw new Error('Response status: ${response.status}')
      }
      return response.json(); 
    })
    .then((newUserFromServer) => {
      setCharacters([...characters, newUserFromServer]);
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteUser(id) {
  const promise = fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
  });
  return promise;
}
  function postUser(person) {
  const promise = fetch("Http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });

  return promise;
}

function postUser(person) {
  const promise = fetch("Http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });

  return promise;
}

  return (
    <div className="container">
    <Table characterData={characters} removeCharacter={removeOneCharacter} />
    <Form handleSubmit={updateList} />
  </div>
  );

}

export default MyApp;
