const Persons = ({ persons, removePerson }) => {
  return (
    <ul>
      {persons.map(person => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => removePerson(person.id)}>
            delete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Persons