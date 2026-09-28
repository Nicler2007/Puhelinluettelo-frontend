import { useState, useEffect } from "react"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Notification from "./components/Notification"
import personService from "./services/persons"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState("success")

  useEffect(() => {
    personService.getAll().then(data => {
      setPersons(data)
    })
  }, [])

  const showNotification = (message, type = "success") => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => setNotification(null), 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      if (window.confirm(`${newName} is already added. Replace the old number?`)) {
        personService
          .update(existingPerson.id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(p =>
              p.id !== existingPerson.id ? p : updatedPerson
            ))
            showNotification(`Updated ${updatedPerson.name}`)
            setNewName("")
            setNewNumber("")
          })
          .catch(() => {
            showNotification(
              `Information of ${existingPerson.name} has already been removed from server`,
              "error"
            )
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showNotification(`Added ${returnedPerson.name}`)
          setNewName("")
          setNewNumber("")
        })
        .catch(() => {
          showNotification("Failed to add person", "error")
        })
    }
  }

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Deleted ${person.name}`)
        })
        .catch(() => {
          showNotification(
            `Information of ${person.name} has already been removed from server`,
            "error"
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} type={notificationType} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App