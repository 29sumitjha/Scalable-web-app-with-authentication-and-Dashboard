import { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { validateTaskTitle, getErrorMessage } from '../../utils/validation';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [searchTerm, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      
      const response = await taskService.getTasks(params);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
      });
    }
    setErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: ''
    });
    setErrors({});
    setApiError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = 'Title is required';
    } else if (!validateTaskTitle(formData.title)) {
      newErrors.title = 'Title must be between 3 and 100 characters';
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, formData);
      } else {
        await taskService.createTask(formData);
      }
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      setApiError(getErrorMessage(error));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        fetchTasks();
      } catch (error) {
        alert(getErrorMessage(error));
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      'in-progress': 'badge-in-progress',
      completed: 'badge-completed'
    };
    return `badge ${badges[status]}`;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'badge-low',
      medium: 'badge-medium',
      high: 'badge-high'
    };
    return `badge ${badges[priority]}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Add New Task
        </Button>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                <div className="flex space-x-2">
                  <Button variant="secondary" onClick={() => handleOpenModal(task)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(task._id)}>
                    Delete
                  </Button>
                </div>
              </div>
              {task.description && (
                <p className="text-gray-600 mb-3">{task.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={getStatusBadge(task.status)}>{task.status}</span>
                <span className={getPriorityBadge(task.priority)}>{task.priority}</span>
              </div>
              {task.dueDate && (
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTask ? 'Edit Task' : 'Add New Task'}>
        <form onSubmit={handleSubmit}>
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {apiError}
            </div>
          )}
          <Input
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="input"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <Input
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
          <div className="flex space-x-3 mt-6">
            <Button type="submit" variant="primary" fullWidth>
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskList;