import React from 'react';
import TaskForm from '../components/TaskForm';
import { Page, Card } from '@shopify/polaris';

const CreateTask = () => {
  return (
    <Page title="Create New Task">
      <Card sectioned>
        <TaskForm mode="create" />
      </Card>
    </Page>
  );
};

export default CreateTask;
