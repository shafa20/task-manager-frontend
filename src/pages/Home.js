import React, { useEffect, useState, Suspense } from 'react';
import { Page, Card, Button, Layout, Spinner, Banner, Box, Text, Pagination } from '@shopify/polaris';
import { useLocation } from 'react-router-dom';
import TaskTable from '../components/TaskTable';
import { getTasks } from '../api/tasks';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const location = useLocation();
  const [success, setSuccess] = useState(location.state && location.state.success ? location.state.success : null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  // Pending state
  const [pendingTasks, setPendingTasks] = useState([]);
  const [pendingMeta, setPendingMeta] = useState(null);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState(null);
  const [pendingSearch, setPendingSearch] = useState('');

  // Completed state
  const [completedTasks, setCompletedTasks] = useState([]);
  const [completedMeta, setCompletedMeta] = useState(null);
  const [completedPage, setCompletedPage] = useState(1);
  const [completedLoading, setCompletedLoading] = useState(true);
  const [completedError, setCompletedError] = useState(null);
  const [completedSearch, setCompletedSearch] = useState('');

  const navigate = useNavigate();

  // Fetch paginated Pending tasks
  const fetchPendingTasks = async (page = 1, search = '') => {
    setPendingLoading(true);
    try {
      let url = `/api/tasks?status=Pending&page=${page}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await getTasks(page, true, 'Pending', search);
      setPendingTasks(res.tasks);
      setPendingMeta(res.meta);
      setPendingError(null);
    } catch (err) {
      setPendingError('Failed to fetch pending tasks.');
    }
    setPendingLoading(false);
  };

  // Fetch paginated Completed tasks
  const fetchCompletedTasks = async (page = 1, search = '') => {
    setCompletedLoading(true);
    try {
      let url = `/api/tasks?status=Completed&page=${page}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await getTasks(page, true, 'Completed', search);
      setCompletedTasks(res.tasks);
      setCompletedMeta(res.meta);
      setCompletedError(null);
    } catch (err) {
      setCompletedError('Failed to fetch completed tasks.');
    }
    setCompletedLoading(false);
  };

  useEffect(() => {
    fetchPendingTasks(pendingPage, pendingSearch);
  }, [pendingPage, pendingSearch]);

  useEffect(() => {
    fetchCompletedTasks(completedPage, completedSearch);
  }, [completedPage, completedSearch]);

  // Pagination controls
  const pendingHasPrevious = pendingMeta && pendingMeta.current_page > 1;
  const pendingHasNext = pendingMeta && pendingMeta.current_page < pendingMeta.last_page;
  const completedHasPrevious = completedMeta && completedMeta.current_page > 1;
  const completedHasNext = completedMeta && completedMeta.current_page < completedMeta.last_page;


  return (
    <Page title="Task Manager" primaryAction={{content: 'Create New Task', onAction: () => navigate('/create')}}>
      {success && <Banner status="success">{success}</Banner>}
      <Layout>
        <Layout.Section>
          {/* Pending Tasks Table */}
          <Card sectioned>
            <div style={{marginBottom: 12}}>
              <Box paddingBlockStart="2" paddingBlockEnd="2">
                <Text variant="headingLg" as="h2" color="primary">
                  <span style={{display: 'flex', alignItems: 'center'}}>
                    <span role="img" aria-label="Pending" style={{marginRight: 8}}>🕓</span>
                    Pending Tasks
                  </span>
                </Text>
              </Box>
              <SearchBar value={pendingSearch} onChange={(val) => { setPendingPage(1); setPendingSearch(val); }} />
            </div>
            {pendingLoading ? (
              <Spinner size="large" />
            ) : pendingError ? (
              <Banner status="critical">{pendingError}</Banner>
            ) : (
              <>
                <TaskTable tasks={pendingTasks} refreshTasks={() => fetchPendingTasks(pendingPage, pendingSearch)} />
                {pendingMeta && pendingMeta.last_page > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, gap: 8 }}>
                    <Button
                      disabled={!pendingHasPrevious}
                      onClick={() => setPendingPage(pendingPage - 1)}
                    >
                      Prev
                    </Button>
                    <span style={{alignSelf:'center'}}>
                      Page {pendingMeta.current_page} of {pendingMeta.last_page}
                    </span>
                    <Button
                      disabled={!pendingHasNext}
                      onClick={() => setPendingPage(pendingPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )} 

              </>
            )}
          </Card>
          <div style={{height: 32}} />
          {/* Completed Tasks Table */}
          <Card sectioned>
            <div style={{marginBottom: 12}}>
              <Box paddingBlockStart="2" paddingBlockEnd="2">
                <Text variant="headingLg" as="h2" color="success">
                  <span style={{display: 'flex', alignItems: 'center'}}>
                    <span role="img" aria-label="Completed" style={{marginRight: 8}}>✅</span>
                    Completed Tasks
                  </span>
                </Text>
              </Box>
              <SearchBar value={completedSearch} onChange={(val) => { setCompletedPage(1); setCompletedSearch(val); }} />
            </div>
            {completedLoading ? (
              <Spinner size="large" />
            ) : completedError ? (
              <Banner status="critical">{completedError}</Banner>
            ) : (
              <>
                <TaskTable tasks={completedTasks} refreshTasks={() => fetchCompletedTasks(completedPage, completedSearch)} />
                {completedMeta && completedMeta.last_page > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, gap: 8 }}>
                    <Button
                      disabled={!completedHasPrevious}
                      onClick={() => setCompletedPage(completedPage - 1)}
                    >
                      Prev
                    </Button>
                    <span style={{alignSelf:'center'}}>
                      Page {completedMeta.current_page} of {completedMeta.last_page}
                    </span>
                    <Button
                      disabled={!completedHasNext}
                      onClick={() => setCompletedPage(completedPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )} 

              </>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;
