import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { endpoint } from '../../constants';
import PanelWrap from '../shared/PanelWrap';
import Panel from '../shared/Panel';
import Table from '../shared/Table';
import Title from '../shared/Title';

class ViewProject extends Component {
  constructor(props) {
    super(props);
    this.state = { project: '', error: false, loading: false };
  }

  componentDidMount() {
    this.getProject();
  }

  getProject = () => {
    const { name } = this.props.match.params;
    this.setState({ loading: true });
    axios
      .get(`${endpoint}/project/${name}`)
      .then(response => {
        this.setState({ project: response.data.data, loading: false });
      })
      .catch(error => {
        this.setState({ error: true, loading: false });
        toast.error(error.data.error || error.response.error);
      });
  };
  render() {
    const { project, error, loading } = this.state;
    return (
      <>
        <PanelWrap>
          <Panel>
            <Title dark centered>
              Project Details
            </Title>
            <Table data={project} error={error} loading={loading} />
          </Panel>
        </PanelWrap>
      </>
    );
  }
}

export default ViewProject;
