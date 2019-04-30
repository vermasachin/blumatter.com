import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { endpoint } from '../../constants';
import Title from '../shared/Title';
import Form from '../shared/Form';
import Label from '../shared/Label';
import Input from '../shared/Input';
import Button from '../shared/Button';
import Wrapper from '../shared/Wrapper';
import Panel from '../shared/Panel';
import PanelWrap from '../shared/PanelWrap';

class AddProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      brief: '',
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

  createProject = e => {
    const { name, brief, industry, skill } = this.state;
    e.preventDefault();
    axios
      .post(`${endpoint}/project`, {
        name,
        brief,
        industry,
        skills: skill
      })
      .then(response => {
        this.props.history.push(`/client-dashboard/view-project/${name}`);
      })
      .catch(error => {
        console.log(error);
        toast.error(error.data.error || error.response.error);
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
    const { name, brief, industries, industry, skills, skill } = this.state;
    return (
      <>
        <PanelWrap>
          <Panel>
            <Title dark centered>
              Create Project
            </Title>
            <Form onSubmit={this.createProject}>
              <Label>Name</Label>
              <Input
                type='text'
                name='name'
                value={name}
                onChange={e => this.handleChange(e)}
                required
              />
              <Label>Brief</Label>
              <Input
                type='brief'
                name='brief'
                value={brief}
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
                Submit
              </Button>
            </Form>
          </Panel>
        </PanelWrap>
      </>
    );
  }
}
export default AddProject;
