import React, { useCallback } from 'react';
import { DataTable, Button, InlineStack, Badge, Modal, TextContainer } from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import { deleteTask } from '../api/tasks';

const TaskTable = ({ tasks, refreshTasks, setSuccess }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = React.useState(null);

  const handleDelete = useCallback(async (id) => {
    await deleteTask(id);
    refreshTasks();
    setActiveModal(null);
    if (setSuccess) setSuccess('Task deleted successfully!');
  }, [refreshTasks, setSuccess]);

  const rows = tasks.map((task) => [
    task.name,
    task.description || '-',
    <Badge status={task.status === 'Completed' ? 'success' : 'attention'}>{task.status}</Badge>,
    <InlineStack gap="100">
      <Button onClick={() => navigate(`/edit/${task.id}`)} size="slim">Edit</Button>
      <Button destructive size="slim" onClick={() => setActiveModal(task.id)}>Delete</Button>
      <Modal
        open={activeModal === task.id}
        onClose={() => setActiveModal(null)}
        title="Delete Task"
        primaryAction={{content: 'Delete', destructive: true, onAction: () => handleDelete(task.id)}}
        secondaryActions={[{content: 'Cancel', onAction: () => setActiveModal(null)}]}
      >
        <Modal.Section>
          <TextContainer>Are you sure you want to delete this task?</TextContainer>
        </Modal.Section>
      </Modal>
    </InlineStack>,
  ]);

  return (
    <DataTable
      columnContentTypes={["text", "text", "text", "text"]}
      headings={["Name", "Description", "Status", "Actions"]}
      rows={rows}
      footerContent={tasks.length === 0 ? 'No tasks found.' : undefined}
    />
  );
};

export default React.memo(TaskTable);
