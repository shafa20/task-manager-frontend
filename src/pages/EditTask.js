import React from 'react';
import TaskForm from '../components/TaskForm';
import { Page, Card } from '@shopify/polaris';
import { useParams } from 'react-router-dom';

const EditTask = () => {
  const { id } = useParams();
  return (
    <Page title="Edit Task">
      <Card sectioned>
        <TaskForm mode="edit" taskId={id} />
      </Card>
    </Page>
  );
};

export default EditTask;
