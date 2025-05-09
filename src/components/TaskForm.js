import React, { useState, useEffect } from 'react';
import { Form, FormLayout, TextField, Select, Button, Banner, Spinner } from '@shopify/polaris';
import { createTask, getTask, updateTask } from '../api/tasks';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' }
];

const TaskForm = ({ mode, taskId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === 'edit' && taskId) {
      getTask(taskId).then(task => {
        setName(task.name);
        setDescription(task.description || '');
        setStatus(task.status);
        setLoading(false);
      }).catch(() => {
        setError('Failed to load task.');
        setLoading(false);
      });
    }
  }, [mode, taskId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (!name.trim()) {
        setError('Task name is required.');
        setSubmitting(false);
        return;
      }
      let successMsg = '';
      if (mode === 'create') {
        await createTask({ name, description, status });
        successMsg = 'Task created successfully!';
      } else {
        await updateTask(taskId, { name, description, status });
        successMsg = 'Task updated successfully!';
      }
      navigate('/', { state: { success: successMsg } });
    } catch (err) {
      setError('Failed to save task.');
    }
    setSubmitting(false);
  };

  // Clear success message on form change
  useEffect(() => {
    setSuccess(null);
  }, [name, description, status]);

  if (loading) return <Spinner size="large" />;

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        {error && <Banner status="critical">{error}</Banner>}
        <TextField
          label="Task Name"
          value={name}
          onChange={setName}
          autoComplete="off"
          requiredIndicator
        />
        <TextField
          label="Description"
          value={description}
          onChange={setDescription}
          multiline
        />
        <Select
          label="Status"
          options={statusOptions}
          onChange={setStatus}
          value={status}
        />
        <Button primary submit loading={submitting}>
          {mode === 'create' ? 'Create Task' : 'Update Task'}
        </Button>
      </FormLayout>
    </Form>
  );
};

export default TaskForm;
