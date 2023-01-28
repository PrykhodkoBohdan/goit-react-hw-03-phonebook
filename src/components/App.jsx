import React, { Component } from 'react';
import Form from './Form/Form';
import Section from './Section/Section';
import Contacts from './Contacts/Contacts';
import Filter from './Filter/Filter';
import { v4 as uuidv4 } from 'uuid';

class App extends Component {
  state = {
    contacts:[],
    filter: '',
  };


  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem("contacts"));
    if(contacts?.length) { 
        this.setState({contacts})
    }
}

componentDidUpdate(_, prevState){

    const {contacts} = this.state;
    if(prevState.contacts.length !== contacts.length) {
        localStorage.setItem("contacts", JSON.stringify(contacts));
    }
}

  formSubmitHandler = data => {
    const { contacts } = this.state;
    const isContactValid = this.validateContact(data, contacts);

    if (isContactValid) {
      data.id = uuidv4();
      this.setState(({ contacts }) => ({
        contacts: [data, ...contacts],
      }));
    }
  };

  validateContact = (data, contacts) => {
    if (contacts.some(({ name }) => name === data.name)) {
      alert(`${data.name} is already in contacts or number`);
      return false;
    } else return true;
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  handleSearch = e => {
    this.setState({
      filter: e.currentTarget.value,
    });
  };

  getFiltredContacts() {
    const { contacts, filter } = this.state;
    const lowerCaseFilter = filter.toLowerCase();
    return contacts.filter(person =>
      person.name.toLowerCase().includes(lowerCaseFilter),
    );
  }

  render() {
    const { filter } = this.state;
    const filteredContacts = this.getFiltredContacts();

    return (
      <>
        <Section title="Phonebook">
          <Form onSubmit={this.formSubmitHandler} />
        </Section>

        <Section title="Contacts">
          <Filter value={filter} onChange={this.handleSearch} />
          <Contacts
            contacts={filteredContacts}
            onDeleteBtnClick={this.deleteContact}
          />
        </Section>
      </>
    );
  }
}

export default App;