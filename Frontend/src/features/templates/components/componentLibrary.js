/**
 * componentLibrary.js
 * Workflow component definitions used by WorkflowLeftSidebar.
 * Separated into its own module to comply with react-refresh/only-export-components.
 */

export const componentLibrary = [
  {
    category: 'Process Stages',
    items: [
      {
        type: 'trigger',
        icon: 'bolt',
        label: 'Trigger',
        fields: [
          { key: 'triggerType', label: 'Trigger Type', default: 'Manual' },
          { key: 'schedule',    label: 'Schedule',     default: 'On Demand' },
        ],
      },
      {
        type: 'task',
        icon: 'task_alt',
        label: 'Task',
        fields: [
          { key: 'taskName', label: 'Task Name', default: 'Untitled Task' },
          { key: 'assignee', label: 'Assignee',  default: 'Unassigned' },
          { key: 'priority', label: 'Priority',  default: 'Medium' },
        ],
      },
      {
        type: 'approval',
        icon: 'how_to_reg',
        label: 'Approval',
        fields: [
          { key: 'approver', label: 'Approver', default: 'Manager' },
          { key: 'timeout',  label: 'Timeout',  default: '48 hours' },
        ],
      },
      {
        type: 'condition',
        icon: 'rule',
        label: 'Condition',
        fields: [
          { key: 'field',    label: 'Field',    default: 'status' },
          { key: 'operator', label: 'Operator', default: 'equals' },
          { key: 'value',    label: 'Value',    default: 'approved' },
        ],
      },
      {
        type: 'flexible',
        icon: 'extension',
        label: 'Flexible',
        subtitle: 'Custom Stage',
        fields: [
          { key: 'stageName',   label: 'Stage Name',  default: 'Custom Stage' },
          { key: 'description', label: 'Description', default: 'No description' },
        ],
      },
    ],
  },
  {
    category: 'Integration Steps',
    items: [
      {
        type: 'notification',
        icon: 'notifications_active',
        label: 'Notification',
        fields: [
          { key: 'channel',  label: 'Channel',  default: 'Email' },
          { key: 'template', label: 'Template', default: 'Default' },
        ],
      },
      {
        type: 'api_call',
        icon: 'api',
        label: 'API Call',
        fields: [
          { key: 'endpoint', label: 'Endpoint', default: 'https://' },
          { key: 'method',   label: 'Method',   default: 'POST' },
        ],
      },
      {
        type: 'delay',
        icon: 'timer',
        label: 'Delay',
        fields: [
          { key: 'duration', label: 'Duration', default: '1 hour' },
        ],
      },
      {
        type: 'sub_process',
        icon: 'account_tree',
        label: 'Sub-Process',
        fields: [
          { key: 'processName', label: 'Process Name', default: 'Untitled' },
          { key: 'waitFor',     label: 'Wait For',     default: 'Completion' },
        ],
      },
    ],
  },
];
