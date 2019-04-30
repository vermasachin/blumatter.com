import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
// import { toast } from 'react-toastify';
import styled from 'styled-components';
import axios from 'axios';
import { endpoint } from '../../constants';
import { Link } from 'react-router-dom';
import Title from '../shared/Title';
import Button from '../shared/Button';

const PanelWrap = styled.div`
  margin: 0 auto;
  width: 420px;
  height: 100vh;
  justify-content: center;
  flex-direction: column;
  display: flex;
`;

const Panel = styled.div`
  border-radius: 6px;
  background: #1c2730;
  padding: 24px 36px;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Label = styled.label`
  margin: 0 0 4px 0;
  display: block;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 700;
  color: #e3e3e3;
`;

const Input = styled.input`
  padding: 10px;
  border: #222;
  border-radius: 6px;
  margin-bottom: 20px;
  width: 100%;
`;

const P = styled.p`
  margin: 8px 0;
  font-size: 0.8rem;
  color: white;
`;

const A = styled(Link)`
  color: #0275d8;
  text-decoration: none;
`;

class ExpertRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      location: '',
      description: '',
      industries: [],
      industry: '',
      skills: [],
      skill: ''
    };
  }

  componentDidMount() {
    this.getIndustry();
    this.getSkills();
  }

  register = e => {
    const {
      name,
      email,
      phone,
      location,
      description,
      industry,
      skill
    } = this.state;
    e.preventDefault();
    axios
      .post(`${endpoint}/expert`, {
        name,
        email,
        phone,
        location,
        description,
        industry,
        skills: skill
      })
      .then(function(response) {
        localStorage.setItem('name', response.data.name);
        props.history.push(`/register/otp/${response.data.email}`);
      })
      .catch(function(error) {
        toast.error(error.response.data.error || error.response.data);
      });
  };

  getIndustry = () => {
    axios
      .get(`${endpoint}/industry`)
      .then(response => this.setState({ industries: response.data }));
  };

  getSkills = () => {
    axios
      .get(`${endpoint}/jobcodes`)
      .then(response => this.setState({ skills: response.data }));
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const {
      name,
      email,
      phone,
      location,
      description,
      industries,
      skills
    } = this.state;

    console.log(this.state);
    return (
      <>
        <Helmet>
          <title>Bittmax - Expert Register</title>
        </Helmet>
        <PanelWrap>
          <Panel>
            <Title centered>Bittmax</Title>
            <Form onSubmit={this.register}>
              <Label>Name</Label>
              <Input
                type='text'
                name='name'
                value={name}
                onChange={e => this.handleChange(e)}
                required
              />
              <Label>Email</Label>
              <Input
                type='email'
                name='email'
                value={email}
                onChange={e => this.handleChange(e)}
                required
              />
              <Label>Phone</Label>
              <Input
                type='number'
                name='phone'
                value={phone}
                onChange={e => this.handleChange(e)}
                required
              />
              <Label>Location</Label>
              <Input
                type='text'
                name='location'
                value={location}
                onChange={e => this.handleChange(e)}
                required
              />
              <Label>Description</Label>
              <Input
                type='text'
                name='description'
                value={description}
                onChange={e => this.handleChange(e)}
                required
              />
              <Label>Industry</Label>
              <Input
                list='industry'
                name='industry'
                onChange={e => this.handleChange(e)}
                required
              />
              <datalist id='industry'>
                {industries.map(industry => (
                  <option key={industry.code} value={industry.name} />
                ))}
              </datalist>
              <Label>Skills</Label>
              <Input
                list='skill'
                name='skill'
                onChange={e => this.handleChange(e)}
                required
              />
              <datalist id='skill'>
                {skills.map(skill => (
                  <option key={skill.code} value={skill.name} />
                ))}
              </datalist>
              <Button primary type='submit'>
                Register
              </Button>
            </Form>

            <P>
              Already registered? <A to='/'>Login</A>
            </P>
          </Panel>
        </PanelWrap>
      </>
    );
  }
}

export default ExpertRegister;
