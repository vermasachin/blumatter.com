import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';
import { endpoint } from '../../constants';
import Title from '../shared/Title';
import Button from '../shared/Button';
import Form from '../shared/Form';
import Input from '../shared/Input';
import Label from '../shared/Label';
import Panel from '../shared/Panel';
import PanelWrap from '../shared/PanelWrap';
import P from '../shared/Paragraph';
import A from '../shared/Link';

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
      .then(response => {
        if (response.data.ok) {
          this.props.history.push('/expert-dashboard');
          toast.success('Registered Successfully.');
        } else {
          toast.error(response.data.error);
        }
      })
      .catch(error => {
        toast.error(error.data.error);
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

    return (
      <>
        <Helmet>
          <title>Blumatter - Expert Register</title>
        </Helmet>
        <PanelWrap>
          <Panel>
            <Title centered>Register as an Expert</Title>
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
